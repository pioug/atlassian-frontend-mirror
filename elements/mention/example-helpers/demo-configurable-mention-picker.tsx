import React from 'react';
import MentionResource, {
  MentionResourceConfig,
} from '../src/api/MentionResource';

// FIXME FAB-1732 - extract or replace with third-party implementation
const toJavascriptString = (obj: object | string | any[]) => {
  if (typeof obj === 'object') {
    if (Array.isArray(obj)) {
      let arrString = '[\n';
      for (let i = 0; i < obj.length; i++) {
        arrString += `  ${toJavascriptString(obj[i])},\n`;
      }
      arrString += ']';
      return arrString;
    }
    let objString = '{\n';
    (Object.keys(obj) as (keyof typeof obj)[]).forEach(key => {
      objString += `  ${key}: ${toJavascriptString(obj[key])},\n`;
    });
    objString += '}';
    return objString;
  }
  return `${obj}`;
};

export interface Props {
  children?: any;
  config: MentionResourceConfig;
}

export interface State {
  resourceProvider: MentionResource;
}

export default class ConfigurableMentionPicker extends React.Component<
  Props,
  State
> {
  constructor(props: Props) {
    super(props);
    this.state = {
      resourceProvider: new MentionResource(props.config),
    };
  }

  UNSAFE_componentWillReceiveProps(nextProps: Props) {
    this.refreshMentions(nextProps.config);
  }

  refreshMentions(config: MentionResourceConfig) {
    this.setState({
      resourceProvider: new MentionResource(config),
    });
  }

  mentionConfigChange: React.ChangeEventHandler<
    HTMLTextAreaElement
  > = event => {
    // eslint-disable-next-line no-eval
    const config = eval(`( () => (${event.target.value}) )()`);
    this.refreshMentions(config);
  };

  render() {
    const { resourceProvider } = this.state;

    return (
      <div style={{ padding: '10px' }}>
        {React.cloneElement(this.props.children, { resourceProvider })}
        <p>
          <label htmlFor="mention-urls">MentionResource config</label>
        </p>
        <p>
          <textarea
            id="mention-urls"
            rows={15}
            style={{ width: '400px' }}
            onChange={this.mentionConfigChange}
            defaultValue={toJavascriptString(this.props.config)}
          />
        </p>
      </div>
    );
  }
}
