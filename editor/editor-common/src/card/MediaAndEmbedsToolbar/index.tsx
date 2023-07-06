import { Node, NodeType, Schema } from 'prosemirror-model';
import { EditorState, NodeSelection } from 'prosemirror-state';
import { hasParentNodeOfType } from 'prosemirror-utils';
import { IntlShape } from 'react-intl-next';

import {
  RichMediaLayout as MediaSingleLayout,
  RichMediaAttributes,
} from '@atlaskit/adf-schema';
import { DEFAULT_EMBED_CARD_WIDTH } from '@atlaskit/editor-shared-styles';
import EditorAlignImageCenter from '@atlaskit/icon/glyph/editor/align-image-center';
import EditorAlignImageLeft from '@atlaskit/icon/glyph/editor/align-image-left';
import EditorAlignImageRight from '@atlaskit/icon/glyph/editor/align-image-right';
import FullWidthIcon from '@atlaskit/icon/glyph/editor/media-full-width';
import WideIcon from '@atlaskit/icon/glyph/editor/media-wide';
import WrapLeftIcon from '@atlaskit/icon/glyph/editor/media-wrap-left';
import WrapRightIcon from '@atlaskit/icon/glyph/editor/media-wrap-right';

import {
  ACTION,
  ACTION_SUBJECT,
  ACTION_SUBJECT_ID,
  EditorAnalyticsAPI,
  EVENT_TYPE,
} from '../../analytics';
import { insideTable } from '../../core-utils';
import commonMessages, {
  mediaAndEmbedToolbarMessages as toolbarMessages,
} from '../../messages';
import type {
  Command,
  EditorContainerWidth,
  FloatingToolbarItem,
  FloatingToolbarSeparator,
  NextEditorPlugin,
  PluginDependenciesAPI,
} from '../../types';
import { alignAttributes, isInLayoutColumn } from '../../utils';

// Workaround as we don't want to import this package into `editor-common`
// We'll get type errors if this gets out of sync with `editor-plugin-width`.
type WidthPluginType = NextEditorPlugin<
  'width',
  { sharedState: EditorContainerWidth | undefined }
>;

type WidthPluginDependencyApi =
  | PluginDependenciesAPI<WidthPluginType>
  | undefined;

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

const makeAlign = (
  layout: MediaSingleLayout,
  nodeType: NodeType,
  widthPluginDependencyApi: WidthPluginDependencyApi,
  analyticsApi: EditorAnalyticsAPI | undefined,
): Command => {
  return (state, dispatch) => {
    const { node } = state.selection as NodeSelection;
    const { layout: previousLayoutType } = node.attrs;
    const { mediaSingle } = state.schema.nodes;
    if (!dispatch) {
      return false;
    }

    const widthPluginState: EditorContainerWidth | undefined =
      widthPluginDependencyApi?.sharedState.currentState();

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

    const {
      doc: {
        type: {
          schema: {
            nodes: { paragraph },
          },
        },
      },
    } = tr;

    // see https://product-fabric.atlassian.net/browse/ED-15518 insert a new paragraph when an embedded card is wrapped left or right
    if (
      layout.startsWith('wrap') &&
      paragraph &&
      !tr.doc.nodeAt(state.selection.to) &&
      (insideTable(state) || isInLayoutColumn(state))
    ) {
      const emptyParaghraph = paragraph.createAndFill();
      if (emptyParaghraph) {
        tr.insert(state.selection.to, emptyParaghraph);
      }
    }

    analyticsApi?.attachAnalyticsEvent({
      eventType: EVENT_TYPE.TRACK,
      action: ACTION.SELECTED,
      actionSubject:
        ACTION_SUBJECT[node.type === mediaSingle ? 'MEDIA_SINGLE' : 'EMBEDS'],
      actionSubjectId: ACTION_SUBJECT_ID.RICH_MEDIA_LAYOUT,
      attributes: {
        previousLayoutType,
        currentLayoutType: layout,
      },
    })(tr);

    dispatch(tr);
    return true;
  };
};

const mapIconsToToolbarItem = (
  icons: Array<any>,
  layout: MediaSingleLayout,
  intl: IntlShape,
  nodeType: NodeType,
  widthPluginDependencyApi: WidthPluginDependencyApi,
  analyticsApi: EditorAnalyticsAPI | undefined,
) =>
  icons.map<FloatingToolbarItem<Command>>((toolbarItem) => {
    const { id, value } = toolbarItem;

    return {
      id: id,
      type: 'button',
      icon: toolbarItem.icon,
      title: intl.formatMessage(layoutToMessages[value]),
      selected: layout === value,
      onClick: makeAlign(
        value,
        nodeType,
        widthPluginDependencyApi,
        analyticsApi,
      ),
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
  intl: IntlShape,
  nodeType: NodeType,
  widthPluginDependencyApi: WidthPluginDependencyApi,
  analyticsApi: EditorAnalyticsAPI | undefined,
  allowResizing?: boolean,
  allowResizingInTables?: boolean,
  allowWrapping = true,
  allowAlignment = true,
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

  const alignmentToolbarItems = allowAlignment
    ? mapIconsToToolbarItem(
        alignmentIcons,
        layout,
        intl,
        nodeType,
        widthPluginDependencyApi,
        analyticsApi,
      )
    : [];
  const wrappingToolbarItems = allowWrapping
    ? mapIconsToToolbarItem(
        wrappingIcons,
        layout,
        intl,
        nodeType,
        widthPluginDependencyApi,
        analyticsApi,
      )
    : [];
  const breakOutToolbarItems = !allowResizing
    ? mapIconsToToolbarItem(
        breakoutIcons,
        layout,
        intl,
        nodeType,
        widthPluginDependencyApi,
        analyticsApi,
      )
    : [];

  const items = [
    ...alignmentToolbarItems,
    ...getSeparatorBetweenAlignmentAndWrapping(allowAlignment, allowWrapping),
    ...wrappingToolbarItems,
    ...getSeparatorBeforeBreakoutItems(
      allowAlignment,
      allowWrapping,
      allowResizing,
    ),
    ...breakOutToolbarItems,
  ];

  return items;
};

const getSeparatorBetweenAlignmentAndWrapping = (
  allowAlignment: boolean,
  allowWrapping: boolean,
) =>
  allowAlignment && allowWrapping
    ? [{ type: 'separator' } as FloatingToolbarSeparator]
    : [];

const getSeparatorBeforeBreakoutItems = (
  allowAlignment: boolean,
  allowWrapping: boolean,
  allowResizing?: boolean,
) =>
  !allowResizing && (allowAlignment || allowWrapping)
    ? [{ type: 'separator' } as FloatingToolbarSeparator]
    : [];

export default buildLayoutButtons;
