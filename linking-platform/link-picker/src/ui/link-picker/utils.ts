import { KeyboardEvent } from 'react';
import { IntlShape } from 'react-intl-next';

import { browser } from './browser';
import { LinkPickerPlugin, LinkSearchListItemData } from '../types';
import { transformTimeStamp } from './transformTimeStamp';

const KeyZCode = 90;
const KeyYCode = 89;

export const isUndoEvent = (e: KeyboardEvent<HTMLInputElement>) => {
  return (
    e.keyCode === KeyZCode &&
    // cmd + z for mac
    ((browser.mac && e.metaKey && !e.shiftKey) ||
      // ctrl + z for non-mac
      (!browser.mac && e.ctrlKey))
  );
};

export const isRedoEvent = (e: KeyboardEvent<HTMLInputElement>) => {
  return (
    // ctrl + y for non-mac
    (!browser.mac && e.ctrlKey && e.keyCode === KeyYCode) ||
    (browser.mac && e.metaKey && e.shiftKey && e.keyCode === KeyZCode) ||
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
    const formattedDate = [date?.pageAction, date?.dateString, date?.timeSince]
      .filter(Boolean)
      .join(' ');
    return [name, container, formattedDate].filter(Boolean).join(', ');
  }
}
