/* eslint-disable @atlaskit/design-system/prefer-primitives */
/**
 * @jsxRuntime classic
 * @jsx jsx
 */

// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { jsx } from '@emotion/react';
import type { IntlShape } from 'react-intl-next';

import {
	dragToMoveDown,
	dragToMoveLeft,
	dragToMoveRight,
	dragToMoveUp,
	tooltip,
} from '@atlaskit/editor-common/keymaps';
import { blockControlsMessages } from '@atlaskit/editor-common/messages';
import type { ExtractInjectionAPI } from '@atlaskit/editor-common/types';
import type { MenuItem } from '@atlaskit/editor-common/ui-menu';
import { shortcutStyle } from '@atlaskit/editor-shared-styles/shortcut';
import ArrowDownIcon from '@atlaskit/icon/core/arrow-down';
import ArrowLeftIcon from '@atlaskit/icon/core/arrow-left';
import ArrowRightnIcon from '@atlaskit/icon/core/arrow-right';
import ArrowUpIcon from '@atlaskit/icon/core/arrow-up';

import type { BlockControlsPlugin } from '../blockControlsPluginType';
import { moveNodeViaShortcut } from '../editor-commands/move-node';
import { DIRECTION } from '../pm-plugins/utils/consts';

export const getBlockMenuItems = (
	formatMessage: IntlShape['formatMessage'],
): { items: MenuItem[] }[] => {
	return [
		{
			items: [
				{
					content: formatMessage(blockControlsMessages.moveUp),
					elemBefore: <ArrowUpIcon label="" />,
					value: {
						name: 'moveUp',
					},
					key: 'move_up',
					// eslint-disable-next-line @atlaskit/design-system/consistent-css-prop-usage, @atlaskit/ui-styling-standard/no-imported-style-values
					elemAfter: <div css={shortcutStyle}>{tooltip(dragToMoveUp)}</div>,
				},
				{
					content: formatMessage(blockControlsMessages.moveDown),
					elemBefore: <ArrowDownIcon label="" />,
					value: {
						name: 'moveDown',
					},
					key: 'move_down',
					// eslint-disable-next-line @atlaskit/design-system/consistent-css-prop-usage, @atlaskit/ui-styling-standard/no-imported-style-values
					elemAfter: <div css={shortcutStyle}>{tooltip(dragToMoveDown)}</div>,
				},
				{
					content: formatMessage(blockControlsMessages.moveLeft),
					elemBefore: <ArrowLeftIcon label="" />,
					value: {
						name: 'moveLeft',
					},
					key: 'move_left',
					// eslint-disable-next-line @atlaskit/design-system/consistent-css-prop-usage, @atlaskit/ui-styling-standard/no-imported-style-values
					elemAfter: <div css={shortcutStyle}>{tooltip(dragToMoveLeft)}</div>,
				},
				{
					content: formatMessage(blockControlsMessages.moveRight),
					elemBefore: <ArrowRightnIcon label="" />,
					value: {
						name: 'moveRight',
					},
					key: 'move_right',
					// eslint-disable-next-line @atlaskit/design-system/consistent-css-prop-usage, @atlaskit/ui-styling-standard/no-imported-style-values
					elemAfter: <div css={shortcutStyle}>{tooltip(dragToMoveRight)}</div>,
				},
			],
		},
	];
};

export const menuItemsCallback = {
	moveUp: (
		api: ExtractInjectionAPI<BlockControlsPlugin> | undefined,
		formatMessage: IntlShape['formatMessage'],
	) => {
		return moveNodeViaShortcut(api, DIRECTION.UP, formatMessage);
	},
	moveDown: (
		api: ExtractInjectionAPI<BlockControlsPlugin> | undefined,
		formatMessage: IntlShape['formatMessage'],
	) => {
		return moveNodeViaShortcut(api, DIRECTION.DOWN, formatMessage);
	},
};
