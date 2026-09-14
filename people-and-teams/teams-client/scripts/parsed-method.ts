import type { ParsedParam } from './parsed-param';

export type ParsedMethod = {
	name: string;
	params: ParsedParam[];
	returnType: string;
	docs: string;
	tags: string;
};
