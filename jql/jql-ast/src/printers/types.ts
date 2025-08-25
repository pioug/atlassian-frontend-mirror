export interface Group {
	contents: Doc[];
	type: 'group';
}

export interface IfBreak {
	breakContents: Doc;
	flatContents: Doc;
	type: 'if-break';
}

export interface NewLine {
	type: 'new-line';
}

export type Doc = Group | IfBreak | NewLine | string;
