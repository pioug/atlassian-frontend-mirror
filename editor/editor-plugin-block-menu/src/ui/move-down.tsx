import React from 'react';

import type { WrappedComponentProps } from 'react-intl-next';
import { useIntl, injectIntl } from 'react-intl-next';

import { useSharedPluginStateWithSelector } from '@atlaskit/editor-common/hooks';
import { blockMenuMessages as messages } from '@atlaskit/editor-common/messages';
import type { ExtractInjectionAPI } from '@atlaskit/editor-common/types';
import { DIRECTION } from '@atlaskit/editor-common/types';
import { ToolbarDropdownItem } from '@atlaskit/editor-toolbar';
import ArrowDownIcon from '@atlaskit/icon/core/arrow-down';

import type { BlockMenuPlugin } from '../blockMenuPluginType';

type Props = {
	api: ExtractInjectionAPI<BlockMenuPlugin>;
};

const MoveDownDropdownItemContent = ({ api }: Props & WrappedComponentProps) => {
	const { formatMessage } = useIntl();
	const { canMoveDown } = useSharedPluginStateWithSelector(
		api,
		['blockControls'],
		({ blockControlsState }) => {
			return {
				canMoveDown: blockControlsState?.blockMenuOptions?.canMoveDown,
			};
		},
	);
	const handleClick = () => {
		api?.core.actions.execute(({ tr }) => {
			api?.blockControls?.commands?.moveNodeWithBlockMenu(DIRECTION.DOWN)({ tr });
			api?.blockControls?.commands?.toggleBlockMenu({ closeMenu: true })({ tr });
			return tr;
		});
	};
	return (
		<ToolbarDropdownItem
			onClick={handleClick}
			elemBefore={<ArrowDownIcon label="" />}
			isDisabled={!canMoveDown}
		>
			{formatMessage(messages.moveDownBlock)}
		</ToolbarDropdownItem>
	);
};

export const MoveDownDropdownItem = injectIntl(MoveDownDropdownItemContent);
