import React from 'react';
import { PureComponent, ReactNode } from 'react';
import { ProviderFactory, WithProviders } from '@atlaskit/editor-common';
import TaskItemWithProviders from './task-item-with-providers';
import { RendererContext } from '../';
import { FabricElementsAnalyticsContext } from '@atlaskit/analytics-namespaced-context';

export interface Props {
  localId: string;
  rendererContext?: RendererContext;
  state?: string;
  providers?: ProviderFactory;
  children?: ReactNode;
}

export default class TaskItem extends PureComponent<Props, {}> {
  private providerFactory: ProviderFactory;

  constructor(props: Props) {
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

  private renderWithProvider = (providers: any) => {
    const { taskDecisionProvider, contextIdentifierProvider } = providers;
    const { children, localId, state, rendererContext } = this.props;
    let objectAri = '';
    if (rendererContext) {
      objectAri = rendererContext.objectAri || '';
    }

    return (
      <FabricElementsAnalyticsContext
        data={{
          userContext: 'document',
        }}
      >
        <TaskItemWithProviders
          objectAri={objectAri}
          taskId={localId}
          isDone={state === 'DONE'}
          taskDecisionProvider={taskDecisionProvider}
          contextIdentifierProvider={contextIdentifierProvider}
        >
          {children}
        </TaskItemWithProviders>
      </FabricElementsAnalyticsContext>
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
