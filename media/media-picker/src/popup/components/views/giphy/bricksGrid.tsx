import React from 'react';
import { Component } from 'react';

// We need to import Bricks in both ways because the way they create the dist doesn't play well with TS
import DefaultImportBricks from 'bricks.js';
import * as Bricks from 'bricks.js';

import { BricksInstance, SizeDetail } from 'bricks.js';

export interface BricksLayoutProps {
  id: string;
  children: JSX.Element[];
  packed?: string;
  sizes?: SizeDetail[];
}

export interface BricksLayoutState {
  instance: BricksInstance;
}

export class BricksLayout extends Component<
  BricksLayoutProps,
  BricksLayoutState
> {
  static defaultProps = {
    packed: 'data-packed',
    sizes: [{ columns: 3, gutter: 10 }],
  };

  componentDidMount() {
    const {
      id,
      packed = 'data-packed',
      sizes = [{ columns: 3, gutter: 10 }],
    } = this.props;
    // We try to use the TS import, otherwise we use the "default" export
    const BricksConstructor = (typeof Bricks === 'function'
      ? Bricks
      : DefaultImportBricks) as any;
    const instance = BricksConstructor({
      container: `#${id}`,
      packed,
      sizes,
    });

    instance.resize(true);
    this.setState({ instance });
  }

  componentDidUpdate({ children: prevChildren }: BricksLayoutProps) {
    const { children } = this.props;

    const { instance } = this.state;
    if (prevChildren.length === 0 && children.length === 0) {
      return;
    }

    return instance.pack();
  }

  componentWillUnmount() {
    this.state.instance.resize(false);
  }

  render() {
    const { id, children } = this.props;
    return <div id={id}>{children}</div>;
  }
}
