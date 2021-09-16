import { Component } from 'react';

export const keyCodes = {
  space: 'Space',
  m: 'KeyM',
  rightArrow: 'ArrowRight',
  leftArrow: 'ArrowLeft',
};

type WithKeyCode = {
  /** @deprecated use code: string instead */
  keyCode: number;
  code?: never;
};
type WithCode = {
  code: string;
  keyCode?: never;
};
export type ShortcutProps = {
  handler: () => void;
} & (WithKeyCode | WithCode);

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
    const { handler, code, keyCode } = this.props;
    if (keyCode !== undefined && e.keyCode === keyCode) {
      handler();
    }

    if (code !== undefined && e.code === code) {
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
