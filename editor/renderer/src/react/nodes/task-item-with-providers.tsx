import React from 'react';
import { Component, ReactNode } from 'react';
import { ContextIdentifierProvider } from '@atlaskit/editor-common';
import {
  ContentRef,
  TaskDecisionProvider,
  ResourcedTaskItem,
} from '@atlaskit/task-decision';

export interface Props {
  taskId: string;
  objectAri: string;
  isDone: boolean;
  contentRef?: ContentRef;
  onChange?: (taskId: string, isChecked: boolean) => void;
  showPlaceholder?: boolean;
  children?: ReactNode;
  taskDecisionProvider?: Promise<TaskDecisionProvider>;
  contextIdentifierProvider?: Promise<ContextIdentifierProvider>;
  disabled?: boolean;
  dataAttributes?: { [key: string]: string | number };
}

export interface State {
  resolvedContextProvider?: ContextIdentifierProvider;
}

export default class TaskItemWithProviders extends Component<Props, State> {
  state: State = { resolvedContextProvider: undefined };

  UNSAFE_componentWillMount() {
    this.updateContextIdentifierProvider(this.props);
  }

  UNSAFE_componentWillReceiveProps(nextProps: Props) {
    if (
      nextProps.contextIdentifierProvider !==
      this.props.contextIdentifierProvider
    ) {
      this.updateContextIdentifierProvider(nextProps);
    }
  }

  private async updateContextIdentifierProvider(props: Props) {
    if (props.contextIdentifierProvider) {
      try {
        const resolvedContextProvider = await props.contextIdentifierProvider;
        this.setState({ resolvedContextProvider });
      } catch (err) {
        this.setState({ resolvedContextProvider: undefined });
      }
    } else {
      this.setState({ resolvedContextProvider: undefined });
    }
  }

  render() {
    const { contextIdentifierProvider, objectAri, ...otherProps } = this.props;
    const resolvedObjectId =
      (this.state.resolvedContextProvider &&
        this.state.resolvedContextProvider.objectId) ||
      objectAri;

    return <ResourcedTaskItem {...otherProps} objectAri={resolvedObjectId} />;
  }
}
