import React from 'react';
import Button from '@atlaskit/button';
import Tooltip from '../src';

const PER_RUN = 100;
const TEST_RUNS = 10;

function getInitialState() {
  return {
    count: 0,
    tests: 0,
    time: 0,
  };
}

interface Props {}
interface State {
  count: number;
  tests: number;
  time: number;
}

export default class PerfTest extends React.Component<Props, State> {
  state = getInitialState();

  startTest = () => {
    let runs = 0;
    let startTime: number;

    const run = () => {
      if (!runs) {
        startTime = Date.now();
      }
      if (runs === TEST_RUNS) {
        const time = Date.now() - startTime;
        this.setState({ time, tests: this.state.tests + 1 });
        return;
      }
      runs += 1;
      this.setState({ count: runs * PER_RUN }, run);
    };

    this.setState({ count: 0 }, run);
  };

  clearResults = () => {
    this.setState(getInitialState, this.renderTooltips);
  };

  renderTooltips() {
    const { count } = this.state;
    const items = [];
    for (let i = 1; i <= count; i += 1) {
      items.push(
        <Tooltip key={i} content="Tooltip Content" position="right">
          <button>Hover Me</button>
        </Tooltip>,
      );
    }
    return items;
  }

  render() {
    const { tests, time } = this.state;

    return (
      <div>
        <Button appearance="primary" onClick={this.startTest}>
          Start Test {tests + 1}
        </Button>
        {time ? (
          <div style={{ marginTop: '1em' }}>
            <p>
              Rendered {TEST_RUNS}&times;{PER_RUN} tooltips in{' '}
              <code>{time}ms</code>
            </p>
            <button onClick={this.clearResults}>Clear</button>
          </div>
        ) : (
          <div style={{ marginTop: '1em' }}>
            <p>Start test to see results...</p>
          </div>
        )}
        <div style={{ marginTop: '1em' }}>{this.renderTooltips()}</div>
      </div>
    );
  }
}
