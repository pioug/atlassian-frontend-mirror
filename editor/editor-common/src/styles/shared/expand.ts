import { css } from '@emotion/react';

import { token } from '@atlaskit/tokens';
/* eslint-disable @atlaskit/design-system/ensure-design-token-usage */
export const expandIconWrapperStyle = css`
  margin-left: ${token('space.negative.100', '-8px')};
`;

const prefix = 'ak-editor-expand';

export const expandClassNames = {
  prefix,
  expanded: `${prefix}__expanded`,
  titleContainer: `${prefix}__title-container`,
  inputContainer: `${prefix}__input-container`,
  iconContainer: `${prefix}__icon-container`,
  icon: `${prefix}__icon`,
  titleInput: `${prefix}__title-input`,
  content: `${prefix}__content`,
  type: (type: string) => `${prefix}__type-${type}`,
};
