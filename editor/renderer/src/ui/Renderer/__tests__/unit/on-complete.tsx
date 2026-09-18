import React from 'react';

import type { DocNode } from '@atlaskit/adf-schema/doc';
import { mockExpDisabled } from '@atlassian/experiment-test-utils/mock-exp-disabled';
import { mockExpEnabled } from '@atlassian/experiment-test-utils/mock-exp-enabled';
import { resetAllExperiments } from '@atlassian/experiment-test-utils/reset-all-experiments';
import { render } from '@atlassian/testing-library';

import { RendererFunctionalComponent as Renderer } from '../../';

const EXPERIMENT = 'platform_renderer_on_complete_after_commit';

const doc = (text: string): DocNode => ({
	version: 1,
	type: 'doc',
	content: [{ type: 'paragraph', content: [{ type: 'text', text }] }],
});

const isDocumentCommitted = () => document.querySelector('.ak-renderer-wrapper') !== null;

// eslint-disable-next-line @atlassian/a11y/require-jest-coverage
describe('Renderer onComplete', () => {
	afterEach(() => {
		resetAllExperiments();
	});

	describe('with platform_renderer_on_complete_after_commit enabled', () => {
		beforeEach(() => {
			mockExpEnabled(EXPERIMENT);
		});

		it('calls onComplete with the render stat only after the document is committed to the DOM', () => {
			const committedAtCall: boolean[] = [];
			const onComplete = jest.fn(() => {
				committedAtCall.push(isDocumentCommitted());
			});

			render(<Renderer document={doc('hello')} appearance="full-page" onComplete={onComplete} />);

			expect(onComplete).toHaveBeenCalledTimes(1);
			expect(onComplete).toHaveBeenCalledWith(
				expect.objectContaining({ sanitizeTime: expect.any(Number) }),
			);
			expect(committedAtCall).toEqual([true]);
		});

		it('calls onComplete again after a re-render that renders a new document', () => {
			const onComplete = jest.fn();
			const { rerender } = render(
				<Renderer document={doc('hello')} appearance="full-page" onComplete={onComplete} />,
			);

			rerender(<Renderer document={doc('world')} appearance="full-page" onComplete={onComplete} />);

			expect(onComplete).toHaveBeenCalledTimes(2);
		});
	});

	describe('with platform_renderer_on_complete_after_commit disabled', () => {
		beforeEach(() => {
			mockExpDisabled(EXPERIMENT);
		});

		it('keeps calling onComplete during render, before the document is committed', () => {
			const committedAtCall: boolean[] = [];
			const onComplete = jest.fn(() => {
				committedAtCall.push(isDocumentCommitted());
			});

			render(<Renderer document={doc('hello')} appearance="full-page" onComplete={onComplete} />);

			expect(onComplete).toHaveBeenCalledTimes(1);
			expect(committedAtCall).toEqual([false]);
		});
	});
});
