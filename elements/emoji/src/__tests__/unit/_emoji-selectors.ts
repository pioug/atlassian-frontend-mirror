import { ReactWrapper, EnzymePropSelector } from 'enzyme';

export function getEmojiTypeAheadItemById(
  emojiTypeAhead: ReactWrapper<any, any>,
  itemKey?: string,
): ReactWrapper<any, any> {
  return emojiTypeAhead.findWhere(
    (n) => n.name() === 'EmojiTypeAheadItem' && n.key() === itemKey,
  );
}

export function getSelectedEmojiTypeAheadItem(
  emojiTypeAhead: ReactWrapper<any, any>,
): ReactWrapper<any, any> {
  return (
    emojiTypeAhead.update() &&
    emojiTypeAhead.findWhere(
      (n) => n.name() === 'EmojiTypeAheadItem' && n.prop('selected'),
    )
  );
}

export function isEmojiTypeAheadItemSelected(
  emojiTypeAhead: ReactWrapper<any, any>,
  itemKey?: string,
): boolean {
  const selectedItem = getSelectedEmojiTypeAheadItem(emojiTypeAhead);
  return !!(selectedItem.length && selectedItem.key() === itemKey);
}

/**
 * Helper function for tests where explicit calls to update() are needed
 * for Enzyme 3 when React components' internal state has changed
 *
 * Only the root node can be updated but find() can be called on child nodes
 * If no child is passed in, find is called on the root node
 *
 * @param root ReactWrapper to update
 * @param prop Child component to find
 * @param child Optional child of root that find should be called on
 */
export function hasSelector(
  root: ReactWrapper<any, any>,
  prop: EnzymePropSelector,
  child?: ReactWrapper<any, any>,
): boolean {
  const component = child || root;
  root.update();
  return component.find(prop).length > 0;
}
