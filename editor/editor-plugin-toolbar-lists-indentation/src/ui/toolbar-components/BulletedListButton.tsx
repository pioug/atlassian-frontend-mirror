import React from 'react';

import {
	toggleBulletList as toggleBulletListKeymap,
	ToolTipContent,
	getAriaKeyshortcuts,
} from '@atlaskit/editor-common/keymaps';
import type { ExtractInjectionAPI } from '@atlaskit/editor-common/types/next-editor-plugin';
import type { ToolbarComponentTypes } from '@atlaskit/editor-toolbar-model/types';
import { ListBulletedIcon } from '@atlaskit/editor-toolbar/list-bulleted-icon';
import { ToolbarButton } from '@atlaskit/editor-toolbar/toolbar-button';
import { ToolbarTooltip } from '@atlaskit/editor-toolbar/toolbar-tooltip';

import type { ToolbarListsIndentationPlugin } from '../../toolbarListsIndentationPluginType';
import { useBulletedListInfo } from './BulletedListMenuItem';

type BulletedListType = {
	api?: ExtractInjectionAPI<ToolbarListsIndentationPlugin>;
	parents: ToolbarComponentTypes;
};

export const BulletedListButton = ({ api, parents }: BulletedListType): React.JSX.Element => {
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
				label={bulletMessage}
			/>
		</ToolbarTooltip>
	);
};
