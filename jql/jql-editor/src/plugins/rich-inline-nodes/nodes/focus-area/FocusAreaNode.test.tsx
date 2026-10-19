import React from 'react';

import { render } from '@testing-library/react';

import { DOMSerializer } from '@atlaskit/editor-prosemirror/model';

import { JQLEditorSchema } from '../../../../schema';
import { FocusAreaNode } from './focus-area-node';

describe('FocusAreaNode', () => {
	const renderFocusAreaNode = ({ name = 'Focus Area Name' } = {}) =>
		render(
			<FocusAreaNode
				id="focus-area-1"
				fieldName="focusArea"
				name={name}
				error={false}
				selected={false}
			/>,
		);

	it('is accessible', async () => {
		const { getByText } = renderFocusAreaNode();
		await expect(getByText('Focus Area Name')).toBeAccessible();
	});

	it('displays the correct text', () => {
		const { getByText } = renderFocusAreaNode({ name: 'Cloud Migration 2026' });
		expect(getByText('Cloud Migration 2026')).toBeInTheDocument();
	});

	it('displays the standard focus area icon', () => {
		const { container } = renderFocusAreaNode();
		expect(container.querySelector('svg')).toBeInTheDocument();
	});

	it('preserves the focus area name after an HTML clipboard round trip', () => {
		const node = JQLEditorSchema.nodes.focusArea.create(
			{ id: 'focus-area-1', fieldName: 'focusArea', name: 'Focus Area Name' },
			JQLEditorSchema.text('"focus-area-1"'),
		);
		const serialized = DOMSerializer.fromSchema(JQLEditorSchema).serializeNode(node);
		const getAttrs = JQLEditorSchema.nodes.focusArea.spec.parseDOM![0].getAttrs!;
		const parsedAttrs = getAttrs(serialized as HTMLElement);
		const pastedNode = JQLEditorSchema.nodes.focusArea.create(parsedAttrs || undefined);
		const { getByText } = renderFocusAreaNode(pastedNode.attrs);
		expect(getByText('Focus Area Name')).toBeInTheDocument();
	});
});
