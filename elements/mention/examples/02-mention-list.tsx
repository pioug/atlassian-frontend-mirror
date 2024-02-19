import { token } from '@atlaskit/tokens';
import React from 'react';
import { IntlProvider } from 'react-intl-next';
import {
  mentions as mentionsData,
  onSelection,
  randomMentions,
} from '../example-helpers';
import MentionList from '../src/components/MentionList';
import { MentionDescription } from '../src/types';

export interface State {
  mentions: MentionDescription[];
}

export default class DemoMentionList extends React.Component<any, State> {
  private mentionListRef?: MentionList | null;

  constructor(props: any) {
    super(props);
    this.state = {
      mentions: mentionsData, // Show all mentions on initial render
    };
  }

  private updateData = () => {
    this.setState({
      mentions: randomMentions(),
    });
  };

  private moveUp = () => {
    if (this.mentionListRef) {
      // FIXME reactify should expose prototype methods from a wc
      this.mentionListRef.selectPrevious();
    }
  };

  private moveDown = () => {
    if (this.mentionListRef) {
      this.mentionListRef.selectNext();
    }
  };

  private handleMentionListRef = (ref: MentionList | null) => {
    this.mentionListRef = ref;
  };

  render() {
    const mentionList = (
      <MentionList
        mentions={this.state.mentions}
        onSelection={onSelection}
        ref={this.handleMentionListRef}
      />
    );

    return (
      <div style={{ paddingLeft: `${token('space.150', '12px')}` }}>
        <div style={{ paddingBottom: `${token('space.150', '12px')}` }}>
          <button
            onClick={this.updateData}
            style={{
              height: `${token('space.400', '32px')}`,
              marginRight: `${token('space.150', '12px')}`,
            }}
          >
            Random refresh
          </button>
          <button
            onClick={this.moveUp}
            style={{
              height: `${token('space.400', '32px')}`,
              marginRight: `${token('space.150', '12px')}`,
            }}
          >
            Up
          </button>
          <button
            onClick={this.moveDown}
            style={{
              height: `${token('space.400', '32px')}`,
              marginRight: `${token('space.150', '12px')}`,
            }}
          >
            Down
          </button>
        </div>
        <IntlProvider locale="en">
          <div data-testid="vr-tested">{mentionList}</div>
        </IntlProvider>
      </div>
    );
  }
}
