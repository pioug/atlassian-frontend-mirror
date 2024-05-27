import { type LinkSearchListItemData } from '../../../common/types';

export const getDefaultItems = (
  numberOfItems: number = 2,
): LinkSearchListItemData[] =>
  Array(numberOfItems)
    .fill(null)
    .map((_, i) => ({
      objectId: `some-object-id-${i + 1}`,
      name: `some-name-${i + 1}`,
      container: `some-container-${i + 1}`,
      url: `http://some-url-${i + 1}.com`,
      icon: `http://some-icon-url-${i + 1}.com`,
      iconAlt: {
        id: 'fabric.linkPicker.defaultAltText',
        defaultMessage: `List item ${i + 1}`,
        description: 'Default alt text for ListItem image',
      },
    }));
