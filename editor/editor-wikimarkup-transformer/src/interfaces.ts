import { type Node as PMNode } from '@atlaskit/editor-prosemirror/model';

export interface AddArgs {
	content: PMNode[];
	style: string | null;
}

export interface Builder {
	/**
	 * Add a item to the builder
	 * @param {AddCellArgs[]} items
	 */
	add: (items: AddCellArgs[]) => void;

	/**
	 * Compile a prosemirror node from the root list
	 * @returns {PMNode}
	 */
	buildPMNode: () => PMNode;

	type: string;
}

export interface ListItem {
	children: List[];
	// Ignored via go/ees005
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	content?: any[];
	parent: List;
}

export interface List {
	children: ListItem[];
	parent?: ListItem;
	type: ListType;
}

export type ListType = 'bulletList' | 'orderedList';

export type CellType = 'tableHeader' | 'tableCell';

export interface TableCell {
	content: PMNode[];
	type: CellType;
}

export interface TableRow {
	cells: TableCell[];
}

export interface Table {
	rows: TableRow[];
}

export interface AddCellArgs extends AddArgs {
	content: PMNode[];
	style: string;
}

export interface ConversionMap {
	[key: string]: string;
}
export interface MediaConversionMap {
	[key: string]: {
		// flag whether ADF media node should be converted to embedded !file! or non-embedded [^file], defaults to embedded
		embed?: boolean;
		// mapping between wiki's filename and media's ID, defaults to key
		transform?: string;
	};
}
export type TokenErrCallback = (err: Error, tokenType: string) => void;

export interface Context {
	readonly conversion?: {
		readonly inlineCardConversion?: ConversionMap;
		readonly mediaConversion?: MediaConversionMap;
		mentionConversion?: ConversionMap;
	};
	readonly defaults?: {
		readonly media?: {
			// defaults to 183, no height will be emitted when null
			height: number | null;
			// defaults to 200, no width will be emitted when null
			width: number | null;
		};
	};
	readonly hydration?: {
		readonly media?: {
			targetCollectionId?: string;
		};
	};
	readonly issueKeyRegex?: RegExp | undefined;
	readonly tokenErrCallback?: TokenErrCallback;
}
