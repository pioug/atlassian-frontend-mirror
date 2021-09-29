/** @jsx jsx */
import styled from '@emotion/styled';
import { gridSize } from '@atlaskit/theme/constants';
import { h400 } from '@atlaskit/theme/typography';
import * as colors from '@atlaskit/theme/colors';

type WhatsNewResultListItemWrapperProps = {
  styles: any;
};

export const WhatsNewResultListItemWrapper = styled.a<
  WhatsNewResultListItemWrapperProps
>(
  {
    position: `relative`,
    boxSizing: `border-box`,
    padding: `${gridSize()}px`,
    display: `block`,
    textDecoration: `none`,
    cursor: `pointer`,
    color: `${colors.N200}`,
    borderRadius: `3px`,

    '&:hover, &:focus, &:visited, &:active': {
      textDecoration: `none`,
      outline: `none`,
      outlineOffset: `none`,
    },

    '&:focus': {
      boxShadow: `${colors.B100} 0px 0px 0px 2px inset`,
    },

    '&:hover': {
      backgroundColor: `${colors.N30}`,
    },

    '&:active': {
      backgroundColor: `${colors.B50}`,
    },
  },
  (props: any) => props.styles,
);

export const WhatsNewResultListItemTitleContainer = styled.div`
  width: 100%;
  white-space: nowrap;
  margin-bottom: ${gridSize() / 2}px;
`;

export const WhatsNewResultListItemTitleText = styled.span`
  ${h400()}
  display: inline-block;
  vertical-align: middle;
  margin: 0;
  padding-left: ${gridSize() / 2}px;
  white-space: normal;
  overflow-x: hidden;
`;

export const WhatsNewResultListItemDescription = styled.p`
  display: block;
  line-height: ${gridSize() * 2.5}px;
  color: ${colors.N400};
  margin: 0;
`;
