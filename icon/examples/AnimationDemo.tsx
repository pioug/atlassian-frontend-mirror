import React, { Component, ComponentType, ChangeEvent } from 'react';
import sample from 'lodash.sample';

import BookIcon from '../glyph/book';
import ArrowUpIcon from '../glyph/arrow-up';
import ArrowDownIcon from '../glyph/arrow-down';
import ArrowLeftIcon from '../glyph/arrow-left';
import ArrowRightIcon from '../glyph/arrow-right';

type State = {
  components: ComponentType<any>[];
};

class AnimationDemo extends Component<{}, State> {
  checkbox?: HTMLInputElement;
  timer?: number;

  static displayName: string;

  readonly state: State = {
    components: [
      ArrowDownIcon,
      ArrowLeftIcon,
      ArrowRightIcon,
      ArrowUpIcon,
      BookIcon,
    ],
  };

  componentDidMount() {
    this.startAnimating();
    if (this.checkbox) this.checkbox.checked = true;
  }

  componentWillUnmount() {
    this.stopAnimating();
  }

  randomIcon = () => {
    const Icon = sample(this.state.components);
    return <Icon label="Random icon" />;
  };

  startAnimating = () => {
    this.timer = window.setInterval(() => this.forceUpdate(), 300);
  };

  stopAnimating = () => {
    if (this.timer) {
      clearInterval(this.timer);
    }
  };

  toggleAnimation = (e: ChangeEvent) => {
    if ((e.target as HTMLInputElement).checked) {
      this.startAnimating();
    } else {
      this.stopAnimating();
    }
  };

  render() {
    return (
      <div>
        <input
          type="checkbox"
          id="animate"
          onChange={this.toggleAnimation}
          ref={(elem: HTMLInputElement) => {
            this.checkbox = elem;
          }}
        />{' '}
        <label htmlFor="animate">Animate</label>
        <hr />
        <div>
          {this.randomIcon()}
          {this.randomIcon()}
          {this.randomIcon()}
          {this.randomIcon()}
          {this.randomIcon()}
          {this.randomIcon()}
          {this.randomIcon()}
          {this.randomIcon()}
        </div>
      </div>
    );
  }
}

AnimationDemo.displayName = 'AnimationDemo';

export default AnimationDemo;
