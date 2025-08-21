import React from 'react';

import { useIntl } from 'react-intl-next';

import { INPUT_METHOD } from '@atlaskit/editor-common/analytics';
import { ToolTipContent, addLink } from '@atlaskit/editor-common/keymaps';
import { toolbarInsertBlockMessages as messages } from '@atlaskit/editor-common/messages';
import { useEditorToolbar } from '@atlaskit/editor-common/toolbar';
import type { ExtractInjectionAPI } from '@atlaskit/editor-common/types';
import { canLinkBeCreatedInRange } from '@atlaskit/editor-common/utils';
import { LinkIcon, ToolbarButton, ToolbarTooltip } from '@atlaskit/editor-toolbar';

import type { HyperlinkPlugin } from '../../hyperlinkPluginType';

type LinkButtonProps = {
	api?: ExtractInjectionAPI<HyperlinkPlugin>;
};

export const LinkButton = ({ api }: LinkButtonProps) => {
	const { formatMessage } = useIntl();
	const { editorView } = useEditorToolbar();
	const { state } = editorView ?? { state: null, dispatch: null };

	const onClick = () => {
		api?.core.actions.execute(api?.hyperlink.commands.showLinkToolbar(INPUT_METHOD.FLOATING_TB));
	};

	const isEnabled = state?.selection
		? canLinkBeCreatedInRange(state?.selection.from, state?.selection.to)(state)
		: false;

	return (
		<ToolbarTooltip
			content={<ToolTipContent description={formatMessage(messages.link)} keymap={addLink} />}
		>
			<ToolbarButton
				iconBefore={<LinkIcon label={formatMessage(messages.link)} size="small" />}
				onClick={onClick}
				testId={'editor-toolbar__link-button'}
				isDisabled={!isEnabled}
			/>
		</ToolbarTooltip>
	);
};
