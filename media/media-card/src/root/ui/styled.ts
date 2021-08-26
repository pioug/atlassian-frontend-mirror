import styled from 'styled-components';
import { CardDimensions, CardAppearance } from '../..';
import { getCSSUnitValue } from '../../utils/getCSSUnitValue';
import { getDefaultCardDimensions } from '../../utils/cardDimensions';
import { hideNativeBrowserTextSelectionStyles } from '@atlaskit/editor-shared-styles/selection';
import { tickBoxClassName, tickboxFixedStyles } from './tickBox/styled';
import { fixedActionBarStyles, actionsBarClassName } from './actionsBar/styled';
import {
  fixedPlayButtonStyles,
  playButtonClassName,
} from './playButton/styled';
import {
  SSRFileExperienceWrapper,
  BaseNewFileExperienceWrapperProps,
} from './styledSSR';

const getWrapperDimensions = (
  dimensions?: CardDimensions,
  appearance?: CardAppearance,
) => {
  const { width, height } = dimensions || {};
  const {
    width: defaultWidth,
    height: defaultHeight,
  } = getDefaultCardDimensions(appearance);
  return `
    width: ${getCSSUnitValue(width || defaultWidth)};
    max-width: 100%;
    height: ${getCSSUnitValue(height || defaultHeight)};
    max-height: 100%;
  `;
};

const getClickablePlayButtonStyles = (isPlayButtonClickable: boolean) => {
  if (!isPlayButtonClickable) {
    return '';
  }
  return `
    &:hover .${playButtonClassName} {
      ${fixedPlayButtonStyles}
    }
  `;
};

const getSelectableTickBoxStyles = (isTickBoxSelectable: boolean) => {
  if (!isTickBoxSelectable) {
    return '';
  }
  return `
    &:hover .${tickBoxClassName} {
      ${tickboxFixedStyles}
    }
  `;
};
export interface NewFileExperienceWrapperProps
  extends BaseNewFileExperienceWrapperProps {
  shouldUsePointerCursor: boolean;
  disableOverlay: boolean;
  displayBackground: boolean;
  selected: boolean;
  isPlayButtonClickable: boolean;
  isTickBoxSelectable: boolean;
  shouldDisplayTooltip: boolean;
}

export const NewFileExperienceWrapper = styled(SSRFileExperienceWrapper)`
  ${({
    dimensions,
    appearance,
    isPlayButtonClickable,
    isTickBoxSelectable,
    shouldDisplayTooltip,
  }: NewFileExperienceWrapperProps) => `
    ${hideNativeBrowserTextSelectionStyles}

    /* We use classnames from here exceptionally to be able to handle styles when the Card is on hover */
    ${getClickablePlayButtonStyles(isPlayButtonClickable)}
    ${getSelectableTickBoxStyles(isTickBoxSelectable)}

    &:hover .${actionsBarClassName} {
      ${fixedActionBarStyles}
    }

    /* Tooltip does not support percentage dimensions. We enforce them here */
    ${
      shouldDisplayTooltip
        ? `> div { ${getWrapperDimensions(dimensions, appearance)} }`
        : ''
    }
`}
`;

NewFileExperienceWrapper.displayName = 'NewFileExperienceWrapper';
