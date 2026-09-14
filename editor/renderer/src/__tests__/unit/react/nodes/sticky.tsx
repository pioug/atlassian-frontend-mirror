import React from 'react';
import type { Layout as TableLayout } from '@atlaskit/adf-schema/tableNodes';
import { akEditorDefaultLayoutWidth } from '@atlaskit/editor-shared-styles';
import { TableSharedCssClassName } from '@atlaskit/editor-common/styles';
import Table from '../../../../react/nodes/table';
import { TableHeader } from '../../../../react/nodes/tableCell';
import TableRow from '../../../../react/nodes/tableRow';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import { renderWithIntl } from '@atlaskit/editor-test-helpers/rtl';
import { p, table, th, tr } from '@atlaskit/adf-utils/builders';
import { defaultSchema as schema } from '@atlaskit/adf-schema/schema-default';
import type { HeadingLevels } from '../../../../react/nodes/heading';
import Heading from '../../../../react/nodes/heading';
import ReactSerializer from '../../../../react';
import type { RendererAppearance } from '../../../../ui/Renderer/types';

const renderWidth = akEditorDefaultLayoutWidth;
const serialiser = new ReactSerializer({});
const tableDoc = {
	...table(
		tr([th()(p('Heading content 1')), th()(p('Header content 2')), th()(p('Header content 3'))]),
	),
};
const tableFromSchema = schema.nodeFromJSON(tableDoc);
const headingProps = {
	level: 1 as HeadingLevels,
	headingId: 'This-is-a-Heading-1',
	dataAttributes: {
		'data-renderer-start-pos': 0,
	},
	nodeType: 'heading',
	marks: [],
	serializer: serialiser,
};
const tableProps = {
	layout: 'default' as TableLayout,
	renderWidth,
	tableNode: tableFromSchema,
	isNumberColumnEnabled: true,
	rendererAppearance: 'full-page' as RendererAppearance,
};

const renderStickyTable = () =>
	renderWithIntl(
		<Table
			{...tableProps}
			stickyHeaders={{
				offsetTop: 30,
			}}
		>
			<TableRow>
				<TableHeader />
				<TableHeader />
				<TableHeader />
			</TableRow>
		</Table>,
	);

describe('Renderer - React/Nodes/Sticky', () => {
	it('should render the visible table outside of the sticky wrapper', () => {
		const { container } = renderStickyTable();

		expect(container.querySelectorAll('table')).toHaveLength(2);

		const stickyWrapper = container.querySelector(
			`.${TableSharedCssClassName.TABLE_STICKY_WRAPPER}`,
		);
		const visibleTables = Array.from(container.querySelectorAll('table')).filter(
			(node) => !stickyWrapper?.contains(node),
		);

		expect(visibleTables).toHaveLength(1);
		expect(visibleTables[0].querySelectorAll('tr')).toHaveLength(1);
	});

	it('should render the duplicated header row inside the sticky wrapper', () => {
		const { container } = renderStickyTable();

		const stickyWrapper = container.querySelector(
			`.${TableSharedCssClassName.TABLE_STICKY_WRAPPER}`,
		);

		expect(stickyWrapper).toBeInTheDocument();
		expect(stickyWrapper?.querySelectorAll('table')).toHaveLength(1);
		expect(stickyWrapper?.querySelectorAll('tr')).toHaveLength(1);
	});

	it('should remove heading id from invisible structure', () => {
		const { container } = renderWithIntl(
			<Heading {...headingProps} invisible={true}>
				This is a Heading 1
			</Heading>,
		);

		const heading = container.querySelector('h1');

		expect(heading).toBeInTheDocument();
		expect(heading).not.toHaveAttribute('id');
	});

	it('should keep heading id in visible structure', () => {
		const { container } = renderWithIntl(<Heading {...headingProps}>This is a Heading 1</Heading>);

		const heading = container.querySelector('h1');

		expect(heading).toBeInTheDocument();
		expect(heading).toHaveAttribute('id', 'This-is-a-Heading-1');
	});

	it('should capture and report a11y violations', async () => {
		const { container } = renderStickyTable();

		await expect(container).toBeAccessible();
	});
});
