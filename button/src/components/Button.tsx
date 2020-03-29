/** @jsx jsx */
import { jsx } from '@emotion/core';
import React from 'react';
import memoize from 'memoize-one';
import {
  withAnalyticsEvents,
  withAnalyticsContext,
  createAndFireEvent,
} from '@atlaskit/analytics-next';
import {
  name as packageName,
  version as packageVersion,
} from '../version.json';
import GlobalTheme from '@atlaskit/theme/components';
import { Theme } from '../theme';
import { mapAttributesToState, filterProps, composeRefs } from './utils';
import Content from './Content';
import InnerWrapper from './InnerWrapper';
import IconWrapper from './IconWrapper';
import LoadingSpinner from './LoadingSpinner';
import { ButtonProps, ThemeMode, ThemeProps, ThemeTokens } from '../types';

export type ButtonState = {
  isHover: boolean;
  isActive: boolean;
  isFocus: boolean;
};

export class Button extends React.Component<ButtonProps, ButtonState> {
  static defaultProps = {
    appearance: 'default',
    autoFocus: false,
    isDisabled: false,
    isLoading: false,
    isSelected: false,
    shouldFitContainer: false,
    spacing: 'default',
    type: 'button',
  };

  // ref can be a range of things because we render button, a, span or other React components
  button: React.Ref<HTMLButtonElement> = React.createRef<HTMLButtonElement>();

  // Makes sure we don't call ref every render.
  getComposedRefs = memoize(composeRefs);

  state = {
    isActive: false,
    isFocus: false,
    isHover: false,
  };

  componentDidMount() {
    if (this.props.autoFocus && this.button instanceof HTMLButtonElement) {
      this.button.focus();
    }
  }

  isInteractive = () => !this.props.isDisabled && !this.props.isLoading;

  onMouseEnter = (e: React.MouseEvent<HTMLElement>) => {
    this.setState({ isHover: true });
    if (this.props.onMouseEnter) {
      this.props.onMouseEnter(e);
    }
  };

  onMouseLeave = (e: React.MouseEvent<HTMLElement>) => {
    this.setState({ isHover: false, isActive: false });
    if (this.props.onMouseLeave) {
      this.props.onMouseLeave(e);
    }
  };

  onMouseDown = (e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault();
    this.setState({ isActive: true });
    if (this.props.onMouseDown) {
      this.props.onMouseDown(e);
    }
  };

  onMouseUp = (e: React.MouseEvent<HTMLElement>) => {
    this.setState({ isActive: false });
    if (this.props.onMouseUp) {
      this.props.onMouseUp(e);
    }
  };

  onFocus: React.FocusEventHandler<HTMLButtonElement> = event => {
    this.setState({ isFocus: true });
    if (this.props.onFocus) {
      this.props.onFocus(event);
    }
  };

  onBlur: React.FocusEventHandler<HTMLButtonElement> = event => {
    this.setState({ isFocus: false });
    if (this.props.onBlur) {
      this.props.onBlur(event);
    }
  };

  getElement = () => {
    const { href, isDisabled } = this.props;
    if (href) {
      return isDisabled ? 'span' : 'a';
    }
    return 'button';
  };

  // Swallow click events when the button is disabled
  // to prevent inner child clicks bubbling up.
  onInnerClick: React.MouseEventHandler<HTMLElement> = e => {
    if (!this.isInteractive()) {
      e.stopPropagation();
    }
    return true;
  };

  render() {
    const {
      appearance = 'default',
      children,
      className,
      component: CustomComponent,
      consumerRef,
      iconAfter,
      iconBefore,
      isDisabled = false,
      isLoading = false,
      isSelected = false,
      shouldFitContainer = false,
      spacing = 'default',
      theme = (
        current: (props: ThemeProps) => ThemeTokens,
        props: ThemeProps,
      ) => current(props),
      testId,
      ...rest
    } = this.props;

    const attributes = { ...this.state, isSelected, isDisabled };

    const StyledButton: React.ReactType = CustomComponent || this.getElement();

    const iconIsOnlyChild: boolean = !!(
      (iconBefore && !iconAfter && !children) ||
      (iconAfter && !iconBefore && !children)
    );

    const specifiers = (styles: {}) => {
      if (StyledButton === 'a') {
        return {
          'a&': styles,
        };
      } else if (StyledButton === CustomComponent) {
        return {
          '&, a&, &:hover, &:active, &:focus': styles,
        };
      }
      return styles;
    };

    return (
      <Theme.Provider value={theme}>
        <GlobalTheme.Consumer>
          {({ mode }: { mode: ThemeMode }) => (
            <Theme.Consumer
              mode={mode}
              state={mapAttributesToState(attributes)}
              iconIsOnlyChild={iconIsOnlyChild}
              {...this.props}
            >
              {({ buttonStyles, spinnerStyles }) => (
                <StyledButton
                  {...filterProps(rest, StyledButton)}
                  data-testid={testId}
                  ref={this.getComposedRefs(this.button, consumerRef)}
                  onMouseEnter={this.onMouseEnter}
                  onMouseLeave={this.onMouseLeave}
                  onMouseDown={this.onMouseDown}
                  onMouseUp={this.onMouseUp}
                  onFocus={this.onFocus}
                  onBlur={this.onBlur}
                  disabled={isDisabled}
                  className={className}
                  css={specifiers(buttonStyles)}
                >
                  <InnerWrapper
                    onClick={this.onInnerClick}
                    fit={!!shouldFitContainer}
                  >
                    {isLoading && (
                      <LoadingSpinner
                        spacing={spacing}
                        appearance={appearance}
                        isSelected={isSelected}
                        isDisabled={isDisabled}
                        styles={spinnerStyles}
                      />
                    )}
                    {iconBefore && (
                      <IconWrapper
                        isLoading={isLoading}
                        spacing={spacing}
                        isOnlyChild={iconIsOnlyChild}
                        icon={iconBefore}
                      />
                    )}
                    {children && (
                      <Content
                        isLoading={isLoading}
                        followsIcon={!!iconBefore}
                        spacing={spacing}
                      >
                        {children}
                      </Content>
                    )}
                    {iconAfter && (
                      <IconWrapper
                        isLoading={isLoading}
                        spacing={spacing}
                        isOnlyChild={iconIsOnlyChild}
                        icon={iconAfter}
                      />
                    )}
                  </InnerWrapper>
                </StyledButton>
              )}
            </Theme.Consumer>
          )}
        </GlobalTheme.Consumer>
      </Theme.Provider>
    );
  }
}

const createAndFireEventOnAtlaskit = createAndFireEvent('atlaskit');
const ButtonWithRef = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (props, ref) => <Button {...props} consumerRef={ref} />,
);
ButtonWithRef.displayName = 'Button';

export default withAnalyticsContext({
  componentName: 'button',
  packageName,
  packageVersion,
})(
  withAnalyticsEvents({
    onClick: createAndFireEventOnAtlaskit({
      action: 'clicked',
      actionSubject: 'button',
      attributes: {
        componentName: 'button',
        packageName,
        packageVersion,
      },
    }),
  })(ButtonWithRef),
);
