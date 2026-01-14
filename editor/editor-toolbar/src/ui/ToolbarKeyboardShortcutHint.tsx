import React from 'react';

import Badge from '@atlaskit/badge';
import { Text } from '@atlaskit/primitives/compiled';

type ToolbarKeyboardShortcutHintProps = {
	isDisabled?: boolean;
	shortcut: string;
};

export const ToolbarKeyboardShortcutHint = ({
	shortcut,
	isDisabled,
}: ToolbarKeyboardShortcutHintProps): React.JSX.Element => {
	if (isDisabled) {
		return (
			<Badge appearance="primaryInverted">
				<Text color="color.text.disabled">{shortcut}</Text>
			</Badge>
		);
	}
	return <Badge>{shortcut}</Badge>;
};
