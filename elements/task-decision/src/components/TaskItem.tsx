/** @jsx jsx */
import React, { useMemo, useRef } from 'react';
import { jsx } from '@emotion/react';
import CheckboxIcon from '@atlaskit/icon/glyph/checkbox';
import Item from './Item';
import { Appearance, ContentRef } from '../types';
import {
  withAnalyticsEvents,
  WithAnalyticsEventsProps,
} from '@atlaskit/analytics-next';
import { createAndFireEventInElementsChannel } from '../analytics';
import { useGlobalTheme } from '@atlaskit/theme/components';
import { checkboxStyles } from './styles';

export interface Props {
  taskId: string;
  isDone?: boolean;
  isFocused?: boolean;
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

const TaskItem = (props: Props & WithAnalyticsEventsProps) => {
  const {
    appearance,
    isDone,
    isFocused,
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

  const inputRef = useRef<HTMLInputElement>(null);
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
        ref={inputRef}
      />
      <CheckboxIcon label="" />
    </span>
  );

  React.useEffect(() => {
    if (isFocused && inputRef.current) {
      inputRef.current?.focus();
      inputRef.current?.blur();
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  }, [isFocused]);

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
