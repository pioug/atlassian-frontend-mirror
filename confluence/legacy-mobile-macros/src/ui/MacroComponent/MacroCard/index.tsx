import React from 'react';

import styled from 'styled-components';

import ErrorIcon from '@atlaskit/icon/glyph/error';
import * as colors from '@atlaskit/theme/colors';
import { themed } from '@atlaskit/theme/components';

import { macroIcon } from './MacroIcon';
import { MacroCardType } from './types';

const Card = styled.span`
  display: flex;
  height: initial;
  white-space: normal;
  text-align: left;
`;

const Content = styled.span`
  flex: 1;
`;

const ContentWrapper = styled.span`
  flex: 1;
  padding-left: 8px;
  display: flex;
  justify-content: space-between;
`;

const Error = styled.span`
  flex-basis: 100%;
  padding-top: 10px;
  display: flex;
  flex-wrap: wrap;
`;

const ErrorMessage = styled.span`
  color: ${themed({ light: colors.N90, dark: colors.DN100 })};
  padding-left: 4px;
  margin-top: -4px;
  word-break: break-word;
`;

const SecondaryAction = styled.span`
  flex-basis: 100%;
  padding-left: 12px;
  margin-top: -8px;
`;

const Icon = styled.span`
  align-items: center;
  display: flex;
  > img {
    padding-left: 4px;
    padding-right: 4px;
  }
`;

const CardBody = styled.span`
  flex: 1;
  flex-wrap: wrap;
  margin-top: 4px;
  margin-bottom: 4px;
`;

const ErrorContent = styled.span`
  display: flex;
`;

export const MacroCard = ({
  macroName,
  iconUrl,
  action,
  errorMessage,
  extensionKey,
  loading,
  secondaryAction,
}: MacroCardType) => (
  <Card>
    <Icon>{macroIcon(iconUrl, extensionKey, macroName)}</Icon>
    <CardBody>
      <ContentWrapper>
        <Content>{macroName}</Content>
        {action}
      </ContentWrapper>
      {errorMessage && !loading && (
        <Error>
          <ErrorContent>
            <ErrorIcon
              primaryColor={colors.R300}
              size="medium"
              label={errorMessage}
            />
            <ErrorMessage>{errorMessage}</ErrorMessage>
          </ErrorContent>
          <SecondaryAction>{secondaryAction}</SecondaryAction>
        </Error>
      )}
    </CardBody>
  </Card>
);
