/* eslint-disable react/prop-types */
import React, { PureComponent } from 'react';

export default class DefaultLinkComponent extends PureComponent {
  render() {
    const {
      children,
      className,
      href,
      onClick,
      onMouseDown,
      onMouseEnter,
      onMouseLeave,
      tabIndex,
      appearance, // eslint-disable-line no-unused-vars
      isSelected, // eslint-disable-line no-unused-vars
      ...otherProps
    } = this.props;

    return href ? (
      <a
        className={className}
        href={href}
        onClick={onClick}
        onMouseDown={onMouseDown}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        tabIndex={tabIndex}
        {...otherProps}
      >
        {children}
      </a>
    ) : (
      children
    );
  }
}
