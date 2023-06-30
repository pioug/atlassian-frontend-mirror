import { IntlShape } from 'react-intl-next';

import { LinkPickerPlugin, LinkSearchListItemData } from '../../common/types';

import { transformTimeStamp } from './transformTimeStamp';

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
