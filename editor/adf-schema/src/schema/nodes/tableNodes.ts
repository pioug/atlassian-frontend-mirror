import type { Node as PmNode } from '@atlaskit/editor-prosemirror/model';
import { hexToEditorBackgroundPaletteRawValue } from '../../utils/editor-palette';
import {
	B100,
	B50,
	B75,
	G200,
	G50,
	G75,
	hexToRgba,
	isHex,
	isRgb,
	N0,
	N20,
	N60,
	N800,
	P100,
	P50,
	P75,
	R100,
	R50,
	R75,
	rgbToHex,
	T100,
	T50,
	T75,
	Y200,
	Y50,
	Y75,
} from '../../utils/colors';
import type { PanelDefinition as Panel } from './panel';
import type {
	ParagraphDefinition as Paragraph,
	ParagraphWithAlignmentDefinition as ParagraphWithMarks,
} from './paragraph';
import type { BlockQuoteDefinition as Blockquote } from './blockquote';
import type {
	OrderedListDefinition as OrderedList,
	BulletListDefinition as BulletList,
} from './types/list';
import type { RuleDefinition as Rule } from './rule';
import type {
	HeadingDefinition as Heading,
	HeadingWithMarksDefinition as HeadingWithMarks,
} from './heading';
import type { CodeBlockDefinition as CodeBlock } from './code-block';
import type { MediaGroupDefinition as MediaGroup } from './media-group';
import type { MediaSingleDefinition as MediaSingle } from './media-single';
import type { DecisionListDefinition as DecisionList } from './decision-list';
import type { TaskListDefinition as TaskList } from './task-list';
import type { ExtensionDefinition as Extension } from './extension';
import type { BlockCardDefinition as BlockCard } from './block-card';
import type { EmbedCardDefinition as EmbedCard } from './embed-card';
import type { NestedExpandDefinition as NestedExpand } from './nested-expand';
import { uuid } from '../../utils/uuid';
import type { FragmentDefinition } from '../marks/fragment';
import { getDarkModeLCHColor } from '../../utils/lch-color-inversion';

import {
	table as tableFactory,
	tableWithNestedTable as tableWithNestedTableFactory,
	tableRow as tableRowFactory,
	tableRowWithNestedTable as tableRowWithNestedTableFactory,
	tableHeader as tableHeaderFactory,
	tableHeaderWithNestedTable as tableHeaderWithNestedTableFactory,
	tableCell as tableCellFactory,
	tableCellWithNestedTable as tableCellWithNestedTableFactory,
} from '../../next-schema/generated/nodeTypes';

import type {
	TableNode,
	TableWithNestedTableNode,
	TableRowNode,
	TableRowWithNestedTableNode,
	TableHeaderNode,
	TableHeaderWithNestedTableNode,
	TableCellNode,
	TableCellWithNestedTableNode,
} from '../../next-schema/generated/nodeTypes';

import type { NodeSpecOptions } from '../createPMSpecFactory';

export interface CellAttributes {
	background?: string;
	colspan?: number;
	colwidth?: number[];
	localId?: string;
	rowspan?: number;
}

export const tablePrefixSelector = 'pm-table';

export const tableCellSelector = `${tablePrefixSelector}-cell-content-wrap`;
export const tableHeaderSelector = `${tablePrefixSelector}-header-content-wrap`;
export const tableCellContentWrapperSelector = `${tablePrefixSelector}-cell-nodeview-wrapper`;
export const tableCellContentDomSelector = `${tablePrefixSelector}-cell-nodeview-content-dom`;

const DEFAULT_TABLE_HEADER_CELL_BACKGROUND = N20.toLocaleLowerCase();

export const getCellAttrs: (
	dom: HTMLElement,
	defaultValues?: CellAttributes,
) => {
	background: string | null;
	colspan: number;
	colwidth: number[] | null;
	localId?: string;
	rowspan: number;
} = (dom: HTMLElement, defaultValues: CellAttributes = {}) => {
	const widthAttr = dom.getAttribute('data-colwidth');
	const width =
		// @ts-ignore TS1501: This regular expression flag is only available when targeting 'es6' or later.
		widthAttr && /^\d+(,\d+)*$/u.test(widthAttr)
			? widthAttr.split(',').map((str) => Number(str))
			: null;
	const colspan = Number(dom.getAttribute('colspan') || 1);
	let { backgroundColor } = dom.style;

	/**
	 * We have pivoted to store background color information in
	 *  data-cell-background.
	 * We will have original hex code (which we map to DST token)
	 *  stored in data-cell-background, use that.
	 * More details at https://product-fabric.atlassian.net/wiki/spaces/EUXQ/pages/3472556903/Tokenising+tableCell+background+colors#Update-toDom-and-parseDom-to-store-and-read-background-color-from-data-cell-background-attribute.4
	 */
	const dataCellBackground = dom.getAttribute('data-cell-background');
	const dataCellBackgroundHexCode =
		dataCellBackground && isHex(dataCellBackground) ? dataCellBackground : undefined;

	// ignore setting background attr if ds neutral token is detected
	if (backgroundColor.includes('--ds-background-neutral')) {
		backgroundColor = '';
	} else {
		if (backgroundColor && isRgb(backgroundColor)) {
			const result = rgbToHex(backgroundColor);
			if (result !== null) {
				backgroundColor = result;
			}
		}
	}

	const backgroundHexCode =
		dataCellBackgroundHexCode ||
		(backgroundColor && backgroundColor !== defaultValues['background'] ? backgroundColor : null);

	const localId = defaultValues?.localId;

	return {
		colspan,
		rowspan: Number(dom.getAttribute('rowspan') || 1),
		colwidth: width && width.length === colspan ? width : null,
		background: backgroundHexCode,
		...(localId && { localId }),
	};
};

export type CellDomAttrs = {
	class?: string;
	colorname?: string;
	colspan?: string;
	'data-cell-background'?: string;
	'data-colwidth'?: string;
	'data-local-id'?: string;
	rowspan?: string;
	style?: string;
};

// these are for test only
let testGlobalTheme: string;
export const setGlobalTheme = (theme: string) => {
	testGlobalTheme = theme;
};
// This is a minimal duplication of the method from @atlaskit/tokens
// to minimise the number of dependencies required as these changes are expected
// to be patched onto CR8.
const getGlobalTheme = () => {
	// This should only be hit during tests.
	//
	// At time of writing Jest mocks are not working in this repository.
	if (testGlobalTheme) {
		return { colorMode: testGlobalTheme };
	}
	const element = document.documentElement;
	const colorMode = element.getAttribute('data-color-mode') || '';

	return { colorMode };
};

// @ts-ignore TS1501: This regular expression flag is only available when targeting 'es6' or later.
const cssVariablePattern = /^var\(--.*\)$/u;

/**
 * gets cell dom attributes based on node attributes
 * @returns CellDomAttrs
 */
export const getCellDomAttrs = (node: PmNode): CellDomAttrs => {
	const attrs: CellDomAttrs = {};
	const nodeType = node.type.name;

	if (node.attrs.colspan !== 1) {
		attrs.colspan = node.attrs.colspan;
	}
	if (node.attrs.rowspan !== 1) {
		attrs.rowspan = node.attrs.rowspan;
	}

	if (node.attrs.colwidth) {
		attrs['data-colwidth'] = node.attrs.colwidth.join(',');
	}
	if (node.attrs.background) {
		const { background } = node.attrs;

		// to ensure that we don't overwrite product's style:
		// - it clears background color for <th> if its set to gray
		// - it clears background color for <td> if its set to white
		// - it clears background color for <th> if ds neutral token is detected
		const ignored =
			(nodeType === 'tableHeader' && background === tableBackgroundColorNames.get('light gray')) ||
			(nodeType === 'tableCell' && background === tableBackgroundColorNames.get('white')) ||
			(nodeType === 'tableHeader' && background.includes('--ds-background-neutral'));

		if (ignored) {
			attrs.style = '';
		} else {
			const color = isRgb(background) && rgbToHex(background) ? rgbToHex(background) : background;

			/**
			 * The Editor supports users pasting content from external sources with custom table cell backgrounds and having those
			 * backgrounds persisted.
			 *
			 * This feature predates the introduction of dark mode.
			 *
			 * Without the inversion logic below, tokenised content (ie. text), can be hard to read when the user loads the page in dark mode.
			 *
			 * This introduces inversion of the presentation of the custom background color when the user is in dark mode.
			 *
			 * This can be done without additional changes to account for users copying and pasting content inside the Editor, because of
			 * how we detect table cell background colors copied from external editor sources. Where we load the background color from a
			 * seperate attribute (data-cell-background), instead of the inline style.
			 *
			 * See the following document for more details on this behaviour
			 * https://hello.atlassian.net/wiki/spaces/CCECO/pages/2892247168/Unsupported+custom+table+cell+background+colors+in+dark+theme+Editor+Job+Story
			 */
			const tokenColor = hexToEditorBackgroundPaletteRawValue(color);

			if (tokenColor) {
				attrs.style = `background-color: ${tokenColor};`;
			} else if (
				/**
				 * There was previously a bug in dark mode where we would attempt to invert
				 * a design token in `getDarkModeLCHColor` causing issues.
				 * If it's a design token we should return it as is.
				 */
				cssVariablePattern.test(color)
			) {
				attrs.style = `background-color: ${color};`;
			} else {
				// if we have a custom color, we need to check if we are in dark mode
				if (getGlobalTheme().colorMode === 'dark') {
					// if we have a custom color, we need to check if we are in dark mode
					attrs.style = `background-color: ${getDarkModeLCHColor(color)};`;
				} else {
					// if we are in light mode, we can just set the color
					attrs.style = `background-color: ${background};`;
				}
			}

			/**
			 * Storing hex code in data-cell-background because
			 *  we want to have DST token (css variable) or
			 *  DST token value (value (hex code) of css variable) in
			 *  inline style to correct render table cell background
			 *  based on selected theme.
			 * Currently we rely on background color hex code stored in
			 *  inline style.
			 * Because of that when we copy and paste table, we end up
			 *  having DST token or DST token value in ADF instead of
			 *  original hex code which we map to DST token.
			 * So, introducing data-cell-background.
			 * More details at https://product-fabric.atlassian.net/wiki/spaces/EUXQ/pages/3472556903/Tokenising+tableCell+background+colors#Update-toDom-and-parseDom-to-store-and-read-background-color-from-data-cell-background-attribute.4
			 */
			if (color) {
				attrs['data-cell-background'] = color;
			}

			if (typeof color === 'string') {
				attrs.colorname = tableBackgroundColorPalette.get(color.toLowerCase());
			}
		}
	}

	if (nodeType === 'tableHeader') {
		attrs.class = tableHeaderSelector;
	} else {
		attrs.class = tableCellSelector;
	}

	if (node?.attrs?.localId) {
		attrs['data-local-id'] = node.attrs.localId;
	}

	return attrs;
};

export const tableBackgroundColorPalette = new Map<string, string>();

export const tableBackgroundBorderColor = hexToRgba(N800, 0.12) || N0;
export const tableBackgroundColorNames = new Map<string, string>();

[
	[N0, 'White'],
	[B50, 'Light blue'],
	[T50, 'Light teal'],
	[G50, 'Light green'],
	[Y50, 'Light yellow'],
	[R50, 'Light red'],
	[P50, 'Light purple'],

	[N20, 'Light gray'],
	[B75, 'Blue'],
	[T75, 'Teal'],
	[G75, 'Green'],
	[Y75, 'Yellow'],
	[R75, 'Red'],
	[P75, 'Purple'],

	[N60, 'Gray'],
	[B100, 'Dark blue'],
	[T100, 'Dark teal'],
	[G200, 'Dark green'],
	[Y200, 'Dark yellow'],
	[R100, 'Dark red'],
	[P100, 'Dark purple'],
].forEach(([colorValue, colorName]) => {
	tableBackgroundColorPalette.set(colorValue.toLowerCase(), colorName);
	tableBackgroundColorNames.set(colorName.toLowerCase(), colorValue.toLowerCase());
});

export type DisplayMode = 'default' | 'fixed';
export type Layout = 'default' | 'full-width' | 'wide' | 'center' | 'align-start' | 'align-end';

export interface TableAttributes {
	__autoSize?: boolean;
	displayMode?: DisplayMode;
	isNumberColumnEnabled?: boolean;
	layout?: Layout;
	/**
	 * @minLength 1
	 */
	localId?: string;
	width?: number;
}

/**
 * @name table_node
 */
export interface TableDefinition {
	attrs?: TableAttributes;
	/**
	 * @minItems 1
	 */
	content: Array<TableRow>;
	marks?: Array<FragmentDefinition>;
	type: 'table';
}

/**
 * @name table_row_node
 */
export interface TableRow {
	content: Array<TableHeader | TableCell>;
	type: 'tableRow';
}

/**
 * @name table_cell_content
 * @minItems 1
 * @allowUnsupportedBlock true
 */
export type TableCellContent = Array<
	| Panel
	| Paragraph
	| ParagraphWithMarks
	| Blockquote
	| OrderedList
	| BulletList
	| Rule
	| Heading
	| HeadingWithMarks
	| CodeBlock
	| MediaGroup
	| MediaSingle
	| DecisionList
	| TaskList
	| Extension
	| BlockCard
	| NestedExpand
	| EmbedCard
>;

/**
 * @name table_cell_node
 */
export interface TableCell {
	attrs?: CellAttributes;
	content: TableCellContent;
	type: 'tableCell';
}

/**
 * @name table_header_node
 */
export interface TableHeader {
	attrs?: CellAttributes;
	content: TableCellContent;
	type: 'tableHeader';
}

// table nodes with nested tables support
export interface TableWithNestedTableDefinition {
	attrs?: TableAttributes;
	/**
	 * @minItems 1
	 */
	content: Array<TableRow>;
	marks?: Array<FragmentDefinition>;
	type: 'table';
}

export interface TableRowWithNestedTableDefinition {
	content: Array<TableHeader | TableCell>;
	type: 'tableRow';
}

export interface TableCellWithNestedTableDefinition {
	attrs?: CellAttributes;
	content: TableCellContent | TableDefinition;
	type: 'tableCell';
}

export interface TableHeaderWithNestedTableDefinition {
	attrs?: CellAttributes;
	content: TableCellContent | TableDefinition;
	type: 'tableHeader';
}

const tableNodeSpecOptions: NodeSpecOptions<TableNode | TableWithNestedTableNode> = {
	parseDOM: [
		{
			tag: 'table',
			getAttrs: (node: string | Node) => {
				// eslint-disable-next-line @atlaskit/editor/no-as-casting
				const dom = node as HTMLElement;
				const breakoutWrapper = dom.parentElement?.parentElement;

				return {
					isNumberColumnEnabled: dom.getAttribute('data-number-column') === 'true',
					layout:
						// copying from editor
						dom.getAttribute('data-layout') ||
						// copying from renderer
						breakoutWrapper?.getAttribute('data-layout') ||
						'default',
					__autoSize: dom.getAttribute('data-autosize') === 'true',
					localId: dom.getAttribute('data-table-local-id') || uuid.generate(),
					width: Number(dom.getAttribute('data-table-width')) || null,
					displayMode: dom.getAttribute('data-table-display-mode') || null,
				};
			},
		},
	],
	toDOM(node) {
		const attrs = {
			'data-number-column': node.attrs.isNumberColumnEnabled,
			'data-layout': node.attrs.layout,
			'data-autosize': node.attrs.__autoSize,
			'data-table-local-id': node.attrs.localId,
			'data-table-width': node.attrs.width,
			'data-table-display-mode': node.attrs.displayMode,
		};
		return ['table', attrs, ['tbody', 0]];
	},
};
// TODO: ED-5048 - Fix any, potential issue.
const createTableSpec = () => tableFactory(tableNodeSpecOptions);

// TODO: ED-29537 - assuming breaking changes aren't allowed, so retaining both exports
/** Includes table width attribute */
export const table = createTableSpec();
// eslint-disable-next-line @repo/internal/deprecations/deprecation-ticket-required
/** @deprecated Do not use, instead use the regular `table` export */
export const tableWithCustomWidth = createTableSpec();
export const tableStage0 = createTableSpec();

const shouldIncludeAttribute = (key: string, value?: string) =>
	!key.startsWith('__') && (key !== 'localId' || !!value);

export const tableToJSON = (node: PmNode) => ({
	attrs: Object.keys(node.attrs)
		.filter((key) => shouldIncludeAttribute(key, node.attrs[key]))
		.reduce<typeof node.attrs>((obj, key) => {
			return {
				...obj,
				[key]: node.attrs[key],
			};
		}, {}),
});

const tableRowNodeSpecOptions: NodeSpecOptions<TableRowNode | TableRowWithNestedTableNode> = {
	parseDOM: [{ tag: 'tr' }],
	toDOM() {
		return ['tr', 0];
	},
};
export const tableRow = tableRowFactory(tableRowNodeSpecOptions);

const cellAttrs = {
	colspan: { default: 1 },
	rowspan: { default: 1 },
	colwidth: { default: null },
	background: { default: null },
	localId: { default: null, optional: true },
};

const tableCellNodeSpecOptions: NodeSpecOptions<TableCellNode | TableCellWithNestedTableNode> = {
	parseDOM: [
		// Ignore number cell copied from renderer
		{
			tag: '.ak-renderer-table-number-column',
			ignore: true,
		},
		{
			tag: 'td',
			// eslint-disable-next-line @atlaskit/editor/no-as-casting
			getAttrs: (dom: string | Node) => getCellAttrs(dom as HTMLElement),
		},
	],
	toDOM: (node) => ['td', getCellDomAttrs(node), 0],
};
export const tableCell = tableCellFactory(tableCellNodeSpecOptions);

export const toJSONTableCell = (node: PmNode) => ({
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	attrs: (Object.keys(node.attrs) as Array<keyof CellAttributes>).reduce<Record<string, any>>(
		(obj, key) => {
			// Only process keys that are defined in cellAttrs
			if (cellAttrs[key] && cellAttrs[key].default !== node.attrs[key]) {
				obj[key] = node.attrs[key];
			}

			return obj;
		},
		{},
	),
});

const tableHeaderNodeSpecOptions: NodeSpecOptions<
	TableHeaderNode | TableHeaderWithNestedTableNode
> = {
	parseDOM: [
		{
			tag: 'th',
			getAttrs: (dom: string | Node) =>
				// eslint-disable-next-line @atlaskit/editor/no-as-casting
				getCellAttrs(dom as HTMLElement, {
					background: DEFAULT_TABLE_HEADER_CELL_BACKGROUND,
				}),
		},
	],

	toDOM: (node) => ['th', getCellDomAttrs(node), 0],
};
export const tableHeader = tableHeaderFactory(tableHeaderNodeSpecOptions);

export const toJSONTableHeader = toJSONTableCell;

// table nodes with nested table support
export const tableWithNestedTable = tableWithNestedTableFactory(tableNodeSpecOptions);

export const tableRowWithNestedTable = tableRowWithNestedTableFactory(tableRowNodeSpecOptions);
export const tableCellWithNestedTable = tableCellWithNestedTableFactory(tableCellNodeSpecOptions);
export const tableHeaderWithNestedTable = tableHeaderWithNestedTableFactory(
	tableHeaderNodeSpecOptions,
);
// table nodes with localId support
const tableRowNodeSpecOptionsWithLocalId: NodeSpecOptions<
	TableRowNode | TableRowWithNestedTableNode
> = {
	parseDOM: [{ tag: 'tr', getAttrs: () => ({ localId: uuid.generate() }) }],
	toDOM(node) {
		return ['tr', { 'data-local-id': node?.attrs?.localId || undefined }, 0];
	},
};

export const tableRowWithLocalId = tableRowFactory(tableRowNodeSpecOptionsWithLocalId);

const tableCellNodeSpecOptionsWithLocalId: NodeSpecOptions<
	TableCellNode | TableCellWithNestedTableNode
> = {
	parseDOM: [
		{
			tag: 'td',
			getAttrs: (dom: string | Node) =>
				// eslint-disable-next-line @atlaskit/editor/no-as-casting
				getCellAttrs(dom as HTMLElement, { localId: uuid.generate() }),
		},
	],
	toDOM(node) {
		return ['td', getCellDomAttrs(node), 0];
	},
};
export const tableCellWithLocalId = tableCellFactory(tableCellNodeSpecOptionsWithLocalId);

const tableHeaderNodeSpecOptionsWithLocalId: NodeSpecOptions<
	TableHeaderNode | TableHeaderWithNestedTableNode
> = {
	parseDOM: [
		{
			tag: 'th',
			getAttrs: (dom: string | Node) =>
				// eslint-disable-next-line @atlaskit/editor/no-as-casting
				getCellAttrs(dom as HTMLElement, {
					background: DEFAULT_TABLE_HEADER_CELL_BACKGROUND,
					localId: uuid.generate(),
				}),
		},
	],
	toDOM: (node) => ['th', getCellDomAttrs(node), 0],
};

export const tableHeaderWithLocalId = tableHeaderFactory(tableHeaderNodeSpecOptionsWithLocalId);

// nested table nodes with localId support
export const tableRowWithNestedTableWithLocalId = tableRowWithNestedTableFactory(
	tableRowNodeSpecOptionsWithLocalId,
);
export const tableCellWithNestedTableWithLocalId = tableCellWithNestedTableFactory(
	tableCellNodeSpecOptionsWithLocalId,
);
export const tableHeaderWithNestedTableWithLocalId = tableHeaderWithNestedTableFactory(
	tableHeaderNodeSpecOptionsWithLocalId,
);
