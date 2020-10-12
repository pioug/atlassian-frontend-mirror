import React from 'react';
import { components } from '@atlaskit/select';

export type Props = {
  selectProps?: { disableInput?: boolean };
  innerRef: (ref: React.Ref<HTMLInputElement>) => void;
};

export class Input extends React.Component<Props> {
  // onKeyPress is used instead as
  // react-select is using onKeyDown for capturing keyboard input
  handleKeyPress = (e: KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
    }
  };

  render() {
    const { selectProps } = this.props;
    return (
      <components.Input
        {...(this.props as any)}
        innerRef={this.props.innerRef}
        isDisabled={selectProps && selectProps.disableInput}
        onKeyPress={this.handleKeyPress}
      />
    );
  }
}
