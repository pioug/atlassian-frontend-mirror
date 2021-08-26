import styled from 'styled-components';
import { responsiveSettings, getTitleBoxHeight } from '../common';
import { Breakpoint } from '../Breakpoint';
import { N0 } from '@atlaskit/theme/colors';
import { rgba } from '../../../styles/mixins';

export type TitleBoxWrapperProps = {
  breakpoint: Breakpoint;
  titleBoxBgColor?: string;
};

type TitleBoxFooterProps = {
  hasIconOverlap: boolean;
};

type TitleBoxHeaderProps = {
  hasIconOverlap: boolean;
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

const HEX_REGEX = /^#[0-9A-F]{6}$/i;
export const TitleBoxWrapper = styled.div`
  ${({ breakpoint, titleBoxBgColor }: TitleBoxWrapperProps) => `
    position: absolute;
    bottom: 0;
    width: 100%;
    background-color: ${rgba(
      titleBoxBgColor && HEX_REGEX.test(titleBoxBgColor) ? titleBoxBgColor : N0,
      0.8,
    )};
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

const iconOverlapStyles = `
  padding-right: 10px;
`;

export const TitleBoxHeader = styled.div`
  ${({ hasIconOverlap }: TitleBoxHeaderProps) => `
    font-weight: 600;
    ${infoStyles}
    ${hasIconOverlap && iconOverlapStyles}
  `}
`;

TitleBoxHeader.displayName = 'FailedTitleBoxHeader';

export const TitleBoxFooter = styled.div`
  ${({ hasIconOverlap }: TitleBoxFooterProps) => `
    text-overflow: ellipsis;
    ${infoStyles}
    ${hasIconOverlap && iconOverlapStyles}
  `}
`;

TitleBoxFooter.displayName = 'TitleBoxFooter';

export const TitleBoxIcon = styled.div`
  position: absolute;
  right: 4px;
  bottom: 0px;
`;

TitleBoxIcon.displayName = 'TitleBoxIcon';

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
