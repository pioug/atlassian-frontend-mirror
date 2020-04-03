import { defineMessages, InjectedIntl } from 'react-intl';
import { EditorState } from 'prosemirror-state';
import { findDomRefAtPos } from 'prosemirror-utils';
import LayoutTwoEqualIcon from '@atlaskit/icon/glyph/editor/layout-two-equal';
import LayoutThreeEqualIcon from '@atlaskit/icon/glyph/editor/layout-three-equal';
import LayoutTwoLeftSidebarIcon from '@atlaskit/icon/glyph/editor/layout-two-left-sidebar';
import LayoutTwoRightSidebarIcon from '@atlaskit/icon/glyph/editor/layout-two-right-sidebar';
import LayoutThreeWithSidebarsIcon from '@atlaskit/icon/glyph/editor/layout-three-with-sidebars';
import RemoveIcon from '@atlaskit/icon/glyph/editor/remove';

import commonMessages from '../../messages';
import { MessageDescriptor } from '../../types/i18n';
import { Command } from '../../types';
import {
  FloatingToolbarConfig,
  FloatingToolbarItem,
  FloatingToolbarSeparator,
  FloatingToolbarButton,
  Icon,
} from '../../plugins/floating-toolbar/types';
import {
  setPresetLayout,
  deleteActiveLayoutNode,
  getPresetLayout,
} from './actions';
import { hoverDecoration } from '../base/pm-plugins/decoration';
import { PresetLayout } from './types';

export const messages = defineMessages({
  twoColumns: {
    id: 'fabric.editor.twoColumns',
    defaultMessage: 'Two columns',
    description: 'Layout with two columns of equal width',
  },
  threeColumns: {
    id: 'fabric.editor.threeColumns',
    defaultMessage: 'Three columns',
    description: 'Layout with three columns of equal width',
  },
  rightSidebar: {
    id: 'fabric.editor.rightSidebar',
    defaultMessage: 'Right sidebar',
    description:
      'Layout with two columns, left column is 2/3 and right is 1/3 of page',
  },
  leftSidebar: {
    id: 'fabric.editor.leftSidebar',
    defaultMessage: 'Left sidebar',
    description:
      'Layout with two columns, left column is 1/3 and right is 2/3 of page',
  },
  threeColumnsWithSidebars: {
    id: 'fabric.editor.threeColumnsWithSidebars',
    defaultMessage: 'Three columns with sidebars',
    description: 'Layout with 3 columns laid out as 25% - 50% - 25%',
  },
});

type PresetLayoutButtonItem = {
  type: PresetLayout;
  title: MessageDescriptor;
  icon: Icon;
};

const LAYOUT_TYPES: PresetLayoutButtonItem[] = [
  { type: 'two_equal', title: messages.twoColumns, icon: LayoutTwoEqualIcon },
  {
    type: 'three_equal',
    title: messages.threeColumns,
    icon: LayoutThreeEqualIcon,
  },
];

const SIDEBAR_LAYOUT_TYPES: PresetLayoutButtonItem[] = [
  {
    type: 'two_right_sidebar',
    title: messages.rightSidebar,
    icon: LayoutTwoRightSidebarIcon,
  },
  {
    type: 'two_left_sidebar',
    title: messages.leftSidebar,
    icon: LayoutTwoLeftSidebarIcon,
  },
  {
    type: 'three_with_sidebars',
    title: messages.threeColumnsWithSidebars,
    icon: LayoutThreeWithSidebarsIcon,
  },
];

const buildLayoutButton = (
  intl: InjectedIntl,
  item: PresetLayoutButtonItem,
  currentLayout: string | undefined,
): FloatingToolbarItem<Command> => ({
  type: 'button',
  icon: item.icon,
  title: intl.formatMessage(item.title),
  onClick: setPresetLayout(item.type),
  selected: !!currentLayout && currentLayout === item.type,
});

export const buildToolbar = (
  state: EditorState,
  intl: InjectedIntl,
  pos: number,
  _allowBreakout: boolean,
  addSidebarLayouts: boolean,
): FloatingToolbarConfig | undefined => {
  const node = state.doc.nodeAt(pos);
  if (node) {
    const currentLayout = getPresetLayout(node);

    const separator: FloatingToolbarSeparator = {
      type: 'separator',
    };

    const nodeType = state.schema.nodes.layoutSection;

    const deleteButton: FloatingToolbarButton<Command> = {
      type: 'button',
      appearance: 'danger',
      icon: RemoveIcon,
      title: intl.formatMessage(commonMessages.remove),
      onClick: deleteActiveLayoutNode,
      onMouseEnter: hoverDecoration(nodeType, true),
      onMouseLeave: hoverDecoration(nodeType, false),
    };

    return {
      title: 'Layout floating controls',
      getDomRef: view =>
        findDomRefAtPos(pos, view.domAtPos.bind(view)) as HTMLElement,
      nodeType,
      items: [
        ...LAYOUT_TYPES.map(i => buildLayoutButton(intl, i, currentLayout)),
        ...(addSidebarLayouts
          ? SIDEBAR_LAYOUT_TYPES.map(i =>
              buildLayoutButton(intl, i, currentLayout),
            )
          : []),
        separator,
        deleteButton,
      ],
    };
  }
  return;
};
