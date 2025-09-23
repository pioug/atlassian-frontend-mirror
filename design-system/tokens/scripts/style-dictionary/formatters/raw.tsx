import type { Format } from 'style-dictionary';

import { createSignedArtifact } from '@atlassian/codegen';

import { getTokenId } from '../../../src/utils/token-ids';
import sortTokens from '../sort-tokens';

const toTokenValueString = (
	types: { string: boolean; number: boolean; boxShadow: boolean; typography: boolean },
	matchCounter: number,
	original: boolean,
) => {
	const prefix = matchCounter === 1 ? '' : '| ';

	const typeValues = [
		types.string ? `	${prefix}string` : undefined,
		types.number ? `	${prefix}number` : undefined,
		types.boxShadow
			? `	${prefix}{
		radius: number;
		offset: {
			x: number;
			y: number;
		};
		color: string;
		opacity: number;
		spread?: number;
		inset?: boolean;
	}[]`
			: undefined,
		types.typography
			? `	${prefix}{
		fontWeight: string;
		fontSize: string;
		lineHeight: string;
		fontFamily: string;
		fontStyle: string;
		letterSpacing: string;
	}`
			: undefined,
	].filter(Boolean) as string[];

	return `type ${original ? 'TokenValueOriginal' : 'TokenValue'} =${
		matchCounter > 1
			? `
`
			: ''
	}${typeValues.join('\n')};`;
};

const getTokenValueType = (tokens: any[], original = false) => {
	const types = {
		string: false,
		number: false,
		boxShadow: false,
		typography: false,
	};
	let matchCounter = 0;

	const getVal = (token: any) => (original ? token.original?.value : token.value);

	for (const token of tokens) {
		if (typeof getVal(token) === 'string') {
			types.string = true;
			matchCounter++;
		}
		if (typeof getVal(token) === 'number') {
			types.number = true;
			matchCounter++;
		}
		if (Array.isArray(getVal(token))) {
			types.boxShadow = true;
			matchCounter++;
		}
		// @ts-ignore - CI fails with `hasOwn` not existing on ObjectConstructor which is wrong
		if (Object.hasOwn(getVal(token), 'fontWeight')) {
			types.typography = true;
			matchCounter++;
		}
	}

	return toTokenValueString(types, matchCounter, original);
};

const getTokenAttributes = (tokens: any[]) => {
	let withCategory = false;
	let withGroupOnly = false;

	for (const token of tokens) {
		if (token.attributes?.category !== undefined) {
			withCategory = true;
			break;
		} else if (Object.keys(token.attributes || {}).length === 1 && token.attributes?.group) {
			withGroupOnly = true;
		}
	}

	if (withGroupOnly) {
		return `type TokenAttributes = {
	group: string;
};`;
	}

	if (withCategory) {
		return `type TokenAttributes = {
	group: string;
	category: string;
};`;
	}
	return `type TokenAttributes = {
	group: string;
	state: string;
	introduced: string;
	description: string;
	suggest?: string[];
	deprecated?: string;
};`;
};

const getTokenType = (cleanName: boolean) => {
	return `
type Token = {
	value: TokenValue;
	filePath: string;
	isSource: boolean;
	attributes: TokenAttributes;
	original: {
		value: TokenValueOriginal;
		attributes: TokenAttributes;
	};
	name: string;
	path: string[];
${cleanName ? '	cleanName: string;' : ''}
};`;
};

const formatter: Format['formatter'] = ({ dictionary, options }) => {
	const output = `
${getTokenValueType(dictionary.allTokens)}

${getTokenValueType(dictionary.allTokens, true)}

${getTokenAttributes(dictionary.allTokens)}

${getTokenType(options.cleanName === true)}

const tokens: Token[] = ${JSON.stringify(
		sortTokens(dictionary.allTokens).map((token) => ({
			...token,
			...(options.cleanName === true ? { cleanName: getTokenId(token.path) } : []),
		})),
		null,
		2,
	)};

export default tokens;\n`;

	return createSignedArtifact(output, `yarn build tokens`);
};

export default formatter;
