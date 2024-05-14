import React from 'react';

import { Box, Pressable, xcss } from '@atlaskit/primitives';
import { token } from '@atlaskit/tokens';
import VisuallyHidden from '@atlaskit/visually-hidden';

import { varDotsMargin, varDotsSize } from './constants';
import { type DotsAppearance } from './types';

// TODO Token usages are not consistent for dots https://product-fabric.atlassian.net/browse/DSP-3180
const colorMap = {
  default: xcss({
    backgroundColor: 'color.background.neutral',
  }),
  help: xcss({
    backgroundColor: 'color.background.neutral',
  }),
  inverted: xcss({
    // @ts-expect-error
    backgroundColor: token('color.icon.subtle'),
  }),
  primary: xcss({
    backgroundColor: 'color.background.neutral',
  }),
};

const selectedColorMap = {
  default: xcss({
    // @ts-expect-error
    backgroundColor: token('color.icon'),
  }),
  help: xcss({
    // @ts-expect-error
    backgroundColor: token('color.icon.discovery'),
  }),
  inverted: xcss({
    // @ts-expect-error
    backgroundColor: token('color.icon.inverse'),
  }),
  primary: xcss({
    // @ts-expect-error
    backgroundColor: token('color.icon.brand'),
  }),
};

const commonStyles = xcss({
  width: `var(${varDotsSize})`,
  height: `var(${varDotsSize})`,
  position: 'relative',
  borderRadius: 'border.radius.circle',

  '::before': {
    display: 'block',
    width: `calc(var(${varDotsSize}) + var(${varDotsMargin}))`,
    height: `calc(var(${varDotsSize}) + var(${varDotsMargin}))`,
    position: 'absolute',
    content: '""',
    insetBlockStart: `calc(-1 * var(${varDotsMargin}) / 2)`,
    insetInlineStart: `calc(-1 * var(${varDotsMargin}) / 2)`,
  },
});

const buttonStyles = xcss({
  padding: 'space.0',
  border: 0,
  cursor: 'pointer',
  outline: 0,
});

type CommonProps = {
  appearance: DotsAppearance;
  isSelected: boolean;
  testId?: string;
};

/**
 * __Presentational indicator__
 *
 * A presentational indicator with no interactivity
 */
export const PresentationalIndicator = ({
  appearance,
  isSelected,
  testId,
}: CommonProps) => (
  <Box
    testId={testId}
    xcss={[
      commonStyles,
      appearance === 'default' && !isSelected && colorMap['default'],
      appearance === 'help' && !isSelected && colorMap['help'],
      appearance === 'inverted' && !isSelected && colorMap['inverted'],
      appearance === 'primary' && !isSelected && colorMap['primary'],
      appearance === 'default' && isSelected && selectedColorMap['default'],
      appearance === 'help' && isSelected && selectedColorMap['help'],
      appearance === 'inverted' && isSelected && selectedColorMap['inverted'],
      appearance === 'primary' && isSelected && selectedColorMap['primary'],
    ]}
  />
);

type ButtonIndicatorProps = {
  panelId: string;
  tabId: string;
  onClick(e: React.MouseEvent<HTMLButtonElement>): void;
} & CommonProps;

/**
 * __Button indicator__
 *
 * An interactive indicator.
 */
export const ButtonIndicator = ({
  appearance,
  panelId,
  tabId,
  isSelected,
  onClick,
  testId,
}: ButtonIndicatorProps) => {
  return (
    <Pressable
      role="tab"
      xcss={[
        commonStyles,
        buttonStyles,
        appearance === 'default' && !isSelected && colorMap['default'],
        appearance === 'help' && !isSelected && colorMap['help'],
        appearance === 'inverted' && !isSelected && colorMap['inverted'],
        appearance === 'primary' && !isSelected && colorMap['primary'],
        appearance === 'default' && isSelected && selectedColorMap['default'],
        appearance === 'help' && isSelected && selectedColorMap['help'],
        appearance === 'inverted' && isSelected && selectedColorMap['inverted'],
        appearance === 'primary' && isSelected && selectedColorMap['primary'],
      ]}
      aria-controls={panelId}
      aria-selected={isSelected}
      id={tabId}
      onClick={onClick}
      tabIndex={isSelected ? -1 : undefined}
      testId={testId}
    >
      <VisuallyHidden>{tabId}</VisuallyHidden>
    </Pressable>
  );
};
