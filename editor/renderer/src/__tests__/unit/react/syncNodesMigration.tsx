// File to be removed after migration: projected to end Dec 2026

import { PanelType } from '@atlaskit/adf-schema/panel';
import { getSchemaBasedOnStage } from '@atlaskit/adf-schema/schema-default';
import { renderWithIntl } from '@atlaskit/editor-test-helpers/rtl';
import { screen } from '@atlassian/testing-library/screen';
import React from 'react';
import type { ComponentType } from 'react';
import { nodeToReact as looselyLazyNodeToReact } from '../../../entry-points/loosely-lazy';
import { Renderer as RendererLegacy } from '../../../entry-points/renderer';
import { Renderer as RendererSync } from '../../../entry-points/renderer-default';
import ReactSerializer from '../../../react';
import { nodeToReact as legacyNodeToReact } from '../../../react/nodes';
import { nodes as newNodeToReact } from '../../../entry-points/nodes-default';
import type { RendererProps } from '../../../ui/renderer-props';

const schema = getSchemaBasedOnStage('stage0');
const dateDoc = schema.nodeFromJSON({
	type: 'doc',
	content: [
		{
			type: 'paragraph',
			content: [{ type: 'date', attrs: { timestamp: '1577836800000' } }],
		},
	],
});

const getDateComponent = (
	Renderer: ComponentType<RendererProps>,
	nodeComponents?: RendererProps['nodeComponents'],
) => {
	let reactSerializer: ReactSerializer | undefined;

	renderWithIntl(
		<Renderer
			document={dateDoc.toJSON()}
			nodeComponents={nodeComponents}
			createSerializer={(init) => {
				reactSerializer = new ReactSerializer(init);
				return reactSerializer;
			}}
		/>,
	);

	if (!reactSerializer) {
		throw new Error('Expected Renderer to create a ReactSerializer');
	}

	const renderedDocument = reactSerializer.serializeFragment(dateDoc.content);
	return renderedDocument?.props.children[0].props.children[0].type;
};

describe('ReactSerializer synchronous node import migration', () => {
	it('uses the synchronous nodeToReact registry for the sync renderer', () => {
		expect(getDateComponent(RendererSync)).toBe(newNodeToReact.date);
		expect(getDateComponent(RendererSync)).not.toBe(legacyNodeToReact.date);
	});

	it('uses the legacy react-loadable registry for the normal renderer', () => {
		expect(getDateComponent(RendererLegacy)).not.toBe(newNodeToReact.date);
		expect(getDateComponent(RendererLegacy)).toBe(legacyNodeToReact.date);
	});

	it('contains every node from the legacy react-loadable registry', () => {
		const newNodeNames = new Set(Object.keys(newNodeToReact));
		const missingNodeNames = Object.keys(legacyNodeToReact).filter(
			(nodeName) => !newNodeNames.has(nodeName),
		);
		expect(missingNodeNames).toEqual([]);
	});

	it('contains every node from the legacy loosely-lazy registry', () => {
		const newNodeNames = new Set(Object.keys(newNodeToReact));
		const missingNodeNames = Object.keys(looselyLazyNodeToReact).filter(
			(nodeName) => !newNodeNames.has(nodeName),
		);
		expect(missingNodeNames).toEqual([]);
	});

	it('keeps consumer node components as the final override', () => {
		const CustomDate = () => null;
		expect(getDateComponent(RendererSync, { date: CustomDate })).toBe(CustomDate);
	});

	it('renders a synchronous node', () => {
		renderWithIntl(
			<RendererSync
				document={{
					version: 1,
					type: 'doc',
					content: [
						{
							type: 'panel',
							attrs: { panelType: PanelType.INFO },
							content: [
								{
									type: 'paragraph',
									content: [{ type: 'text', text: 'Synchronous panel content' }],
								},
							],
						},
					],
				}}
			/>,
		);

		expect(screen.getByText('Synchronous panel content')).toBeVisible();
	});
});
