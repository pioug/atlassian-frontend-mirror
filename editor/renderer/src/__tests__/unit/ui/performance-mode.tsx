import React from 'react';

import { renderToString } from 'react-dom/server';

import type { DocNode } from '@atlaskit/adf-schema/doc';
import { render } from '@atlassian/testing-library/render';
import { screen } from '@atlassian/testing-library/screen';

import ReactSerializer, { type ReactSerializerInit } from '../../../react';
import { RendererContextProvider, useRendererContext } from '../../../renderer-context';
import Renderer from '../../../ui/Renderer';

const adfDocument: DocNode = {
	version: 1,
	type: 'doc',
	content: [
		{
			type: 'table',
			content: [
				{
					type: 'tableRow',
					content: [
						{
							type: 'tableCell',
							content: [{ type: 'paragraph', content: [{ type: 'text', text: 'Cell' }] }],
						},
					],
				},
			],
		},
	],
};

// A consumer probe only; no table feature reductions are introduced by this API.
const TableProbe = () => {
	const { isPerformanceModeActive = false } = useRendererContext();
	return <span>{isPerformanceModeActive ? 'active' : 'inactive'}</span>;
};
const nodeComponents = { table: TableProbe };

describe('performance mode activation', () => {
	it('forwards activation to nodes and custom serializers, including updates without a remount', async () => {
		const createSerializer = jest.fn((init: ReactSerializerInit) => new ReactSerializer(init));
		const { rerender } = render(
			<Renderer
				document={adfDocument}
				nodeComponents={nodeComponents}
				createSerializer={createSerializer}
			/>,
		);
		expect(screen.getByText('inactive')).toBeInTheDocument();
		expect(createSerializer.mock.lastCall?.[0]).toMatchObject({ isPerformanceModeActive: false });
		rerender(
			<Renderer
				document={adfDocument}
				nodeComponents={nodeComponents}
				createSerializer={createSerializer}
				isPerformanceModeActive
			/>,
		);
		expect(screen.getByText('active')).toBeInTheDocument();
		expect(createSerializer.mock.lastCall?.[0]).toMatchObject({ isPerformanceModeActive: true });
		rerender(
			<Renderer
				document={adfDocument}
				nodeComponents={nodeComponents}
				createSerializer={createSerializer}
				isPerformanceModeActive={false}
			/>,
		);
		expect(screen.getByText('inactive')).toBeInTheDocument();
		expect(createSerializer.mock.lastCall?.[0]).toMatchObject({ isPerformanceModeActive: false });
		await expect(document.body).toBeAccessible();
	});

	it('provides activation during server rendering', () => {
		const createSerializer = jest.fn((init: ReactSerializerInit) => new ReactSerializer(init));
		const html = renderToString(
			<Renderer
				document={adfDocument}
				nodeComponents={nodeComponents}
				createSerializer={createSerializer}
				isPerformanceModeActive
			/>,
		);
		expect(html).toContain('>active</span>');
		expect(createSerializer.mock.lastCall?.[0]).toMatchObject({ isPerformanceModeActive: true });
	});

	it('defaults independent nested renderers to inactive instead of inheriting a parent decision', () => {
		render(
			<RendererContextProvider value={{ isPerformanceModeActive: true }}>
				<Renderer document={adfDocument} nodeComponents={nodeComponents} />
			</RendererContextProvider>,
		);
		expect(screen.getByText('inactive')).toBeInTheDocument();
	});
});
