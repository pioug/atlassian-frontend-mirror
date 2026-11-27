import React from 'react';

import type { DocNode } from '@atlaskit/adf-schema/doc';
import { mockExpDisabled } from '@atlassian/experiment-test-utils/mock-exp-disabled';
import { mockExpEnabled } from '@atlassian/experiment-test-utils/mock-exp-enabled';
import { render } from '@atlassian/testing-library/testing-library/react';

import { RendererFunctionalComponent as Renderer } from '../../';

const EXPERIMENT = 'platform_editor_fix_tuple_content_variants';

// Matches the ADF Confluence returns for a task with small text. Each test passes its own text
// because the renderer reuses its validation result for an equal document.
const createDoc = (text: string): DocNode =>
	({
		version: 1,
		type: 'doc',
		content: [
			{
				type: 'taskList',
				attrs: { localId: 'list' },
				content: [
					{
						type: 'blockTaskItem',
						attrs: { localId: 'task', state: 'TODO' },
						content: [
							{
								type: 'paragraph',
								marks: [{ type: 'fontSize', attrs: { fontSize: 'small' } }],
								content: [{ type: 'text', text }],
							},
						],
					},
				],
			},
		],
	}) as DocNode;

const getSmallTextMark = (container: HTMLElement) =>
	container.querySelector(".fabric-editor-font-size[data-font-size='small']");

describe('Renderer: small text in blockTaskItem', () => {
	it('renders the fontSize mark when the experiment is on', () => {
		mockExpEnabled(EXPERIMENT);
		const { container } = render(
			<Renderer document={createDoc('Experiment on')} appearance="full-page" />,
		);

		expect(getSmallTextMark(container)).toHaveTextContent('Experiment on');
	});

	it('drops the fontSize mark when the experiment is off', () => {
		mockExpDisabled(EXPERIMENT);
		const { container } = render(
			<Renderer document={createDoc('Experiment off')} appearance="full-page" />,
		);

		expect(container).toHaveTextContent('Experiment off');
		expect(getSmallTextMark(container)).toBeNull();
	});
});
