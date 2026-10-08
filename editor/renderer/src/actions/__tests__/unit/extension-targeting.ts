import { failGate, passGate } from '@atlassian/feature-flags-test-utils/mock-gates';

import RendererActions from '../../index';

describe('RendererActions extension targeting', () => {
	const gate = 'cc_maui_annotations_on_extensions';
	const createRange = (nested = false) => {
		const root = document.createElement('div');
		root.className = 'ak-renderer-document';
		const extension = root.appendChild(document.createElement('div'));
		extension.className = 'ak-renderer-extension';
		const content = extension.appendChild(document.createElement('div'));
		if (nested) {
			content.className = 'ak-renderer-document';
		}
		const text = content.appendChild(document.createTextNode('Chart'));
		const range = document.createRange();
		range.selectNodeContents(text);
		return { range, extension };
	};

	it('preserves extension rejection when the gate is disabled', () => {
		failGate(gate);
		const actions = new RendererActions();
		jest.spyOn(actions, 'isValidAnnotationRange').mockReturnValue(true);
		expect(actions.isRangeAnnotatable(createRange().range)).toBe(false);
	});

	it('allows the extension wrapper without a nested document', () => {
		passGate(gate);
		const actions = new RendererActions();
		jest.spyOn(actions, 'isValidAnnotationRange').mockReturnValue(true);
		const { range, extension } = createRange();
		expect(actions.isRangeAnnotatable(range)).toBe(true);
		range.selectNodeContents(extension);
		expect(actions.isRangeAnnotatable(range)).toBe(true);
	});

	it('continues to reject a nested renderer document', () => {
		passGate(gate);
		const actions = new RendererActions();
		jest.spyOn(actions, 'isValidAnnotationRange').mockReturnValue(true);
		expect(actions.isRangeAnnotatable(createRange(true).range)).toBe(false);
	});

	it('still validates the document positions after accepting the wrapper', () => {
		passGate(gate);
		const actions = new RendererActions();
		jest.spyOn(actions, 'isValidAnnotationRange').mockReturnValue(false);
		expect(actions.isRangeAnnotatable(createRange().range)).toBe(false);
	});
});
