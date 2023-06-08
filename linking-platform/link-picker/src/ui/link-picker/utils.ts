import { KeyboardEvent } from 'react';
import { IntlShape } from 'react-intl-next';

import { browser } from '@atlaskit/linking-common/user-agent';

import { LinkPickerPlugin, LinkSearchListItemData } from '../types';
import { transformTimeStamp } from './transformTimeStamp';

const KeyZCode = 90;
const KeyYCode = 89;

export const isUndoEvent = (e: KeyboardEvent<HTMLInputElement>) => {
  const { mac } = browser();

  return (
    e.keyCode === KeyZCode &&
    // cmd + z for mac
    ((mac && e.metaKey && !e.shiftKey) ||
      // ctrl + z for non-mac
      (!mac && e.ctrlKey))
  );
};

export const isRedoEvent = (e: KeyboardEvent<HTMLInputElement>) => {
  const { mac } = browser();

  return (
    // ctrl + y for non-mac
    (!mac && e.ctrlKey && e.keyCode === KeyYCode) ||
    (mac && e.metaKey && e.shiftKey && e.keyCode === KeyZCode) ||
    (e.ctrlKey && e.shiftKey && e.keyCode === KeyZCode)
  );
};

/**
 * Retrieve the data source for a link given the item and the plugin that resolved it
 */
export const getDataSource = (
  item: LinkSearchListItemData,
  plugin?: LinkPickerPlugin,
) => {
  return item.meta?.source ?? plugin?.meta?.source ?? 'unknown';
};

export function getScreenReaderText(
  items: LinkSearchListItemData[],
  selectedIndex: number,
  intl: IntlShape,
): string | undefined {
  if (items.length && selectedIndex > -1) {
    const { name, container, lastUpdatedDate, lastViewedDate } =
      items[selectedIndex];

    const date = transformTimeStamp(intl, lastViewedDate, lastUpdatedDate);
    return [name, container, date].filter(Boolean).join(', ');
  }
}

export const handleNavKeyDown = (
  event: KeyboardEvent<HTMLElement>,
  itemsLength: number,
  activeIndex: number,
) => {
  let updatedIndex = activeIndex;
  switch (event.key) {
    case 'ArrowDown':
      event.preventDefault();
      updatedIndex = (activeIndex + 1) % itemsLength;
      break;

    case 'ArrowUp':
      event.preventDefault();
      updatedIndex = activeIndex > 0 ? activeIndex - 1 : itemsLength - 1;
      break;

    case 'Home':
      event.preventDefault();
      updatedIndex = 0;
      break;

    case 'End':
      event.preventDefault();
      updatedIndex = itemsLength - 1;
      break;
  }
  return updatedIndex;
};
