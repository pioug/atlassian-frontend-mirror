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

export interface MenuIconItem extends MenuItem {
	command: Command;
	iconMark?: IconTypes;
	tooltipElement?: React.ReactElement;
	iconElement?: React.ReactElement;
	buttonId?: TOOLBAR_ACTION_SUBJECT_ID;
}

export type MenuIconState = {
	isActive: boolean;
	isDisabled: boolean;
	isHidden: boolean;
	hasSchemaMark: boolean;
};

export type IconHookProps = {
	isToolbarDisabled?: boolean;
} & WrappedComponentProps;

export enum ToolbarType {
	PRIMARY = 'primaryToolbar',
	FLOATING = 'floatingToolbar',
}
