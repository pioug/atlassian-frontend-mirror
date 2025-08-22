import type { WrappedComponentProps } from 'react-intl-next';

import type { TOOLBAR_ACTION_SUBJECT_ID } from '@atlaskit/editor-common/analytics';
import type { Command } from '@atlaskit/editor-common/types';
import type { MenuItem } from '@atlaskit/editor-common/ui-menu';

export enum IconTypes {
	strong = 'strong',
	em = 'em',
	underline = 'underline',
	strike = 'strike',
	code = 'code',
	subscript = 'subscript',
	superscript = 'superscript',
}

export enum FormatOptions {
	strong = 'strong',
	em = 'em',
	underline = 'underline',
	strike = 'strike',
	code = 'code',
	subscript = 'subscript',
	superscript = 'superscript',
}

export type FormatOptionState = {
	isActive: boolean;
	isDisabled: boolean;
	isHidden: boolean;
};

export interface MenuIconItem extends MenuItem {
	buttonId?: TOOLBAR_ACTION_SUBJECT_ID;
	command: Command;
	iconElement?: React.ReactElement;
	iconMark?: IconTypes;
	tooltipElement?: React.ReactElement;
}

export type MenuIconState = {
	hasSchemaMark: boolean;
	isActive: boolean;
	isDisabled: boolean;
	isHidden: boolean;
};

export type IconHookProps = {
	isToolbarDisabled?: boolean;
} & WrappedComponentProps;

export enum ToolbarType {
	PRIMARY = 'primaryToolbar',
	FLOATING = 'floatingToolbar',
}
