import styled from 'styled-components';
import { getTitleBoxHeight } from '../common';
import { Breakpoint } from '../Breakpoint';

export function titleBoxHeight(hasTitleBox: boolean, breakpoint: Breakpoint) {
  // there is no titlebox
  if (!hasTitleBox) {
    return `0px`;
  }

  // calculate height of the titlebox
  const marginBottom = getTitleBoxHeight(breakpoint);

  return `${marginBottom}px`;
}

export type IconWrapperProps = {
  hasTitleBox: boolean;
  breakpoint: Breakpoint;
};

export const IconWrapper = styled.div`
  ${({ hasTitleBox, breakpoint }: IconWrapperProps) => `
    position: absolute;
    width: 100%;
    height: calc(100% - ${titleBoxHeight(hasTitleBox, breakpoint)});
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
`}
`;
IconWrapper.displayName = 'MediaIconWrapper';
