// --------------------------------------------------------
// Factory Utils
// --------------------------------------------------------
export const normaliseInput = <T>(input?: T | T[]): T[] =>
	!input ? [] : input instanceof Array ? input : [input];
