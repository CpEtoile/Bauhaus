import { rangeType } from 'js/utils/msd/';
const { RICH_TEXT, TEXT } = rangeType;

export const HELP_COLLAPSED = 'HELP_COLLAPSED';

export function isOpen(id) {
	const collapsed = JSON.parse(localStorage.getItem(HELP_COLLAPSED)) || {};
	return collapsed[id] || false;
}

export function toggleOpen(id) {
	const collapsed = JSON.parse(localStorage.getItem(HELP_COLLAPSED)) || {};
	const previous = collapsed[id] || false;
	localStorage.setItem(
		HELP_COLLAPSED,
		JSON.stringify({
			...collapsed,
			[id]: !previous,
		})
	);
}

/**
 * Return true if the section of a MSD should display its labelLg2
 *
 * @param {Object} section
 * @returns {Boolean}
 */
export function hasLabelLg2(section) {
	return section.rangeType === TEXT || section.rangeType === RICH_TEXT;
}

/**
 * Return true if the duplicate button should be displayed.
 * For the moment only Sims linked to an operation (with siblings operations
 * wihout SIMS) can use this feature.
 *
 * @param {Object} sims
 * @returns {Boolean}
 */
export function shouldDisplayDuplicateButton(sims) {
	const siblingsWithoutSims = sims.parentsWithoutSims || [];
	return siblingsWithoutSims.length > 0 && sims.idOperation;
}

/**
 *
 * @param {import('js/types').Sims} sims
 * @returns {String}
 */
export function getParentUri(sims) {
	if (sims.idOperation) {
		return `/operations/operation/${sims.idOperation}`;
	} else if (sims.idSeries) {
		return `/operations/serie/${sims.idSeries}`;
	} else if (sims.idIndicator) {
		return `/operations/indicator/${sims.idIndicator}`;
	}
}

export function getParentType(sims) {
	if (sims.idOperation) {
		return 'operation';
	}
	if (sims.idSeries) {
		return 'series';
	}
	if (sims.idIndicator) {
		return 'indicator';
	}
}

export function getParentId(sims) {
	return sims.idOperation || sims.idSeries || sims.idIndicator;
}

export function getParentIdName(parentType) {
	if (parentType === 'operation') {
		return 'idOperation';
	}
	if (parentType === 'series') {
		return 'idSeries';
	}
	if (parentType === 'indicator') {
		return 'idIndicator';
	}
}
