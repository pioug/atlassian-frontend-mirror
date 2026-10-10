import React from 'react';

import { useIntl } from 'react-intl';

import { INPUT_METHOD } from '@atlaskit/editor-common/analytics/types/enums';
import {
	ToolTipContent,
	getAriaKeyshortcuts,
	toggleCodeBlock,
} from '@atlaskit/editor-common/keymaps';
import { messages as blockTypeMessages } from '@atlaskit/editor-common/messages/block-type';
import { useEditorToolbar } from '@atlaskit/editor-common/toolbar/context';
import type { ExtractInjectionAPI } from '@atlaskit/editor-common/types/next-editor-plugin';
import { CodeIcon } from '@atlaskit/editor-toolbar/code-icon';
import { ToolbarButton } from '@atlaskit/editor-toolbar/toolbar-button';
import { ToolbarTooltip } from '@atlaskit/editor-toolbar/toolbar-tooltip';

import type { InsertBlockPlugin } from '../../insertBlockPluginType';

type CodeBlockButtonProps = {
	api?: ExtractInjectionAPI<InsertBlockPlugin>;
};

export const CodeBlockButton = ({ api }: CodeBlockButtonProps): React.JSX.Element | null => {
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
