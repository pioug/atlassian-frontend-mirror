import React from 'react';

import { useIntl } from 'react-intl';

import {
	addRowAfter,
	addRowBefore,
	deleteRow,
	moveRowDown,
	moveRowDownOld,
	moveRowUp,
	moveRowUpOld,
	tooltip,
} from '@atlaskit/editor-common/keymaps';
import { tableMessages as messages } from '@atlaskit/editor-common/messages';
import {
	DeleteIcon,
	TableRowAddAboveIcon,
	TableRowAddBelowIcon,
	TableRowMoveDownIcon,
	TableRowMoveUpIcon,
	ToolbarDropdownItem,
	ToolbarKeyboardShortcutHint,
} from '@atlaskit/editor-toolbar';
import { expValEquals } from '@atlaskit/tmp-editor-statsig/exp-val-equals';
import Toggle from '@atlaskit/toggle';

export const HeaderRowToggleItem = (): React.JSX.Element => {
	const { formatMessage } = useIntl();

	return (
		<ToolbarDropdownItem
			testId="row-menu-header-row-toggle"
			elemAfter={
				<Toggle
					id="row-menu-toggle-header-row"
					label={formatMessage(messages.headerRow)}
					isChecked={false}
				/>
			}
		>
			{formatMessage(messages.headerRow)}
		</ToolbarDropdownItem>
	);
};

export const NumberedRowsToggleItem = (): React.JSX.Element => {
	const { formatMessage } = useIntl();

	return (
		<ToolbarDropdownItem
			testId="row-menu-numbered-rows-toggle"
			elemAfter={
				<Toggle
					id="row-menu-toggle-numbered-rows"
					label={formatMessage(messages.numberedRows)}
					isChecked={false}
				/>
			}
		>
			{formatMessage(messages.numberedRows)}
		</ToolbarDropdownItem>
	);
};

const getMoveRowUpShortcut = () =>
	tooltip(
		expValEquals('editor-a11y-fy26-keyboard-move-row-column', 'isEnabled', true)
			? moveRowUp
			: moveRowUpOld,
	);

const getMoveRowDownShortcut = () =>
	tooltip(
		expValEquals('editor-a11y-fy26-keyboard-move-row-column', 'isEnabled', true)
			? moveRowDown
			: moveRowDownOld,
	);

export const AddRowAboveItem = (): React.JSX.Element => {
	const { formatMessage } = useIntl();
	return (
		<ToolbarDropdownItem
			testId="row-menu-add-row-above"
			elemBefore={<TableRowAddAboveIcon color="currentColor" label="" size="small" />}
			elemAfter={<ToolbarKeyboardShortcutHint shortcut={tooltip(addRowBefore) ?? ''} />}
		>
			{formatMessage(messages.addRowAbove)}
		</ToolbarDropdownItem>
	);
};

export const AddRowBelowItem = (): React.JSX.Element => {
	const { formatMessage } = useIntl();
	return (
		<ToolbarDropdownItem
			testId="row-menu-add-row-below"
			elemBefore={<TableRowAddBelowIcon color="currentColor" label="" size="small" />}
			elemAfter={<ToolbarKeyboardShortcutHint shortcut={tooltip(addRowAfter) ?? ''} />}
		>
			{formatMessage(messages.addRowBelow)}
		</ToolbarDropdownItem>
	);
};

export const MoveRowUpItem = (): React.JSX.Element => {
	const { formatMessage } = useIntl();
	return (
		<ToolbarDropdownItem
			testId="row-menu-move-row-up"
			elemBefore={<TableRowMoveUpIcon color="currentColor" label="" size="small" />}
			elemAfter={<ToolbarKeyboardShortcutHint shortcut={getMoveRowUpShortcut() ?? ''} />}
		>
			{formatMessage(messages.moveRowUp, { 0: 1 })}
		</ToolbarDropdownItem>
	);
};

export const MoveRowDownItem = (): React.JSX.Element => {
	const { formatMessage } = useIntl();
	return (
		<ToolbarDropdownItem
			testId="row-menu-move-row-down"
			elemBefore={<TableRowMoveDownIcon color="currentColor" label="" size="small" />}
			elemAfter={<ToolbarKeyboardShortcutHint shortcut={getMoveRowDownShortcut() ?? ''} />}
		>
			{formatMessage(messages.moveRowDown, { 0: 1 })}
		</ToolbarDropdownItem>
	);
};

export const DeleteRowItem = (): React.JSX.Element => {
	const { formatMessage } = useIntl();
	return (
		<ToolbarDropdownItem
			testId="row-menu-delete-row"
			elemBefore={<DeleteIcon color="currentColor" label="" size="small" />}
			elemAfter={<ToolbarKeyboardShortcutHint shortcut={tooltip(deleteRow) ?? ''} />}
		>
			{formatMessage(messages.removeRows, { 0: 1 })}
		</ToolbarDropdownItem>
	);
};
