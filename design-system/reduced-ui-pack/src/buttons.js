// AFP-2532 TODO: Fix automatic suppressions below
// eslint-disable-next-line @atlassian/tangerine/import/entry-points
import { colors } from '@atlaskit/theme';
import evaluateInner from './utils/evaluate-inner';

/**
 * This exits as @ak-color-B75A: fade(@ak-color-B75, 60%);
 * but theme does not have B75A color
 */
const colorB75A = 'rgba(179, 212, 255, 0.6)';
/**
 * This exits as @ak-color-B200A: fade(@ak-color-B200, 60%);
 * but theme does not have B75A color
 */
const colorB200A = 'rgba(38, 132, 255, 0.6)';

export default evaluateInner`
  .ak-button {
    align-items: baseline;
    box-sizing: border-box;
    border-radius: 3px;
    border-width: 0;
    display: inline-flex;
    font-style: normal;
    font-size: inherit;
    height: 2.28571429em;
    line-height: 2.28571429em;
    margin: 0;
    outline: none;
    padding: 0 12px;
    text-align: center;
    transition: background 0.1s ease-out, box-shadow 0.15s cubic-bezier(0.47, 0.03, 0.49, 1.38);
    user-select: none;
    vertical-align: middle;
    white-space: nowrap;
  }
  .ak-button:hover {
    cursor: pointer;
    transition: background 0s ease-out, box-shadow 0.15s cubic-bezier(0.47, 0.03, 0.49, 1.38);
  }
  .ak-button:active {
    transition-duration: 0s;
  }
  .ak-button:focus {
    outline: none;
    transition-duration: 0s, 0.2s;
  }
  .ak-button[disabled] {
    cursor: not-allowed;
  }
  .ak-button__appearance-default {
    background: ${colors.N20A};
    color: ${colors.N400};
    text-decoration: none;
  }
  .ak-button__appearance-default:hover {
    background: ${colors.N30A};
  }
  .ak-button__appearance-default:active {
    background: ${colorB75A};
    color: ${colors.B400};
  }
  .ak-button__appearance-default:focus {
    box-shadow: 0 0 0 2px ${colorB200A};
  }
  .ak-button__appearance-default[disabled],
  .ak-button__appearance-default[disabled]:active,
  .ak-button__appearance-default[disabled]:hover {
    background: ${colors.N20A};
    color: ${colors.N70};
    text-decoration: none;
  }
  .ak-button__appearance-default[disabled]:focus,
  .ak-button__appearance-default[disabled]:active:focus,
  .ak-button__appearance-default[disabled]:hover:focus {
    box-shadow: 0 0 0 2px ${colorB200A};
  }
  .ak-button__appearance-subtle {
    background: none;
    color: ${colors.N400};
    text-decoration: none;
  }
  .ak-button__appearance-subtle:hover {
    background: ${colors.N30A};
  }
  .ak-button__appearance-subtle:active {
    background: ${colorB75A};
    color: ${colors.B400};
  }
  .ak-button__appearance-subtle:focus {
    box-shadow: 0 0 0 2px ${colorB200A};
  }
  .ak-button__appearance-subtle[disabled],
  .ak-button__appearance-subtle[disabled]:active,
  .ak-button__appearance-subtle[disabled]:hover {
    background: ${colors.N20A};
    color: ${colors.N70};
    text-decoration: none;
  }
  .ak-button__appearance-subtle[disabled]:focus,
  .ak-button__appearance-subtle[disabled]:active:focus,
  .ak-button__appearance-subtle[disabled]:hover:focus {
    box-shadow: 0 0 0 2px ${colorB200A};
  }
  .ak-button__appearance-primary {
    background: ${colors.B400};
    color: ${colors.N0};
    text-decoration: none;
  }
  .ak-button__appearance-primary:hover {
    background: ${colors.B300};
  }
  .ak-button__appearance-primary:active {
    background: ${colors.B500};
    color: ${colors.N0};
  }
  .ak-button__appearance-primary:focus {
    box-shadow: 0 0 0 2px ${colorB200A};
  }
  .ak-button__appearance-primary[disabled],
  .ak-button__appearance-primary[disabled]:active,
  .ak-button__appearance-primary[disabled]:hover {
    background: ${colors.B400};
    color: rgba(255, 255, 255, 0.5);
    text-decoration: none;
  }
  .ak-button__appearance-primary[disabled]:focus,
  .ak-button__appearance-primary[disabled]:active:focus,
  .ak-button__appearance-primary[disabled]:hover:focus {
    box-shadow: 0 0 0 2px ${colorB200A};
  }
  .ak-button__appearance-link {
    background: none;
    color: ${colors.B400};
    text-decoration: none;
  }
  .ak-button__appearance-link:hover {
    background: none;
    color: ${colors.B300};
    text-decoration: underline;
  }
  .ak-button__appearance-link:active {
    text-decoration: none;
    background: none;
    color: ${colors.B500};
  }
  .ak-button__appearance-link:focus {
    box-shadow: 0 0 0 2px ${colorB200A};
  }
  .ak-button__appearance-link[disabled],
  .ak-button__appearance-link[disabled]:active,
  .ak-button__appearance-link[disabled]:hover {
    background: none;
    color: ${colors.N70};
    text-decoration: none;
  }
  .ak-button__appearance-link[disabled]:focus,
  .ak-button__appearance-link[disabled]:active:focus,
  .ak-button__appearance-link[disabled]:hover:focus {
    box-shadow: 0 0 0 2px ${colorB200A};
  }
  .ak-button__appearance-subtle-link {
    background: none;
    color: ${colors.N500};
    text-decoration: none;
  }
  .ak-button__appearance-subtle-link:hover {
    background: none;
    color: ${colors.B300};
    text-decoration: underline;
  }
  .ak-button__appearance-subtle-link:active {
    text-decoration: none;
    background: none;
    color: ${colors.B500};
  }
  .ak-button__appearance-subtle-link:focus {
    box-shadow: 0 0 0 2px ${colorB200A};
  }
  .ak-button__appearance-subtle-link[disabled],
  .ak-button__appearance-subtle-link[disabled]:active,
  .ak-button__appearance-subtle-link[disabled]:focus {
    background: none;
    color: ${colors.N70};
    text-decoration: none;
  }
  .ak-button__appearance-subtle-link[disabled]:focus,
  .ak-button__appearance-subtle-link[disabled]:active:focus,
  .ak-button__appearance-subtle-link[disabled]:focus:focus {
    box-shadow: 0 0 0 2px ${colorB200A};
  }
  .ak-button__spacing-compact {
    height: 1.71428571em;
    line-height: 1.71428571em;
  }
  .ak-button__spacing-none {
    height: auto;
    line-height: normal;
    padding: 0;
  }
  .ak-button::-moz-focus-inner {
    border: 0;
    margin: 0;
    padding: 0;
  }
`;
