/** @jsx jsx */
import React from 'react';
import { css, jsx } from '@emotion/core';
import { Example } from '@atlaskit/docs';
import { token } from '@atlaskit/tokens';

const backColor = token('color.background.neutral.subtle', '#FFFFFF');
const frontColor = token(
  'color.background.neutral.subtle.hovered',
  '#091E420F',
);
const backgroundStyles = css`
  .AKExampleShowcase {
    background-color: ${backColor};
    opacity: 1;
    background-image: repeating-linear-gradient(
        45deg,
        ${frontColor} 25%,
        transparent 25%,
        transparent 75%,
        ${frontColor} 75%,
        ${frontColor}
      ),
      repeating-linear-gradient(
        45deg,
        ${frontColor} 25%,
        ${backColor} 25%,
        ${backColor} 75%,
        ${frontColor} 75%,
        ${frontColor}
      );
    background-position: 0 0, 6px 6px;
    background-size: 12px 12px;
  }
`;

const toggleStyles = css`
  .AKExampleWrapper {
    padding-top: 23px;
  }
  .AKExampleToggle {
    display: none;
  }
`;

const getStyles = (sourceVisible: boolean, background: boolean) => css`
  ${background ? backgroundStyles : undefined}
  ${sourceVisible === false ? toggleStyles : undefined}
`;

type FlexibleUiExampleProps = {
  background?: boolean;
} & typeof Example;

const CustomExample: React.FC<FlexibleUiExampleProps> = ({
  background,
  sourceVisible,
  ...props
}) => (
  <div css={getStyles(sourceVisible, background)}>
    <Example
      packageName="@atlaskit/smart-card"
      sourceVisible={sourceVisible}
      {...props}
    />
  </div>
);

export default CustomExample;
