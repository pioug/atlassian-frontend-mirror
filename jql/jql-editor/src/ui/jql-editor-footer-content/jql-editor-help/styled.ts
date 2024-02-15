import { css } from '@emotion/react';
import styled from '@emotion/styled';

import { token } from '@atlaskit/tokens';

import { hiddenMixin } from '../../../common/styled';

type HelpContainerProps = {
  isVisible: boolean;
};

export const HelpContainer = styled.div<HelpContainerProps>`
  display: flex;
  margin-left: auto;
  margin-right: 0;
  flex-shrink: 0;
  padding: 0 ${token('space.100', '8px')};

  > * + * {
    margin-left: ${token('space.200', '16px')};
  }

  ${props =>
    props.isVisible
      ? css`
          visibility: visible;
          opacity: 1;
          transition: opacity 250ms cubic-bezier(0.15, 1, 0.3, 1);
        `
      : css`
          ${hiddenMixin};
          opacity: 0;
        `}
`;
