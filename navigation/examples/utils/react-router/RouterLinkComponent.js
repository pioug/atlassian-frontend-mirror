import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Link } from 'react-router-dom';

export default class RouterLinkComponent extends Component {
  static propTypes = {
    href: PropTypes.string,
    children: PropTypes.node,
    onMouseDown: PropTypes.func,
    className: PropTypes.string,
  };

  render() {
    const { href, children, onMouseDown, className } = this.props;

    return href ? (
      <Link className={className} onMouseDown={onMouseDown} to={href}>
        {children}
      </Link>
    ) : (
      children
    );
  }
}
