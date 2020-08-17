/** @jsx jsx */

/* eslint-disable no-mixed-operators */
import { CSSProperties, forwardRef, useMemo } from 'react';

import { css, jsx } from '@emotion/core';

import { fontFamily } from '@atlaskit/theme/constants';
import { e200 } from '@atlaskit/theme/elevation';

import { ThemeTokens, ThemeTokensTrack } from './theme';

const sliderThumbSize = 16;
const sliderThumbBorderThickness = 2;
const sliderLineThickness = 4;
const transitionDuration = '0.2s';
const sliderBorderRadius = sliderLineThickness / 2;
export const overallHeight = 40;

interface CustomInputProps extends ThemeTokens {
  ref: React.Ref<HTMLInputElement>;
  valuePercent: string;
}

type InputProps = React.InputHTMLAttributes<HTMLInputElement> &
  CustomInputProps;

const getBackgroundGradient = ({ lower, upper }: ThemeTokensTrack) =>
  `
    background: linear-gradient(${lower}, ${lower}) 0 / var(--range-inline-width) 100%
      no-repeat ${upper};
    [dir='rtl'] & {
      background-position: right;
    }
  `;

// Thumb style
const sliderThumbStyle = ({ thumb }: ThemeTokens) => {
  return `
    background: ${thumb.default.background};
    border: ${sliderThumbBorderThickness}px solid transparent;
    border-radius: 50%;
    height: ${sliderThumbSize}px;
    width: ${sliderThumbSize}px;
    box-sizing: border-box;
    transition: border-color ${transitionDuration} ease-in-out;
    ${e200()};
  `;
};

// Track styles
const sliderTrackStyle = `
  border-radius: ${sliderBorderRadius}px;
  border: 0;
  cursor: pointer;
  height: ${sliderLineThickness}px;
  width: 100%;
  transition: background-color ${transitionDuration} ease-in-out;
`;

// Range input styles
const chromeRangeInputStyle = (tokens: ThemeTokens) => {
  return `
  &::-webkit-slider-thumb {
    -webkit-appearance: none;
    margin-top: -${(sliderThumbSize - sliderLineThickness) / 2}px;
    ${sliderThumbStyle(tokens)};
  }

  &:focus::-webkit-slider-thumb {
    border-color: ${tokens.thumb.focus.border};
  }

  &:disabled::-webkit-slider-thumb {
    cursor: not-allowed;
    box-shadow: 0 0 1px ${tokens.thumb.disabled.boxShadow};
  }

  &::-webkit-slider-runnable-track {
    ${sliderTrackStyle};
    ${getBackgroundGradient(tokens.track.default)};
  }

  &:focus::-webkit-slider-runnable-track {
    ${getBackgroundGradient(tokens.track.default)};
  }

  &:active::-webkit-slider-runnable-track,
  &:hover::-webkit-slider-runnable-track {
    ${getBackgroundGradient(tokens.track.hover)};
  }

  &:disabled::-webkit-slider-runnable-track {
    ${getBackgroundGradient(tokens.track.disabled)}
    cursor: not-allowed;
  }
  `;
};

const firefoxRangeInputStyle = (tokens: ThemeTokens) => {
  return `
  &::-moz-focus-outer {
    border: 0;
  }

  &::-moz-range-thumb {
    ${sliderThumbStyle(tokens)};
  }

  &:focus::-moz-range-thumb {
    border-color: ${tokens.thumb.focus.border};
  }

  &:disabled::-moz-range-thumb {
    cursor: not-allowed;
    box-shadow: 0 0 1px ${tokens.thumb.disabled.boxShadow};
  }

  &::-moz-range-progress {
    ${sliderTrackStyle};
    background: ${tokens.track.default.lower};
  }

  &::-moz-range-track {
    ${sliderTrackStyle};
    background: ${tokens.track.default.upper};
  }

  &:active::-moz-range-progress,
  &:hover::-moz-range-progress {
    background: ${tokens.track.hover.lower};
  }

  &:active::-moz-range-track,
  &:hover::-moz-range-track {
    background: ${tokens.track.hover.upper};
  }

  &:disabled::-moz-range-progress {
    background: ${tokens.track.disabled.lower};
    cursor: not-allowed;
  }

  &:disabled::-moz-range-track {
    background: ${tokens.track.disabled.upper};
    cursor: not-allowed;
  }
`;
};

const IERangeInputStyle = (tokens: ThemeTokens) => {
  return `
  &::-ms-thumb {
    margin-top: 0;
    ${sliderThumbStyle(tokens)};
  }

  &:focus::-ms-thumb {
    border-color: ${tokens.thumb.focus.border};
  }

  &:disabled::-ms-thumb {
    cursor: not-allowed;
    box-shadow: 0 0 1px ${tokens.thumb.disabled.boxShadow};
  }

  &::-ms-track {
    background: transparent;
    border-color: transparent;
    color: transparent;
    cursor: pointer;
    height: ${sliderLineThickness}px;
    transition: background-color ${transitionDuration} ease-in-out;
    width: 100%;
  }

  &::-ms-fill-lower {
    background: ${tokens.track.default.lower};
    border-radius: ${sliderBorderRadius}px;
    border: 0;
  }

  &::-ms-fill-upper {
    background: ${tokens.track.default.upper};
    border-radius: ${sliderBorderRadius}px;
    border: 0;
  }

  &:active::-ms-fill-lower,
  &:hover::-ms-fill-lower {
    background: ${tokens.track.hover.lower};
  }

  &:active::-ms-fill-upper,
  &:hover::-ms-fill-upper {
    background: ${tokens.track.hover.upper};
  }

  &:disabled::-ms-fill-lower {
    background: ${tokens.track.disabled.lower};
    cursor: not-allowed;
  }

  &:disabled::-ms-fill-upper {
    background: ${tokens.track.disabled.upper};
    cursor: not-allowed;
  }
`;
};

// Styles are split per browser as they are implemented differently
// Cannot consolidate as Chrome & Firefox don't recognise styles if they are grouped
// with CSS selectors they don't recognise, e.g. &::-ms-thumb
export const rangeInputStyle = (tokens: ThemeTokens) => {
  return css`
    -webkit-appearance: none; /* Hides the slider so that custom slider can be made */
    background: transparent; /* Otherwise white in Chrome */
    height: ${overallHeight}px; /* Otherwise thumb will collide with previous box element */
    padding: 0; /* IE11 includes padding, this normalises it */
    width: 100%; /* Specific width is required for Firefox. */

    &:focus {
      outline: none;
    }

    &:disabled {
      cursor: not-allowed;
    }

    ${chromeRangeInputStyle(tokens)}
    ${firefoxRangeInputStyle(tokens)}
    ${IERangeInputStyle(tokens)};

    font-family: ${fontFamily()};

    background-position: right;
  `;
};

export const Input = forwardRef(
  (props: InputProps, ref: React.Ref<HTMLInputElement>) => {
    const { valuePercent, thumb, track, style, ...strippedProps } = props;

    // Note: emotion will cache unique outputs as their own this
    // We are memoizing the creation of this string
    const styles = useMemo(() => rangeInputStyle({ track, thumb }), [
      thumb,
      track,
    ]);

    // We are creating a css variable to control the "progress" portion of the range input
    // This avoids us needing to create a new css class for each new percentage value
    return (
      <input
        {...strippedProps}
        style={{ '--range-inline-width': `${valuePercent}%` } as CSSProperties}
        ref={ref}
        css={styles}
      />
    );
  },
);

Input.displayName = 'InputRange';
