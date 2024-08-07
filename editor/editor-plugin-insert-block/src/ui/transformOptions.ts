import {
	blockTypeMessages as messages,
	toolbarInsertBlockMessages as toolbarMessages,
} from '@atlaskit/editor-common/messages';
import EditorCodeIcon from '@atlaskit/icon/glyph/editor/code';
import EditorInfoIcon from '@atlaskit/icon/glyph/editor/info';
import QuoteIcon from '@atlaskit/icon/glyph/quote';

import ExpandIcon from '../assets/expand';

export const transformationOptions = [
	{
		title: messages.panel,
		icon: EditorInfoIcon,
	},
	{
		title: toolbarMessages.expand,
		icon: ExpandIcon,
	},
	{
		title: messages.codeblock,
		icon: EditorCodeIcon,
	},
	{
		title: messages.blockquote,
		icon: QuoteIcon,
	},
];
