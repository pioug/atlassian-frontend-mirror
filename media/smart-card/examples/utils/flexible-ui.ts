import { CardState, CardType } from '../../src/state/store/types';
import extractFlexibleLinkContext from '../../src/extractors/flexible';
import { FlexibleUiDataContext } from '../../src/state/flexible-ui-context/types';
import { safeToken } from '../../src/utils/token';

export const getCardState = (
  data = {},
  meta = {},
  status = 'resolved' as CardType,
): CardState => ({
  status,
  details: {
    meta: {
      access: 'granted',
      visibility: 'public',
    },
    data: {
      '@type': 'Object',
      '@context': {
        '@vocab': 'https://www.w3.org/ns/activitystreams#',
        atlassian: 'https://schema.atlassian.com/ns/vocabulary#',
        schema: 'http://schema.org/',
      },
      generator: {
        '@type': 'Object',
        '@id': 'https://www.atlassian.com/#Confluence',
      },
      url: 'link-url',
      name:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam non elementum augue. Donec porttitor purus ut lacus blandit, quis hendrerit turpis pharetra. Etiam commodo lorem metus, eu eleifend tellus mattis sed. Suspendisse potenti. Duis metus quam, lacinia dapibus faucibus quis, laoreet quis turpis. Curabitur iaculis suscipit ligula ac commodo. Cras in metus enim. Duis sit amet turpis suscipit, ultricies odio sit amet, bibendum sem. Nunc consectetur diam vel elit pulvinar posuere. Maecenas neque mauris, tempor nec dolor nec, mollis laoreet nibh. Fusce mauris ante, scelerisque in tristique ut, ultrices sed eros. Cras imperdiet tellus nisl, in efficitur nibh rhoncus eget.',
      ...data,
    },
  },
});

export const getContext = (
  override: Partial<FlexibleUiDataContext> = {},
): FlexibleUiDataContext => {
  const cardState = getCardState();
  const context = extractFlexibleLinkContext(cardState.details);
  return {
    ...context,
    ...override,
  };
};

export const exampleTokens = {
  backgroundColor: safeToken('color.background.neutral', '#091E420F'),
  iconBackgroundColor: safeToken('color.icon.brand', '#0C66E4'),
  iconColor: safeToken('color.text.inverse', '#FFFFFF'),
};
