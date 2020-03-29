import React from 'react';
import invariant from 'tiny-invariant';
import ReactFocusLock from 'react-focus-lock';

interface Props {
  /**
    Boolean indicating whether to focus on the first tabbable element inside the focus lock.
  */
  autoFocus: boolean | (() => HTMLElement | null);
  /**
    Content inside the focus lock.
  */
  children?: React.ReactNode;
  /**
    Whether the focus lock is active or not.
  */
  isEnabled: boolean;
  /**
    Whether to return the focus to the previous active element.
  */
  shouldReturnFocus: boolean;
}

// Thin wrapper over react-focus-lock. This wrapper only exists to ensure API compatibility.
// This component should be deleted during https://ecosystem.atlassian.net/browse/AK-5658
export default class FocusLock extends React.Component<Props> {
  static defaultProps = {
    autoFocus: true,
    isEnabled: true,
    shouldReturnFocus: true,
  };

  componentDidMount() {
    const { isEnabled, autoFocus } = this.props;

    if (process.env.NODE_ENV !== 'production') {
      invariant(
        typeof autoFocus === 'boolean',
        '@atlaskit/modal-dialog: Passing a function as autoFocus is deprecated. Instead call focus on the element ref or use the autofocus property.',
      );
    }
    if (typeof autoFocus === 'function' && isEnabled) {
      const elem = autoFocus();
      if (elem && elem.focus) {
        elem.focus();
      }
    }
  }

  render() {
    const { isEnabled, autoFocus, shouldReturnFocus } = this.props;
    return (
      <ReactFocusLock
        disabled={!isEnabled}
        autoFocus={!!autoFocus}
        returnFocus={shouldReturnFocus}
      >
        {this.props.children}
      </ReactFocusLock>
    );
  }
}
