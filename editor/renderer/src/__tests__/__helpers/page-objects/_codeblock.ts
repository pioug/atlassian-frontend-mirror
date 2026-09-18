import { CodeBlockSharedCssClassName } from '@atlaskit/editor-common/styles';

import { LightWeightCodeBlockCssClassName } from '../../../react/nodes/codeBlock/components/lightWeightCodeBlock';

export const selectors: {
	codeBlock: string;
	copyToClipboardButton: string;
	lightWeightCodeBlock: string;
	designSystemCodeBlock: string;
	wrapButton: string;
	languageJavaScript: string;
} = {
	codeBlock: `.${CodeBlockSharedCssClassName.CODEBLOCK_CONTAINER}`,
	copyToClipboardButton: '.copy-to-clipboard',
	lightWeightCodeBlock: `.${LightWeightCodeBlockCssClassName.CONTAINER}`,
	designSystemCodeBlock: CodeBlockSharedCssClassName.DS_CODEBLOCK,
	wrapButton: '.wrap-code',
	languageJavaScript: '.language-javascript',
};
