import React from 'react';
import { ActivityProvider } from '@atlaskit/activity-provider';
import {
  ProviderFactory,
  WithProviders,
  Providers,
  Diff,
} from '@atlaskit/editor-common';

export interface ExpandedActivityProviderProps {
  providerFactory: ProviderFactory;
}

export interface WithActivityProviderProps {
  activityProvider: ActivityProvider;
}

export default function withActivityProvider<Props>(
  WrappedComponent: React.ComponentType<Props & WithActivityProviderProps>,
) {
  return class WithActivityProvider extends React.Component<
    Diff<Props, WithActivityProviderProps> & ExpandedActivityProviderProps
  > {
    renderNode = (providers: Providers) => {
      const { providerFactory, ...props } = this
        .props as ExpandedActivityProviderProps;
      const { activityProvider } = providers;

      return (
        <WrappedComponent
          activityProvider={activityProvider as any}
          {...(props as Props)}
        />
      );
    };

    render() {
      const { providerFactory } = this.props;
      return (
        <WithProviders
          providers={['activityProvider']}
          providerFactory={providerFactory}
          renderNode={this.renderNode}
        />
      );
    }
  };
}
