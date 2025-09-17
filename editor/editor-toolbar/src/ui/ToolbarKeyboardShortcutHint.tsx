import React from 'react';

import Badge from '@atlaskit/badge';
import { Text } from '@atlaskit/primitives/compiled';
import { expValEquals } from '@atlaskit/tmp-editor-statsig/exp-val-equals';

type ToolbarKeyboardShortcutHintProps = {
	isDisabled?: boolean;
	shortcut: string;
};

export const ToolbarKeyboardShortcutHint = ({
	shortcut,
	isDisabled,
}: ToolbarKeyboardShortcutHintProps) => {
	if (isDisabled && expValEquals('platform_editor_toolbar_aifc_patch_5', 'isEnabled', true)) {
		return (
			<Badge appearance="primaryInverted">
				<Text color="color.text.disabled">{shortcut}</Text>
			</Badge>
		);
	}
	return <Badge>{shortcut}</Badge>;
};
