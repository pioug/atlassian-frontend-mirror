import React from 'react';

import { type JsonLd } from 'json-ld-types';

import CodeIcon from '@atlaskit/icon/core/migration/angle-brackets--code';
import { N600 } from '@atlaskit/theme/colors';
import { token } from '@atlaskit/tokens';

import { type LinkDetail } from './types';

export type LinkProgrammingLanguageType =
	| JsonLd.Data.SourceCodeDocument
	| JsonLd.Data.SourceCodeCommit
	| JsonLd.Data.SourceCodePullRequest
	| JsonLd.Data.SourceCodeReference
	| JsonLd.Data.SourceCodeRepository;

export const extractProgrammingLanguage = (
	jsonLd: LinkProgrammingLanguageType,
): LinkDetail | undefined => {
	const programmingLanguage = jsonLd['schema:programmingLanguage'];
	if (programmingLanguage) {
		return {
			text: programmingLanguage,
			icon: <CodeIcon LEGACY_size="small" label="code" color={token('color.icon.subtle', N600)} />,
		};
	}
};
