export interface Group {
	type: 'group';
	contents: Doc[];
}

export interface IfBreak {
	type: 'if-break';
	breakContents: Doc;
	flatContents: Doc;
}

export interface NewLine {
	type: 'new-line';
}

export type Doc = Group | IfBreak | NewLine | string;
