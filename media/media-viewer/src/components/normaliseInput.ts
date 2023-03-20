import { MediaViewerDataSource } from './types';
import { Identifier, isExternalImageIdentifier } from '@atlaskit/media-client';
import { getIdentifierCollection } from '../utils/getIdentifierCollection';
import { getSelectedIndex } from '../utils';

type NormaliseInputParams = {
  dataSource?: MediaViewerDataSource;
  selectedItem: Identifier;
  items?: Array<Identifier>;
  collectionName: string;
};

const ensureCollectionName = (
  items: Array<Identifier>,
  collectionName: string,
) =>
  items.map((identifier) =>
    isExternalImageIdentifier(identifier)
      ? identifier
      : {
          ...identifier,
          collectionName: getIdentifierCollection(identifier, collectionName),
        },
  );

// returns a valid MV data source including current the card identifier
const ensureSelectedItem = (
  items: Array<Identifier>,
  selectedItem: Identifier,
): Array<Identifier> => {
  // we want to ensure the card identifier is in the list
  const selectedItemIndex = getSelectedIndex(items, selectedItem);
  if (selectedItemIndex === -1) {
    return [selectedItem, ...items];
  }
  return items;
};

const normaliseItems = (
  selectedItem: Identifier,
  items: Identifier[],
  collectionName: string,
): Identifier[] => {
  const itemsWithCollection = ensureCollectionName(items, collectionName);
  return ensureSelectedItem(itemsWithCollection, selectedItem);
};

export const normaliseInput = ({
  dataSource,
  selectedItem,
  items,
  collectionName,
}: NormaliseInputParams): {
  normalisedSelectedItem: Identifier;
  normalisedItems?: Array<Identifier>;
} => {
  const normalisedSelectedItem: Identifier = isExternalImageIdentifier(
    selectedItem,
  )
    ? selectedItem
    : {
        ...selectedItem,
        collectionName,
      };

  if (items) {
    return {
      normalisedSelectedItem,
      normalisedItems: normaliseItems(
        normalisedSelectedItem,
        items,
        collectionName,
      ),
    };
  } else if (dataSource?.list) {
    return {
      normalisedSelectedItem,
      normalisedItems: normaliseItems(
        normalisedSelectedItem,
        dataSource.list,
        collectionName,
      ),
    };
  } else if (
    dataSource?.collectionName &&
    !isExternalImageIdentifier(selectedItem)
  ) {
    return {
      normalisedSelectedItem,
      normalisedItems: undefined,
    };
  }

  return {
    normalisedSelectedItem,
    normalisedItems: [normalisedSelectedItem],
  };
};
