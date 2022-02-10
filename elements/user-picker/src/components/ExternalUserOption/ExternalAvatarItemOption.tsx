import React, { ReactNode } from 'react';
import styled from 'styled-components';
import { B400 } from '@atlaskit/theme/colors';
import { token } from '@atlaskit/tokens';

const OuterWrapper = styled.div`
  align-items: center;
  box-sizing: border-box;
  display: flex;
  line-height: 1;
  outline: none;
  margin: 0;
  width: 100%;
  cursor: pointer;
`;

const DetailsWrapper = styled.div`
  display: flex;
  max-width: 100%;
  min-width: 0;
  flex: 1 1 100%;
  line-height: 1.4;
  padding-left: 8px;
  align-items: center;
`;

const TextSection = styled.div`
  width: calc(100% - 32px);
  flex: auto;
`;

const Text = styled.div<{ secondary?: boolean }>`
  display: flex;
  max-width: 100%;
  margin: 0;
  color: ${token('color.text.selected', B400)};
  ${({ secondary }) =>
    secondary &&
    `color: ${token('color.text.selected', B400)}; font-size: 0.85em;`}
  white-space: nowrap;

  > span {
    max-width: inherit;
  }
`;

export type ExternalAvatarItemOptionProps = {
  avatar: ReactNode;
  primaryText: ReactNode;
  secondaryText?: ReactNode;
  sourcesInfoTooltip?: ReactNode;
};

export const ExternalAvatarItemOption = ({
  avatar,
  primaryText,
  secondaryText,
  sourcesInfoTooltip,
}: ExternalAvatarItemOptionProps) => (
  <OuterWrapper>
    {avatar}
    <DetailsWrapper>
      <TextSection>
        <div>
          <Text>{primaryText}</Text>
        </div>
        {secondaryText && (
          <div>
            <Text secondary>{secondaryText}</Text>
          </div>
        )}
      </TextSection>
      <div>{sourcesInfoTooltip}</div>
    </DetailsWrapper>
  </OuterWrapper>
);
