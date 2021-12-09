import React from 'react';

import { FormattedMessage } from 'react-intl-next';
import styled from 'styled-components';

import { gridSize } from '@atlaskit/theme/constants';
import { h500 } from '@atlaskit/theme/typography';

import { messages } from '../i18n';

export type Props = {
  title?: React.ReactNode;
};
const HeaderWrapper = styled.div`
  display: flex;
  justify-content: space-between;
`;

export const FormHeaderTitle = styled.h1`
  ${h500};
  line-height: ${gridSize() * 4}px;
  margin-right: ${gridSize() * 4}px;
  margin-top: ${gridSize() * 4}px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;

  > span {
    font-size: initial;
  }
`;

export const ShareHeader: React.StatelessComponent<Props> = ({ title }) => (
  <HeaderWrapper>
    <FormHeaderTitle>
      {title || <FormattedMessage {...messages.formTitle} />}
    </FormHeaderTitle>
  </HeaderWrapper>
);
