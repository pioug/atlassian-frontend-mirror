/* eslint-disable */
// @ts-nocheck
// Note: This file is auto generated using "yarn workspace @atlassian/ts-boundary-files update-boundary-file -r=platform -f=packages/help/help-article/src/components/ArticleBody/index.tsx"
import React from 'react';
import { BODY_FORMAT_TYPES } from '../../model/HelpArticle';
import type { AdfDoc } from '../../model/HelpArticle';
export interface Props {
    body?: string | AdfDoc;
    bodyFormat: BODY_FORMAT_TYPES;
    onArticleRenderBegin?(): void;
    onArticleRenderDone?(): void;
}
export declare const ArticleBody: (props: Props) => React.JSX.Element | null;
export default ArticleBody;
