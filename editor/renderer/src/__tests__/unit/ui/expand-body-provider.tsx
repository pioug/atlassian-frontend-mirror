import React, { useState } from 'react';
import type { ReactNode } from 'react';

import { act, fireEvent, waitFor } from '@testing-library/react';

import { defaultSchema } from '@atlaskit/adf-schema/schema-default';
import type { Node as PMNode } from '@atlaskit/editor-prosemirror/model';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import { renderWithIntl } from '@atlaskit/editor-test-helpers/rtl';
import { mockExpDisabled } from '@atlassian/experiment-test-utils/mock-exp-disabled';
import { mockExpEnabled } from '@atlassian/experiment-test-utils/mock-exp-enabled';

import ExpandWithInt from '../../../ui/Expand';
import { ExpandBodyBlock, ExpandBodyProvider } from '../../../ui/utils/expand-body';

const BODY_TEXT = 'collapsed body text';

// `revealedByFind` is keyed by node identity; the serializer reuses node instances across renders.
const node = defaultSchema.nodeFromJSON({
	type: 'expand',
	attrs: { title: 'Outer title' },
	content: [
		{ type: 'paragraph', content: [{ type: 'text', text: BODY_TEXT }] },
		{
			type: 'nestedExpand',
			attrs: { title: 'Inner title' },
			content: [{ type: 'paragraph', content: [{ type: 'text', text: 'inner text' }] }],
		},
	],
});
const nestedNode = node.child(1);

/**
 * Expands under a product's own outermost body that are thrown away and mounted again when the
 * button is clicked.
 */
const Remounted = ({ children }: { children: (round: number) => ReactNode }) => {
	const [round, setRound] = useState(0);
	const [body] = useState(() => ({
		revealed: true,
		openWithAncestors: () => {},
		revealedByFind: new WeakSet<PMNode>(),
	}));
	return (
		<ExpandBodyProvider value={body}>
			<button type="button" onClick={() => setRound(round + 1)}>
				remount
			</button>
			{children(round)}
		</ExpandBodyProvider>
	);
};

const expand = (round: number) => (
	<ExpandWithInt key={round} title="Outer title" nodeType="expand" node={node}>
		<ExpandBodyBlock searchText={BODY_TEXT}>
			<div data-testid="expand-children">children</div>
		</ExpandBodyBlock>
	</ExpandWithInt>
);

const nestedExpands = (round: number) => (
	<ExpandWithInt key={round} title="Outer title" nodeType="expand" node={node}>
		<ExpandWithInt title="Inner title" nodeType="nestedExpand" node={nestedNode}>
			<div>inner</div>
		</ExpandWithInt>
	</ExpandWithInt>
);

const expandButtons = (container: HTMLElement) => [
	...container.querySelectorAll<HTMLElement>('[aria-expanded]'),
];

const remount = (getByText: (text: string) => HTMLElement) =>
	act(() => {
		fireEvent.click(getByText('remount'));
	});

describe('ExpandBodyProvider', () => {
	it('mounts an expand the reader opened open again after a remount', () => {
		mockExpEnabled('cc_light_mode_table_virtualization');
		const { container, getByText } = renderWithIntl(<Remounted>{expand}</Remounted>);

		fireEvent.click(expandButtons(container)[0]);
		remount(getByText);

		expect(expandButtons(container)[0]).toHaveAttribute('aria-expanded', 'true');
	});

	it('mounts it closed again after the reader closed it', () => {
		mockExpEnabled('cc_light_mode_table_virtualization');
		const { container, getByText } = renderWithIntl(<Remounted>{expand}</Remounted>);

		fireEvent.click(expandButtons(container)[0]);
		fireEvent.click(expandButtons(container)[0]);
		remount(getByText);

		expect(expandButtons(container)[0]).toHaveAttribute('aria-expanded', 'false');
	});

	it('mounts a nested expand the reader opened open again after a remount', () => {
		mockExpEnabled('cc_light_mode_table_virtualization');
		const { container, getByText } = renderWithIntl(<Remounted>{nestedExpands}</Remounted>);

		fireEvent.click(expandButtons(container)[0]);
		fireEvent.click(expandButtons(container)[1]);
		remount(getByText);

		expect(expandButtons(container).map((button) => button.getAttribute('aria-expanded'))).toEqual([
			'true',
			'true',
		]);
	});

	it('mounts an expand find opened open again after a remount', async () => {
		const { container, getByText } = renderWithIntl(<Remounted>{expand}</Remounted>);
		const wrapper = container.querySelector('.expand-content-wrapper')!;
		await waitFor(() => {
			expect(wrapper.getAttribute('hidden')).toBe('until-found');
		});

		fireEvent(wrapper, new Event('beforematch'));
		remount(getByText);

		expect(expandButtons(container)[0]).toHaveAttribute('aria-expanded', 'true');
	});

	it('does not record reader toggles without table virtualization', () => {
		mockExpDisabled('cc_light_mode_table_virtualization');
		const { container, getByText } = renderWithIntl(<Remounted>{expand}</Remounted>);

		fireEvent.click(expandButtons(container)[0]);
		remount(getByText);

		expect(expandButtons(container)[0]).toHaveAttribute('aria-expanded', 'false');
	});
});
