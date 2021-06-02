import React from 'react';
import { PureComponent } from 'react';
import { EmojiProvider } from '../src/resource';
import { ResourcedEmoji } from '../src/element';
import { localStoragePrefix } from '../src/util/constants';
import { EmojiDescription } from '../src/types';

export interface EmojiUsageProps {
  emojiProvider: EmojiProvider;
  emojiList: Array<EmojiDescription>;
  emojiQueue: Array<string>;
}

export class EmojiUsageList extends PureComponent<EmojiUsageProps, any> {
  constructor(props: EmojiUsageProps) {
    super(props);
  }

  render() {
    let emojiUsageList;

    if (this.props.emojiList.length === 0) {
      emojiUsageList = <span>None</span>;
    } else {
      emojiUsageList = (
        <span>
          {this.props.emojiList.map((emoji) => {
            return (
              <span key={emoji.id} style={{ marginRight: '15px' }}>
                <span style={{ marginRight: '3px' }}>
                  (
                  {
                    this.props.emojiQueue.filter(
                      (emojiId) => emojiId === emoji.id,
                    ).length
                  }
                  )
                </span>
                <ResourcedEmoji
                  emojiId={emoji}
                  emojiProvider={Promise.resolve(this.props.emojiProvider)}
                  showTooltip={true}
                />
              </span>
            );
          })}
        </span>
      );
    }

    return (
      <div style={{ paddingTop: '10px', paddingBottom: '10px' }}>
        <h4>Emojis ordered by usage</h4>
        {emojiUsageList}
      </div>
    );
  }
}

export interface LocalStorageViewProps {
  emojiProvider: EmojiProvider;
  emojiQueue: Array<string>;
}

export class LocalStorageView extends PureComponent<
  LocalStorageViewProps,
  any
> {
  constructor(props: LocalStorageViewProps) {
    super(props);
  }

  render() {
    let renderedQueue;
    if (this.props.emojiQueue.length === 0) {
      renderedQueue = <span>None</span>;
    } else {
      renderedQueue = (
        <span>
          {this.props.emojiQueue.map((id, index) => {
            return (
              <span key={index} style={{ marginRight: '3px' }}>
                <ResourcedEmoji
                  emojiId={{ id: id, shortName: 'unknown' }}
                  emojiProvider={Promise.resolve(this.props.emojiProvider)}
                  showTooltip={false}
                />
                <span>({id})</span>
              </span>
            );
          })}
        </span>
      );
    }

    return (
      <div style={{ paddingTop: '10px', paddingBottom: '10px' }}>
        <h4>Emoji Queue (from localStorage)</h4>
        <pre style={{ whiteSpace: 'pre-wrap', wordWrap: 'break-word' }}>
          {renderedQueue}
        </pre>
      </div>
    );
  }
}

export interface UsagingShowingProps {
  emojiResource: any;
}

export interface UsageShowingState {
  emojiList: Array<EmojiDescription>;
  emojiQueue: Array<string>;
}

/**
 * Extend this class if you want to wrap an emoji component such that emoji usage is displayed after it.
 */
export abstract class UsageShowAndClearComponent extends PureComponent<
  UsagingShowingProps,
  UsageShowingState
> {
  constructor(props: UsagingShowingProps) {
    super(props);
    this.state = {
      emojiList: [],
      emojiQueue: this.getEmojiQueue(),
    };
  }

  componentDidMount() {
    this.refreshFrequentlyUsedList();
  }

  onSelection = (): void => {
    // give the tracker a chance to write to the queue and local storage before updating state
    window.setTimeout(() => {
      this.refreshFrequentlyUsedList();
    });
  };

  clearUsageData = (): void => {
    const { emojiResource } = this.props;
    emojiResource.clearFrequentlyUsed();
    this.refreshFrequentlyUsedList();
  };

  protected refreshFrequentlyUsedList() {
    this.props.emojiResource
      .getFrequentlyUsed()
      .then(this.onRefreshedFrequentlyUsedList);
  }

  protected onRefreshedFrequentlyUsedList = (
    emojiList: EmojiDescription[],
  ): void => {
    this.setState({
      emojiList,
      emojiQueue: this.getEmojiQueue(),
    });
  };

  protected abstract getWrappedComponent(): JSX.Element;

  getEmojiQueue(): Array<string> {
    const json = window.localStorage.getItem(`${localStoragePrefix}.lastUsed`);
    if (json) {
      try {
        return JSON.parse(json);
      } catch (e) {
        // swallow any parse exception
      }
    }

    return new Array<string>();
  }

  render() {
    const { emojiResource } = this.props;
    const { emojiList, emojiQueue } = this.state;

    const wrappedComponent = this.getWrappedComponent();

    return (
      <div style={{ padding: '10px' }}>
        {wrappedComponent}
        <div>
          <button onClick={this.clearUsageData}>Clear All Usage</button>
        </div>
        <EmojiUsageList
          emojiProvider={emojiResource as EmojiProvider}
          emojiList={emojiList}
          emojiQueue={emojiQueue}
        />
        <LocalStorageView
          emojiProvider={emojiResource as EmojiProvider}
          emojiQueue={emojiQueue}
        />
      </div>
    );
  }
}
