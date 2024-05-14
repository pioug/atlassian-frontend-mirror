import type { IntlShape, MessageDescriptor } from 'react-intl-next';

import type { EditorAnalyticsAPI } from '@atlaskit/editor-common/analytics';
import commonMessages, {
  layoutMessages as toolbarMessages,
} from '@atlaskit/editor-common/messages';
import type {
  Command,
  ExtractInjectionAPI,
  FloatingToolbarButton,
  FloatingToolbarConfig,
  FloatingToolbarItem,
  FloatingToolbarSeparator,
  Icon,
} from '@atlaskit/editor-common/types';
import type { EditorState } from '@atlaskit/editor-prosemirror/state';
import { findDomRefAtPos } from '@atlaskit/editor-prosemirror/utils';
import EditorLayoutSingleIcon from '@atlaskit/icon/glyph/editor/layout-single';
import LayoutThreeEqualIcon from '@atlaskit/icon/glyph/editor/layout-three-equal';
import LayoutThreeWithSidebarsIcon from '@atlaskit/icon/glyph/editor/layout-three-with-sidebars';
import LayoutTwoEqualIcon from '@atlaskit/icon/glyph/editor/layout-two-equal';
import LayoutTwoLeftSidebarIcon from '@atlaskit/icon/glyph/editor/layout-two-left-sidebar';
import LayoutTwoRightSidebarIcon from '@atlaskit/icon/glyph/editor/layout-two-right-sidebar';
import RemoveIcon from '@atlaskit/icon/glyph/editor/remove';

import {
  deleteActiveLayoutNode,
  getPresetLayout,
  setPresetLayout,
} from './actions';
import type { PresetLayout } from './types';

import type { LayoutPlugin } from './index';

type PresetLayoutButtonItem = {
  id?: string;
  type: PresetLayout;
  title: MessageDescriptor;
  icon: Icon;
};

const LAYOUT_TYPES: PresetLayoutButtonItem[] = [
  {
    id: 'editor.layout.twoEquals',
    type: 'two_equal',
    title: toolbarMessages.twoColumns,
    icon: LayoutTwoEqualIcon,
  },
  {
    id: 'editor.layout.threeEquals',
    type: 'three_equal',
    title: toolbarMessages.threeColumns,
    icon: LayoutThreeEqualIcon,
  },
];

const LAYOUT_TYPES_WITH_SINGLE_COL: PresetLayoutButtonItem[] = [
  {
    id: 'editor.layout.singeLayout',
    type: 'single',
    title: toolbarMessages.singleColumn,
    icon: EditorLayoutSingleIcon,
  },
  ...LAYOUT_TYPES,
];

const SIDEBAR_LAYOUT_TYPES: PresetLayoutButtonItem[] = [
  {
    id: 'editor.layout.twoRightSidebar',
    type: 'two_right_sidebar',
    title: toolbarMessages.rightSidebar,
    icon: LayoutTwoRightSidebarIcon,
  },
  {
    id: 'editor.layout.twoLeftSidebar',
    type: 'two_left_sidebar',
    title: toolbarMessages.leftSidebar,
    icon: LayoutTwoLeftSidebarIcon,
  },
  {
    id: 'editor.layout.threeWithSidebars',
    type: 'three_with_sidebars',
    title: toolbarMessages.threeColumnsWithSidebars,
    icon: LayoutThreeWithSidebarsIcon,
  },
];

const buildLayoutButton = (
  intl: IntlShape,
  item: PresetLayoutButtonItem,
  currentLayout: string | undefined,
  editorAnalyticsAPI: EditorAnalyticsAPI | undefined,
): FloatingToolbarItem<Command> => ({
  id: item.id,
  type: 'button',
  icon: item.icon,
  testId: item.title.id ? `${item.title.id}` : undefined,
  title: intl.formatMessage(item.title),
  onClick: setPresetLayout(editorAnalyticsAPI)(item.type),
  selected: !!currentLayout && currentLayout === item.type,
  tabIndex: null,
});

export const layoutToolbarTitle = 'Layout floating controls';

export const buildToolbar = (
  state: EditorState,
  intl: IntlShape,
  pos: number,
  _allowBreakout: boolean,
  addSidebarLayouts: boolean,
  allowSingleColumnLayout: boolean,
  api: ExtractInjectionAPI<LayoutPlugin> | undefined,
): FloatingToolbarConfig | undefined => {
  const { hoverDecoration } = api?.decorations?.actions ?? {};
  const editorAnalyticsAPI = api?.analytics?.actions;
  const node = state.doc.nodeAt(pos);
  if (node) {
    const currentLayout = getPresetLayout(node);

    const separator: FloatingToolbarSeparator = {
      type: 'separator',
    };

    const nodeType = state.schema.nodes.layoutSection;

    const deleteButton: FloatingToolbarButton<Command> = {
      id: 'editor.layout.delete',
      type: 'button',
      appearance: 'danger',
      focusEditoronEnter: true,
      icon: RemoveIcon,
      testId: commonMessages.remove.id,
      title: intl.formatMessage(commonMessages.remove),
      onClick: deleteActiveLayoutNode(editorAnalyticsAPI),
      onMouseEnter: hoverDecoration?.(nodeType, true),
      onMouseLeave: hoverDecoration?.(nodeType, false),
      onFocus: hoverDecoration?.(nodeType, true),
      onBlur: hoverDecoration?.(nodeType, false),
      tabIndex: null,
    };

    const layoutTypes = allowSingleColumnLayout
      ? LAYOUT_TYPES_WITH_SINGLE_COL
      : LAYOUT_TYPES;

    return {
      title: layoutToolbarTitle,
      getDomRef: view =>
        findDomRefAtPos(pos, view.domAtPos.bind(view)) as HTMLElement,
      nodeType,
      groupLabel: intl.formatMessage(
        toolbarMessages.floatingToolbarRadioGroupAriaLabel,
      ),
      items: [
        ...layoutTypes.map(i =>
          buildLayoutButton(intl, i, currentLayout, editorAnalyticsAPI),
        ),
        ...(addSidebarLayouts
          ? SIDEBAR_LAYOUT_TYPES.map(i =>
              buildLayoutButton(intl, i, currentLayout, editorAnalyticsAPI),
            )
          : []),
        separator,
        {
          type: 'copy-button',
          supportsViewMode: true,
          items: [
            {
              state,
              formatMessage: intl.formatMessage,
              nodeType,
            },
          ],
        },

        separator,
        deleteButton,
      ],
      scrollable: true,
    };
  }
  return;
};
