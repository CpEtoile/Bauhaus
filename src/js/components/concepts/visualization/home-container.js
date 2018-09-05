import React, { Component } from 'react';
import { PropTypes } from 'prop-types';
import { connect } from 'react-redux';
import { VALIDATE_CONCEPT_LIST } from 'js/actions/constants';
import validateConcepts from 'js/actions/concepts/validate';
import * as select from 'js/reducers';
import buildExtract from 'js/utils/build-extract';
import { saveSecondLang } from 'js/actions/app';
import loadConcept from 'js/actions/concepts/concept';
import loadDisseminationStatusList from 'js/actions/dissemination-status';
import loadStampList from 'js/actions/stamp';
import loadConceptAndAllNotes from 'js/actions/concepts/concept-and-all-notes';
import check from 'js/utils/auth';
import Loading from 'js/components/shared/loading';
import ConceptVisualization from './home';
import ConceptVisualizationStandBy from './stand-by';
import { OK } from 'js/constants';
const extractId = buildExtract('id');

class ConceptVisualizationContainer extends Component {
	constructor(props) {
		super(props);
		this.state = {
			validationRequested: false,
		};
		this.handleConceptValidation = id => {
			this.props.validateConcept(id);
			this.setState({
				validationRequested: true,
			});
		};
	}
	componentWillMount() {
		const { id, allNotes } = this.props;
		if (!allNotes) {
			this.props.loadConceptAndAllNotes(id);
		}
	}

	componentWillReceiveProps({ id, validationStatus }) {
		if (id !== this.props.id) {
			this.props.loadConceptAndAllNotes(id);
		}
		if (this.state.validationRequested && validationStatus === OK) {
			//validation has been processed successfully, we can show the
			//component again
			this.setState({
				validationRequested: false,
			});
			//we need to load the concept again
			this.props.loadConcept(id);
		}
	}
	render() {
		const { validationRequested } = this.state;
		const { validationStatus } = this.props;
		if (validationRequested && validationStatus !== OK) {
			//if validation is OK: nothing to do. We stay on this page and the concept will
			//be loaded automatically (since the entries for the given concept in the store will
			//be deleted).
			if (validationStatus !== OK) {
				return <Loading textType="validating" context="concepts" />;
			}
		}
		const { id, permission, concept, allNotes, secondLang, langs } = this.props;
		if (concept && allNotes) {
			const { general, links } = concept;
			let { notes } = concept;
			const { conceptVersion, isValidated, creator } = general;
			const { authType, roles, stamp } = permission;
			const authImpl = check(authType);
			const adminOrContributorOrConceptCreator = authImpl.isAdminOrContributorOrConceptCreator(
				roles,
				stamp,
				creator
			);
			if (
				!adminOrContributorOrConceptCreator &&
				isValidated === 'false' &&
				conceptVersion === '1'
			)
				return <ConceptVisualizationStandBy general={general} />;
			if (
				conceptVersion !== '1' &&
				isValidated === 'false' &&
				!adminOrContributorOrConceptCreator
			) {
				general.isValidated = 'true';
				general.conceptVersion = (general.conceptVersion - 1).toString();
				notes = allNotes[general.conceptVersion];
			}

			return (
				<ConceptVisualization
					id={id}
					permission={permission}
					general={general}
					notes={notes}
					links={links}
					validateConcept={this.handleConceptValidation}
					validationStatus={validationStatus}
					secondLang={secondLang}
					saveSecondLang={this.props.saveSecondLang}
					langs={langs}
				/>
			);
		}
		return <Loading textType="loading" context="concepts" />;
	}
}

const mapStateToProps = (state, ownProps) => {
	const id = extractId(ownProps);
	let allNotes;
	const general = select.getConceptGeneral(state, id);
	if (general) {
		allNotes = select.getAllNotes(state, id, general.conceptVersion);
	}
	return {
		id,
		permission: select.getPermission(state),
		secondLang: state.app.secondLang,
		concept: select.getConcept(state, id),
		allNotes,
		//TODO should check if the concept which has been validated are the same
		//a validation has been requested for.
		validationStatus: select.getStatus(state, VALIDATE_CONCEPT_LIST),
		langs: select.getLangs(state),
	};
};

const mapDispatchToProps = {
	saveSecondLang,
	loadConcept,
	loadDisseminationStatusList,
	loadStampList,
	loadConceptAndAllNotes,
	validateConcept: id => validateConcepts([id]),
};

ConceptVisualizationContainer = connect(mapStateToProps, mapDispatchToProps)(
	ConceptVisualizationContainer
);

ConceptVisualizationContainer.propTypes = {
	match: PropTypes.shape({
		params: PropTypes.shape({
			id: PropTypes.string.isRequired,
		}),
	}),
};
export default ConceptVisualizationContainer;
