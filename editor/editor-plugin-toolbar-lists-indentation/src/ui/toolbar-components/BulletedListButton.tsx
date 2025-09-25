import React from 'react';

import {
	toggleBulletList as toggleBulletListKeymap,
	ToolTipContent,
	getAriaKeyshortcuts,
} from '@atlaskit/editor-common/keymaps';
import type { ExtractInjectionAPI } from '@atlaskit/editor-common/types';
import { ListBulletedIcon, ToolbarButton, ToolbarTooltip } from '@atlaskit/editor-toolbar';
import type { ToolbarComponentTypes } from '@atlaskit/editor-toolbar-model';

import type { ToolbarListsIndentationPlugin } from '../../toolbarListsIndentationPluginType';

import { useBulletedListInfo } from './BulletedListMenuItem';

type BulletedListType = {
	api?: ExtractInjectionAPI<ToolbarListsIndentationPlugin>;
	parents: ToolbarComponentTypes;
};

export const BulletedListButton = ({ api, parents }: BulletedListType) => {
	const { bulletMessage, onClick, isDisabled, isSelected } = useBulletedListInfo({
		api,
		parents,
	});

	return (
		<ToolbarTooltip
			content={<ToolTipContent description={bulletMessage} keymap={toggleBulletListKeymap} />}
		>
			<ToolbarButton
				iconBefore={<ListBulletedIcon size="small" label="" />}
				onClick={onClick}
				isSelected={isSelected}
				isDisabled={isDisabled}
				ariaKeyshortcuts={getAriaKeyshortcuts(toggleBulletListKeymap)}
			/>
		</ToolbarTooltip>
	);
};
