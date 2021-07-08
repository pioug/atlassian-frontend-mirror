import React from 'react';
import { PureComponent } from 'react';
import { CheckBoxWrapper } from '../styled/TaskItem';

import Item from './Item';
import { Appearance, ContentRef } from '../types';
import {
  withAnalyticsEvents,
  WithAnalyticsEventsProps,
} from '@atlaskit/analytics-next';
import { createAndFireEventInElementsChannel } from '../analytics';

export interface Props {
  taskId: string;
  isDone?: boolean;
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

export class TaskItem extends PureComponent<
  Props & WithAnalyticsEventsProps,
  {}
> {
  public static defaultProps: Partial<Props> = {
    appearance: 'inline',
  };

  private checkBoxId: string;

  constructor(props: Props & WithAnalyticsEventsProps) {
    super(props);
    this.checkBoxId = getCheckBoxId(props.taskId);
  }

  UNSAFE_componentWillReceiveProps(nextProps: Props) {
    if (nextProps.taskId !== this.props.taskId) {
      this.checkBoxId = getCheckBoxId(nextProps.taskId);
    }
  }

  handleOnChange = (_evt: React.SyntheticEvent<HTMLInputElement>) => {
    const { onChange, taskId, isDone, createAnalyticsEvent } = this.props;
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

  render() {
    const {
      appearance,
      isDone,
      contentRef,
      children,
      placeholder,
      showPlaceholder,
      disabled,
      dataAttributes,
    } = this.props;

    const icon = (
      <CheckBoxWrapper contentEditable={false}>
        <input
          id={this.checkBoxId}
          aria-labelledby={`${this.checkBoxId}-wrapper`}
          name={this.checkBoxId}
          type="checkbox"
          onChange={this.handleOnChange}
          checked={!!isDone}
          disabled={!!disabled}
          suppressHydrationWarning={true}
        />
        <label htmlFor={this.checkBoxId} suppressHydrationWarning={true} />
      </CheckBoxWrapper>
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
        checkBoxId={this.checkBoxId}
      >
        {children}
      </Item>
    );
  }
}

// This is to ensure that the "type" is exported, as it gets lost and not exported along with TaskItem after
// going through the high order component.

export default withAnalyticsEvents()(TaskItem);
