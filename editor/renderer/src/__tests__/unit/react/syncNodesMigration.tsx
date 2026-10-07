// File to be removed after migration: projected to end Dec 2026

import React from 'react';
import type { ComponentType } from 'react';

import { PanelType } from '@atlaskit/adf-schema/panel';
import { getSchemaBasedOnStage } from '@atlaskit/adf-schema/schema-default';
import { renderWithIntl } from '@atlaskit/editor-test-helpers/rtl';
import { screen } from '@atlassian/testing-library/screen';

import { nodeToReact as looselyLazyNodeToReact } from '../../../entry-points/loosely-lazy';
import { nodes as newNodeToReact } from '../../../entry-points/nodes-default';
import RendererEntryPointReactSerializerLegacy from '../../../entry-points/react';
import RendererWithAnnotationSelectionLegacy, {
	Renderer as RendererLegacy,
	RendererFunctionalComponent as RendererFunctionalComponentLegacy,
	RendererWithAnalytics as RendererWithAnalyticsLegacy,
} from '../../../entry-points/renderer';
import { Renderer as RendererSync } from '../../../entry-points/renderer-default';
import {
	ReactRenderer as ReactRendererLegacy,
	ReactSerializer as RootReactSerializerLegacy,
	RendererWithAnalytics as RootRendererWithAnalyticsLegacy,
} from '../../../index';
import ReactSerializerCore from '../../../react';
import { nodeToReact as legacyNodeToReact } from '../../../react/nodes';
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
	let reactSerializer: ReactSerializerCore | undefined;

	renderWithIntl(
		<Renderer
			document={dateDoc.toJSON()}
			nodeComponents={nodeComponents}
			createSerializer={(init) => {
				reactSerializer = new ReactSerializerCore(init);
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

const getDateComponentFromSerializer = (Serializer: typeof ReactSerializerCore) => {
	const reactSerializer = new Serializer({});
	const renderedDocument = reactSerializer.serializeFragment(dateDoc.content);
	return renderedDocument?.props.children[0].props.children[0].type;
};

const legacyRenderers: Array<[string, ComponentType<RendererProps>]> = [
	// src/index.ts
	['ReactRenderer', ReactRendererLegacy],
	['RootRendererWithAnalytics', RootRendererWithAnalyticsLegacy],
	// src/entry-points/renderer.tsx
	['RendererWithAnnotationSelection', RendererWithAnnotationSelectionLegacy], // Default export
	['Renderer', RendererLegacy],
	['RendererFunctionalComponent', RendererFunctionalComponentLegacy],
	['RendererWithAnalytics', RendererWithAnalyticsLegacy],
];

const legacySerializers: Array<[string, typeof ReactSerializerCore]> = [
	// src/index.ts
	['ReactSerializer', RootReactSerializerLegacy],
	// src/entry-points/react.tsx
	['ReactSerializer /react', RendererEntryPointReactSerializerLegacy], // Default export
];

describe('ReactSerializer synchronous node import migration', () => {
	it('uses the synchronous nodeToReact registry for the sync renderer', () => {
		expect(getDateComponent(RendererSync)).toBe(newNodeToReact.date);
		expect(getDateComponent(RendererSync)).not.toBe(legacyNodeToReact.date);
	});

	it.each(legacyRenderers)('uses the legacy react-loadable registry for %s', (_name, Renderer) => {
		expect(getDateComponent(Renderer)).not.toBe(newNodeToReact.date);
		expect(getDateComponent(Renderer)).toBe(legacyNodeToReact.date);
	});

	it.each(legacySerializers)(
		'uses the legacy react-loadable registry for %s',
		(_name, Serializer) => {
			expect(getDateComponentFromSerializer(Serializer)).not.toBe(newNodeToReact.date);
			expect(getDateComponentFromSerializer(Serializer)).toBe(legacyNodeToReact.date);
		},
	);

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
