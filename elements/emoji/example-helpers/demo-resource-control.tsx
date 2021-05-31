import React from 'react';
import { PureComponent, ReactElement } from 'react';
import serializeJavascript from 'serialize-javascript';
import {
  EmojiResource,
  EmojiProvider,
  EmojiResourceConfig,
} from '../src/resource';

export function getEmojiConfig() {
  let emojiConfig;
  try {
    // eslint-disable-next-line import/no-unresolved
    emojiConfig = require('../local-config')['default'];
  } catch (e) {
    emojiConfig = require('../local-config-example')['default'];
  }

  emojiConfig.allowUpload = true;
  return emojiConfig;
}

export function getRealEmojiResource() {
  const resource = new EmojiResource(getEmojiConfig());
  return Promise.resolve(resource);
}

export interface Props {
  children: ReactElement<any>;
  emojiConfig: EmojiResourceConfig;
  customEmojiProvider?: Promise<EmojiProvider>;
  customPadding?: number;
}

export interface State {
  emojiProvider: Promise<EmojiProvider>;
}

export default class ResourcedEmojiControl extends PureComponent<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      emojiProvider:
        this.props.customEmojiProvider ||
        Promise.resolve(new EmojiResource(this.props.emojiConfig)),
    };
  }

  UNSAFE_componentWillReceiveProps(nextProps: Props) {
    // Make a weak attempt to reduce the duplication in EmojiResource creation when a storybook is mounted
    if (
      JSON.stringify(nextProps.emojiConfig) !==
      JSON.stringify(this.props.emojiConfig)
    ) {
      this.refreshEmoji(nextProps.emojiConfig);
    }
  }

  refreshEmoji(emojiConfig: EmojiResourceConfig) {
    this.setState({
      emojiProvider: Promise.resolve(new EmojiResource(emojiConfig)),
    });
  }

  emojiConfigChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    // eslint-disable-next-line no-new-func
    const config = new Function('', `return (${event.target.value})`)();
    this.refreshEmoji(config);
  };

  render() {
    const { customPadding } = this.props;
    const { emojiProvider } = this.state;
    const paddingBottom = customPadding ? `${customPadding}px` : '30px';

    return (
      <div style={{ padding: '10px' }}>
        <div style={{ paddingBottom }}>
          {React.cloneElement(this.props.children, { emojiProvider })}
        </div>
        <div>
          <p>
            <label htmlFor="emoji-urls">EmojiLoader config</label>
          </p>
          <p>
            <textarea
              id="emoji-urls"
              rows={15}
              style={{ height: '280px', width: '500px' }}
              onChange={this.emojiConfigChange}
              defaultValue={serializeJavascript(this.props.emojiConfig, {
                space: 2,
              }).replace(/\\u002F/g, '/')}
            />
          </p>
        </div>
      </div>
    );
  }
}
