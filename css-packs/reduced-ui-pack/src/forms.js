// AFP-2532 TODO: Fix automatic suppressions below
// eslint-disable-next-line @atlassian/tangerine/import/entry-points
import { colors, gridSize, fontSize } from '@atlaskit/theme';
import dataUri from './utils/data-uri';
import evaluateInner from './utils/evaluate-inner';

const labelFontSize = 12;
const baseBorderRadius = '3px';
const baseBorderWidth = 2;
const baseTransitionDuration = '0.2s'; // Transition speed
const basePaddingY = 10;
const basePaddingX = 8;

module.exports = evaluateInner`
  .ak-field-group {
    border: 0;
    margin: 0;
    min-width: 0;
    padding: ${gridSize() * 2}px 0 0 0;
  }
  .ak-field-group > label,
  .ak-field-group > legend {
    color: ${colors.N200};
    display: block;
    font-size: ${labelFontSize}px;
    font-weight: 600;
    line-height: 1;
    padding: 0;
    margin-bottom: ${gridSize() / 2}px;
  }
  .ak-field-group > legend {
    float: left;
    width: 100%;
  }
  .ak-field-text,
  .ak-field-date,
  .ak-field-search,
  .ak-field-email,
  .ak-field-url,
  .ak-field-tel,
  .ak-field-number,
  .ak-field-month,
  .ak-field-week,
  .ak-field-time,
  .ak-field-datetime-local,
  .ak-field-password,
  .ak-field-select,
  .ak-field-textarea {
    background-color: ${colors.N10};
    border-radius: ${baseBorderRadius};
    border: 2px solid ${colors.N40};
    box-shadow: none;
    box-sizing: border-box;
    color: ${colors.N800};
    font-family: inherit;
    font-size: ${fontSize}px;
    line-height: 20px;
    max-width: 100%;
    outline: none;
    padding: ${basePaddingY - baseBorderWidth}px ${
  basePaddingX - baseBorderWidth
}px;
    transition: background-color ${baseTransitionDuration} ease-in-out, border-color ${baseTransitionDuration} ease-in-out;
    width: 100%;
  }
  .ak-field-text:hover,
  .ak-field-date:hover,
  .ak-field-search:hover,
  .ak-field-email:hover,
  .ak-field-url:hover,
  .ak-field-tel:hover,
  .ak-field-number:hover,
  .ak-field-month:hover,
  .ak-field-week:hover,
  .ak-field-time:hover,
  .ak-field-datetime-local:hover,
  .ak-field-password:hover,
  .ak-field-select:hover,
  .ak-field-textarea:hover {
    background-color: ${colors.N30};
    border-color: ${colors.N40};
  }
  .ak-field-text:focus,
  .ak-field-date:focus,
  .ak-field-search:focus,
  .ak-field-email:focus,
  .ak-field-url:focus,
  .ak-field-tel:focus,
  .ak-field-number:focus,
  .ak-field-month:focus,
  .ak-field-week:focus,
  .ak-field-time:focus,
  .ak-field-datetime-local:focus,
  .ak-field-password:focus,
  .ak-field-select:focus,
  .ak-field-textarea:focus {
    background-color: ${colors.N0};
    border-color: ${colors.B100};
  }
  .ak-field-text:focus:invalid,
  .ak-field-date:focus:invalid,
  .ak-field-search:focus:invalid,
  .ak-field-email:focus:invalid,
  .ak-field-url:focus:invalid,
  .ak-field-tel:focus:invalid,
  .ak-field-number:focus:invalid,
  .ak-field-month:focus:invalid,
  .ak-field-week:focus:invalid,
  .ak-field-time:focus:invalid,
  .ak-field-datetime-local:focus:invalid,
  .ak-field-password:focus:invalid,
  .ak-field-select:focus:invalid,
  .ak-field-textarea:focus:invalid,
  .ak-field-text:focus:out-of-range,
  .ak-field-date:focus:out-of-range,
  .ak-field-search:focus:out-of-range,
  .ak-field-email:focus:out-of-range,
  .ak-field-url:focus:out-of-range,
  .ak-field-tel:focus:out-of-range,
  .ak-field-number:focus:out-of-range,
  .ak-field-month:focus:out-of-range,
  .ak-field-week:focus:out-of-range,
  .ak-field-time:focus:out-of-range,
  .ak-field-datetime-local:focus:out-of-range,
  .ak-field-password:focus:out-of-range,
  .ak-field-select:focus:out-of-range,
  .ak-field-textarea:focus:out-of-range {
    border-color: ${colors.R400};
  }
  .ak-field-text[disabled],
  .ak-field-date[disabled],
  .ak-field-search[disabled],
  .ak-field-email[disabled],
  .ak-field-url[disabled],
  .ak-field-tel[disabled],
  .ak-field-number[disabled],
  .ak-field-month[disabled],
  .ak-field-week[disabled],
  .ak-field-time[disabled],
  .ak-field-datetime-local[disabled],
  .ak-field-password[disabled],
  .ak-field-select[disabled],
  .ak-field-textarea[disabled],
  .ak-field-text[disabled]:hover,
  .ak-field-date[disabled]:hover,
  .ak-field-search[disabled]:hover,
  .ak-field-email[disabled]:hover,
  .ak-field-url[disabled]:hover,
  .ak-field-tel[disabled]:hover,
  .ak-field-number[disabled]:hover,
  .ak-field-month[disabled]:hover,
  .ak-field-week[disabled]:hover,
  .ak-field-time[disabled]:hover,
  .ak-field-datetime-local[disabled]:hover,
  .ak-field-password[disabled]:hover,
  .ak-field-select[disabled]:hover,
  .ak-field-textarea[disabled]:hover {
    background-color: ${colors.N20};
    border-color: transparent;
    color: ${colors.N70};
    cursor: not-allowed;
    resize: none;
  }
  .ak-field-text::-webkit-input-placeholder,
  .ak-field-date::-webkit-input-placeholder,
  .ak-field-search::-webkit-input-placeholder,
  .ak-field-email::-webkit-input-placeholder,
  .ak-field-url::-webkit-input-placeholder,
  .ak-field-tel::-webkit-input-placeholder,
  .ak-field-number::-webkit-input-placeholder,
  .ak-field-month::-webkit-input-placeholder,
  .ak-field-week::-webkit-input-placeholder,
  .ak-field-time::-webkit-input-placeholder,
  .ak-field-datetime-local::-webkit-input-placeholder,
  .ak-field-password::-webkit-input-placeholder,
  .ak-field-select::-webkit-input-placeholder,
  .ak-field-textarea::-webkit-input-placeholder {
    color: ${colors.N100};
  }
  .ak-field-text::-moz-placeholder,
  .ak-field-date::-moz-placeholder,
  .ak-field-search::-moz-placeholder,
  .ak-field-email::-moz-placeholder,
  .ak-field-url::-moz-placeholder,
  .ak-field-tel::-moz-placeholder,
  .ak-field-number::-moz-placeholder,
  .ak-field-month::-moz-placeholder,
  .ak-field-week::-moz-placeholder,
  .ak-field-time::-moz-placeholder,
  .ak-field-datetime-local::-moz-placeholder,
  .ak-field-password::-moz-placeholder,
  .ak-field-select::-moz-placeholder,
  .ak-field-textarea::-moz-placeholder {
    color: ${colors.N100};
  }
  .ak-field-text:-ms-input-placeholder,
  .ak-field-date:-ms-input-placeholder,
  .ak-field-search:-ms-input-placeholder,
  .ak-field-email:-ms-input-placeholder,
  .ak-field-url:-ms-input-placeholder,
  .ak-field-tel:-ms-input-placeholder,
  .ak-field-number:-ms-input-placeholder,
  .ak-field-month:-ms-input-placeholder,
  .ak-field-week:-ms-input-placeholder,
  .ak-field-time:-ms-input-placeholder,
  .ak-field-datetime-local:-ms-input-placeholder,
  .ak-field-password:-ms-input-placeholder,
  .ak-field-select:-ms-input-placeholder,
  .ak-field-textarea:-ms-input-placeholder {
    color: ${colors.N100};
  }
  .ak-field-text:-moz-placeholder,
  .ak-field-date:-moz-placeholder,
  .ak-field-search:-moz-placeholder,
  .ak-field-email:-moz-placeholder,
  .ak-field-url:-moz-placeholder,
  .ak-field-tel:-moz-placeholder,
  .ak-field-number:-moz-placeholder,
  .ak-field-month:-moz-placeholder,
  .ak-field-week:-moz-placeholder,
  .ak-field-time:-moz-placeholder,
  .ak-field-datetime-local:-moz-placeholder,
  .ak-field-password:-moz-placeholder,
  .ak-field-select:-moz-placeholder,
  .ak-field-textarea:-moz-placeholder {
    color: ${colors.N100};
  }
  .ak-field-textarea {
    display: block;
    overflow: auto;
  }
  .ak-field__resize-none {
    resize: none;
  }
  .ak-field__resize-horizontal {
    resize: both;
  }
  .ak-field__resize-vertical {
    resize: both;
  }
  .ak-field-search {
    -moz-appearance: textfield;
    -webkit-appearance: textfield;
    appearance: textfield;
  }
  .ak-field-search::-webkit-search-decoration {
    -webkit-appearance: none;
  }
  .ak-field-color {
    background-color: ${colors.N10};
    border-radius: ${baseBorderRadius};
    border: 2px solid ${colors.N40};
    box-sizing: border-box;
    height: ${gridSize() * 5}px;
    padding: 6px 4px; /* special sizes just for color inputs */
    transition: border-color ${baseTransitionDuration} ease-in-out;
  }
  .ak-field-color:focus {
    background-color: ${colors.N0};
    border-color: ${colors.B100};
    outline: none;
  }
  .ak-field-color:focus:invalid {
    border-color: ${colors.R400};
  }
  .ak-field-select {
    -moz-appearance: none;
    -webkit-appearance: none;
    appearance: none;
  }
  .ak-field-select > optgroup[label] {
    color: ${colors.N300};
    font-size: ${fontSize}px;
    font-weight: normal;
    line-height: 1.42857143;
  }
  .ak-field-select > optgroup[label] > option {
    color: ${colors.N800};
  }
  .ak-field-select > option {
    color: ${colors.N800};
  }
  .ak-field-select:not([multiple]) {
    background-image: ${dataUri('icons/expand.svg')};
    background-position-x: calc(100% - 7px);
    background-position-y: center;
    background-repeat: no-repeat;
    padding-right: 35px;
  }
  .ak-field-select[multiple] {
    overflow-y: auto;
    padding: 1px;
  }
  .ak-field-select[multiple] > option {
    box-sizing: border-box;
    height: ${gridSize() * 3}px;
    line-height: 1.42857143;
    padding: 2px 6px;
  }
  .ak-field-select[multiple] > option:checked {
    background-color: ${colors.N40};
    color: inherit;
  }
  .ak-field-select[multiple]:focus > option:checked {
    background-color: ${colors.B100};
    color: white;
  }
  .ak-field-select:-moz-focusring {
    color: transparent;
    text-shadow: 0 0 0 #000;
  }
  .ak-field-select::-ms-expand {
    display: none;
  }
  .ak-field-checkbox {
    clear: both;
    position: relative;
  }
  .ak-field-checkbox > input[type='checkbox'] {
    left: 0;
    margin: 0 ${gridSize()}px;
    opacity: 0;
    outline: none;
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    width: 12px;
  }
  .ak-field-checkbox > input[type='checkbox'] + label {
    box-sizing: border-box;
    display: block;
    padding: 4px 4px 4px 32px;
    position: relative;
    width: 100%;
  }
  .ak-field-checkbox > input[type='checkbox'] + label::after {
    background: ${dataUri('icons/checkbox-unchecked.svg')} no-repeat 50% 50%;
    border-radius: ${baseBorderRadius};
    border: ${baseBorderWidth}px solid ${colors.N40};
    box-sizing: border-box;
    content: '';
    height: 14px;
    left: 7px;
    position: absolute;
    top: 6px;
    transition: border-color ${baseTransitionDuration} ease-in-out;
    width: 14px;
  }
  .ak-field-checkbox > input[type='checkbox']:not([disabled]) + label:hover::after {
    background-image: ${dataUri('icons/checkbox-unchecked-hover.svg')};
    border-color: ${colors.N40};
  }
  .ak-field-checkbox > input[type='checkbox'][disabled] + label {
    color: ${colors.N70};
  }
  .ak-field-checkbox > input[type='checkbox'][disabled] + label::after {
    background-image: ${dataUri('icons/checkbox-unchecked-disabled.svg')};
    border-color: transparent;
    cursor: not-allowed;
  }
  .ak-field-checkbox > input[type='checkbox']:checked + label::after {
    background-image: ${dataUri('icons/checkbox-checked.svg')};
    border-color: transparent;
  }
  .ak-field-checkbox > input[type='checkbox']:checked:not([disabled]) + label:hover::after {
    background-image: ${dataUri('icons/checkbox-checked-hover.svg')};
  }
  .ak-field-checkbox > input[type='checkbox']:checked[disabled] + label::after {
    background-image: ${dataUri('icons/checkbox-checked-disabled.svg')};
  }
  .ak-field-checkbox > input[type='checkbox']:focus + label::after {
    border-color: ${colors.B100} !important;
  }
  .ak-field-radio {
    clear: both;
    position: relative;
  }
  .ak-field-radio > input[type='radio'] {
    left: 0;
    margin: 0 8px;
    opacity: 0;
    outline: none;
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    width: 12px;
  }
  .ak-field-radio > input[type='radio'] + label {
    box-sizing: border-box;
    display: block;
    padding: 4px 4px 4px 32px;
    position: relative;
    width: 100%;
  }
  .ak-field-radio > input[type='radio'] + label::after {
    background: ${dataUri('icons/radio-unchecked.svg')} no-repeat 50% 50%;
    border-radius: 50%;
    border: ${baseBorderWidth}px solid ${colors.N40};
    box-sizing: border-box;
    content: '';
    height: 14px;
    left: 7px;
    position: absolute;
    transition: border-color ${baseTransitionDuration} ease-in-out;
    top: 6px;
    width: 14px;
  }
  .ak-field-radio > input[type='radio']:not([disabled]) + label:hover::after {
    background-image: ${dataUri('icons/radio-unchecked-hover.svg')};
    border-color: ${colors.N40};
  }
  .ak-field-radio > input[type='radio'][disabled] + label {
    color: ${colors.N70};
  }
  .ak-field-radio > input[type='radio'][disabled] + label::after {
    background-image: ${dataUri('icons/radio-unchecked-disabled.svg')};
    border-color: transparent;
    cursor: not-allowed;
  }
  .ak-field-radio > input[type='radio']:checked + label::after {
    background-image: ${dataUri('icons/radio-checked.svg')};
    border-color: transparent;
  }
  .ak-field-radio
    > input[type='radio']:checked:not([disabled])
    + label:hover::after {
    background-image: ${dataUri('icons/radio-checked-hover.svg')};
  }
  .ak-field-radio > input[type='radio']:checked[disabled] + label::after {
    background-image: ${dataUri('icons/radio-checked-disabled.svg')};
  }
  .ak-field-radio > input[type='radio']:focus + label::after {
    border-color: ${colors.B100} !important;
  }
  .ak-field__width-xsmall {
    max-width: 80px;
  }
  .ak-field__width-small {
    max-width: 160px;
  }
  .ak-field__width-medium {
    max-width: 240px;
  }
  .ak-field__width-large {
    max-width: 320px;
  }
  .ak-field__width-xlarge {
    max-width: 480px;
  }
`;
