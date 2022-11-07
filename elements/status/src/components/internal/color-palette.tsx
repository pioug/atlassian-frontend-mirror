/** @jsx jsx */
import { gridSize } from '@atlaskit/theme/constants';
import * as colors from '@atlaskit/theme/colors';
import { token } from '@atlaskit/tokens';
import React, { useEffect, useRef, useCallback } from 'react';
import { css, jsx } from '@emotion/react';
import { Color as ColorType } from '../Status';
import Color from './color';

// color value, label, background, borderColor
const palette: [ColorType, string, string][] = [
  [
    'neutral',
    token('color.background.neutral', colors.N40),
    token('color.text', colors.N400),
  ],
  [
    'purple',
    token('color.background.discovery', colors.P50),
    token('color.text.discovery', colors.P400),
  ],
  [
    'blue',
    token('color.background.information', colors.B50),
    token('color.text.information', colors.B400),
  ],
  [
    'red',
    token('color.background.danger', colors.R50),
    token('color.text.danger', colors.R400),
  ],
  [
    'yellow',
    token('color.background.warning', colors.Y50),
    token('color.text.warning', colors.Y400),
  ],
  [
    'green',
    token('color.background.success', colors.G50),
    token('color.text.success', colors.G400),
  ],
];

const colorPaletteWrapperStyles = css`
  margin: ${gridSize()}px ${gridSize()}px 0 ${gridSize()}px;
  /* Firefox bug fix: https://product-fabric.atlassian.net/browse/ED-1789 */
  display: flex;
  flex-wrap: wrap;
`;

interface ColorPaletteProps {
  selectedColor?: ColorType;
  onClick: (value: ColorType) => void;
  onHover?: (value: ColorType) => void;
  cols?: number;
  className?: string;
}

const VK_LEFT = 37; //ArrowLeft
const VK_RIGHT = 39; //ArrowRight
const VK_UP = 38; //ArrowUp
const VK_DOWN = 40; //ArrowDown
const VK_TAB = 9;

export default ({
  cols = 7,
  onClick,
  selectedColor,
  className,
  onHover,
}: ColorPaletteProps) => {
  const colorRefs: React.MutableRefObject<HTMLButtonElement[]> = useRef([]);

  useEffect(() => {
    colorRefs.current = colorRefs.current.slice(0, palette.length);
  }, []);

  const memoizedHandleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      const colorIndex = palette.findIndex(
        ([colorValue]) => colorValue === selectedColor,
      );
      let newColorIndex = null;
      const nextColor = () =>
        colorIndex + 1 > palette.length - 1 ? 0 : colorIndex + 1;
      const previousColor = () =>
        colorIndex - 1 < 0 ? palette.length - 1 : colorIndex - 1;

      switch (e.keyCode) {
        case VK_RIGHT:
        case VK_DOWN:
          e.preventDefault();
          newColorIndex = nextColor();
          break;
        case VK_LEFT:
        case VK_UP:
          e.preventDefault();
          newColorIndex = previousColor();
          break;
        case VK_TAB:
          e.preventDefault();
          if (e.shiftKey) {
            newColorIndex = previousColor();
          } else {
            newColorIndex = nextColor();
          }
          break;
      }
      if (newColorIndex === null) {
        return;
      }
      const newColorValue = palette[newColorIndex][0];
      const newRef = colorRefs.current[newColorIndex];
      newRef?.focus();
      onClick(newColorValue);
    },
    [selectedColor, onClick, colorRefs],
  );

  return (
    /**
      We need to disable below eslint rule becuase of role "radiogroup". This role was added
      in https://a11y-internal.atlassian.net/browse/AK-832 to fix accessibility issue.
      When we migrated to emotion from styled component, we started getting this error.
      Task added in https://product-fabric.atlassian.net/wiki/spaces/E/pages/3182068181/Potential+improvements#Moderate-changes.
     */
    // eslint-disable-next-line jsx-a11y/interactive-supports-focus
    <div
      css={colorPaletteWrapperStyles}
      className={className}
      role="radiogroup"
      style={{ maxWidth: cols * 32 }}
      onKeyDown={memoizedHandleKeyDown}
    >
      {palette.map(([colorValue, backgroundColor, borderColor], i) => {
        return (
          <Color
            key={colorValue}
            value={colorValue}
            backgroundColor={backgroundColor}
            borderColor={borderColor}
            onClick={onClick}
            onHover={onHover}
            isSelected={colorValue === selectedColor}
            tabIndex={colorValue === selectedColor ? 0 : -1}
            setRef={(el) => (colorRefs.current[i] = el)}
          />
        );
      })}
    </div>
  );
};
