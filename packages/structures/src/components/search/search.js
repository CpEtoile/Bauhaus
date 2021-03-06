import React, { useState, useEffect } from 'react';
import { Select, Loading } from '@inseefr/wilco';
import { Link, Redirect } from 'react-router-dom';
import api from '../../apis/structure-api';
import D from '../../i18n/build-dictionary';
import { formatLabel } from '../../utils';
import {
	ConceptsAPI,
	ArrayUtils,
	AdvancedSearchList,
	ItemToSelectModel,
	AbstractAdvancedSearchComponent,
} from 'bauhaus-utilities';

const filterLabel = ArrayUtils.filterKeyDeburr(['labelLg1']);
const filterConcept = ArrayUtils.filterKeyDeburr(['concept']);

const fields = ['labelLg1', 'concept'];

export class SearchFormList extends AbstractAdvancedSearchComponent {
	static defaultState = {
		labelLg1: '',
		concept: '',
	};

	constructor(props) {
		super(props, SearchFormList.defaultState);
	}

	handlers = this.handleChange(fields, newState => {
		const { labelLg1, concept } = newState;
		return this.props.data
			.filter(filterConcept(concept))
			.filter(filterLabel(labelLg1));
	});

	render() {
		const { data, labelLg1, concept } = this.state;
		const { concepts } = this.props;

		const conceptsOptions = ItemToSelectModel.toSelectModel(concepts);
		const dataLinks = data.map(component => (
			<li key={component.id} className="list-group-item text-left">
				<Link to={`/structures/components/${component.id}`}>
					{formatLabel(component)}
				</Link>
			</li>
		));
		return (
			<AdvancedSearchList
				title={D.componentsSearchTitle}
				data={dataLinks}
				initializeState={this.initializeState}
				redirect={<Redirect to={'/structures/components'} push />}
			>
				<div className="row form-group">
					<div className="col-md-12">
						<label className="w-100">
							{D.label}
							<input
								value={labelLg1}
								onChange={e => this.handlers.labelLg1(e.target.value)}
								type="text"
								className="form-control"
							/>
						</label>
					</div>
				</div>
				<div className="row form-group">
					<div className="col-md-12">
						<label className="w-100">
							{D.conceptTitle}

							<Select
								placeholder=""
								value={
									conceptsOptions.find(option => option.value === concept) || ''
								}
								options={conceptsOptions}
								onChange={value => {
									this.handlers.concept(value);
								}}
							/>
						</label>
					</div>
				</div>
			</AdvancedSearchList>
		);
	}
}

const SearchListContainer = () => {
	const [loading, setLoading] = useState(true);
	const [items, setItems] = useState([]);
	const [concepts, setConcepts] = useState([]);

	useEffect(() => {
		Promise.all([
			api.getMutualizedComponentsForSearch(),
			ConceptsAPI.getConceptList(),
		])
			.then(([components, concepts]) => {
				setItems(components);
				setConcepts(concepts);
			})
			.finally(() => setLoading(false));
	}, []);
	if (loading) {
		return <Loading />;
	}
	return <SearchFormList data={items} concepts={concepts} />;
};

export default SearchListContainer;
