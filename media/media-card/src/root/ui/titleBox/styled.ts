import styled from 'styled-components';
import { responsiveSettings, getTitleBoxHeight, Breakpoint } from '../common';
import { N0 } from '@atlaskit/theme/colors';
import { rgba } from '../../../styles/mixins';

export type TitleBoxWrapperProps = {
  breakpoint: Breakpoint;
};

const generateResponsiveStyles = (
  breakpoint: Breakpoint = Breakpoint.SMALL,
) => {
  const setting = responsiveSettings[breakpoint];
  const verticalPadding = setting.titleBox.verticalPadding;
  const horizontalPadding = setting.titleBox.horizontalPadding;
  const height = getTitleBoxHeight(breakpoint);
  return `
    height: ${height}px;
    padding: ${verticalPadding}px ${horizontalPadding}px;
  `;
};

export const TitleBoxWrapper = styled.div`
  ${({ breakpoint }: TitleBoxWrapperProps) => `
    position: absolute;
    bottom: 0;
    width: 100%;
    background-color: ${rgba(N0, 0.8)};
    color: inherit;
    display: flex;
    flex-direction: column;
    justify-content: center;
    ${generateResponsiveStyles(breakpoint)}
  `}
`;

TitleBoxWrapper.displayName = 'TitleBoxWrapper';

const infoStyles = `
  white-space: nowrap;
  overflow: hidden;
`;

export const TitleBoxHeader = styled.div`
  font-weight: 600;
  ${infoStyles}
`;

TitleBoxHeader.displayName = 'FailedTitleBoxHeader';

export const TitleBoxFooter = styled.div`
  ${infoStyles}
`;

TitleBoxFooter.displayName = 'TitleBoxFooter';

export const ErrorMessageWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  span {
    vertical-align: middle;
    :nth-child(2) {
      margin-left: 4px;
      margin-right: 4px;
    }
  }
`;
