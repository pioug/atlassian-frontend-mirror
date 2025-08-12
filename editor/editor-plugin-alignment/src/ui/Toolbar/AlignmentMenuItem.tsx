import React from 'react';

import { useIntl } from 'react-intl-next';

import { useSharedPluginStateWithSelector } from '@atlaskit/editor-common/hooks';
import { getAriaKeyshortcuts, tooltip } from '@atlaskit/editor-common/keymaps';
import { getInputMethodFromParentKeys } from '@atlaskit/editor-common/toolbar';
import type { ExtractInjectionAPI } from '@atlaskit/editor-common/types';
import { ToolbarDropdownItem, ToolbarKeyboardShortcutHint } from '@atlaskit/editor-toolbar';
import type { ToolbarComponentTypes } from '@atlaskit/editor-toolbar-model';

import type { AlignmentPlugin } from '../../alignmentPluginType';
import { changeAlignmentTr } from '../../editor-commands';
import type { AlignmentState } from '../../pm-plugins/types';

import type { OptionInfo } from './types';

export const AlignmentMenuItem = ({
	option: { label, icon: Icon, keymap },
	api,
	alignment,
	parents,
}: {
	option: OptionInfo;
	api: ExtractInjectionAPI<AlignmentPlugin> | undefined;
	alignment: AlignmentState;
	parents: ToolbarComponentTypes;
}) => {
	const { align } = useSharedPluginStateWithSelector(api, ['alignment'], (states) => {
		return {
			align: states.alignmentState?.align,
		};
	});
	const { formatMessage } = useIntl();
	const shortcut = tooltip(keymap);
	return (
		<ToolbarDropdownItem
			isSelected={align === alignment}
			elemBefore={<Icon label="" />}
			elemAfter={shortcut && <ToolbarKeyboardShortcutHint shortcut={shortcut} />}
			ariaKeyshortcuts={getAriaKeyshortcuts(keymap)}
			onClick={() => {
				api?.core.actions.execute(
					changeAlignmentTr(api, alignment, getInputMethodFromParentKeys(parents)),
				);
			}}
		>
			{formatMessage(label)}
		</ToolbarDropdownItem>
	);
};
