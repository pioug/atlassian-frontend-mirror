import React from 'react';
import cx from 'classnames';
import { Component } from 'react';

import { A } from './styled';

export interface HrefProps {
  linkUrl?: string;
  underline?: boolean;
  className?: string;

  [propName: string]: any;
}

export class Href extends Component<HrefProps, {}> {
  render() {
    const {
      linkUrl,
      underline,
      children,
      className,
      ...otherProps
    } = this.props;
    const classNames = cx(className, { underline });

    return (
      <A
        {...otherProps}
        href={linkUrl}
        className={classNames}
        target="_blank"
        rel="noopener"
      >
        {children}
      </A>
    );
  }
}
