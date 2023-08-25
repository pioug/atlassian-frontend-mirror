import React from 'react';

import styled from 'styled-components';

import ErrorIcon from '@atlaskit/icon/glyph/error';
import * as colors from '@atlaskit/theme/colors';
import { token } from '@atlaskit/tokens';

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
  padding-left: ${token('space.100', '8px')};
  display: flex;
  justify-content: space-between;
`;

// eslint-disable-next-line @atlaskit/design-system/ensure-design-token-usage
const Error = styled.span`
  flex-basis: 100%;
  padding-top: 10px;
  display: flex;
  flex-wrap: wrap;
`;

const ErrorMessage = styled.span`
  color: ${token('color.text.subtlest', colors.N90)};
  padding-left: ${token('space.050', '4px')};
  margin-top: calc(-1 * ${token('space.050', '4px')});
  word-break: break-word;
`;

const SecondaryAction = styled.span`
  flex-basis: 100%;
  padding-left: ${token('space.150', '12px')};
  margin-top: calc(-1 * ${token('space.100', '8px')});
`;

const Icon = styled.span`
  align-items: center;
  display: flex;
  > img {
    padding-left: ${token('space.050', '4px')};
    padding-right: ${token('space.050', '4px')};
  }
`;

const CardBody = styled.span`
  flex: 1;
  flex-wrap: wrap;
  margin-top: ${token('space.050', '4px')};
  margin-bottom: ${token('space.050', '4px')};
`;

const ErrorContent = styled.span`
  display: flex;
`;

export const MacroFallbackCard = ({
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
              primaryColor={token('color.icon.danger', colors.R300)}
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
