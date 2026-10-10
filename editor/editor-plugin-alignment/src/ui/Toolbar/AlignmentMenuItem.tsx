import React from 'react';

import { useIntl } from 'react-intl';

import { getAriaKeyshortcuts, tooltip } from '@atlaskit/editor-common/keymaps';
import { getInputMethodFromParentKeys } from '@atlaskit/editor-common/toolbar';
import type { ExtractInjectionAPI } from '@atlaskit/editor-common/types/next-editor-plugin';
import { useSharedPluginStateWithSelector } from '@atlaskit/editor-common/useSharedPluginStateWithSelector';
import type { ToolbarComponentTypes } from '@atlaskit/editor-toolbar-model/types';
import { ToolbarDropdownItem } from '@atlaskit/editor-toolbar/toolbar-dropdown-item';
import { ToolbarKeyboardShortcutHint } from '@atlaskit/editor-toolbar/toolbar-keyboard-shortcut-hint';

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
	alignment: AlignmentState;
	api: ExtractInjectionAPI<AlignmentPlugin> | undefined;
	option: OptionInfo;
	parents: ToolbarComponentTypes;
}): React.JSX.Element => {
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
			elemBefore={<Icon size="small" label="" />}
			elemAfter={shortcut && <ToolbarKeyboardShortcutHint shortcut={shortcut} />}
			ariaKeyshortcuts={getAriaKeyshortcuts(keymap)}
			// eslint-disable-next-line @atlassian/perf-linting/no-unstable-inline-props -- Ignored via go/ees017 (to be fixed)
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
