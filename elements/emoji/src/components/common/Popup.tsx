import React from 'react';
import { PureComponent, ReactElement } from 'react';
import ReactDOM from 'react-dom';
import { RelativePosition } from '../../types';

const getTargetNode = (target: string | Element): Element | null => {
  if (typeof target === 'string') {
    return document.querySelector(target);
  }
  // Expect to be an element
  return target;
};

export interface Props {
  target: string | Element;
  relativePosition?: RelativePosition;
  offsetX?: number;
  offsetY?: number;
  zIndex?: string | number;
  children: ReactElement<any>;
}

/*
 * Simple implementation of popup while waiting for ak-inline-dialog
 */
export default class Popup extends PureComponent<Props, {}> {
  private popup?: HTMLElement;
  private debounced: number | null = null;

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
    window.addEventListener('resize', this.handleResize);
    this.applyAbsolutePosition();
    this.renderContent();
  }

  componentDidUpdate() {
    this.applyAbsolutePosition();
    this.renderContent();
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.handleResize);
    if (this.popup) {
      ReactDOM.unmountComponentAtNode(this.popup);
      document.body.removeChild(this.popup);
    }
  }

  // Internal
  applyBelowPosition() {
    const targetNode = getTargetNode(this.props.target);
    if (targetNode && this.popup) {
      const box = targetNode.getBoundingClientRect();
      const top = box.bottom + (this.props.offsetY || 0);
      const left = box.left + (this.props.offsetX || 0);
      this.popup.style.top = `${top}px`;
      this.popup.style.bottom = '';
      this.popup.style.left = `${left}px`;
    }
  }

  applyAbovePosition() {
    const targetNode = getTargetNode(this.props.target);
    if (targetNode && this.popup) {
      const box = targetNode.getBoundingClientRect();
      const bottom = window.innerHeight - box.top + (this.props.offsetY || 0);
      const left = box.left + (this.props.offsetX || 0);
      this.popup.style.top = '';
      this.popup.style.bottom = `${bottom}px`;
      this.popup.style.left = `${left}px`;
    }
  }

  applyAbsolutePosition() {
    if (this.props.relativePosition === 'above') {
      this.applyAbovePosition();
    } else if (this.props.relativePosition === 'below') {
      this.applyBelowPosition();
    } else {
      const targetNode = getTargetNode(this.props.target);
      if (targetNode) {
        const box = targetNode.getBoundingClientRect();
        const viewPortHeight = window.innerHeight;
        if (box.top < viewPortHeight / 2) {
          this.applyBelowPosition();
        } else {
          this.applyAbovePosition();
        }
      }
    }
    if (this.props.zIndex && this.popup) {
      this.popup.style.zIndex = `${this.props.zIndex}`;
    }
  }

  private handleResize = () => {
    if (this.debounced) {
      clearTimeout(this.debounced);
      this.debounced = null;
    }
    // Timeout set to 30ms as to not throttle IE11
    this.debounced = window.setTimeout(() => {
      this.applyAbsolutePosition();
      this.debounced = null;
    }, 30);
  };

  renderContent() {
    if (this.popup) {
      ReactDOM.render<ReactElement<any>>(this.props.children, this.popup);
    }
  }

  render() {
    // inline placeholder element for react to render inplace
    return <div />;
  }
}
