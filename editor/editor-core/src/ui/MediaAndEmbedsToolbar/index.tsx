import { EditorState, NodeSelection } from 'prosemirror-state';
import { InjectedIntl } from 'react-intl';
import { hasParentNodeOfType } from 'prosemirror-utils';
import { Schema, NodeType, Node } from 'prosemirror-model';
import {
  FloatingToolbarSeparator,
  FloatingToolbarItem,
} from '../../plugins/floating-toolbar/types';
import {
  RichMediaLayout as MediaSingleLayout,
  RichMediaAttributes,
} from '@atlaskit/adf-schema';
import { Command } from '../../types';
import commonMessages from '../../messages';

import WrapLeftIcon from '@atlaskit/icon/glyph/editor/media-wrap-left';
import WrapRightIcon from '@atlaskit/icon/glyph/editor/media-wrap-right';
import WideIcon from '@atlaskit/icon/glyph/editor/media-wide';
import FullWidthIcon from '@atlaskit/icon/glyph/editor/media-full-width';

import EditorAlignImageLeft from '@atlaskit/icon/glyph/editor/align-image-left';
import EditorAlignImageRight from '@atlaskit/icon/glyph/editor/align-image-right';
import EditorAlignImageCenter from '@atlaskit/icon/glyph/editor/align-image-center';
import { alignAttributes } from '../../utils/rich-media-utils';
import {
  WidthPluginState,
  pluginKey as widthPluginKey,
} from '../../plugins/width';
import { DEFAULT_EMBED_CARD_WIDTH } from '@atlaskit/editor-shared-styles';

import { addAnalytics } from '../../plugins/analytics/utils';
import {
  ACTION_SUBJECT,
  ACTION_SUBJECT_ID,
  EVENT_TYPE,
  ACTION,
} from '../../plugins/analytics';
import { toolbarMessages } from './toolbar-messages';

type IconMap = Array<
  | { id?: string; value: string; icon: React.ComponentClass<any> }
  | { value: 'separator' }
>;

const alignmentIcons: IconMap = [
  {
    id: 'editor.media.alignLeft',
    value: 'align-start',
    icon: EditorAlignImageLeft,
  },
  {
    id: 'editor.media.alignCenter',
    value: 'center',
    icon: EditorAlignImageCenter,
  },
  {
    id: 'editor.media.alignRight',
    value: 'align-end',
    icon: EditorAlignImageRight,
  },
];

const wrappingIcons: IconMap = [
  { id: 'editor.media.wrapLeft', value: 'wrap-left', icon: WrapLeftIcon },
  { id: 'editor.media.wrapRight', value: 'wrap-right', icon: WrapRightIcon },
];

const breakoutIcons: IconMap = [
  { value: 'wide', icon: WideIcon },
  { value: 'full-width', icon: FullWidthIcon },
];

const layoutToMessages: Record<string, any> = {
  'wrap-left': toolbarMessages.wrapLeft,
  center: commonMessages.alignImageCenter,
  'wrap-right': toolbarMessages.wrapRight,
  wide: commonMessages.layoutWide,
  'full-width': commonMessages.layoutFullWidth,
  'align-end': commonMessages.alignImageRight,
  'align-start': commonMessages.alignImageLeft,
};

const getNodeWidth = (node: Node, schema: Schema): number => {
  const { embedCard } = schema.nodes;
  if (node.type === embedCard) {
    return node.attrs.originalWidth || DEFAULT_EMBED_CARD_WIDTH;
  }
  return (node.firstChild && node.firstChild.attrs.width) || node.attrs.width;
};

const makeAlign = (layout: MediaSingleLayout, nodeType: NodeType): Command => {
  return (state, dispatch) => {
    const { node } = state.selection as NodeSelection;
    const { layout: previousLayoutType } = node.attrs;
    const { mediaSingle } = state.schema.nodes;
    if (!dispatch) {
      return false;
    }

    const widthPluginState:
      | WidthPluginState
      | undefined = widthPluginKey.getState(state);

    if (!node || node.type !== nodeType || !widthPluginState) {
      return false;
    }

    const nodeWidth = getNodeWidth(node, state.schema);

    const newAttrs = alignAttributes(
      layout,
      node.attrs as RichMediaAttributes,
      undefined,
      nodeWidth,
      widthPluginState.lineLength,
    );
    const tr = state.tr.setNodeMarkup(
      state.selection.from,
      undefined,
      newAttrs,
    );
    tr.setMeta('scrollIntoView', false);
    // when image captions are enabled, the wrong node gets selected after
    // setNodeMarkup is called
    tr.setSelection(NodeSelection.create(tr.doc, state.selection.from));
    dispatch(
      addAnalytics(state, tr, {
        eventType: EVENT_TYPE.TRACK,
        action: ACTION.SELECTED,
        actionSubject:
          ACTION_SUBJECT[node.type === mediaSingle ? 'MEDIA_SINGLE' : 'EMBEDS'],
        actionSubjectId: ACTION_SUBJECT_ID.RICH_MEDIA_LAYOUT,
        attributes: {
          previousLayoutType,
          currentLayoutType: layout,
        },
      }),
    );
    return true;
  };
};

const mapIconsToToolbarItem = (
  icons: Array<any>,
  layout: MediaSingleLayout,
  intl: InjectedIntl,
  nodeType: NodeType,
) =>
  icons.map<FloatingToolbarItem<Command>>((toolbarItem) => {
    const { id, value } = toolbarItem;

    return {
      id: id,
      type: 'button',
      icon: toolbarItem.icon,
      title: intl.formatMessage(layoutToMessages[value]),
      selected: layout === value,
      onClick: makeAlign(value, nodeType),
    };
  });

const shouldHideLayoutToolbar = (
  selection: NodeSelection,
  { nodes }: Schema,
  allowResizingInTables?: boolean,
) => {
  return hasParentNodeOfType(
    [
      nodes.bodiedExtension,
      nodes.listItem,
      nodes.expand,
      nodes.nestedExpand,
      ...(allowResizingInTables ? [] : [nodes.table]),
    ].filter(Boolean),
  )(selection);
};

const buildLayoutButtons = (
  state: EditorState,
  intl: InjectedIntl,
  nodeType: NodeType,
  allowResizing?: boolean,
  allowResizingInTables?: boolean,
) => {
  const { selection } = state;

  if (
    !(selection instanceof NodeSelection) ||
    !selection.node ||
    !nodeType ||
    shouldHideLayoutToolbar(selection, state.schema, allowResizingInTables)
  ) {
    return [];
  }

  const { layout } = selection.node.attrs;

  let toolbarItems = [
    ...mapIconsToToolbarItem(alignmentIcons, layout, intl, nodeType),
    { type: 'separator' } as FloatingToolbarSeparator,
    ...mapIconsToToolbarItem(wrappingIcons, layout, intl, nodeType),
  ];

  if (!allowResizing) {
    toolbarItems = toolbarItems.concat([
      { type: 'separator' } as FloatingToolbarSeparator,
      ...mapIconsToToolbarItem(breakoutIcons, layout, intl, nodeType),
    ]);
  }

  return toolbarItems;
};

export default buildLayoutButtons;
