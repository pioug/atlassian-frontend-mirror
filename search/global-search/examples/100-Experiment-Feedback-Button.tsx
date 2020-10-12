import React from 'react';
import StorybookQuickSearch from '../example-helpers/StorybookQuickSearch';

// eslint-disable-next-line import/no-anonymous-default-export
export default class extends React.Component {
  render() {
    return (
      <StorybookQuickSearch
        showFeedbackCollector={true}
        feedbackCollectorProps={{
          name: 'abcdef',
          email: 'abcdef@atlassian.com',
        }}
      />
    );
  }
}
