import React from 'react';

import { useIntl } from 'react-intl-next';

import { INPUT_METHOD } from '@atlaskit/editor-common/analytics';
import {
	ToolTipContent,
	getAriaKeyshortcuts,
	toggleCodeBlock,
} from '@atlaskit/editor-common/keymaps';
import { blockTypeMessages } from '@atlaskit/editor-common/messages';
import { useEditorToolbar } from '@atlaskit/editor-common/toolbar';
import type { ExtractInjectionAPI } from '@atlaskit/editor-common/types';
import { ToolbarButton, ToolbarTooltip, CodeIcon } from '@atlaskit/editor-toolbar';

import type { InsertBlockPlugin } from '../../insertBlockPluginType';

type CodeBlockButtonProps = {
	api?: ExtractInjectionAPI<InsertBlockPlugin>;
};

export const CodeBlockButton = ({ api }: CodeBlockButtonProps) => {
	const { formatMessage } = useIntl();
	const { editorView } = useEditorToolbar();

	if (!api?.codeBlock) {
		return null;
	}

	const onClick = () => {
		if (editorView) {
			api?.codeBlock?.actions.insertCodeBlock(INPUT_METHOD.TOOLBAR)(
				editorView.state,
				editorView.dispatch,
			);
		}
	};

	return (
		<ToolbarTooltip
			content={
				<ToolTipContent
					description={formatMessage(blockTypeMessages.codeblock)}
					keymap={toggleCodeBlock}
				/>
			}
		>
			<ToolbarButton
				iconBefore={<CodeIcon label={formatMessage(blockTypeMessages.codeblock)} size="small" />}
				onClick={onClick}
				ariaKeyshortcuts={getAriaKeyshortcuts(toggleCodeBlock)}
			/>
		</ToolbarTooltip>
	);
};
