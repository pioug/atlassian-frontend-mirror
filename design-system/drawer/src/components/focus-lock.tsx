import React, { Component } from 'react';
import invariant from 'tiny-invariant';
import ReactFocusLock from 'react-focus-lock';
import { FocusLockProps } from './types';

// Thin wrapper over react-focus-lock. This wrapper only exists to ensure API compatibility.
// This component should be deleted during https://ecosystem.atlassian.net/browse/AK-5658
export default class FocusLock extends Component<FocusLockProps> {
  componentDidMount() {
    const { isFocusLockEnabled, autoFocusFirstElem } = this.props;

    if (process.env.NODE_ENV !== 'production' && !process.env.CI) {
      invariant(
        typeof autoFocusFirstElem === 'boolean',
        '@atlaskit/modal-dialog: Passing a function as autoFocus is deprecated. Instead call focus on the element ref or use the autofocus property.',
      );
    }
    if (typeof autoFocusFirstElem === 'function' && isFocusLockEnabled) {
      const elem = autoFocusFirstElem();
      if (elem && elem.focus) {
        elem.focus();
      }
    }
  }

  render() {
    const {
      isFocusLockEnabled,
      autoFocusFirstElem,
      shouldReturnFocus,
    } = this.props;
    return (
      <ReactFocusLock
        disabled={!isFocusLockEnabled}
        autoFocus={!!autoFocusFirstElem}
        returnFocus={shouldReturnFocus}
      >
        {this.props.children}
      </ReactFocusLock>
    );
  }
}
