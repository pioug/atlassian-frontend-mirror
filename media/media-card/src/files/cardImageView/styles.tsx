import { css } from '@emotion/react';
import { absolute, borderRadius, size } from '@atlaskit/media-ui';
import { GlobalThemeTokens, themed } from '@atlaskit/theme/components';
import { N20, DN50, N0 } from '@atlaskit/theme/colors';
import { rootStyles, cardShadow } from '../../styles';
import { getSelectedBorderStyle } from '../../styles/getSelectedBorderStyle';
import { CardStatus } from '../../index';

export interface WrapperProps {
  disableOverlay?: boolean;
  selectable?: boolean;
  selected?: boolean;
  hasOnClick?: boolean;
  mediaType?: string;
  mediaName?: string;
  progress?: number;
  status?: CardStatus;
  theme?: GlobalThemeTokens;
  children?: JSX.Element | JSX.Element[];
}

const getShadowAttribute = (props: WrapperProps) => {
  const { disableOverlay } = props;
  return disableOverlay ? '' : cardShadow;
};

const getBackgroundColor = (props: WrapperProps) => {
  const { mediaType } = props;
  return `background: ${
    mediaType === 'image'
      ? 'transparent'
      : themed({ light: N20, dark: DN50 })(props)
  };`;
};

export const wrapperStyles = (props: WrapperProps) => css`
  ${rootStyles()}
  ${getShadowAttribute(props)}
  ${borderRadius}
  ${getBackgroundColor(
    props,
  )}

  line-height: normal;
  position: relative;

  ${getSelectedBorderStyle(props)}

  ${size()} .wrapper {
    ${borderRadius};
    display: block;
    height: inherit;
    position: relative;

    .img-wrapper {
      position: relative;
      width: inherit;
      height: inherit;
      overflow: hidden;
      display: block;
      ${borderRadius}
    }
  }
`;

export const playIconWrapperStyles = css`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;

  /* we want to override default icon size and hover state */
  &:hover > * {
    width: 64px;
    height: 64px;
  }
`;

export const playIconBackgroundStyles = css`
  background: rgba(23, 43, 77, 0.7);
  border-radius: 100%;
  padding: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition-property: width, height;
  transition-duration: 0.1s;
  width: 56px;
  height: 56px;
`;

const bodyHeight = 26;

export const progressBarWrapperStyles = css`
  position: absolute;
  height: 100%;
  width: 100%;
`;

export const overlayStyles = css`
  ${absolute()}
  ${size()}
  border-radius: inherit;
  background-color: rgba(9, 30, 66, 0.5);
`;

export const titleStyles = css`
  ${absolute()} width: 100%;
  padding: 8px;
  color: ${N0};
  font-size: 12px;
  line-height: 18px;
  word-wrap: break-word;
`;

export const bodyStyles = css`
  display: flex;
  position: absolute;
  bottom: 0;
  width: 100%;
  padding: 8px;
  color: ${N0};
`;

export const progressWrapperStyles = css`
  flex-grow: 1;

  /*
    force the height to always be 20px (the height of the cancel icon),
    so that the height of the progress bar doesn't jump when cards with
    and without a cancel icon are rendered side-by-side.
  */
  height: ${bodyHeight}px;

  /*
    vertically center the progress bar within the 20px, keeping the progress bar full width
  */
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

export const cardActionsWrapperStyles = css`
  margin-left: 4px;
  /*
    button must appear above overlay
   */
  z-index: 2;
`;
