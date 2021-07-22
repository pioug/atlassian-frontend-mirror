import { ToolbarSize } from '../../../../ui/Toolbar/types';
import { IconTypes } from './types';

export const DefaultButtonsToolbar: IconTypes[] = [
  IconTypes.strong,
  IconTypes.em,
];

export const DefaultButtonsMenu: IconTypes[] = [
  IconTypes.underline,
  IconTypes.strike,
  IconTypes.code,
  IconTypes.subscript,
  IconTypes.superscript,
];

export const ResponsiveCustomButtonToolbar: Record<ToolbarSize, IconTypes[]> = {
  [ToolbarSize.XXL]: DefaultButtonsToolbar,
  [ToolbarSize.XL]: DefaultButtonsToolbar,
  [ToolbarSize.L]: DefaultButtonsToolbar,
  [ToolbarSize.M]: [],
  [ToolbarSize.S]: [],
  [ToolbarSize.XXXS]: [],
};

export const ResponsiveCustomMenu: Record<ToolbarSize, IconTypes[]> = {
  [ToolbarSize.XXL]: DefaultButtonsMenu,
  [ToolbarSize.XL]: DefaultButtonsMenu,
  [ToolbarSize.L]: DefaultButtonsMenu,
  [ToolbarSize.M]: [IconTypes.strong, IconTypes.em, ...DefaultButtonsMenu],
  [ToolbarSize.S]: [IconTypes.strong, IconTypes.em, ...DefaultButtonsMenu],
  [ToolbarSize.XXXS]: [IconTypes.strong, IconTypes.em, ...DefaultButtonsMenu],
};
