import { getRDFList } from 'bauhaus-utilities';

// TODO : Complete with other code list
const query = `
PREFIX skos:<http://www.w3.org/2004/02/skos/core#>
PREFIX xkos:<http://rdf-vocabulary.ddialliance.org/xkos#>

SELECT ?value ?label ?range WHERE {
	?value ?b xkos:ClassificationLevel .
	?value skos:prefLabel ?label .
	FILTER(lang(?label) = 'fr') .
	?value xkos:organizedBy ?range
}
`;

export const getCodeList = () => getRDFList('http://id.insee.fr/sparql')(query);

export const getFormattedCodeList = () => {
	return getCodeList().then(response => {
		return response?.map(({ value, label }) => {
			return {
				id: value,
				label: label,
			};
		});
	});
};
