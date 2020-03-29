import React, { PureComponent, ReactNode } from 'react';
import { Container } from './styled';

interface Props {
  /** Whether the tags should be left-aligned or right-aligned. */
  alignment?: 'start' | 'end';
  /** Tags to render within the tag group. */
  children: ReactNode;
}

export default class TagGroup extends PureComponent<Props> {
  static defaultProps = {
    alignment: 'start',
  };

  render() {
    const { alignment, children } = this.props;

    return <Container justify={alignment!}>{children}</Container>;
  }
}
