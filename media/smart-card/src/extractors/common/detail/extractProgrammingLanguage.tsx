import React from 'react';
import { N600 } from '@atlaskit/theme/colors';
import CodeIcon from '@atlaskit/icon/glyph/code';

import { JsonLd } from 'json-ld-types';
import { LinkDetail } from './types';

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
      icon: <CodeIcon size="small" label="code" primaryColor={N600} />,
    };
  }
};
