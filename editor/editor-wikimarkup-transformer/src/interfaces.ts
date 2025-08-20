import { type Node as PMNode } from '@atlaskit/editor-prosemirror/model';

export interface AddArgs {
	style: string | null;
	content: PMNode[];
}

export interface Builder {
	type: string;

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
}

export interface ListItem {
	// Ignored via go/ees005
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	content?: any[];
	parent: List;
	children: List[];
}

export interface List {
	children: ListItem[];
	type: ListType;
	parent?: ListItem;
}

export type ListType = 'bulletList' | 'orderedList';

export type CellType = 'tableHeader' | 'tableCell';

export interface TableCell {
	type: CellType;
	content: PMNode[];
}

export interface TableRow {
	cells: TableCell[];
}

export interface Table {
	rows: TableRow[];
}

export interface AddCellArgs extends AddArgs {
	style: string;
	content: PMNode[];
}

export interface ConversionMap {
	[key: string]: string;
}
export interface MediaConversionMap {
	[key: string]: {
		// mapping between wiki's filename and media's ID, defaults to key
		transform?: string;
		// flag whether ADF media node should be converted to embedded !file! or non-embedded [^file], defaults to embedded
		embed?: boolean;
	};
}
export type TokenErrCallback = (err: Error, tokenType: string) => void;

export interface Context {
	readonly issueKeyRegex?: RegExp | undefined;
	readonly tokenErrCallback?: TokenErrCallback;
	readonly conversion?: {
		readonly inlineCardConversion?: ConversionMap;
		readonly mediaConversion?: MediaConversionMap;
		mentionConversion?: ConversionMap;
	};
	readonly hydration?: {
		readonly media?: {
			targetCollectionId?: string;
		};
	};
	readonly defaults?: {
		readonly media?: {
			// defaults to 200, no width will be emitted when null
			width: number | null;
			// defaults to 183, no height will be emitted when null
			height: number | null;
		};
	};
}
