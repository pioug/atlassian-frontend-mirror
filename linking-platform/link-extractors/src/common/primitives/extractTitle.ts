import { type JsonLd } from '@atlaskit/json-ld-types';

import { extractContext } from '../context';

import { extractType } from './extractType';

export const extractTitle = (
	jsonLd: JsonLd.Data.BaseData,
	removeTextHighlightingFromTitle?: boolean,
): string | undefined => {
	const name = jsonLd.name?.replace(/[\r\n]+/g, '');
	const id = jsonLd['@id'] || '';

	// Check if this is a reference to something _inside_ a Repository.
	// We format these titles to represent more metadata.
	const context = extractContext(jsonLd);
	const type = extractType(jsonLd);
	const hasContextType = context && context.type;
	const hasContextRepo =
		hasContextType && context!.type!.includes('atlassian:SourceCodeRepository');
	if (hasContextRepo && type) {
		const contextName = (context!.name && `${context!.name}: `) || '';
		// COMMIT: `repo-name: abf137c title of commit message`
		if (type.includes('atlassian:SourceCodeCommit')) {
			const [, hashContent] = id.split(':');
			const hash = hashContent && `${hashContent.substring(0, 8)} `;
			return contextName + (hash || '') + name;
		}
		// PR: `repo-name: #42 title of pull request`
		if (type.includes('atlassian:SourceCodePullRequest')) {
			const pullRequest = jsonLd as JsonLd.Data.SourceCodePullRequest;
			const internalId = pullRequest['atlassian:internalId'];
			const internalIdRef = internalId && `#${internalId} `;
			return contextName + (internalIdRef || '') + name;
		}
		// BRANCH: `repo-name/branch-name`
		if (type.includes('atlassian:SourceCodeReference')) {
			return contextName + name;
		}

		// FILE: `repo-name: filepath`
		if (type.includes('schema:DigitalDocument')) {
			return contextName + name;
		}
	}

	if (removeTextHighlightingFromTitle) {
		const textFragmentRegex = new RegExp(' \\| :~:text=.*', 'g');
		const truncated = name?.replace(textFragmentRegex, '');
		return truncated;
	}

	return name;
};
