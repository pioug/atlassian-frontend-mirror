import React, { PureComponent, ReactElement } from 'react';

import { defineMessages, InjectedIntlProps, injectIntl } from 'react-intl';

import {
  ProviderFactory,
  Providers,
  WithProviders,
} from '@atlaskit/editor-common';
import { ContentRef } from '@atlaskit/task-decision';

import TaskItemWithProviders from './task-item-with-providers';

const messages = defineMessages({
  placeholder: {
    id: 'fabric.editor.taskPlaceholder',
    defaultMessage: "Type your action, use '@' to assign to someone.",
    description:
      'Placeholder description for an empty action/task in the editor',
  },
});

export interface TaskProps {
  taskId: string;
  isDone: boolean;
  contentRef?: ContentRef;
  onChange?: (taskId: string, isChecked: boolean) => void;
  showPlaceholder?: boolean;
  children?: ReactElement<any>;
  providers?: ProviderFactory;
  disabled?: boolean;
}

export class TaskItem extends PureComponent<TaskProps & InjectedIntlProps, {}> {
  static displayName = 'TaskItem';

  private providerFactory: ProviderFactory;

  constructor(props: TaskProps & InjectedIntlProps) {
    super(props);
    this.providerFactory = props.providers || new ProviderFactory();
  }

  componentWillUnmount() {
    if (!this.props.providers) {
      // new ProviderFactory is created if no `providers` has been set
      // in this case when component is unmounted it's safe to destroy this providerFactory
      this.providerFactory.destroy();
    }
  }

  private renderWithProvider = (providers: Providers) => {
    const {
      providers: _providerFactory,
      intl: { formatMessage },
      ...otherProps
    } = this.props;
    const { taskDecisionProvider, contextIdentifierProvider } = providers;
    const placeholder = formatMessage(messages.placeholder);

    return (
      <TaskItemWithProviders
        {...otherProps}
        placeholder={placeholder}
        taskDecisionProvider={taskDecisionProvider}
        contextIdentifierProvider={contextIdentifierProvider}
      />
    );
  };

  render() {
    return (
      <WithProviders
        providers={['taskDecisionProvider', 'contextIdentifierProvider']}
        providerFactory={this.providerFactory}
        renderNode={this.renderWithProvider}
      />
    );
  }
}

export default injectIntl(TaskItem);
