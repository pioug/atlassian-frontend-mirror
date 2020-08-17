import styled from 'styled-components';
import { transition } from '../../../styles';
import { N90A } from '@atlaskit/theme/colors';

export const blanketClassName = 'media-card-blanket';

export const fixedBlanketStyles = `
  background-color: ${N90A};
`;

export const Blanket = styled.div.attrs({ className: blanketClassName })`
  ${({ isFixed }: { isFixed?: boolean }) => `
    ${transition()}
    position: absolute;
    width: 100%;
    height: 100%;
    max-height: 100%;
    max-width: 100%;
    left: 0;
    top: 0;
    ${isFixed ? fixedBlanketStyles : ''}
  `}
`;

Blanket.displayName = 'Blanket';
