export interface ADFEntityMark {
	type: string;
	// Ignored via go/ees005
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	attrs?: { [name: string]: any };
}

/*
 * An ADF Node object with the option to add additional key-value pairs.
 * ADNode and JSONNode are serialisable versions of this interface.
 */
export interface ADFEntity {
	type: string;
	// Ignored via go/ees005
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	attrs?: { [name: string]: any };
	content?: Array<ADFEntity | undefined>;
	marks?: Array<ADFEntityMark>;
	text?: string;
	// Ignored via go/ees005
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	[key: string]: any;
}

export type Visitor = (
	node: ADFEntity,
	parent: EntityParent,
	index: number,
	depth: number,
) => ADFEntity | false | undefined | void;

export type VisitorCollection = { [nodeType: string]: Visitor };

export type EntityParent = { node?: ADFEntity; parent?: EntityParent };
