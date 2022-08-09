import { flattenCertainChildPropsAsProp } from '@atlaskit/codemod-utils';

export const flattenI18nInnerPropsAsProp = flattenCertainChildPropsAsProp(
  '@atlaskit/pagination',
  'i18n',
  ['prev', 'next'],
);
