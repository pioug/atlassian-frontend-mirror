import React from 'react';

import type { IntlShape } from 'react-intl-next';

import commonMessages, { blockControlsMessages } from '@atlaskit/editor-common/messages';
import type { MenuItem } from '@atlaskit/editor-common/ui-menu';
import ArrowDownIcon from '@atlaskit/icon/core/arrow-down';
import ArrowUpIcon from '@atlaskit/icon/core/arrow-up';
import CopyIcon from '@atlaskit/icon/core/copy';
import DeleteIcon from '@atlaskit/icon/core/delete';

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
				},
				{
					content: formatMessage(blockControlsMessages.moveDown),
					elemBefore: <ArrowDownIcon label="" />,
					value: {
						name: 'moveDown',
					},
					key: 'move_down',
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
				},
				{
					content: formatMessage(blockControlsMessages.delete),
					value: {
						name: 'delete',
					},
					elemBefore: <DeleteIcon label="" />,
					key: 'delete',
				},
			],
		},
	];
};
