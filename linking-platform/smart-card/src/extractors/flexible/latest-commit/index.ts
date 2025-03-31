import { type JsonLd } from '@atlaskit/json-ld-types';

export type LinkTypeLatestCommit =
	| JsonLd.Data.SourceCodeDocument
	| JsonLd.Data.SourceCodeRepository;

export const extractLatestCommit = (jsonLd: LinkTypeLatestCommit): string | undefined => {
	const latestCommit = jsonLd['atlassian:latestCommit'];
	if (typeof latestCommit === 'string') {
		return latestCommit;
	}

	if (latestCommit) {
		//todo: change the properties to latestCommit.hash when BE is ready
		return latestCommit ? latestCommit.name : undefined;
	}
};
