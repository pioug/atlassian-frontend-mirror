/* eslint-disable react/prop-types */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import FocusTrap from 'react-focus-lock';

/* eslint-disable react/sort-comp */
export default class FocusLock extends Component {
  ariaHiddenNode;

  initFromProps = false;

  teardownFromProps = false;

  static contextTypes = {
    /** available when invoked within @atlaskit/layer-manager */
    ariaHiddenNode: PropTypes.object,
  };

  static defaultProps = {
    autoFocus: true,
    enabled: true,
    returnFocus: true,
  };

  componentDidMount() {
    const { enabled, autoFocus } = this.props;

    if (typeof autoFocus === 'function') {
      // eslint-disable-next-line no-console
      console.warn(
        '@atlaskit/layer-manager: Passing a function as autoFocus in FocusLock is deprecated. Please see "Auto focusing an element" in https://atlaskit.atlassian.com/packages/design-system/layer-manager',
      );
    }

    if (enabled) {
      this.initialise();
    }
  }

  componentWillUnmount() {
    if (!this.initFromProps && !this.teardownFromProps) {
      this.teardown();
    }
  }

  componentDidUpdate(prevProps) {
    if (this.props.enabled && this.props.enabled !== prevProps.enabled) {
      this.initFromProps = true;
      this.initialise();
    }

    if (!this.props.enabled && this.props.enabled !== prevProps.enabled) {
      this.teardownFromProps = true;
      this.teardown();
    }
  }

  initialise = () => {
    const { autoFocus } = this.props;
    // set the element to hide from assistive technology
    this.ariaHiddenNode =
      this.props.ariaHiddenNode || this.context.ariaHiddenNode;

    // accessible `popup` content
    if (this.ariaHiddenNode) {
      this.ariaHiddenNode.setAttribute('aria-hidden', '');
    }
    if (typeof autoFocus === 'function') {
      const elem = autoFocus();
      if (elem && elem.focus) {
        elem.focus();
      }
    }
  };

  teardown = () => {
    if (this.ariaHiddenNode) {
      this.ariaHiddenNode.removeAttribute('aria-hidden');
    }
  };

  render() {
    const { enabled, autoFocus, returnFocus } = this.props;
    return (
      <FocusTrap
        disabled={!enabled}
        autoFocus={!!autoFocus}
        returnFocus={returnFocus}
      >
        {this.props.children}
      </FocusTrap>
    );
  }
}
