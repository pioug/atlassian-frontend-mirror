/** @jsx jsx */
import React, { useMemo } from 'react';
import { css, jsx } from '@emotion/react';

import Item from './Item';
import { Appearance, ContentRef } from '../types';
import {
  withAnalyticsEvents,
  WithAnalyticsEventsProps,
} from '@atlaskit/analytics-next';
import { createAndFireEventInElementsChannel } from '../analytics';
import { themed, useGlobalTheme } from '@atlaskit/theme/components';
import { token } from '@atlaskit/tokens';
import { B300, B75, DN100, DN200, N0, N30, N90 } from '@atlaskit/theme/colors';
import type { Theme } from '@atlaskit/theme/types';

export interface Props {
  taskId: string;
  isDone?: boolean;
  isRenderer?: boolean;
  onChange?: (taskId: string, isChecked: boolean) => void;
  contentRef?: ContentRef;
  children?: any;
  placeholder?: string;
  showPlaceholder?: boolean;
  appearance?: Appearance;
  disabled?: boolean;
  dataAttributes?: { [key: string]: string | number };
}

let taskCount = 0;
const getCheckBoxId = (localId: string) => `${localId}-${taskCount++}`;

const checkboxStyles = (isRenderer: boolean | undefined) => (theme: Theme) =>
  css`
    flex: 0 0 16px;
    width: 16px;
    height: 16px;
    position: relative;
    align-self: start;
    margin: ${token('space.050', '4px')} ${token('space.100', '8px')} 0 0;

    & > input[type='checkbox'] {
      width: 16px;
      height: 16px;
      z-index: 1;
      cursor: pointer;
      position: absolute;
      outline: none;
      margin: 0;
      opacity: 0;
      left: 0;
      top: 50%;
      transform: translateY(-50%);

      + div {
        box-sizing: border-box;
        display: inline;
        width: 100%;
        cursor: pointer;

        &::after {
          background: ${themed({
            light: token('color.background.input', N0),
            dark: token('color.background.input', DN100),
          })({ theme })};
          background-size: 16px;
          border-radius: 3px;
          border-style: solid;
          border-width: 1px;
          border-color: ${themed({
            light: token('color.border', N90),
            dark: token('color.border', DN200),
          })({ theme })};
          box-sizing: border-box;
          content: '';
          height: 16px;
          left: 50%;
          position: absolute;
          transition: border-color 0.2s ease-in-out;
          top: 8px;
          width: 16px;
          transform: translate(-50%, -50%);
        }
      }
      ${isRenderer
        ? css`
            &:focus-visible + div:after {
              outline: 2px solid
                ${themed({
                  light: token('color.border.focused', B300),
                  dark: token('color.border.focused', B75),
                })({ theme })};
            }
          `
        : ''}

      &:not([disabled]):hover + div::after {
        background: ${themed({
          light: token('color.background.input', N30),
          dark: token('color.background.input', B75),
        })({ theme })};
        transition: border 0.2s ease-in-out;
      }
      &[disabled] + div {
        opacity: 0.5;
        cursor: default;
      }
      &:checked {
        + div::after {
          background: url(data:image/svg+xml;charset=utf-8;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiIHN0YW5kYWxvbmU9Im5vIj8+DQo8c3ZnIHdpZHRoPSIxMiIgaGVpZ2h0PSIxMiIgdmlld0JveD0iMCAwIDEyIDEyIiB2ZXJzaW9uPSIxLjEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiPg0KICA8cmVjdCB3aWR0aD0iMTIiIGhlaWdodD0iMTIiIHJ4PSIyIiBmaWxsPSIjMDA1MkNDIj48L3JlY3Q+DQogIDxwYXRoIGZpbGw9IiNGRkZGRkYiIGQ9Ik05LjM3NCA0LjkxNEw1LjQ1NiA4LjgzMmEuNzY5Ljc2OSAwIDAgMS0xLjA4OCAwTDIuNjI2IDcuMDkxYS43NjkuNzY5IDAgMSAxIDEuMDg4LTEuMDg5TDQuOTEyIDcuMmwzLjM3NC0zLjM3NGEuNzY5Ljc2OSAwIDEgMSAxLjA4OCAxLjA4OCI+PC9wYXRoPg0KPC9zdmc+)
            no-repeat 0 0;
          background-size: 16px;
          border: 0;
          border-color: transparent;
        }
        &:not([disabled]):hover + div::after {
          background: url(data:image/svg+xml;charset=utf-8;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiIHN0YW5kYWxvbmU9Im5vIj8+DQo8c3ZnIHdpZHRoPSIxMiIgaGVpZ2h0PSIxMiIgdmlld0JveD0iMCAwIDEyIDEyIiB2ZXJzaW9uPSIxLjEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiPg0KICA8cmVjdCB3aWR0aD0iMTIiIGhlaWdodD0iMTIiIHJ4PSIyIiBmaWxsPSIjMDc0N0E2Ij48L3JlY3Q+DQogIDxwYXRoIGZpbGw9IiNGRkZGRkYiIGQ9Ik05LjM3NCA0LjkxNEw1LjQ1NiA4LjgzMmEuNzY5Ljc2OSAwIDAgMS0xLjA4OCAwTDIuNjI2IDcuMDkxYS43NjkuNzY5IDAgMSAxIDEuMDg4LTEuMDg5TDQuOTEyIDcuMmwzLjM3NC0zLjM3NGEuNzY5Ljc2OSAwIDEgMSAxLjA4OCAxLjA4OCI+PC9wYXRoPg0KPC9zdmc+)
            no-repeat 0 0;
          background-size: 16px;
        }
      }
    }
  `;

const TaskItem = (props: Props & WithAnalyticsEventsProps) => {
  const {
    appearance,
    isDone,
    isRenderer,
    contentRef,
    children,
    placeholder,
    showPlaceholder,
    disabled,
    dataAttributes,
    taskId,
    onChange,
    createAnalyticsEvent,
  } = props;

  const theme = useGlobalTheme();
  const checkBoxId = useMemo(() => getCheckBoxId(taskId), [taskId]);

  const handleOnChange = useMemo(() => {
    return (_evt: React.SyntheticEvent<HTMLInputElement>) => {
      const newIsDone = !isDone;
      if (onChange) {
        onChange(taskId, newIsDone);
      }
      const action = newIsDone ? 'checked' : 'unchecked';
      if (createAnalyticsEvent) {
        createAndFireEventInElementsChannel({
          action,
          actionSubject: 'action',
          eventType: 'ui',
          attributes: {
            localId: taskId,
          },
        })(createAnalyticsEvent);
      }
    };
  }, [onChange, taskId, isDone, createAnalyticsEvent]);

  const handleOnKeyPress = useMemo(
    () => (event: React.KeyboardEvent<HTMLInputElement>) => {
      if (event.key === 'Enter') {
        handleOnChange(event);
      }
    },
    [handleOnChange],
  );

  const icon = (
    <span css={checkboxStyles(isRenderer)(theme)} contentEditable={false}>
      <input
        id={checkBoxId}
        aria-labelledby={`${checkBoxId}-wrapper`}
        name={checkBoxId}
        type="checkbox"
        onChange={handleOnChange}
        checked={!!isDone}
        disabled={!!disabled}
        suppressHydrationWarning={true}
        onKeyPress={handleOnKeyPress}
      />
      <div />
    </span>
  );

  return (
    <Item
      appearance={appearance}
      contentRef={contentRef}
      icon={icon}
      placeholder={placeholder}
      showPlaceholder={showPlaceholder}
      itemType="TASK"
      dataAttributes={dataAttributes}
      checkBoxId={checkBoxId}
      theme={theme}
    >
      {children}
    </Item>
  );
};

// This is to ensure that the "type" is exported, as it gets lost and not exported along with TaskItem after
// going through the high order component.

export default withAnalyticsEvents()(TaskItem);
