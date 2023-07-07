import { css } from '@emotion/react';
import { getBooleanFF } from '@atlaskit/platform-feature-flags';
import { token } from '@atlaskit/tokens';
import { themed } from '@atlaskit/theme/components';
import type { Theme } from '@atlaskit/theme/types';
import { DN50, N200, N20A } from '@atlaskit/theme/colors';
import checkboxTheme from './theme';

/*
  Increasing specificity with double ampersand to ensure these rules take
  priority over the global styles applied to 'ol' elements.
*/
export const listStyles = css`
  && {
    list-style-type: none;
    padding-left: 0;
  }
`;

export const taskListStyles = css`
  div + div {
    margin-top: ${token('space.050', '4px')};
  }
`;

export const contentStyles = css`
  margin: 0;
  word-wrap: break-word;
  min-width: 0;
  flex: 1 1 auto;
`;

export const taskStyles = css`
  display: flex;
  flex-direction: row;
  position: relative;
`;

export const decisionStyles = (theme: Theme) =>
  css`
    display: flex;
    flex-direction: row;
    margin: ${token('space.100', '8px')} 0 0 0;
    padding: ${token('space.100', '8px')};
    padding-left: ${token('space.150', '12px')};
    border-radius: ${token('border.radius.100', '3px')};
    background-color: ${themed({
      light: token('color.background.neutral', N20A),
      dark: token('color.background.neutral', DN50),
    })({ theme })};
    position: relative;

    .decision-item {
      cursor: initial;
    }
  `;

export const placeholderStyles = (offset: number) =>
  css`
    margin: 0 0 0 ${offset}px;
    position: absolute;
    color: ${token('color.text.subtlest', N200)};
    pointer-events: none;
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
    max-width: calc(100% - 50px);
  `;

/**
 * References packages/design-system/checkbox/src/checkbox.tsx
 * To be used until mobile editor does not require legacy themed() API anymore,
 * which will allow migration to use @atlaskit/checkbox instead
 */
export const checkboxStyles =
  (isRenderer: boolean | undefined) => (theme: Theme) =>
    css`
      flex: 0 0 24px;
      width: 24px;
      height: 24px;
      position: relative;
      align-self: start;

      & > input[type='checkbox'] {
        width: 16px;
        height: 16px;
        z-index: 1;
        cursor: pointer;
        outline: none;
        margin: 0;
        opacity: 0;
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);

        &[disabled] {
          cursor: default;
        }

        + span {
          width: 24px;
          height: 24px;
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
        }

        + span > svg {
          box-sizing: border-box;
          display: inline;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          max-width: unset;
          max-height: unset;
          position: absolute;
          overflow: hidden;
          color: ${themed({
            light: checkboxTheme.light.boxColor.rest,
            dark: checkboxTheme.dark.boxColor.rest,
          })({ theme })};
          transition: color 0.2s ease-in-out, fill 0.2s ease-in-out;
          path:first-of-type {
            visibility: hidden;
          }
          rect:first-of-type {
            stroke: ${themed({
              light: checkboxTheme.light.borderColor.rest,
              dark: checkboxTheme.dark.borderColor.rest,
            })({ theme })};
            stroke-width: ${getBooleanFF(
              'platform.design-system-team.border-checkbox_nyoiu',
            )
              ? 1
              : 2};
            transition: stroke 0.2s ease-in-out;
          }
        }

        &&:focus + span > svg,
        &&:checked:focus + span > svg {
          rect:first-of-type {
            stroke: ${themed({
              light: checkboxTheme.light.borderColor.focused,
              dark: checkboxTheme.dark.borderColor.focused,
            })({ theme })};
          }
        }

        &:hover + span > svg {
          color: ${themed({
            light: checkboxTheme.light.boxColor.hovered,
            dark: checkboxTheme.dark.boxColor.hovered,
          })({ theme })};
          rect:first-of-type {
            stroke: ${themed({
              light: checkboxTheme.light.borderColor.hovered,
              dark: checkboxTheme.dark.borderColor.hovered,
            })({ theme })};
          }
        }

        &:checked:hover + span > svg {
          color: ${themed({
            light: checkboxTheme.light.boxColor.hoveredAndChecked,
            dark: checkboxTheme.dark.boxColor.hoveredAndChecked,
          })({ theme })};
          fill: ${themed({
            light: checkboxTheme.light.tickColor.checked,
            dark: checkboxTheme.dark.tickColor.checked,
          })({ theme })};
          rect:first-of-type {
            stroke: ${themed({
              light: checkboxTheme.light.borderColor.hoveredAndChecked,
              dark: checkboxTheme.dark.borderColor.hoveredAndChecked,
            })({ theme })};
          }
        }

        &:checked {
          + span > svg {
            path:first-of-type {
              visibility: visible;
            }
            color: ${themed({
              light: checkboxTheme.light.boxColor.checked,
              dark: checkboxTheme.dark.boxColor.checked,
            })({ theme })};
            fill: ${themed({
              light: checkboxTheme.light.tickColor.checked,
              dark: checkboxTheme.dark.tickColor.checked,
            })({ theme })};
            rect:first-of-type {
              stroke: ${themed({
                light: checkboxTheme.light.borderColor.checked,
                dark: checkboxTheme.dark.borderColor.checked,
              })({ theme })};
            }
          }
        }

        &:active + span > svg {
          color: ${themed({
            light: checkboxTheme.light.boxColor.active,
            dark: checkboxTheme.dark.boxColor.active,
          })({ theme })};
          rect:first-of-type {
            stroke: ${themed({
              light: checkboxTheme.light.borderColor.active,
              dark: checkboxTheme.dark.borderColor.active,
            })({ theme })};
          }
        }

        &:checked:active + span > svg {
          color: ${themed({
            light: checkboxTheme.light.boxColor.active,
            dark: checkboxTheme.dark.boxColor.active,
          })({ theme })};
          fill: ${themed({
            light: checkboxTheme.light.tickColor.activeAndChecked,
            dark: checkboxTheme.dark.tickColor.activeAndChecked,
          })({ theme })};
          rect:first-of-type {
            stroke: ${themed({
              light: checkboxTheme.light.borderColor.active,
              dark: checkboxTheme.dark.borderColor.active,
            })({ theme })};
          }
        }

        &:disabled + span > svg,
        &:disabled:hover + span > svg,
        &:disabled:focus + span > svg,
        &:disabled:active + span > svg {
          color: ${themed({
            light: checkboxTheme.light.boxColor.disabled,
            dark: checkboxTheme.dark.boxColor.disabled,
          })({ theme })};
          rect:first-of-type {
            stroke: ${themed({
              light: checkboxTheme.light.borderColor.disabled,
              dark: checkboxTheme.dark.borderColor.disabled,
            })({ theme })};
          }
        }

        &:disabled:checked + span > svg {
          fill: ${themed({
            light: checkboxTheme.light.tickColor.disabledAndChecked,
            dark: checkboxTheme.dark.tickColor.disabledAndChecked,
          })({ theme })};
        }

        ${isRenderer
          ? css`
              &:focus + span > svg,
              &:checked:focus + span > svg {
                rect:first-of-type {
                  stroke: ${themed({
                    light: checkboxTheme.light.borderColor.focused,
                    dark: checkboxTheme.dark.borderColor.focused,
                  })({ theme })};
                }
              }
            `
          : css`
              &:active:focus + span > svg,
              &:checked:active:focus + span > svg {
                rect:first-of-type {
                  stroke: ${themed({
                    light: checkboxTheme.light.borderColor.focused,
                    dark: checkboxTheme.dark.borderColor.focused,
                  })({ theme })};
                }
              }
            `}
      }
    `;
