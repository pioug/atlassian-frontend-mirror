import React, { useCallback } from 'react';

import type { WrappedComponentProps } from 'react-intl-next';
import { useIntl, injectIntl } from 'react-intl-next';

import { blockMenuMessages as messages } from '@atlaskit/editor-common/messages';
import type { ExtractInjectionAPI } from '@atlaskit/editor-common/types';
import { ToolbarDropdownItem } from '@atlaskit/editor-toolbar';
import LinkIcon from '@atlaskit/icon/core/link';

import type { BlockMenuPlugin, BlockMenuPluginOptions } from '../blockMenuPluginType';

import { copyLink } from './utils/copyLink';

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

	return (
		<ToolbarDropdownItem onClick={handleClick} elemBefore={<LinkIcon label="" />}>
			{formatMessage(messages.copyLink)}
		</ToolbarDropdownItem>
	);
};

export const CopyLinkDropdownItem = injectIntl(CopyLinkDropdownItemContent);
