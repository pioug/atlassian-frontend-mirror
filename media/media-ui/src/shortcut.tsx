import { Component } from 'react';

export const keyCodes = {
  space: 'Space',
  m: 'KeyM',
  rightArrow: 'ArrowRight',
  leftArrow: 'ArrowLeft',
};

type WithCode = {
  code: string;
  keyCode?: never;
};
export type ShortcutProps = {
  handler: () => void;
  eventType?: 'keyup' | 'keydown';
} & WithCode;

export class Shortcut extends Component<ShortcutProps, {}> {
  eventType: keyof DocumentEventMap = 'keydown';
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
    const { handler, code } = this.props;

    if (code !== undefined && e.code === code) {
      handler();
    }
  };

  private init = () => {
    const { eventType = 'keydown' } = this.props;
    this.eventType = eventType;
    document.addEventListener(this.eventType, this.keyHandler);
  };

  private release = () => {
    document.removeEventListener(
      this.eventType,
      this.keyHandler as EventListener,
    );
  };
}
