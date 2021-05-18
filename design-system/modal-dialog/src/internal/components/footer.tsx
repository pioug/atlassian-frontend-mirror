/** @jsx jsx */

import React from 'react';

import { jsx } from '@emotion/core';

import Button from '@atlaskit/button/custom-theme-button';

import { internalFooterStyles } from '../styles/content';
import { ActionProps, AppearanceType, KeyboardOrMouseEvent } from '../types';

export interface FooterProps extends FooterComponentProps {
  /**
   * Buttons to render in the footer.
   * The first element in the array will implictly become the primary action.
   */
  actions?: Array<ActionProps>;

  /**
   * Component overrides to change footer.
   */
  component?: React.ElementType<FooterComponentProps>;
}

export interface FooterComponentProps {
  /**
   * Appearance of the modal that changes the color of the primary action and adds an icon to the heading.
   */
  appearance?: AppearanceType;

  /**
   * Callback function called when the modal dialog is requesting to be closed.
   */
  onClose: (e: KeyboardOrMouseEvent) => void;

  /**
   * When set to `true` should be used to draw a line above the footer signifying that there is overflowed content inside the modal dialog.
   */
  showKeyline?: boolean;

  /**
   * A `testId` prop is provided for specified elements,
   * which is a unique string that appears as a data attribute `data-testid` in the rendered code,
   * serving as a hook for automated tests.
   */
  testId?: string;
}

export default function ModalFooter(props: FooterProps) {
  const { actions, appearance, component, onClose, testId } = props;
  const warning = 'You can provide `component` OR `actions`, not both.';

  if (!component && !actions) {
    return null;
  }
  if (component && actions) {
    console.warn(warning); // eslint-disable-line no-console
    return null;
  }
  if (component) {
    return React.createElement(component, {
      appearance,
      onClose,
    });
  }

  return (
    <footer
      css={internalFooterStyles}
      data-testid={testId && `${testId}--footer`}
    >
      {actions &&
        actions.map(({ text, ...rest }, index) => (
          <Button
            key={index}
            appearance={index !== 0 ? 'subtle' : appearance || 'primary'}
            data-ds--modal-dialog--action
            testId={testId && `${testId}--action-${index}`}
            {...rest}
          >
            {text}
          </Button>
        ))}
    </footer>
  );
}
