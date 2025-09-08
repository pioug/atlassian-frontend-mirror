import React, { useCallback } from 'react';

import type { WrappedComponentProps } from 'react-intl-next';
import { useIntl, injectIntl } from 'react-intl-next';

import { blockMenuMessages as messages } from '@atlaskit/editor-common/messages';
import type { ExtractInjectionAPI } from '@atlaskit/editor-common/types';
import { ToolbarDropdownItem } from '@atlaskit/editor-toolbar';
import LinkIcon from '@atlaskit/icon/core/link';
import { fg } from '@atlaskit/platform-feature-flags';

import type { BlockMenuPlugin, BlockMenuPluginOptions } from '../blockMenuPluginType';

import { copyLink } from './utils/copyLink';
import { isNestedNode } from './utils/isNestedNode';

type Props = {
	api: ExtractInjectionAPI<BlockMenuPlugin> | undefined;
	config: BlockMenuPluginOptions | undefined;
};

const CopyLinkDropdownItemContent = ({ api, config }: Props & WrappedComponentProps) => {
	const { formatMessage } = useIntl();

	const handleClick = useCallback(() => {
		api?.core.actions.execute(({ tr }) => {
			api?.blockControls?.commands?.toggleBlockMenu({ closeMenu: true })({ tr });
			return tr;
		});
		api?.core.actions.focus();
		return copyLink(config?.getLinkPath, config?.blockQueryParam, api);
	}, [config?.getLinkPath, config?.blockQueryParam, api]);

	const checkIsNestedNode = useCallback(() => {
		const selection = api?.selection?.sharedState?.currentState()?.selection;
		return isNestedNode(selection);
	}, [api]);

	// Hide copy link when `platform_editor_adf_with_localid` feature flag is off or when the node is nested
	if (!fg('platform_editor_adf_with_localid') || checkIsNestedNode()) {
		return null;
	}

	return (
		<ToolbarDropdownItem onClick={handleClick} elemBefore={<LinkIcon label="" />}>
			{formatMessage(messages.copyLink)}
		</ToolbarDropdownItem>
	);
};

export const CopyLinkDropdownItem = injectIntl(CopyLinkDropdownItemContent);
