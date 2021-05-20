import { AnalyticsViewerContainer } from '@atlaskit/analytics-viewer';
import React from 'react';
import { IntlProvider } from 'react-intl';
import {
  assignToMe,
  exampleOptions,
  filterUsers,
  unassigned,
} from '../example-helpers';
import { LoadOptions, OnInputChange, OptionData } from '../src/types';

type ChildrenProps = {
  loadUsers: LoadOptions;
  options: OptionData[];
  onInputChange: OnInputChange;
};

export type Props = {
  children: (props: ChildrenProps) => React.ReactNode;
  analytics?: boolean;
};

export class ExampleWrapper extends React.PureComponent<
  Props,
  { options: OptionData[] }
> {
  constructor(props: Props) {
    super(props);
    this.state = {
      options: exampleOptions,
    };
  }

  private loadUsers = (searchText?: string, sessionId?: string) => {
    if (searchText && searchText.length > 0) {
      return new Promise<OptionData[]>((resolve) => {
        window.setTimeout(() => resolve(filterUsers(searchText)), 1000);
      });
    }

    if (sessionId) {
      console.log(`sessionId is ${sessionId}`);
    }

    return [
      unassigned,
      assignToMe,
      new Promise<OptionData[]>((resolve) => {
        window.setTimeout(() => resolve(exampleOptions), 1000);
      }),
    ];
  };

  private onInputChange = (searchText?: string) => {
    this.setState({
      options:
        searchText && searchText.length > 0
          ? filterUsers(searchText)
          : exampleOptions,
    });
  };

  render() {
    const { children, analytics } = this.props;
    const { options } = this.state;

    const example = children({
      options,
      loadUsers: this.loadUsers,
      onInputChange: this.onInputChange,
    });
    return (
      <IntlProvider locale="en">
        <div>
          {analytics ? (
            <AnalyticsViewerContainer>{example}</AnalyticsViewerContainer>
          ) : (
            example
          )}
        </div>
      </IntlProvider>
    );
  }
}
