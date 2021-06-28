import React from 'react';
import { toNativeBridge } from '../src/editor/web-to-native';

export interface LogItem {
  log: string;
  id: number;
}

export interface Props {
  filter?: string[];
}

export interface State {
  logs: LogItem[];
}

let logId = 0;

export default class WebToNativeReporter extends React.Component<Props, State> {
  private oldLog?: string;

  constructor(props: any) {
    super(props);
    this.state = {
      logs: [],
    };
  }

  UNSAFE_componentWillMount() {
    this.oldLog = (toNativeBridge as any).log;
    (toNativeBridge as any).log = this.handleNewLog;
  }

  componentWillUnmount() {
    (toNativeBridge as any).log = this.oldLog;
  }

  private handleNewLog = (bridge: string, event: string, props: any) => {
    const { filter } = this.props;
    const logText = `${bridge}:${event} ${JSON.stringify(props)}`;
    const isInFilter = (acc: boolean, filterBy: string) =>
      acc || logText.startsWith(filterBy);
    if (!filter || !filter.length || filter.reduce(isInFilter, false)) {
      this.setState({
        logs: [
          {
            log: logText,
            id: logId++,
          },
          ...this.state.logs.slice(0, 99),
        ],
      });
    }
  };

  render() {
    return (
      <div
        style={{
          overflowY: 'scroll',
          height: '180px',
        }}
      >
        {this.state.logs.map((logItem) => (
          <p key={logItem.id}>{logItem.log}</p>
        ))}
      </div>
    );
  }
}
