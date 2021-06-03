/* eslint-disable react/prop-types */
import React, { Component } from 'react';
import textContent from 'react-addons-text-content';

import {
  GroupTitle,
  GroupTitleText,
  GroupTitleAfter,
} from '../styled/ItemGroup';

export default class ItemGroup extends Component {
  static defaultProps = {
    role: 'group',
  };

  render() {
    const {
      children,
      elemAfter,
      isCompact,
      title,
      label,
      innerRef,
      role,
    } = this.props;

    const ariaLabel = (() => {
      if (label) {
        return textContent(label);
      }
      if (title) {
        return textContent(title);
      }
      return '';
    })();
    return (
      <div aria-label={ariaLabel} role={role} ref={innerRef}>
        {title ? (
          <GroupTitle aria-hidden="true" isCompact={isCompact}>
            <GroupTitleText>{title}</GroupTitleText>
            {elemAfter ? (
              <GroupTitleAfter
                innerRef={(r) => {
                  this.headingAfterElement = r;
                }}
              >
                {elemAfter}
              </GroupTitleAfter>
            ) : null}
          </GroupTitle>
        ) : null}
        {children}
      </div>
    );
  }
}
