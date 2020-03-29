/** @jsx jsx */
import { jsx } from '@emotion/core';
import React from 'react';
import Button from '../src';

type State = {
  count: number;
  disabled: boolean;
  childrenEls: boolean;
};

export default class extends React.Component<{}, State> {
  state = {
    count: 0,
    disabled: true,
    childrenEls: false,
  };

  increment = () => {
    this.setState(({ count }) => ({ count: count + 1 }));
  };

  toggleDisabled = () => {
    this.setState({
      disabled: !this.state.disabled,
    });
  };

  toggleChildren = () => {
    this.setState({
      childrenEls: !this.state.childrenEls,
    });
  };

  render() {
    return (
      // eslint-disable-next-line jsx-a11y/no-static-element-interactions
      <div css={{ padding: 40 }} onClick={this.increment}>
        <p>
          Native buttons only swallow onclick events when the button is the
          target of the click, i.e. it has no child elements. If it does have
          child elements, they will be the target of the click and then bubble
          up and be caught by parent event listeners.
        </p>
        <p>
          AK buttons that are disabled will swallow onClick events regardless of
          whether they contain child elements or not so they do not propagate to
          parent handlers in all cases.
        </p>
        <p>
          <button disabled={this.state.disabled}>
            {this.state.childrenEls ? (
              <div>Disabled native button</div>
            ) : (
              'Disabled native button'
            )}
          </button>
        </p>
        <p>
          <Button isDisabled={this.state.disabled}>
            {this.state.childrenEls ? (
              <div>Disabled AK button</div>
            ) : (
              'Disabled AK button'
            )}
          </Button>
        </p>
        <p>Click count: {this.state.count}</p>
        <p>
          <Button onClick={this.toggleDisabled}>Toggle Disabled</Button>
        </p>
        <p>
          <Button onClick={this.toggleChildren}>
            Toggle button child elements
          </Button>
          Child button elements {this.state.childrenEls ? '' : 'do not '}exist
        </p>
      </div>
    );
  }
}
