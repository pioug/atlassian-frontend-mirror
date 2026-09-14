import type { ParsedMethod } from './parsed-method';

export // Define a type for the parsed information
type ParsedInfo = {
	name: string;
	docs: string;
	methods: ParsedMethod[];
}[];
