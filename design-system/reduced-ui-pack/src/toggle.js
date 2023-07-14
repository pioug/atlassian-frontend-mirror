// AFP-2532 TODO: Fix automatic suppressions below
// eslint-disable-next-line @atlassian/tangerine/import/entry-points
import { colors, gridSize } from '@atlaskit/theme';
import dataUri from './utils/data-uri';
import evaluateInner from './utils/evaluate-inner';

const borderWidth = 2;
const toggleTransition = 0.2;
const toggleBgCheckedDisabled = '#35b885';
const toggleSlideCheckedDisabled = '#a1dcc4';

const toggleBgUncheckedDisabled = '#f3f4f5';
const toggleSlideUncheckedDisabled = '#afb6c2';
const togglePadding = gridSize() / 4;

const toggleHeightLarge = gridSize() * 2.5;
const toggleWidthLarge = gridSize() * 5;

const toggleHeightDefault = gridSize() * 2;
const toggleWidthDefault = gridSize() * 4;

export default evaluateInner`
  .ak-field-toggle {
    display: inline-block;
    overflow: hidden;
    position: relative;
    user-select: none;
  }
  .ak-field-toggle > label {
    background-clip: content-box;
    background-color: ${colors.N80};
    background-image: ${dataUri(
      'internal/toggle/check-enabled.svg',
    )}, ${dataUri('internal/toggle/cross-enabled.svg')};
    background-repeat: no-repeat;
    border: ${borderWidth}px solid transparent;
    color: transparent;
    cursor: pointer;
    display: inline-block;
    overflow: hidden;
    padding: ${gridSize() / 4}px;
    text-indent: -9999px;
    transition: background-color ${toggleTransition}s, border-color ${toggleTransition}s;
    vertical-align: top;
    white-space: nowrap;
  }
  .ak-field-toggle > label::before {
    background: white;
    content: '';
    cursor: pointer;
    display: block;
    transition: transform ${toggleTransition}s;
  }
  .ak-field-toggle > input {
    left: 0;
    opacity: 0;
    position: absolute;
    top: 0;
  }
  .ak-field-toggle > input:checked + label {
    background-color: ${colors.G300};
  }
  .ak-field-toggle > input:disabled + label {
    background-color: ${toggleBgUncheckedDisabled};
    background-image: ${dataUri(
      'internal/toggle/check-disabled.svg',
    )}, ${dataUri('internal/toggle/cross-disabled.svg')};
    cursor: not-allowed;
  }
  .ak-field-toggle > input:disabled + label::before {
    background-color: ${toggleSlideUncheckedDisabled};
    cursor: not-allowed;
  }
  .ak-field-toggle > input:checked:disabled + label {
    background-color: ${toggleBgCheckedDisabled};
  }
  .ak-field-toggle > input:checked:disabled + label::before {
    background-color: ${toggleSlideCheckedDisabled};
  }
  .ak-field-toggle > input:focus {
    outline: none;
  }
  .ak-field-toggle > input:focus + label {
    border-color: ${colors.B100};
  }
  .ak-field-toggle__size-large > label {
    background-position: ${togglePadding * 2.5}px ${togglePadding * 2}px, ${
  toggleWidthLarge - (toggleHeightLarge - togglePadding * 2) - togglePadding / 2
}px ${togglePadding * 2}px;
    background-size: ${toggleHeightLarge - togglePadding * 2}px ${
  toggleHeightLarge - togglePadding * 2
}px, ${toggleHeightLarge - togglePadding * 2}px ${
  toggleHeightLarge - togglePadding * 2
}px;
    border-radius: ${toggleHeightLarge}px;
    height: ${toggleHeightLarge}px;
    width: ${toggleWidthLarge}px;
  }
  .ak-field-toggle__size-large > label::before {
    background: white;
    border-radius: ${toggleHeightLarge - togglePadding * 2}px;
    content: '';
    display: block;
    height: ${toggleHeightLarge - togglePadding * 2}px;
    margin-left: ${togglePadding}px;
    margin-top: ${togglePadding}px;
    width: ${toggleHeightLarge - togglePadding * 2}px;
  }
  .ak-field-toggle__size-large > input:checked + label::before {
    transform: translate(${
      toggleWidthLarge -
      (toggleHeightLarge - togglePadding * 2) -
      togglePadding * 2
    }px, 0);
  }
  .ak-field-toggle__size-default > label {
    background-position: ${togglePadding * 2.5}px ${togglePadding * 2}px, ${
  toggleWidthDefault -
  (toggleHeightDefault - togglePadding * 2) -
  togglePadding / 2
}px ${togglePadding * 2}px;
    background-size: ${toggleHeightDefault - togglePadding * 2}px ${
  toggleHeightDefault - togglePadding * 2
}px, ${toggleHeightDefault - togglePadding * 2}px ${
  toggleHeightDefault - togglePadding * 2
}px;
    border-radius: ${toggleHeightDefault}px;
    height: ${toggleHeightDefault}px;
    width: ${toggleWidthDefault}px;
  }
  .ak-field-toggle__size-default > label::before {
    background: white;
    border-radius: ${toggleHeightDefault - togglePadding * 2}px;
    content: '';
    display: block;
    height: ${toggleHeightDefault - togglePadding * 2}px;
    margin-left: ${togglePadding}px;
    margin-top: ${togglePadding}px;
    width: ${toggleHeightDefault - togglePadding * 2}px;
  }
  .ak-field-toggle__size-default > input:checked + label::before {
    transform: translate(${
      toggleWidthDefault -
      (toggleHeightDefault - togglePadding * 2) -
      togglePadding * 2
    }px, 0);
  }
`;
