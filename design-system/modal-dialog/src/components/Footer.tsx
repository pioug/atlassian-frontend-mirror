import React from 'react';

import Button from '@atlaskit/button';

import { ActionItem, Actions, Footer } from '../styled/Content';
import { ActionProps, AppearanceType, KeyboardOrMouseEvent } from '../types';

const JustifyShim = (props: any) => <span {...props} />;

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
}

export default class ModalFooter extends React.Component<FooterProps, {}> {
  render() {
    const { actions, appearance, component, onClose, showKeyline } = this.props;
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
        showKeyline,
      });
    }

    return (
      <Footer showKeyline={showKeyline}>
        <JustifyShim />
        <Actions>
          {actions
            ? actions.map(({ text, ...rest }, index) => {
                const variant =
                  index !== 0 ? 'subtle' : appearance || 'primary';

                return (
                  <ActionItem key={index}>
                    <Button appearance={variant} {...rest}>
                      {text}
                    </Button>
                  </ActionItem>
                );
              })
            : null}
        </Actions>
      </Footer>
    );
  }
}
