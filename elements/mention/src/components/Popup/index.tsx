import React from 'react';
import ReactDOM from 'react-dom';

export interface Props {
  target?: string;
  relativePosition?: 'above' | 'below' | 'auto';
  offsetX?: number;
  offsetY?: number;
  zIndex?: number | string;
  children?: any;
}

/*
 * Simple implementation of popup while waiting for ak-inline-dialog
 */
export default class Popup extends React.PureComponent<Props, {}> {
  private popup?: HTMLElement | null;

  static defaultProps = {
    relativePosition: 'auto',
    offsetX: 0,
    offsetY: 0,
    zIndex: 0,
  };

  componentDidMount() {
    this.popup = document.createElement('div');
    document.body.appendChild(this.popup);
    this.popup.style.position = 'absolute';
    this._applyAbsolutePosition();
    this._renderContent();
  }

  componentDidUpdate() {
    this._renderContent();
  }

  componentWillUnmount() {
    if (this.popup) {
      ReactDOM.unmountComponentAtNode(this.popup);
      document.body.removeChild(this.popup);
    }
  }

  _applyBelowPosition() {
    const targetNode =
      this.props.target && document.getElementById(this.props.target);
    if (targetNode) {
      const box = targetNode.getBoundingClientRect();
      const top = box.bottom + (this.props.offsetY || 0);
      const left = box.left + (this.props.offsetX || 0);
      if (this.popup) {
        this.popup.style.top = `${top}px`;
        this.popup.style.bottom = '';
        this.popup.style.left = `${left}px`;
      }
    }
  }

  _applyAbovePosition() {
    const targetNode =
      this.props.target && document.getElementById(this.props.target);
    if (targetNode) {
      const box = targetNode.getBoundingClientRect();
      const bottom = window.innerHeight - box.top + (this.props.offsetY || 0);
      const left = box.left + (this.props.offsetX || 0);
      if (this.popup) {
        this.popup.style.top = '';
        this.popup.style.bottom = `${bottom}px`;
        this.popup.style.left = `${left}px`;
      }
    }
  }

  _applyAbsolutePosition() {
    if (this.props.relativePosition === 'above') {
      this._applyAbovePosition();
    } else if (this.props.relativePosition === 'below') {
      this._applyBelowPosition();
    } else {
      const targetNode =
        this.props.target && document.getElementById(this.props.target);
      if (targetNode) {
        const box = targetNode.getBoundingClientRect();
        const viewPortHeight = window.innerHeight;
        if (box.top < viewPortHeight / 2) {
          this._applyBelowPosition();
        } else {
          this._applyAbovePosition();
        }
      }
    }
    if (this.props.zIndex && this.popup) {
      this.popup.style.zIndex = `${this.props.zIndex}`;
    }
  }

  _renderContent() {
    if (this.popup) {
      ReactDOM.render(this.props.children, this.popup);
    }
  }

  render() {
    // Placeholder element for react to render inplace
    return <div />;
  }
}
