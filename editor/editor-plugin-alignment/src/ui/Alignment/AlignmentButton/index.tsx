import React from 'react';

import type { Keymap } from '@atlaskit/editor-common/keymaps';
import { getAriaKeyshortcuts, tooltip, ToolTipContent } from '@atlaskit/editor-common/keymaps';
import { ToolbarButton } from '@atlaskit/editor-common/ui-menu';

import type { AlignmentState } from '../../../pm-plugins/types';

export interface Props {
	value: AlignmentState;
	label: string;
	isSelected?: boolean;
	onClick: (value: AlignmentState, shouldClosePopup: boolean) => void;
	content: React.ReactElement;
	shortcut?: Keymap;
}

function AlignmentButton({ label, isSelected, content, shortcut, onClick, value }: Props) {
	const onClickCallback = (e: React.MouseEvent<HTMLElement>) => {
		// detect if the click event comes from keyboard where screenX and screenY are 0
		const isMouseEvent = e instanceof MouseEvent;
		e.preventDefault();
		onClick(value, isMouseEvent);
	};

	return (
		<ToolbarButton
			disabled={false}
			selected={isSelected}
			title={<ToolTipContent description={label} keymap={shortcut} />}
			aria-label={shortcut ? tooltip(shortcut, label) : label}
			aria-pressed={isSelected}
			aria-keyshortcuts={getAriaKeyshortcuts(shortcut)}
			onClick={onClickCallback}
			iconBefore={content}
		/>
	);
}

export default AlignmentButton;
