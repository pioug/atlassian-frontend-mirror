import React from 'react';
import { MentionProvider } from '../src/api/MentionResource';
import { PresenceProvider } from '../src/api/PresenceResource';
import MentionPicker, { Position } from '../src/components/MentionPicker';
import { MentionDescription, OnMentionEvent } from '../src/types';
import debug from '../src/util/logger';
import SearchTextInput from './demo-search-text-input';

const onOpen = () => debug('picker opened');
const onClose = () => debug('picker closed');

export interface Props {
  label: string;
  onSelection?: OnMentionEvent;
  resourceProvider?: MentionProvider;
  presenceProvider?: PresenceProvider;
  relativePosition?: Position;
  zIndex?: number;
}

export interface State {
  active: boolean;
  query: string;
}

export default class MentionTextInput extends React.Component<Props, State> {
  private mentionPickerRef?: MentionPicker | null;

  constructor(props: Props) {
    super(props);
    this.state = {
      active: false,
      query: '',
    };
  }

  private showMentionPopup = () => {
    this.setState({
      active: true,
    });
  };

  private hideMentionPopup = () => {
    this.setState({
      active: false,
    });
  };

  private handleSelection = (mention: MentionDescription) => {
    this.hideMentionPopup();
    if (this.props.onSelection) {
      this.props.onSelection(mention);
    }
  };

  private updateSearch: React.ChangeEventHandler<HTMLInputElement> = (
    event,
  ) => {
    if (this.state.active) {
      this.setState({
        query: event.target.value || '',
      });
    }
  };

  private handleInputUp = () =>
    this.mentionPickerRef && this.mentionPickerRef.selectPrevious();
  private handleInputDown = () =>
    this.mentionPickerRef && this.mentionPickerRef.selectNext();
  private handleInputEnter = () =>
    this.mentionPickerRef && this.mentionPickerRef.chooseCurrentSelection();
  private handleMentionPickerRef = (ref: MentionPicker | null) => {
    this.mentionPickerRef = ref;
  };

  render() {
    debug('demo-mention-text-input.render');
    /* eslint no-unused-vars: 0 */
    const {
      label,
      relativePosition,
      resourceProvider,
      presenceProvider,
      zIndex,
    } = this.props;
    const searchInput = (
      <SearchTextInput
        inputId="demo-input"
        label={label}
        onChange={this.updateSearch}
        onUp={this.handleInputUp}
        onDown={this.handleInputDown}
        onEnter={this.handleInputEnter}
        onEscape={this.hideMentionPopup}
        onFocus={this.showMentionPopup}
        onBlur={this.hideMentionPopup}
      />
    );

    let mentionPicker;

    if (this.state.active) {
      mentionPicker = (
        // @ts-ignore
        <MentionPicker
          target="demo-input"
          position={relativePosition}
          resourceProvider={resourceProvider as MentionProvider}
          presenceProvider={presenceProvider}
          onSelection={this.handleSelection}
          onOpen={onOpen}
          onClose={onClose}
          ref={this.handleMentionPickerRef}
          query={this.state.query}
          zIndex={zIndex}
        />
      );
    }

    return (
      <div style={{ padding: '10px' }}>
        {searchInput}
        {mentionPicker}
      </div>
    );
  }
}
