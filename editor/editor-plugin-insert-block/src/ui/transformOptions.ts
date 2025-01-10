import {
	blockTypeMessages as messages,
	toolbarInsertBlockMessages as toolbarMessages,
} from '@atlaskit/editor-common/messages';
import type { ExtractInjectionAPI } from '@atlaskit/editor-common/types';
import { type Schema } from '@atlaskit/editor-prosemirror/model';
import EditorCodeIcon from '@atlaskit/icon/core/migration/angle-brackets--editor-code';
import EditorInfoIcon from '@atlaskit/icon/core/migration/information--editor-info';
import QuotationMarkIcon from '@atlaskit/icon/core/migration/quotation-mark--quote';

import type { InsertBlockPlugin } from '../insertBlockPluginType';

import ExpandIcon from './assets/expand';

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
		icon: QuotationMarkIcon,
		command: api?.blockType?.actions.insertBlockQuote,
	},
];
