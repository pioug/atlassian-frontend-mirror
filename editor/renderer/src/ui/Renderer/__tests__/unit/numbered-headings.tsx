import React from 'react';

import { IntlProvider } from 'react-intl';

import type { DocNode } from '@atlaskit/adf-schema/doc';
import { PanelType } from '@atlaskit/adf-schema/panel';
import { setupEditorExperiments } from '@atlaskit/tmp-editor-statsig/setup';
import { mockExpDisabled } from '@atlassian/experiment-test-utils/mock-exp-disabled';
import { mockExpEnabled } from '@atlassian/experiment-test-utils/mock-exp-enabled';
import { render } from '@atlassian/testing-library/render';
import { screen } from '@atlassian/testing-library/screen';
import { userEvent } from '@atlassian/testing-library/user-event';
import { waitFor } from '@atlassian/testing-library/wait-for';

import type { RendererProps } from '../../../renderer-props';
import { RendererFunctionalComponent as Renderer } from '../../index';

const heading = (level: 1 | 2 | 3 | 4 | 5 | 6, text = `Heading ${level}`) => ({
	type: 'heading' as const,
	attrs: { level },
	content: [{ type: 'text' as const, text }],
});

const document: DocNode = {
	type: 'doc',
	version: 1,
	content: [heading(1), heading(3), heading(2), heading(1, 'Next section')],
};

const renderer = (props: Partial<RendererProps> = {}) => (
	<IntlProvider locale="en">
		<Renderer document={document} appearance="full-page" {...props} />
	</IntlProvider>
);

const numbers = () =>
	screen.getAllByRole('heading').map((node) => node.getAttribute('data-heading-number'));

describe('numbered headings', () => {
	afterEach(() => setupEditorExperiments('test', {}));

	it.each([true, false])(
		'numbers headings with the anchor accessibility experiment %s',
		(enabled) => {
			mockExpEnabled('platform_editor_numbered_headings');
			setupEditorExperiments('test', { platform_editor_copy_link_a11y_inconsistency_fix: enabled });
			render(renderer({ showHeadingNumbers: true }));
			expect(numbers()).toEqual(['1', '1.1.1', '1.2', '2']);
			expect(screen.getByRole('heading', { name: 'Heading 1' })).toHaveAttribute('id', 'Heading-1');
		},
	);

	it.each([undefined, false])(
		'does not number headings when the prop is %s',
		(showHeadingNumbers) => {
			mockExpEnabled('platform_editor_numbered_headings');
			render(renderer({ showHeadingNumbers }));
			expect(numbers()).toEqual([null, null, null, null]);
		},
	);

	it('does not number headings in the experiment control cohort', () => {
		mockExpDisabled('platform_editor_numbered_headings');
		render(renderer({ showHeadingNumbers: true }));
		expect(numbers()).toEqual([null, null, null, null]);
	});

	it('numbers all six levels', () => {
		mockExpEnabled('platform_editor_numbered_headings');
		render(
			renderer({
				showHeadingNumbers: true,
				document: {
					type: 'doc',
					version: 1,
					content: [heading(1), heading(2), heading(3), heading(4), heading(5), heading(6)],
				},
			}),
		);
		expect(numbers()).toEqual(['1', '1.1', '1.1.1', '1.1.1.1', '1.1.1.1.1', '1.1.1.1.1.1']);
	});

	it('continues numbering across panels, tables, layouts and expands', async () => {
		mockExpEnabled('platform_editor_numbered_headings');
		const nestedDocument: DocNode = {
			type: 'doc',
			version: 1,
			content: [
				heading(1),
				{ type: 'panel', attrs: { panelType: PanelType.INFO }, content: [heading(2)] },
				{
					type: 'table',
					content: [{ type: 'tableRow', content: [{ type: 'tableCell', content: [heading(3)] }] }],
				},
				{
					type: 'layoutSection',
					content: [
						{ type: 'layoutColumn', attrs: { width: 50 }, content: [heading(2, 'Layout heading')] },
						{ type: 'layoutColumn', attrs: { width: 50 }, content: [{ type: 'paragraph' }] },
					],
				},
				{ type: 'expand', attrs: { title: 'Details' }, content: [heading(3, 'Expand heading')] },
				heading(1, 'Final heading'),
			],
		};
		render(renderer({ showHeadingNumbers: true, document: nestedDocument }));
		await userEvent.click(await screen.findByText('Details'));
		await waitFor(() =>
			expect(
				screen
					.getAllByRole('heading', { hidden: true })
					.map((node) => node.getAttribute('data-heading-number')),
			).toEqual(['1', '1.1', '1.1.1', '1.2', '1.2.1', '2']),
		);
	});

	it('resets numbering when the document changes and when toggled off and on', () => {
		mockExpEnabled('platform_editor_numbered_headings');
		const { rerender } = render(renderer({ showHeadingNumbers: true }));
		const nextDocument: DocNode = { type: 'doc', version: 1, content: [heading(2), heading(1)] };
		rerender(renderer({ showHeadingNumbers: true, document: nextDocument }));
		expect(numbers()).toEqual(['1.1', '2']);
		rerender(renderer({ showHeadingNumbers: false, document: nextDocument }));
		expect(numbers()).toEqual([null, null]);
		rerender(renderer({ showHeadingNumbers: true, document: nextDocument }));
		expect(numbers()).toEqual(['1.1', '2']);
	});

	it('keeps numbering independent between renderer instances', () => {
		mockExpEnabled('platform_editor_numbered_headings');
		render(
			<>
				{renderer({ showHeadingNumbers: true })}
				{renderer({ showHeadingNumbers: true })}
			</>,
		);
		expect(numbers()).toEqual(['1', '1.1.1', '1.2', '2', '1', '1.1.1', '1.2', '2']);
	});
});
