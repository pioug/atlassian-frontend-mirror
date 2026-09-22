import React from 'react';

import type { DocNode } from '@atlaskit/adf-schema/doc';
import { render } from '@atlassian/testing-library/render';

import { Renderer } from '../../';

// `validationOverrides` is the 11th argument to renderDocument.
const VALIDATION_OVERRIDES_ARG = 10;

const renderDocumentCalls: unknown[][] = [];

jest.mock('../../../../render-document', () => {
	const actual = jest.requireActual<{
		// Ignored via go/ees005
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		renderDocument: (...args: any[]) => any;
	}>('../../../../render-document');

	return {
		...actual,
		// Ignored via go/ees005
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		renderDocument: (...args: any[]) => {
			renderDocumentCalls.push(args);
			return actual.renderDocument(...args);
		},
	};
});

// Forced on so the `allowTableInPanel` branch runs without needing a schema that permits
// table-in-panel; that branch is the one which used to build a new object every render.
jest.mock('@atlaskit/editor-common/nesting', () => ({
	...jest.requireActual<object>('@atlaskit/editor-common/nesting'),
	isPanelNestingTableSupported: () => true,
}));

const doc: DocNode = {
	type: 'doc',
	version: 1,
	content: [{ type: 'paragraph', content: [{ type: 'text', text: 'hello' }] }],
};

const getValidationOverrides = () =>
	renderDocumentCalls.map((args) => args[VALIDATION_OVERRIDES_ARG]);

// The component is wrapped in React.memo, so an identical element tree is skipped entirely. A fresh
// `eventHandlers` object forces a real re-render without touching validationOverrides.
const renderOnce = () => <Renderer document={doc} appearance="full-page" eventHandlers={{}} />;

describe('Renderer - validationOverrides reference stability', () => {
	beforeEach(() => {
		renderDocumentCalls.length = 0;
	});

	it('passes the same validationOverrides reference across re-renders', () => {
		const { rerender } = render(renderOnce());
		rerender(renderOnce());
		rerender(renderOnce());

		const overrides = getValidationOverrides();
		expect(overrides.length).toBeGreaterThanOrEqual(2);
		expect(overrides[0]).toEqual(expect.objectContaining({ allowTableInPanel: true }));
		overrides.forEach((value) => {
			// Reference, not deep, equality: a fresh object per render is what makes
			// renderDocument's memo miss and re-validate an unchanged document.
			expect(value).toBe(overrides[0]);
		});
	});
});
