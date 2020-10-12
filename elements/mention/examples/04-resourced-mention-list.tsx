import React from 'react';
import { onSelection, resourceProvider } from '../example-helpers';
import SearchTextInput from '../example-helpers/demo-search-text-input';
import ResourcedMentionList from '../src/components/ResourcedMentionList';

export interface State {
  query: string;
}

export default class DemoResourcedMentionList extends React.Component<
  {},
  State
> {
  private resourcedMentionListRef?: ResourcedMentionList | null;

  constructor(props: {}) {
    super(props);
    this.state = {
      query: '',
    };
  }

  private updateQuery = (event: React.SyntheticEvent<any>): void => {
    const target = event.target as HTMLInputElement;
    this.setState({
      query: target.value,
    });
  };

  private handleMentionListRef = (ref: ResourcedMentionList | null) => {
    this.resourcedMentionListRef = ref;
  };

  private handleInputUp = () => {
    this.resourcedMentionListRef &&
      this.resourcedMentionListRef.selectPrevious();
  };
  private handleInputDown = () => {
    this.resourcedMentionListRef && this.resourcedMentionListRef.selectNext();
  };
  private handleInputEnter = () => {
    this.resourcedMentionListRef &&
      this.resourcedMentionListRef.chooseCurrentSelection();
  };

  render() {
    const mentionList = (
      <ResourcedMentionList
        onSelection={onSelection}
        resourceProvider={resourceProvider}
        query={this.state.query}
        ref={this.handleMentionListRef}
        isTeamMentionHighlightEnabled
      />
    );

    return (
      <div style={{ width: '400px', padding: '10px' }}>
        <SearchTextInput
          inputId="mention-input"
          label="User search"
          onChange={this.updateQuery}
          onUp={this.handleInputUp}
          onDown={this.handleInputDown}
          onEnter={this.handleInputEnter}
        />
        {mentionList}
      </div>
    );
  }
}
