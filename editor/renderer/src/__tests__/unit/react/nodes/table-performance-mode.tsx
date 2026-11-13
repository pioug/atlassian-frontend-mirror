import React from 'react';

import { renderToStaticMarkup } from 'react-dom/server';
import { IntlProvider } from 'react-intl';

import { defaultSchema } from '@atlaskit/adf-schema/schema-default';
import { ShadowObserver } from '@atlaskit/editor-common/OverflowShadow/shadowObserver';
import { TableSharedCssClassName } from '@atlaskit/editor-common/styles';
import { renderWithIntl } from '@atlaskit/editor-test-helpers/rtl';
import { setupEditorExperiments } from '@atlaskit/tmp-editor-statsig/setup';
import { fireEvent } from '@atlassian/testing-library/fire-event';
import { screen } from '@atlassian/testing-library/screen';

import Table from '../../../../react/nodes/table';
import { TableCell, TableHeader } from '../../../../react/nodes/tableCell';
import TableRow from '../../../../react/nodes/tableRow';
import { RendererContextProvider } from '../../../../renderer-context';

const tableNode = defaultSchema.nodeFromJSON({
	type: 'table',
	attrs: { width: 1000 },
	content: [
		{ type: 'tableRow', content: [{ type: 'tableHeader', content: [{ type: 'paragraph' }] }] },
		{ type: 'tableRow', content: [{ type: 'tableCell', content: [{ type: 'paragraph' }] }] },
	],
});

const table = (active: boolean, syncedBlock = false) => (
	<RendererContextProvider
		value={{
			isPerformanceModeActive: active,
			isTopLevelRenderer: !syncedBlock,
			nestedRendererType: syncedBlock ? 'syncedBlock' : undefined,
		}}
	>
		<Table
			tableNode={tableNode}
			columnWidths={[1000]}
			layout="default"
			renderWidth={500}
			rendererAppearance="full-page"
			isNumberColumnEnabled={false}
			allowTableResizing
			stickyHeaders={{ offsetTop: 0 }}
		>
			<TableRow>{[<TableHeader key="header">Header</TableHeader>]}</TableRow>
			<TableRow>
				<TableCell>Body</TableCell>
			</TableRow>
		</Table>
	</RendererContextProvider>
);

beforeEach(() => {
	setupEditorExperiments('confluence', { platform_renderer_table_sticky_scrollbar: true });
});
afterEach(() => {
	jest.restoreAllMocks();
	setupEditorExperiments('test', {}, {}, { disableTestOverrides: true });
});

it('omits cloned headers, shadow sentinels, and dimension observations in Performance Mode', () => {
	const observe = jest.spyOn(ResizeObserver.prototype, 'observe');
	renderWithIntl(table(true));
	const root = screen.getByTestId('table-container');
	expect(screen.getAllByRole('table')).toHaveLength(1);
	expect(root.querySelector(`.${TableSharedCssClassName.TABLE_STICKY_WRAPPER}`)).toBeNull();
	expect(root.querySelector('.sentinel-left, .sentinel-right')).toBeNull();
	expect(observe).not.toHaveBeenCalled();
	const wrapper = screen.getByText('Body').closest('table')!.parentElement!;
	expect(wrapper).toHaveAttribute('tabindex', '0');
});

it.each([false, true])('keeps authored widths in Performance Mode (synced block: %s)', (synced) => {
	const { rerender } = renderWithIntl(table(true, synced));
	const element = screen.getByRole('table');
	expect(element).toHaveStyle({ width: '1000px', minWidth: '1000px' });
	expect(element.querySelector('col')).toHaveStyle({ width: '999px' });
	rerender(table(false, synced));
	expect(element.style.minWidth).toBe('');
	expect(element.style.width).toBe('');
});

it.each([
	{ active: false, savedWidth: null, expectedWidth: '' },
	{ active: true, savedWidth: null, expectedWidth: '' },
	{ active: false, savedWidth: 1000, expectedWidth: '' },
	{ active: true, savedWidth: 1000, expectedWidth: '1000px' },
])(
	'preserves comment table sizing (Performance Mode: $active, saved width: $savedWidth)',
	({ active, savedWidth, expectedWidth }) => {
		const commentTableNode = tableNode.type.create(
			{ ...tableNode.attrs, width: savedWidth },
			tableNode.content,
		);
		renderWithIntl(
			<RendererContextProvider value={{ isPerformanceModeActive: active }}>
				<Table
					tableNode={commentTableNode}
					layout="default"
					renderWidth={500}
					rendererAppearance="comment"
					isNumberColumnEnabled={false}
					allowTableResizing
				>
					<TableRow>
						<TableCell>Body</TableCell>
					</TableRow>
				</Table>
			</RendererContextProvider>,
		);
		const element = screen.getByRole('table');
		expect(element).toHaveAttribute('data-table-width', savedWidth ? `${savedWidth}` : 'inherit');
		expect(element.style.minWidth).toBe(expectedWidth);
		expect(element.style.width).toBe(expectedWidth);
	},
);

it('restores headers and shadow tracking without replacing the table or its content', () => {
	const dispose = jest.spyOn(ShadowObserver.prototype, 'dispose');
	const disconnect = jest.spyOn(ResizeObserver.prototype, 'disconnect');
	const observe = jest.spyOn(ResizeObserver.prototype, 'observe');
	const { rerender } = renderWithIntl(table(false));
	const initialObservations = observe.mock.calls.length;
	const root = screen.getByTestId('table-container');
	const body = screen.getByText('Body');
	const element = body.closest('table');
	expect(root.querySelectorAll('table')).toHaveLength(2);
	rerender(table(true));
	expect(dispose).toHaveBeenCalled();
	expect(disconnect).toHaveBeenCalled();
	expect(observe).toHaveBeenCalledTimes(initialObservations);
	expect(screen.getAllByRole('table')).toHaveLength(1);
	expect(screen.getByText('Body')).toBe(body);
	expect(body.closest('table')).toBe(element);
	rerender(table(false));
	expect(observe.mock.calls.length).toBeGreaterThan(initialObservations);
	expect(root.querySelectorAll('table')).toHaveLength(2);
	expect(screen.getByText('Body')).toBe(body);
	expect(root.querySelector('.sentinel-left')).toBeInTheDocument();
});

it('synchronizes the floating scrollbar without a sticky header in Performance Mode', () => {
	renderWithIntl(table(true));
	const root = screen.getByTestId('table-container');
	const wrapper = screen.getByRole('table').parentElement!;
	const scrollbar = root.querySelector<HTMLElement>(
		'[data-vc="table-sticky-scrollbar-container"]',
	)!;
	wrapper.scrollLeft = 120;
	fireEvent.scroll(wrapper);
	expect(scrollbar.scrollLeft).toBe(120);
});

it('renders the same fixed width and single header during SSR', () => {
	const html = renderToStaticMarkup(<IntlProvider locale="en">{table(true)}</IntlProvider>);
	const parsed = new DOMParser().parseFromString(html, 'text/html');
	expect(parsed.querySelectorAll('table')).toHaveLength(1);
	expect(parsed.querySelector('table')?.style.width).toBe('1000px');
	expect(parsed.querySelector('col')?.style.width).toBe('999px');
});
