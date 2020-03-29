import React from 'react';
import Tag from '@atlaskit/tag';
import TagGroup from '../src';

interface Props {
  alignment: 'start' | 'end';
}

interface State {
  tags: Array<string>;
}

class MyTagGroup extends React.Component<Props, State> {
  state = {
    tags: ['Candy canes', 'Tiramisu', 'Gummi bears', 'Wagon Wheels'],
  };

  handleRemoveRequest = () => true;

  handleRemoveComplete = (text: string) => {
    this.setState({
      tags: this.state.tags.filter(str => str !== text),
    });
    console.log(`Removed ${text}.`);
  };

  render() {
    return (
      <TagGroup alignment={this.props.alignment}>
        {this.state.tags.map(text => (
          <Tag
            key={text}
            onAfterRemoveAction={this.handleRemoveComplete}
            onBeforeRemoveAction={this.handleRemoveRequest}
            removeButtonText="Remove me"
            text={text}
          />
        ))}
      </TagGroup>
    );
  }
}

export default () => (
  <div>
    <MyTagGroup alignment="start" />
    <MyTagGroup alignment="end" />
  </div>
);
