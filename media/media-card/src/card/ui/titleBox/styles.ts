import { css } from '@emotion/react';
import { token } from '@atlaskit/tokens';
import { responsiveSettings, getTitleBoxHeight, Breakpoint } from '../common';
import { N0, N800 } from '@atlaskit/theme/colors';
import { rgba } from '../styles';
import {
  TitleBoxFooterProps,
  TitleBoxHeaderProps,
  TitleBoxWrapperProps,
} from './types';

const generateResponsiveStyles = (
  breakpoint: Breakpoint = Breakpoint.SMALL,
) => {
  const setting = responsiveSettings[breakpoint];
  const verticalPadding = setting.titleBox.verticalPadding;
  const horizontalPadding = setting.titleBox.horizontalPadding;
  const height = getTitleBoxHeight(breakpoint);
  return `height: ${height}px;
    padding: ${verticalPadding}px ${horizontalPadding}px;`;
};

const HEX_REGEX = /^#[0-9A-F]{6}$/i;

export const titleBoxWrapperStyles = ({
  breakpoint,
  titleBoxBgColor,
}: TitleBoxWrapperProps) =>
  css(
    {
      position: 'absolute',
      bottom: 0,
      width: '100%',
      backgroundColor: token(
        'elevation.surface',
        rgba(
          titleBoxBgColor && HEX_REGEX.test(titleBoxBgColor)
            ? titleBoxBgColor
            : N0,
          1,
        ),
      ),
      color: token('color.text', N800),
      cursor: 'inherit',
      pointerEvents: 'none',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
    },
    generateResponsiveStyles(breakpoint),
  );

titleBoxWrapperStyles.displayName = 'TitleBoxWrapper';

const infoStyles = `white-space: nowrap;overflow: hidden;`;

const iconOverlapStyles = `padding-right: 10px;`;

export const titleBoxHeaderStyles = ({ hasIconOverlap }: TitleBoxHeaderProps) =>
  css(
    {
      fontWeight: 600,
    },
    infoStyles,
    hasIconOverlap && iconOverlapStyles,
  );

titleBoxHeaderStyles.displayName = 'FailedTitleBoxHeader';

export const titleBoxFooterStyles = ({ hasIconOverlap }: TitleBoxFooterProps) =>
  css(
    {
      textOverflow: 'ellipsis',
    },
    infoStyles,
    hasIconOverlap && iconOverlapStyles,
  );

titleBoxFooterStyles.displayName = 'TitleBoxFooter';

export const titleBoxIconStyles = css({
  position: 'absolute',
  right: token('space.050', '4px'),
  bottom: '0px',
});

export const errorMessageWrapperStyles = css({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-start',
  span: {
    verticalAlign: 'middle',
    ':nth-child(2)': {
      marginLeft: token('space.050', '4px'),
      marginRight: token('space.050', '4px'),
    },
  },
});
