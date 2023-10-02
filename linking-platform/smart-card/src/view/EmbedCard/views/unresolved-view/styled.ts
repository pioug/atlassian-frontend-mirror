import { fontSize } from '@atlaskit/theme/constants';
import { css } from '@emotion/react';
import { gs } from '../../../common/utils';

export const containerStyles = css`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
`;

export const imageStyles = css`
  max-height: ${gs(14)};
  margin-bottom: ${gs(4)};
  overflow: hidden;
`;

export const titleStyles = css`
  font-size: ${gs(2.5)};
  margin-bottom: ${gs(1.5)};
  max-width: ${gs(50)};
  text-align: center;
`;

export const descriptionStyles = css`
  font-size: ${fontSize()};
  margin-bottom: ${gs(2.5)};
  text-align: center;
  max-width: ${gs(50)};
  line-height: ${gs(3)};
`;
