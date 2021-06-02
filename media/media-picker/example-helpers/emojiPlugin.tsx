import React from 'react';
import EmojiEmojiIcon from '@atlaskit/icon/glyph/emoji/emoji';
import FieldText from '@atlaskit/field-text';
import { Component } from 'react';
import { EmojiHeader, EmojiWrapper } from './styled';
import { SelectedItem } from '../src/popup/domain';
import {
  MediaPickerPlugin,
  PluginActions,
  PluginFile,
} from '../src/domain/plugin';
import { BricksView, BrickItem } from '../src/plugins/views/bricks';

export type EmojiResult = { [key: string]: string };
export interface EmojiViewState {
  results: EmojiResult;
  query: string;
}

export interface EmojiViewProps {
  actions: PluginActions;
  selectedItems: SelectedItem[];
}

export interface UnsplashFileMetadata {
  src: string;
  srcFull: string;
}

export const PLUGIN_NAME = 'emoji';
const maxVisibleResults = 30;
const random = (min: number, max: number) =>
  Math.floor(Math.random() * (max - min + 1) + min);

class EmojiView extends Component<EmojiViewProps, EmojiViewState> {
  static allResults?: EmojiResult = undefined;

  state: EmojiViewState = {
    results: {},
    query: '',
  };

  async componentDidMount() {
    this.search();
  }

  search = async () => {
    const { query } = this.state;
    const results = EmojiView.allResults
      ? EmojiView.allResults
      : ((await (
          await fetch('https://api.github.com/emojis')
        ).json()) as EmojiResult);

    if (!EmojiView.allResults) {
      EmojiView.allResults = results;
    }

    const keys = Object.keys(results).filter((key) => key.indexOf(query) > -1);
    const visibleResults: { [key: string]: string } = {};

    keys.forEach((key, index) => {
      if (index <= maxVisibleResults) {
        visibleResults[key] = results[key];
      }
    });

    this.setState({
      results: visibleResults,
    });
  };

  onCardClick = (id: string) => () => {
    const { results } = this.state;
    const { actions } = this.props;
    const selectedResult = Object.keys(results).find((key) => key === id);
    if (!selectedResult) {
      return;
    }
    const metadata = {
      key: selectedResult,
      src: results[selectedResult],
    };
    const item: PluginFile = {
      id,
      metadata,
    };
    actions.fileClick(item, PLUGIN_NAME);
  };

  onQueryChange = (event: any) => {
    const query = event.currentTarget.value;

    this.setState({ query }, this.search);
  };

  onFileClick = (id: string) => this.onCardClick(id)();

  renderBricks = () => {
    const { selectedItems } = this.props;
    const { results } = this.state;
    const items: BrickItem[] = Object.keys(results).map((key) => {
      const identifier: BrickItem = {
        id: key,
        dataURI: results[key],
        name: key,
        dimensions: {
          height: random(250, 200),
          width: random(150, 100),
        },
      };

      return identifier;
    });

    return (
      <BricksView
        items={items}
        selectedItems={selectedItems}
        pluginName={PLUGIN_NAME}
        onFileClick={this.onFileClick}
      />
    );
  };

  render() {
    const { query } = this.state;
    const content = this.renderBricks();

    return (
      <EmojiWrapper>
        <EmojiHeader>
          <h2>Emoji</h2>
          <FieldText
            placeholder=""
            onChange={this.onQueryChange}
            value={query}
          />
        </EmojiHeader>
        {content}
      </EmojiWrapper>
    );
  }
}

export const emojiPlugin: MediaPickerPlugin = {
  name: PLUGIN_NAME,
  icon: <EmojiEmojiIcon label="emoji-icon" />,
  render: (actions, selectedItems) => (
    <EmojiView actions={actions} selectedItems={selectedItems} />
  ),
};
