import React, { Component } from 'react';
import { AnalyticsListener } from '@atlaskit/analytics-next';
import Pagination from '../src';

type State = {
  analyticEventContext: Object;
  analyticEventPayload: Object;
  items: Array<{ value: number }>;
  selected: number;
};

export default class extends Component<{}, State> {
  state = {
    analyticEventContext: {},
    analyticEventPayload: {},
    items: pageLinks,
    selected: 1,
  };

  onArrowClicked = (direction?: string) => {
    if (direction === 'previous') {
      this.setState({
        selected: this.state.selected - 1,
      });
    } else {
      this.setState({
        selected: this.state.selected + 1,
      });
    }
  };

  updateTheSelected = (newPage: number) => {
    this.setState({
      selected: newPage,
    });
  };

  sendAnalytics = (analyticEvent: { context: any; payload: any }) => {
    this.setState({
      analyticEventContext: analyticEvent.context,
      analyticEventPayload: analyticEvent.payload,
    });
  };

  render() {
    const { analyticEventContext, analyticEventPayload, items } = this.state;
    return (
      <AnalyticsListener channel="atlaskit" onEvent={this.sendAnalytics}>
        <Pagination
          getPageLabel={(page: any) =>
            typeof page === 'object' ? page.value : page
          }
          pages={items}
        />
        <h2>Analytics event context received</h2>
        <pre>{JSON.stringify(analyticEventContext, null, 2)}</pre>
        <h2>Analytics event payload received</h2>
        <pre>{JSON.stringify(analyticEventPayload, null, 2)}</pre>
      </AnalyticsListener>
    );
  }
}

const pageLinks: Array<{ value: number }> = [...Array(13)].map((_, index) => ({
  value: index + 1,
}));
