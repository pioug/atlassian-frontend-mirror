import React, { Component } from 'react';

import NodeResolver from 'react-node-resolver';

import {
  createAndFireEvent,
  withAnalyticsContext,
  withAnalyticsEvents,
} from '@atlaskit/analytics-next';
import { Manager, Popper, Reference } from '@atlaskit/popper';

import { Placement, Props } from '../types';

import { Container } from './styled';

const packageName = process.env._PACKAGE_NAME_ as string;
const packageVersion = process.env._PACKAGE_VERSION_ as string;

class InlineDialog extends Component<Props, {}> {
  static defaultProps = {
    isOpen: false,
    onContentBlur: () => {},
    onContentClick: () => {},
    onContentFocus: () => {},
    onClose: () => {},
    placement: 'bottom-start' as Placement,
  };

  containerRef?: HTMLElement;

  triggerRef?: HTMLElement;

  componentDidUpdate(prevProps: Props) {
    if (typeof window === 'undefined') {
      return;
    }

    if (!prevProps.isOpen && this.props.isOpen) {
      window.addEventListener('click', this.handleClickOutside, true);
    } else if (prevProps.isOpen && !this.props.isOpen) {
      window.removeEventListener('click', this.handleClickOutside, true);
    }
  }

  componentDidMount() {
    if (typeof window === 'undefined') {
      return;
    }

    if (this.props.isOpen) {
      window.addEventListener('click', this.handleClickOutside, true);
    }
  }

  componentWillUnmount() {
    if (typeof window === 'undefined') {
      return;
    }

    window.removeEventListener('click', this.handleClickOutside, true);
  }

  handleClickOutside = (event: any) => {
    const { isOpen, onClose } = this.props;

    if (event.defaultPrevented) {
      return;
    }

    const container = this.containerRef;
    const trigger = this.triggerRef;
    const { target } = event;

    // exit if we click outside but on the trigger — it can handle the clicks itself
    if (trigger && trigger.contains(target)) {
      return;
    }

    // call onClose if the click originated from outside the dialog
    if (isOpen && container && !container.contains(target)) {
      onClose && onClose({ isOpen: false, event });
    }
  };

  render() {
    const {
      children,
      placement,
      isOpen,
      content,
      onContentBlur,
      onContentFocus,
      onContentClick,
      testId,
    } = this.props;

    const popper = isOpen ? (
      <Popper placement={placement}>
        {({ ref, style }) => (
          <Container
            onBlur={onContentBlur}
            onFocus={onContentFocus}
            onClick={onContentClick}
            innerRef={(node) => {
              this.containerRef = node;

              if (typeof ref === 'function') {
                ref(node);
              } else {
                (ref as React.MutableRefObject<HTMLElement>).current = node;
              }
            }}
            style={style}
            data-testid={testId}
          >
            {content}
          </Container>
        )}
      </Popper>
    ) : null;

    return (
      <Manager>
        <Reference>
          {({ ref }) => (
            <NodeResolver
              innerRef={(node: HTMLElement) => {
                this.triggerRef = node;

                if (typeof ref === 'function') {
                  ref(node);
                } else {
                  (ref as React.MutableRefObject<HTMLElement>).current = node;
                }
              }}
            >
              {children}
            </NodeResolver>
          )}
        </Reference>
        {popper}
      </Manager>
    );
  }
}

export { InlineDialog as InlineDialogWithoutAnalytics };
const createAndFireEventOnAtlaskit = createAndFireEvent('atlaskit');

export default withAnalyticsContext({
  componentName: 'inlineDialog',
  packageName,
  packageVersion,
})(
  withAnalyticsEvents({
    onClose: createAndFireEventOnAtlaskit({
      action: 'closed',
      actionSubject: 'inlineDialog',

      attributes: {
        componentName: 'inlineDialog',
        packageName,
        packageVersion,
      },
    }),
  })(InlineDialog),
);
