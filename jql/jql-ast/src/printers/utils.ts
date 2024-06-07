import { type Doc, type Group, type IfBreak, type NewLine } from './types';

export const group = (contents: Doc[]): Group => {
	return {
		type: 'group',
		contents,
	};
};

export const ifBreak = (breakContents: Doc, flatContents: Doc): IfBreak => {
	return {
		type: 'if-break',
		breakContents,
		flatContents,
	};
};

export const newLine = (): NewLine => {
	return {
		type: 'new-line',
	};
};
