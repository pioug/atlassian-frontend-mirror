import styled from 'styled-components';

import { HTMLAttributes, ComponentClass } from 'react';
import { N500, N0 } from '@atlaskit/theme/colors';
import { borderRadius, size, center } from '@atlaskit/media-ui';
import { Root } from '../../styles';

export const Wrapper: ComponentClass<HTMLAttributes<{}>> = styled(Root)`
  display: flex;
  position: relative;
  line-height: 0;
`;

export enum CardActionIconButtonVariant {
  default = 'default',
  filled = 'filled',
}

type CardActionButtonOwnProps = {
  variant?: CardActionIconButtonVariant;
};
export type CardActionButtonProps = CardActionButtonOwnProps &
  HTMLAttributes<HTMLDivElement>;

const getVariantStyles = (variant?: 'default' | 'filled'): string => {
  return variant === 'filled'
    ? `
    background: ${N0};
    margin-right: 8px;
    opacity: 0.8;

    &:last-child {
      margin-right: 0;
    }

    &:hover {
      opacity: 0.6;
    }
  `
    : `
    &:hover {
      background-color: rgba(9, 30, 66, 0.06);
    }
  `;
};

export const CardActionButton: ComponentClass<CardActionButtonProps> = styled.div`
  ${({ variant }: CardActionButtonProps) => `
    ${center} ${borderRadius} ${size(26)} color: ${N500};

    &:hover {
      cursor: pointer;
    }

    ${getVariantStyles(variant)}
  `}
`;
