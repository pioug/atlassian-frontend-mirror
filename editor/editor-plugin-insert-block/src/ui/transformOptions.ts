import {
	blockTypeMessages as messages,
	toolbarInsertBlockMessages as toolbarMessages,
} from '@atlaskit/editor-common/messages';
import type { ExtractInjectionAPI } from '@atlaskit/editor-common/types';
import EditorCodeIcon from '@atlaskit/icon/glyph/editor/code';
import EditorInfoIcon from '@atlaskit/icon/glyph/editor/info';
import QuoteIcon from '@atlaskit/icon/glyph/quote';

import ExpandIcon from '../assets/expand';
import type { InsertBlockPlugin } from '../plugin';

export const transformationOptions = (api: ExtractInjectionAPI<InsertBlockPlugin> | undefined) => [
	{
		title: messages.panel,
		icon: EditorInfoIcon,
		command: api?.panel?.actions.insertPanel,
	},
	{
		title: toolbarMessages.expand,
		icon: ExpandIcon,
		command: api?.expand?.actions.insertExpandWithInputMethod,
	},
	{
		title: messages.codeblock,
		icon: EditorCodeIcon,
		command: api?.codeBlock?.actions.insertCodeBlock,
	},
	{
		title: messages.blockquote,
		icon: QuoteIcon,
		command: api?.blockType?.actions.insertBlockQuote,
	},
];
