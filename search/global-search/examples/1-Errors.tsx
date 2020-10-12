import React from 'react';
import StorybookQuickSearch from '../example-helpers/StorybookQuickSearch';
import { setupAllRequestFailedMocks } from '../example-helpers/mocks/mockApis';

export default class GlobalQuickSearchExample extends React.Component {
  UNSAFE_componentWillMount() {
    setupAllRequestFailedMocks();
  }

  render() {
    return <StorybookQuickSearch />;
  }
}
