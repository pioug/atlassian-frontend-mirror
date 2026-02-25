import React from 'react';

import { useIntl, type MessageDescriptor } from 'react-intl-next';

import { useSharedPluginStateWithSelector } from '@atlaskit/editor-common/hooks';
import { blockMenuMessages as messages } from '@atlaskit/editor-common/messages';
import type { ExtractInjectionAPI } from '@atlaskit/editor-common/types';
import AkFlag, { FlagGroup, AutoDismissFlag } from '@atlaskit/flag';
import SuccessIcon from '@atlaskit/icon/core/check-circle';
import { fg } from '@atlaskit/platform-feature-flags';
import { token } from '@atlaskit/tokens';

import type { BlockMenuPlugin } from '../blockMenuPluginType';
import { FLAG_ID } from '../blockMenuPluginType';
import { blockMenuPluginKey } from '../pm-plugins/main';

type Props = {
	api?: ExtractInjectionAPI<BlockMenuPlugin>;
};

type FlagConfig = {
	autoDismiss?: boolean;
	title: MessageDescriptor;
};

const flagMap: Record<FLAG_ID, FlagConfig> = {
	[FLAG_ID.LINK_COPIED_TO_CLIPBOARD]: {
		title: messages.linkCopiedToClipboard,
		autoDismiss: true,
	},
};

export const Flag = ({ api }: Props) => {
	const { showFlag } = useSharedPluginStateWithSelector(api, ['blockMenu'], (states) => {
		return {
			showFlag: states.blockMenuState?.showFlag,
		};
	});
	const { formatMessage } = useIntl();

	if (!showFlag) {
		return;
	}

	const { title } = flagMap[showFlag];

	const onDismissed = () => {
		api?.core.actions.execute(({ tr }) => {
			tr.setMeta(blockMenuPluginKey, {
				showFlag: false,
			});
			return tr;
		});
		api?.core.actions.focus();
	};

	const FlagComponent = flagMap[showFlag].autoDismiss ? AutoDismissFlag : AkFlag;

	// [FEATURE FLAG: platform_editor_block_menu_v2_patch_3]
	// Adds size="small" to icons for better visual consistency in block menu.
	// To clean up: remove conditional, keep only size="small" version.
	const iconSize = fg('platform_editor_block_menu_v2_patch_3') ? 'small' : undefined;

	return (
		<FlagGroup>
			<FlagComponent
				onDismissed={onDismissed}
				title={formatMessage(title)}
				id={showFlag}
				testId={showFlag}
				icon={<SuccessIcon label="" color={token('color.icon.success')} size={iconSize} />}
			/>
		</FlagGroup>
	);
};
