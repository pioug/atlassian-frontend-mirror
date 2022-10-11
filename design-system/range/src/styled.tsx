/** @jsx jsx */

import { CSSProperties, forwardRef } from 'react';

import { css, jsx } from '@emotion/react';

import * as theme from './theme';

type InputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  ref: React.Ref<HTMLInputElement>;
  valuePercent: string;
};

const VAR_THUMB_BORDER_COLOR = '--thumb-border';
const VAR_THUMB_SHADOW = '--thumb-shadow';
const VAR_TRACK_BACKGROUND_COLOR = '--track-bg';
const VAR_TRACK_FOREGROUND_COLOR = '--track-fg';
const VAR_TRACK_FOREGROUND_WIDTH = '--track-fg-width';

const sliderThumbStyles = {
  boxSizing: 'border-box',
  width: theme.thumb.size,
  height: theme.thumb.size,
  background: theme.thumb.background,
  border: `${theme.thumb.borderWidth}px solid var(${VAR_THUMB_BORDER_COLOR})`,
  borderRadius: '50%',
  boxShadow: `var(${VAR_THUMB_SHADOW})`,
  cursor: 'pointer', // Different implicit behavior across browsers -> making it explicit
  transition: `border-color ${theme.transitionDuration} ease-in-out`,
} as const;

const sliderTrackStyles = {
  borderRadius: theme.track.borderRadius,
  border: 0,
  cursor: 'pointer',
  height: theme.track.height,
  width: '100%',
  transition: `background-color ${theme.transitionDuration} ease-in-out`,
} as const;

// Styles are split per browser as they are implemented differently
// Cannot consolidate as Chrome & Firefox don't recognise styles if they are grouped
// with CSS selectors they don't recognise, e.g. &::-ms-thumb
const browserStyles = {
  webkit: css({
    WebkitAppearance: 'none', // Hides the slider so that custom slider can be made
    '::-webkit-slider-thumb': {
      ...sliderThumbStyles,
      marginTop: -(theme.thumb.size - theme.track.height) / 2,
      WebkitAppearance: 'none',
    },
    '::-webkit-slider-runnable-track': {
      ...sliderTrackStyles,
      /**
       * Webkit does not have separate properties for the background/foreground like firefox.
       * Instead we use background layering:
       * - The gray background is a simple background color.
       * - The blue foreground is a 'gradient' (to create a color block) that is sized to the progress.
       *
       * Individual properties have been used over the `background` shorthand for readability.
       */
      backgroundColor: `var(${VAR_TRACK_BACKGROUND_COLOR})`,
      backgroundImage: `linear-gradient(var(${VAR_TRACK_FOREGROUND_COLOR}), var(${VAR_TRACK_FOREGROUND_COLOR}))`,
      backgroundRepeat: 'no-repeat',
      backgroundSize: `var(${VAR_TRACK_FOREGROUND_WIDTH}) 100%`,
      // eslint-disable-next-line @repo/internal/styles/no-nested-styles
      '[dir="rtl"] &': {
        backgroundPosition: 'right',
      },
    },
    ':disabled': {
      '::-webkit-slider-thumb, ::-webkit-slider-runnable-track': {
        cursor: 'not-allowed',
      },
    },
  }),
  firefox: css({
    '::-moz-range-thumb': sliderThumbStyles,
    '::-moz-focus-outer': {
      border: 0,
    },
    '::-moz-range-progress': {
      ...sliderTrackStyles,
      background: `var(${VAR_TRACK_FOREGROUND_COLOR})`,
    },
    '::-moz-range-track': {
      ...sliderTrackStyles,
      background: `var(${VAR_TRACK_BACKGROUND_COLOR})`,
    },
    ':disabled': {
      '::-moz-range-thumb, ::-moz-range-progress, ::-moz-range-track': {
        cursor: 'not-allowed',
      },
    },
  }),
};

const baseStyles = css({
  width: '100%', // Has a fixed width by default
  height: theme.input.height, // Otherwise thumb will collide with previous box element
  background: 'transparent', // Otherwise white
  ':focus': {
    outline: 'none',
  },
  ':disabled': {
    cursor: 'not-allowed',
  },
});

const themeStyles = css({
  [VAR_THUMB_BORDER_COLOR]: theme.thumb.borderColor.default,
  [VAR_THUMB_SHADOW]: theme.thumb.boxShadow.default,
  [VAR_TRACK_BACKGROUND_COLOR]: theme.track.background.default,
  [VAR_TRACK_FOREGROUND_COLOR]: theme.track.foreground.default,
  ':active, :hover': {
    [VAR_TRACK_BACKGROUND_COLOR]: theme.track.background.hovered,
    [VAR_TRACK_FOREGROUND_COLOR]: theme.track.foreground.hovered,
  },
  ':focus': {
    [VAR_THUMB_BORDER_COLOR]: theme.thumb.borderColor.focused,
  },
  ':disabled': {
    [VAR_THUMB_SHADOW]: theme.thumb.boxShadow.disabled,
    [VAR_TRACK_BACKGROUND_COLOR]: theme.track.background.disabled,
    [VAR_TRACK_FOREGROUND_COLOR]: theme.track.foreground.disabled,
  },
});

/**
 * __Input__
 * Internal-only styled input component.
 */
export const Input = forwardRef(
  (props: InputProps, ref: React.Ref<HTMLInputElement>) => {
    const { valuePercent, style, ...strippedProps } = props;

    return (
      <input
        {...strippedProps}
        style={
          {
            // We are creating a css variable to control the "progress" portion of the range input
            // This avoids us needing to create a new css class for each new percentage value
            [VAR_TRACK_FOREGROUND_WIDTH]: `${valuePercent}%`,
          } as CSSProperties
        }
        ref={ref}
        css={[
          baseStyles,
          browserStyles.webkit,
          browserStyles.firefox,
          themeStyles,
        ]}
      />
    );
  },
);

Input.displayName = 'InputRange';
