import React from 'react';

import Badge from '@atlaskit/badge';

type ToolbarKeyboardShortcutHintProps = {
	shortcut: string;
};

export const ToolbarKeyboardShortcutHint = ({ shortcut }: ToolbarKeyboardShortcutHintProps) => {
	return <Badge>{shortcut}</Badge>;
};
