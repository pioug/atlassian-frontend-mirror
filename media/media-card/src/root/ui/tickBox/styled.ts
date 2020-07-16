import styled from 'styled-components';
import { transition } from '../../../styles';
import { B200, N0, N100 } from '@atlaskit/theme/colors';

export const tickBoxClassName = 'media-card-tickbox';

export const tickboxFixedStyles = `
  background-color: ${N0};
  color: ${N100};
`;

const getSelectedStyles = (selected?: boolean) =>
  selected
    ? `
      background-color: ${B200};
      color: white;
    `
    : ``;

export const Wrapper = styled.div.attrs({ className: tickBoxClassName })`
  ${({ selected }: { selected?: boolean }) => `
    ${transition()}
    font-size: 14px;
    width: 14px;
    height: 14px;
    position: absolute;
    top: 7px;
    left: 7px;
    border-radius: 20px;
    color: transparent;

    /* Enforce dimensions and position of "tick" icon */
    span {
      display: block;
      svg {
        height: 14px;
      }
    }
    ${getSelectedStyles(selected)}
  `}
`;

Wrapper.displayName = 'TickBoxWrapper';
