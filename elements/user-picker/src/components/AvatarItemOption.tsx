import React, { ReactNode } from 'react';
import styled from 'styled-components';
import { B400 } from '@atlaskit/theme/colors';
import Lozenge from '@atlaskit/lozenge';
import Tooltip from '@atlaskit/tooltip';
import { LozengeProps } from '../types';

const Wrapper = styled.span`
  align-items: center;
  box-sizing: border-box;
  display: flex;
  line-height: 1;
  outline: none;
  margin: 0;
  width: 100%;
  cursor: pointer;
`;

const Text = styled.span<{ secondary?: boolean }>`
  margin: 0;
  color: ${B400};
  overflow-x: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  ${({ secondary }) => secondary && `color: ${B400}; font-size: 0.85em;`}
`;

const AdditionalInfo = styled.span<{ withTooltip?: boolean }>`
  float: right;
  ${({ withTooltip }) => withTooltip && ` padding-top: 5px;`}
`;

export const TextWrapper = styled.span`
  color: ${({ color }) => color};
  overflow: hidden;
  text-overflow: ellipsis;
  display: inline-block;
`;

export type AvatarItemOptionProps = {
  avatar: ReactNode;
  primaryText?: ReactNode;
  secondaryText?: ReactNode;
  lozenge?: LozengeProps;
  sourcesInfoTooltip?: ReactNode;
};

export const AvatarItemOption = ({
  avatar,
  primaryText,
  secondaryText,
  lozenge,
  sourcesInfoTooltip,
}: AvatarItemOptionProps) => (
  <Wrapper>
    {avatar}
    <div
      style={{
        maxWidth: '100%',
        minWidth: 0,
        flex: '1 1 100%',
        lineHeight: '1.4',
        paddingLeft: '8px',
      }}
    >
      <div>
        <Text>{primaryText}</Text>
        <AdditionalInfo withTooltip={Boolean(sourcesInfoTooltip)}>
          {!sourcesInfoTooltip &&
            lozenge &&
            lozenge.text &&
            (lozenge.tooltip ? (
              // Note that entire Lozenge must be wrapped in the Tooltip (rather than just the
              // Lozenge text) or tooltip won't work
              <Tooltip content={lozenge.tooltip}>
                <Lozenge {...lozenge}>{lozenge.text}</Lozenge>
              </Tooltip>
            ) : (
              <Lozenge {...lozenge}>{lozenge.text}</Lozenge>
            ))}
          {sourcesInfoTooltip}
        </AdditionalInfo>
      </div>
      <div>
        <Text secondary>{secondaryText}</Text>
      </div>
    </div>
  </Wrapper>
);
