/* eslint-disable @atlaskit/design-system/prefer-primitives */
/**
 * @jsxRuntime classic
 * @jsx jsx
 */

// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { jsx } from '@emotion/react';
import type { IntlShape } from 'react-intl-next';

import {
	copy,
	deleteKey,
	dragToMoveDown,
	dragToMoveUp,
	tooltip,
} from '@atlaskit/editor-common/keymaps';
import commonMessages, { blockControlsMessages } from '@atlaskit/editor-common/messages';
import type { ExtractInjectionAPI } from '@atlaskit/editor-common/types';
import type { MenuItem } from '@atlaskit/editor-common/ui-menu';
import { shortcutStyle } from '@atlaskit/editor-shared-styles/shortcut';
import ArrowDownIcon from '@atlaskit/icon/core/arrow-down';
import ArrowUpIcon from '@atlaskit/icon/core/arrow-up';
import CopyIcon from '@atlaskit/icon/core/copy';
import DeleteIcon from '@atlaskit/icon/core/delete';

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
			],
		},
		{
			items: [
				{
					content: formatMessage(commonMessages.copyToClipboard),
					value: {
						name: 'copy',
					},
					elemBefore: <CopyIcon label="" />,
					key: 'copy',
					// eslint-disable-next-line @atlaskit/design-system/consistent-css-prop-usage, @atlaskit/ui-styling-standard/no-imported-style-values
					elemAfter: <div css={shortcutStyle}>{tooltip(copy)}</div>,
				},
				{
					content: formatMessage(blockControlsMessages.delete),
					value: {
						name: 'delete',
					},
					elemBefore: <DeleteIcon label="" />,
					key: 'delete',
					// eslint-disable-next-line @atlaskit/design-system/consistent-css-prop-usage, @atlaskit/ui-styling-standard/no-imported-style-values
					elemAfter: <div css={shortcutStyle}>{tooltip(deleteKey)}</div>,
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
	copy: () => {
		// TODO: implement copy
		// console.log('copy');
	},
	delete: () => {
		// TODO: implement delete
		// console.log('delete');
	},
};
