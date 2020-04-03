import { Component } from 'react';

export const keyCodes = {
  space: 32,
  m: 77,
};

export interface ShortcutProps {
  keyCode: number;
  handler: () => void;
}

export class Shortcut extends Component<ShortcutProps, {}> {
  componentDidMount() {
    this.init();
  }

  componentWillUnmount() {
    this.release();
  }

  render() {
    return null;
  }

  private keyHandler = (e: KeyboardEvent) => {
    const { keyCode, handler } = this.props;
    if (e.keyCode === keyCode) {
      handler();
    }
  };

  private init = () => {
    document.addEventListener('keydown', this.keyHandler);
  };

  private release = () => {
    document.removeEventListener('keydown', this.keyHandler);
  };
}
