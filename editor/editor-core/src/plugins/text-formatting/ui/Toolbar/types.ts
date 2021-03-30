import { EditorState } from 'prosemirror-state';
import { InjectedIntlProps } from 'react-intl';
import { Command } from '../../../../types/command';
import { MenuItem } from '../../../../ui/DropdownMenu/types';
import { TOOLBAR_ACTION_SUBJECT_ID } from '../../../../plugins/analytics/types/toolbar-button';

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
  editorState: EditorState;
} & InjectedIntlProps;
