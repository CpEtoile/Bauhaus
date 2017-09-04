import listReducer, { getItems } from './utils/list-reducer';
import * as A from 'js/actions/constants';
import { combineReducers } from 'redux';
import conceptReducers from './concepts/';
import * as conceptGeneral from './concepts/by-id/general';
import * as notes from './concepts/by-id/notes';
import * as links from './concepts/by-id/links';
import * as collectionGeneral from './collections/by-id/general';
import * as members from './collections/by-id/members';
import collectionReducers from './collections/';
import remoteCalls, * as remoteCallsSelectors from './remote-calls';

const disseminationStatusList = listReducer([
	A.LOAD_DISSEMINATION_STATUS_LIST,
	A.LOAD_DISSEMINATION_STATUS_LIST_SUCCESS,
	A.LOAD_DISSEMINATION_STATUS_LIST_FAILURE,
]);

const stampList = listReducer([
	A.LOAD_STAMP_LIST,
	A.LOAD_STAMP_LIST_SUCCESS,
	A.LOAD_STAMP_LIST_FAILURE,
]);

export default combineReducers({
	stampList,
	disseminationStatusList,
	...conceptReducers,
	...collectionReducers,
	remoteCalls,
});

export const getConceptList = state => getItems(state.conceptList);
export const getConceptSearchList = state => getItems(state.conceptSearchList);
export const getConceptValidateList = state =>
	getItems(state.conceptToValidateList);
export const getDisseminationStatusList = state =>
	getItems(state.disseminationStatusList);
export const getStampList = state => getItems(state.stampList);

export const getConceptGeneral = (state, id) =>
	conceptGeneral.getGeneral(state.conceptGeneral, id);
export const getNotes = (state, id, version) =>
	notes.getNotes(state.conceptNotes, id, version);
export const getLinks = (state, id) => links.getLinks(state.conceptLinks, id);

export function getAllNotes(state, id, lastVersion) {
	return notes.getAllNotes(state.conceptNotes, id, lastVersion);
}

export function getConcept(state, id) {
	const general = getConceptGeneral(state, id);
	const links = getLinks(state, id);
	let notes;
	if (general) {
		notes = getNotes(state, id, general.conceptVersion);
	}

	if (!(general && notes && links)) return;

	return {
		general,
		notes,
		links,
	};
}

export const getCollectionList = state => getItems(state.collectionList);
export const getCollectionValidateList = state =>
	getItems(state.collectionToValidateList);

export const getCollectionGeneral = (state, id) =>
	collectionGeneral.getGeneral(state.collectionGeneral, id);
export const getMembers = (state, id) =>
	members.getMembers(state.collectionMembers, id);

export function getCollection(state, id) {
	const general = getCollectionGeneral(state, id);
	const members = getMembers(state, id);

	if (!(general && members)) return;

	return {
		general,
		members,
	};
}

export const getStatus = (state, op) =>
	remoteCallsSelectors.getStatus(state.remoteCalls, op);

export const getNewlyCreatedId = state =>
	remoteCallsSelectors.getNewlyCreatedId(state.remoteCalls);
