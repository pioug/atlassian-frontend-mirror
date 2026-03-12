import { tokens as tokenMetadata } from '@atlaskit/tokens/token-metadata';

// https://hello.atlassian.net/wiki/spaces/DST/pages/6558592429/Token+content+type
export type TokenMCPSchema = {
	name: string;
	path: string[];
	description: string;
	exampleValue: string;
};

export const tokens: TokenMCPSchema[] = tokenMetadata.map((metadata) => ({
	name: metadata.name,
	path: metadata.path,
	description: metadata.description,
	exampleValue: String(metadata.exampleValue ?? ''),
}));
