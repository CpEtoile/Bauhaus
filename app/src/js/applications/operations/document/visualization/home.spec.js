import React from 'react';
import OperationsDocumentationVisualization from './home';
import { render } from '@testing-library/react';

const langs = { lg1: 'lg1', lg2: 'lg2' };
const document = {
	descriptionLg1: 'descriptionLg1',
	descriptionLg2: 'descriptionLg2',
	uri: 'uri/page/1',
	url: 'url',
	updatedDate: '2019/02/01',
};
describe('OperationsDocumentationVisualization', () => {
	it('should display by default two notes', () => {
		const { container } = render(
			<OperationsDocumentationVisualization
				secondLang={false}
				attr={document}
				langs={langs}
			/>
		);
		const notes = container.querySelectorAll('.wilco-note');
		expect(notes).toHaveLength(2);

		expect(notes[0].innerHTML).toContain(document.descriptionLg1);

		const a = notes[1].querySelector('a');
		expect(a).toBeDefined();
		expect(a.href).toContain(document.url);
		expect(a.getAttribute('rel')).toBe('noopener noreferrer');
		expect(a.getAttribute('target')).toBe('_blank');
		expect(a.innerHTML).toContain(document.url);
	});

	it('should display a note if the secondLang flag is true', () => {
		const { container } = render(
			<OperationsDocumentationVisualization
				attr={document}
				langs={langs}
				secondLang={true}
			/>
		);
		const notes = container.querySelectorAll('.wilco-note');

		expect(notes).toHaveLength(3);

		expect(notes[0].innerHTML).toContain(document.descriptionLg1);
		expect(notes[1].innerHTML).toContain(document.descriptionLg2);
	});
	it('should display a note if the object is a document', () => {
		const d = {
			...document,
			uri: '/document/uri',
		};
		const { container } = render(
			<OperationsDocumentationVisualization
				attr={d}
				langs={langs}
				secondLang={true}
			/>
		);
		const notes = container.querySelectorAll('.wilco-note');
		expect(notes).toHaveLength(5);
	});
});
