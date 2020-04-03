import { EditorView } from 'prosemirror-view';
import {
  FloatingToolbarConfig,
  FloatingToolbarItem,
  FloatingToolbarButton,
} from '../../../../plugins/floating-toolbar/types';
import { Command } from '../../../../types';

export const getToolbarItems = (
  toolbar: FloatingToolbarConfig,
  view: EditorView,
) => {
  const node = view.state.doc.nodeAt(view.state.selection.from)!;
  if (Array.isArray(toolbar.items)) {
    return toolbar.items;
  } else {
    return toolbar.items(node);
  }
};

export const findToolbarBtn = (
  items: Array<FloatingToolbarItem<Command>>,
  title: string,
): FloatingToolbarButton<Command> =>
  items.find(
    item => item.type === 'button' && item.title === title,
  ) as FloatingToolbarButton<Command>;
