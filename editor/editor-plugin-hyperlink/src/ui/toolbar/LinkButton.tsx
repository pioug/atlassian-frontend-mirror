import React from 'react';

import { useIntl } from 'react-intl-next';

import { INPUT_METHOD } from '@atlaskit/editor-common/analytics';
import { useSharedPluginStateWithSelector } from '@atlaskit/editor-common/hooks';
import { ToolTipContent, addLink } from '@atlaskit/editor-common/keymaps';
import { toolbarInsertBlockMessages as messages } from '@atlaskit/editor-common/messages';
import type { ExtractInjectionAPI } from '@atlaskit/editor-common/types';
import { LinkIcon, ToolbarButton, ToolbarTooltip } from '@atlaskit/editor-toolbar';

import type { HyperlinkPlugin } from '../../hyperlinkPluginType';

type LinkButtonProps = {
	api?: ExtractInjectionAPI<HyperlinkPlugin>;
};

export const LinkButton = ({ api }: LinkButtonProps): React.JSX.Element => {
	const { formatMessage } = useIntl();
	const canInsertLink = useSharedPluginStateWithSelector(
		api,
		['hyperlink'],
		(state) => state?.hyperlinkState?.canInsertLink ?? true,
	);

	const onClick = () => {
		api?.core.actions.execute(api?.hyperlink.commands.showLinkToolbar(INPUT_METHOD.FLOATING_TB));
	};

	const isEnabled = canInsertLink;

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
