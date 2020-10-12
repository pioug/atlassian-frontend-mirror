import React from 'react';
import { QuickSearchContext } from '../api/types';
import {
  ABTest,
  CrossProductSearchClient,
  DEFAULT_AB_TEST,
} from '../api/CrossProductSearchClient';
import memoizeOne from 'memoize-one';

interface Props {
  context: QuickSearchContext;
  crossProductSearchClient: CrossProductSearchClient;
  children: (abTest: ABTest) => React.ReactNode;
}

interface State {
  abTest: ABTest | null;
}

export class ABTestProvider extends React.Component<Props, State> {
  state = {
    abTest: null,
  };

  fetchAbTestOnce = memoizeOne(() => {
    const { context, crossProductSearchClient } = this.props;

    if (!this.state.abTest) {
      crossProductSearchClient
        .getAbTestDataForProduct(context)
        .then(abTest => {
          this.setState({
            abTest: abTest || DEFAULT_AB_TEST,
          });
        })
        .catch(e => {
          this.setState({
            abTest: DEFAULT_AB_TEST,
          });
        });
    }
  });

  componentDidMount() {
    this.fetchAbTestOnce();
  }

  componentDidUpdate() {
    this.fetchAbTestOnce();
  }

  render() {
    const { abTest } = this.state;
    const { children } = this.props;

    if (!abTest) {
      return null;
    }

    return <>{children(abTest!)}</>;
  }
}
