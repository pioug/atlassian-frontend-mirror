import React from 'react';
import { getSchemaBasedOnStage } from '@atlaskit/adf-schema/schema-default';
import { p, table, td, th, tr } from '@atlaskit/adf-utils/builders';
import { TableSharedCssClassName } from '@atlaskit/editor-common/styles';
import { renderWithIntl } from '@atlaskit/editor-test-helpers/rtl';
import { setupEditorExperiments } from '@atlaskit/tmp-editor-statsig/setup';
import { render } from '@atlassian/testing-library/render';
import { screen } from '@atlassian/testing-library/screen';

import { TableCell, TableHeader } from '../../../../react/nodes/tableCell';
import { TableProcessorWithContainerStyles } from '../../../../react/nodes/table';
import TableRow from '../../../../react/nodes/tableRow';
import { RendererStyleContainer } from '../../../../ui/Renderer/RendererStyleContainer';

const schema = getSchemaBasedOnStage('stage0');

const RowRenderer = ({ children }: React.PropsWithChildren): React.JSX.Element => <>{children}</>;

const renderRoundedTable = () => {
	render(
		<RendererStyleContainer
			allowNestedHeaderLinks={false}
			appearance="full-page"
			testId="renderer-style-container"
			useBlockRenderForCodeBlock={false}
		>
			{/* eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop -- fixture must match the production table container selector */}
			<div className={TableSharedCssClassName.TABLE_CONTAINER}>
				<table>
					<tbody>
						<tr>
							<th data-reaches-left data-reaches-top scope="col">
								Cell
							</th>
						</tr>
					</tbody>
				</table>
			</div>
		</RendererStyleContainer>,
	);

	return screen.getByRole('columnheader');
};

const setupRoundedTableExperiments = () => {
	setupEditorExperiments('test', {
		platform_editor_table_q4_loveability: true,
	});
};

describe('rounded table corners', () => {
	afterEach(() => {
		setupEditorExperiments('test', {}, {}, { disableTestOverrides: true });
	});

	it('adds edge attributes to cells nested inside a row renderer', () => {
		setupRoundedTableExperiments();
		const tableNode = schema.nodeFromJSON(
			table(
				tr([th()(p('Header 1')), th()(p('Header 2'))]),
				tr([td()(p('Body 1')), td()(p('Body 2'))]),
			),
		);
		renderWithIntl(
			<TableProcessorWithContainerStyles
				isNumberColumnEnabled={false}
				layout="default"
				rendererAppearance="full-page"
				renderWidth={760}
				smartCardStorage={new Map()}
				tableNode={tableNode}
			>
				<TableRow>
					<TableHeader />
					<TableHeader />
				</TableRow>
				<RowRenderer>
					<TableRow>
						<TableCell />
						<TableCell />
					</TableRow>
				</RowRenderer>
			</TableProcessorWithContainerStyles>,
		);

		const [topLeftCell] = screen.getAllByRole('columnheader');
		const [bottomLeftCell, bottomRightCell] = screen.getAllByRole('cell');

		expect(topLeftCell).toHaveAttribute('data-reaches-left', 'true');
		expect(topLeftCell).toHaveAttribute('data-reaches-top', 'true');
		expect(bottomLeftCell).toHaveAttribute('data-reaches-bottom', 'true');
		expect(bottomLeftCell).toHaveAttribute('data-reaches-left', 'true');
		expect(bottomRightCell).toHaveAttribute('data-reaches-bottom', 'true');
		expect(bottomRightCell).toHaveAttribute('data-reaches-right', 'true');
	});

	it('preserves merged-cell edge geometry for wrapped rows', () => {
		setupRoundedTableExperiments();
		const tableNode = schema.nodeFromJSON(
			table(
				tr([th({ colspan: 2 })(p('Header'))]),
				tr([td({ rowspan: 2 })(p('Left')), td()(p('Top right'))]),
				tr([td()(p('Bottom right'))]),
			),
		);
		renderWithIntl(
			<TableProcessorWithContainerStyles
				isNumberColumnEnabled={false}
				layout="default"
				rendererAppearance="full-page"
				renderWidth={760}
				smartCardStorage={new Map()}
				tableNode={tableNode}
			>
				<TableRow>
					<TableHeader colspan={2} />
				</TableRow>
				<RowRenderer>
					<TableRow>
						<TableCell rowspan={2} />
						<TableCell />
					</TableRow>
				</RowRenderer>
				<RowRenderer>
					<TableRow>
						<TableCell />
					</TableRow>
				</RowRenderer>
			</TableProcessorWithContainerStyles>,
		);

		const headerCell = screen.getByRole('columnheader');
		const [leftCell, , bottomRightCell] = screen.getAllByRole('cell');

		expect(headerCell).toHaveAttribute('data-reaches-left', 'true');
		expect(headerCell).toHaveAttribute('data-reaches-right', 'true');
		expect(leftCell).toHaveAttribute('data-reaches-bottom', 'true');
		expect(leftCell).toHaveAttribute('data-reaches-left', 'true');
		expect(bottomRightCell).toHaveAttribute('data-reaches-bottom', 'true');
		expect(bottomRightCell).toHaveAttribute('data-reaches-right', 'true');
		expect(bottomRightCell).not.toHaveAttribute('data-reaches-left');
	});

	it('omits clip-path while retaining rounded corner styles', async () => {
		setupRoundedTableExperiments();
		const cornerCell = renderRoundedTable();
		const styles = getComputedStyle(cornerCell);

		expect(styles.clipPath).toBe('');
		expect(styles.backgroundClip).toBe('border-box');
		expect(styles.borderTopLeftRadius).not.toBe('');
		await expect(document.body).toBeAccessible();
	});
});
