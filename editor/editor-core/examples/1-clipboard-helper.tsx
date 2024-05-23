import React from 'react';

import * as clipboard from 'clipboard-polyfill';


export interface State {
  value: string;
}
export default class ClipboardHelper extends React.Component<{}, State> {
  state = { value: '' };

  handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    this.setState({ value: e.target.value });
  };
  clearValue = () => {
    this.setState({ value: '' });
  };

  copyAs = async (type = 'text/plain') =>  {
    const blob = new Blob([this.state.value], { type });
    const dt = new ClipboardItem({
      [type]: blob
    });
    await clipboard.write([dt]);
  };

  render() {
    return (
      <div>
        <textarea
          id="input"
          onFocus={this.clearValue}
          onChange={this.handleChange}
          value={this.state.value}
        />
        <button
          className="copy-as-plaintext"
          onClick={() => this.copyAs('text/plain')}
        >
          Copy Plain Text
        </button>
        <button
          className="copy-as-html"
          onClick={() => this.copyAs('text/html')}
        >
          Copy HTML
        </button>
      </div>
    );
  }
}
