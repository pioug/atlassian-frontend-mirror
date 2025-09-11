import React from 'react';

import { useIntl } from 'react-intl-next';

import { INPUT_METHOD } from '@atlaskit/editor-common/analytics';
import { useSharedPluginStateWithSelector } from '@atlaskit/editor-common/hooks';
import { ToolTipContent, addLink } from '@atlaskit/editor-common/keymaps';
import { toolbarInsertBlockMessages as messages } from '@atlaskit/editor-common/messages';
import { useEditorToolbar } from '@atlaskit/editor-common/toolbar';
import type { ExtractInjectionAPI } from '@atlaskit/editor-common/types';
import { canLinkBeCreatedInRange } from '@atlaskit/editor-common/utils';
import { LinkIcon, ToolbarButton, ToolbarTooltip } from '@atlaskit/editor-toolbar';
import { expValEquals } from '@atlaskit/tmp-editor-statsig/exp-val-equals';

import type { HyperlinkPlugin } from '../../hyperlinkPluginType';

type LinkButtonProps = {
	api?: ExtractInjectionAPI<HyperlinkPlugin>;
};

export const LinkButton = ({ api }: LinkButtonProps) => {
	const { formatMessage } = useIntl();
	const { editorView } = useEditorToolbar();
	// Warning! Do not destructure editorView, it will become stale
	const { state } = editorView ?? { state: null, dispatch: null };
	const canInsertLink = useSharedPluginStateWithSelector(
		api,
		['hyperlink'],
		(state) => state?.hyperlinkState?.canInsertLink ?? true,
	);

	const onClick = () => {
		api?.core.actions.execute(api?.hyperlink.commands.showLinkToolbar(INPUT_METHOD.FLOATING_TB));
	};

	let isEnabled: boolean;
	if (expValEquals('platform_editor_toolbar_aifc_fix_editor_view', 'isEnabled', true)) {
		isEnabled = canInsertLink;
	} else {
		isEnabled = state?.selection
			? canLinkBeCreatedInRange(state?.selection.from, state?.selection.to)(state)
			: false;
	}

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
