import {
	blockTypeMessages as messages,
	toolbarInsertBlockMessages as toolbarMessages,
} from '@atlaskit/editor-common/messages';
import type { ExtractInjectionAPI } from '@atlaskit/editor-common/types';
import { type Schema } from '@atlaskit/editor-prosemirror/model';
import EditorCodeIcon from '@atlaskit/icon/glyph/editor/code';
import EditorInfoIcon from '@atlaskit/icon/glyph/editor/info';
import QuoteIcon from '@atlaskit/icon/glyph/quote';

import ExpandIcon from '../assets/expand';
import type { InsertBlockPlugin } from '../plugin';

export const transformationOptions = (
	api: ExtractInjectionAPI<InsertBlockPlugin> | undefined,
	schema: Schema,
) => [
	{
		type: schema.nodes.panel,
		title: messages.panel,
		icon: EditorInfoIcon,
		command: api?.panel?.actions.insertPanel,
	},
	{
		type: schema.nodes.expand,
		title: toolbarMessages.expand,
		icon: ExpandIcon,
		command: api?.expand?.actions.insertExpandWithInputMethod,
	},
	{
		type: schema.nodes.codeBlock,
		title: messages.codeblock,
		icon: EditorCodeIcon,
		command: api?.codeBlock?.actions.insertCodeBlock,
	},
	{
		type: schema.nodes.blockquote,
		title: messages.blockquote,
		icon: QuoteIcon,
		command: api?.blockType?.actions.insertBlockQuote,
	},
];
