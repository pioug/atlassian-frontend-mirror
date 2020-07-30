/** @jsx jsx */
import React from 'react';

import { jsx } from '@emotion/core';
import rafSchedule from 'raf-schd';
import ScrollLock from 'react-scrolllock';

import {
  bodyStyles,
  Body as DefaultBody,
  keylineHeight,
  wrapperStyles,
} from '../styled/Content';
import {
  ActionProps,
  AppearanceType,
  ContainerComponentProps,
  KeyboardOrMouseEvent,
} from '../types';

import Footer, { FooterComponentProps } from './Footer';
import Header, { HeaderComponentProps } from './Header';

function getInitialState() {
  return {
    showFooterKeyline: false,
    showHeaderKeyline: false,
    showContentFocus: false,
    tabbableElements: [],
  };
}

interface Props {
  /**
   * Buttons to render in the footer.
   * The first element in the array will implictly become the primary action.
   */
  actions?: Array<ActionProps>;

  /**
   * Appearance of the modal that changes the color of the primary action and adds an icon to the heading.
   */
  appearance?: AppearanceType;

  /**
   * Contents of the modal dialog.
   */
  children?: React.ReactNode;

  /**
   * Component overrides to change components in the modal dialog.
   */
  components: {
    Header?: React.ElementType<HeaderComponentProps>;
    Body?: React.ElementType;
    Footer?: React.ElementType<FooterComponentProps>;
    Container?: React.ElementType<ContainerComponentProps>;
  };

  /**
   * Do not use. This prop has been deprecated.
   * Use the `components` prop instead.
   */
  body?: React.ElementType;

  /**
   * Do not use. This prop has been deprecated.
   * Use the `components` prop instead.
   */
  header?: React.ElementType<HeaderComponentProps>;

  /**
   * Do not use. This prop has been deprecated.
   * Use the `components` prop instead.
   */
  footer?: React.ElementType<FooterComponentProps>;

  /**
   * Callback function called when the modal dialog is requesting to be closed.
   */
  onClose: (event: KeyboardOrMouseEvent) => void;

  /**
   * Callback function called when the modal changes position in the stack.
   */
  onStackChange?: (stackIndex: number) => void;

  /**
   * Whether or not the body content should scroll.
   */
  shouldScroll?: boolean;

  /**
   * Calls `onClose` when pressing escape.
   * Defaults to `true`.
   */
  shouldCloseOnEscapePress?: boolean;

  /**
   * Will remove all styling from the modal dialog container allowing you to define your own styles,
   * heading,
   * and footer with actions.
   * This prop should only be used as a last resort.
   */
  isChromeless?: boolean;

  /**
   * Number representing where in the stack of modals this modal sits.
   * This offsets the modal dialogs vertical position.
   */
  stackIndex?: number;

  /**
   * Heading for the modal dialog.
   */
  heading?: React.ReactNode;

  /**
   * Unique id for the modal heading element.
   */
  headingId?: string;

  /**
   * When `true` will allow the heading to span multiple lines.
   * Defaults to `false`.
   */
  isHeadingMultiline?: boolean;

  /**
   * A `testId` prop is provided for specified elements,
   * which is a unique string that appears as a data attribute `data-testid` in the rendered code,
   * serving as a hook for automated tests.
   */
  testId?: string;
}

interface State {
  showFooterKeyline: boolean;
  showHeaderKeyline: boolean;
  showContentFocus: boolean;
  tabbableElements: Array<{}>;
}

export default class Content extends React.Component<Props, State> {
  static defaultProps = {
    autoFocus: false,
    components: {},
    isChromeless: false,
    stackIndex: 0,
    isHeadingMultiline: true,
  };

  escapeIsHeldDown: boolean = false;

  _isMounted: boolean = false;

  scrollContainer: HTMLElement | null = null;

  state: State = getInitialState();

  componentDidMount() {
    this._isMounted = true;

    document.addEventListener('keydown', this.handleKeyDown, false);
    document.addEventListener('keyup', this.handleKeyUp, false);

    if (this.scrollContainer) {
      const capturedScrollContainer = this.scrollContainer;
      window.addEventListener('resize', this.determineKeylines, false);
      capturedScrollContainer.addEventListener(
        'scroll',
        this.determineKeylines,
        false,
      );
      this.determineKeylines();
    }

    /* eslint-disable no-console */
    // Check for deprecated props
    if (this.props.header) {
      console.warn(
        "@atlaskit/modal-dialog: Deprecation warning - Use of the header prop in ModalDialog is deprecated. Please compose your ModalDialog using the 'components' prop instead",
      );
    }
    if (this.props.footer) {
      console.warn(
        "@atlaskit/modal-dialog: Deprecation warning - Use of the footer prop in ModalDialog is deprecated. Please compose your ModalDialog using the 'components' prop instead",
      );
    }
    if (this.props.body) {
      console.warn(
        "@atlaskit/modal-dialog: Deprecation warning - Use of the body prop in ModalDialog is deprecated. Please compose your ModalDialog using the 'components' prop instead",
      );
    }

    // Check that custom body components have used ForwardRef to attach to a DOM element
    if (this.props.components.Body) {
      if (!(this.scrollContainer instanceof HTMLElement)) {
        console.warn(
          '@atlaskit/modal-dialog: Warning - Ref must attach to a DOM element; check you are using forwardRef and attaching the ref to an appropriate element. Check the examples for more details.',
        );
      }
    }
    /* eslint-enable no-console */
  }

  UNSAFE_componentWillReceiveProps(nextProps: Props) {
    const { stackIndex } = this.props;

    // update focus scope and let consumer know when stack index has changed
    if (nextProps.stackIndex && nextProps.stackIndex !== stackIndex) {
      this.handleStackChange(nextProps.stackIndex);
    }
  }

  componentWillUnmount() {
    this._isMounted = false;

    document.removeEventListener('keydown', this.handleKeyDown, false);
    document.removeEventListener('keyup', this.handleKeyUp, false);

    if (this.scrollContainer) {
      const capturedScrollContainer = this.scrollContainer;
      window.removeEventListener('resize', this.determineKeylines, false);
      capturedScrollContainer.removeEventListener(
        'scroll',
        this.determineKeylines,
        false,
      );
    }
  }

  determineKeylines = rafSchedule(() => {
    if (!this.scrollContainer) {
      return;
    }

    const { scrollTop, scrollHeight, clientHeight } = this.scrollContainer;
    const scrollableDistance = scrollHeight - clientHeight;
    const showHeaderKeyline = scrollTop > keylineHeight;
    const showFooterKeyline = scrollTop <= scrollableDistance - keylineHeight;
    const showContentFocus = scrollHeight > clientHeight;
    this.setState({
      showHeaderKeyline,
      showFooterKeyline,
      showContentFocus,
    });
  });

  getScrollContainer = (ref: HTMLElement) => {
    if (!ref) {
      return;
    }
    this.scrollContainer = ref;
  };

  handleKeyUp = () => {
    this.escapeIsHeldDown = false;
  };

  handleKeyDown = (event: any) => {
    const { onClose, shouldCloseOnEscapePress, stackIndex = 0 } = this.props;

    // avoid consumers accidentally closing multiple modals if they hold escape.
    if (this.escapeIsHeldDown) {
      return;
    }
    if (event.key === 'Escape' || event.key === 'Esc') {
      this.escapeIsHeldDown = true;
    }

    // only the foremost modal should be interactive.
    if (!this._isMounted || stackIndex > 0) {
      return;
    }

    switch (event.key) {
      case 'Esc':
      case 'Escape':
        if (shouldCloseOnEscapePress) {
          onClose(event);
        }
        break;
      default:
    }
  };

  handleStackChange = (stackIndex: number) => {
    const { onStackChange } = this.props;
    if (onStackChange) {
      onStackChange(stackIndex);
    }
  };

  render() {
    const {
      actions,
      appearance,
      body: DeprecatedBody,
      children,
      components,
      footer,
      header,
      heading,
      isChromeless,
      isHeadingMultiline,
      onClose,
      shouldScroll,
      testId,
      headingId,
    } = this.props;

    const {
      showFooterKeyline,
      showHeaderKeyline,
      showContentFocus,
    } = this.state;
    const { Container = 'div', Body: CustomBody } = components;

    const Body = CustomBody || DeprecatedBody || DefaultBody;

    return (
      <Container css={wrapperStyles} data-testid={testId}>
        {isChromeless ? (
          children
        ) : (
          <React.Fragment>
            <Header
              id={headingId}
              appearance={appearance}
              component={components.Header ? components.Header : header}
              heading={heading}
              onClose={onClose}
              isHeadingMultiline={isHeadingMultiline}
              showKeyline={showHeaderKeyline}
              testId={testId}
            />
            {/* Backwards compatibility for styled-components innerRefs */}
            <Body
              tabIndex={showContentFocus ? 0 : undefined}
              css={bodyStyles(shouldScroll)}
              {...(!Body.hasOwnProperty('styledComponentId')
                ? { ref: this.getScrollContainer }
                : { innerRef: this.getScrollContainer })}
            >
              {children}
            </Body>
            <Footer
              actions={actions}
              appearance={appearance}
              component={components.Footer ? components.Footer : footer}
              onClose={onClose}
              showKeyline={showFooterKeyline}
            />
          </React.Fragment>
        )}
        <ScrollLock />
      </Container>
    );
  }
}
