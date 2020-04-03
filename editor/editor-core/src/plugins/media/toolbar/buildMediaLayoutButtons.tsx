import { EditorState, NodeSelection } from 'prosemirror-state';
import { InjectedIntl, defineMessages } from 'react-intl';
import { hasParentNodeOfType } from 'prosemirror-utils';
import { Schema } from 'prosemirror-model';
import {
  FloatingToolbarSeparator,
  FloatingToolbarItem,
} from '../../floating-toolbar/types';
import { MediaSingleLayout, MediaSingleAttributes } from '@atlaskit/adf-schema';
import { stateKey } from '../pm-plugins/plugin-key';
import { Command } from '../../../types';
import commonMessages from '../../../messages';

import WrapLeftIcon from '@atlaskit/icon/glyph/editor/media-wrap-left';
import WrapRightIcon from '@atlaskit/icon/glyph/editor/media-wrap-right';
import WideIcon from '@atlaskit/icon/glyph/editor/media-wide';
import FullWidthIcon from '@atlaskit/icon/glyph/editor/media-full-width';

import EditorAlignImageLeft from '@atlaskit/icon/glyph/editor/align-image-left';
import EditorAlignImageRight from '@atlaskit/icon/glyph/editor/align-image-right';
import EditorAlignImageCenter from '@atlaskit/icon/glyph/editor/align-image-center';
import { alignAttributes } from '../utils/media-single';
import { MediaPluginState } from '../pm-plugins/types';

type IconMap = Array<
  { value: string; icon: React.ComponentClass<any> } | { value: 'separator' }
>;

const alignmentIcons: IconMap = [
  { value: 'align-start', icon: EditorAlignImageLeft },
  { value: 'center', icon: EditorAlignImageCenter },
  { value: 'align-end', icon: EditorAlignImageRight },
];

const wrappingIcons: IconMap = [
  { value: 'wrap-left', icon: WrapLeftIcon },
  { value: 'wrap-right', icon: WrapRightIcon },
];

const breakoutIcons: IconMap = [
  { value: 'wide', icon: WideIcon },
  { value: 'full-width', icon: FullWidthIcon },
];

export const messages = defineMessages({
  wrapLeft: {
    id: 'fabric.editor.wrapLeft',
    defaultMessage: 'Wrap left',
    description: 'Aligns your image to the left and wraps text around it.',
  },
  wrapRight: {
    id: 'fabric.editor.wrapRight',
    defaultMessage: 'Wrap right',
    description: 'Aligns your image to the right and wraps text around it.',
  },
});

const layoutToMessages: Record<string, any> = {
  'wrap-left': messages.wrapLeft,
  center: commonMessages.alignImageCenter,
  'wrap-right': messages.wrapRight,
  wide: commonMessages.layoutWide,
  'full-width': commonMessages.layoutFullWidth,
  'align-end': commonMessages.alignImageRight,
  'align-start': commonMessages.alignImageLeft,
};

const makeAlign = (layout: MediaSingleLayout): Command => {
  return (state, dispatch) => {
    const pluginState: MediaPluginState | undefined = stateKey.getState(state);
    if (!pluginState || !dispatch) {
      return false;
    }

    const { mediaSingle } = state.schema.nodes;
    const mediaSingleNode = pluginState.selectedMediaContainerNode();
    if (!mediaSingleNode || mediaSingleNode.type !== mediaSingle) {
      return false;
    }

    const newAttrs = alignAttributes(
      layout,
      mediaSingleNode.attrs as MediaSingleAttributes,
    );
    const tr = state.tr.setNodeMarkup(
      state.selection.from,
      undefined,
      newAttrs,
    );
    tr.setMeta('scrollIntoView', false);
    dispatch(tr);
    return true;
  };
};

const mapIconsToToolbarItem = (
  icons: Array<any>,
  layout: MediaSingleLayout,
  intl: InjectedIntl,
) =>
  icons.map<FloatingToolbarItem<Command>>(toolbarItem => {
    const { value } = toolbarItem;

    return {
      type: 'button',
      icon: toolbarItem.icon,
      title: intl.formatMessage(layoutToMessages[value]),
      selected: layout === value,
      onClick: makeAlign(value),
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
  allowResizing?: boolean,
  allowResizingInTables?: boolean,
) => {
  const { selection } = state;
  const { mediaSingle } = state.schema.nodes;

  if (
    !(selection instanceof NodeSelection) ||
    !selection.node ||
    !mediaSingle ||
    shouldHideLayoutToolbar(selection, state.schema, allowResizingInTables)
  ) {
    return [];
  }

  const { layout } = selection.node.attrs;

  let toolbarItems = [
    ...mapIconsToToolbarItem(alignmentIcons, layout, intl),
    { type: 'separator' } as FloatingToolbarSeparator,
    ...mapIconsToToolbarItem(wrappingIcons, layout, intl),
  ];

  if (!allowResizing) {
    toolbarItems = toolbarItems.concat([
      { type: 'separator' } as FloatingToolbarSeparator,
      ...mapIconsToToolbarItem(breakoutIcons, layout, intl),
    ]);
  }

  return toolbarItems;
};

export default buildLayoutButtons;
