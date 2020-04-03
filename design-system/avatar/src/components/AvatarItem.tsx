import GlobalTheme, { ThemeProp } from '@atlaskit/theme/components';
import React, {
  cloneElement,
  Component,
  ComponentType,
  ReactNode,
} from 'react';
import { propsOmittedFromClickData } from './constants';
import { omit } from '../utils';
import {
  getBackgroundColor,
  Content,
  PrimaryText,
  SecondaryText,
} from '../styled/AvatarItem';
import { getProps, getStyledAvatarItem } from '../helpers';
import { withPseudoState } from '../hoc';
import { ThemeItem, ThemeItemTokens } from '../theme/item';
import { AvatarClickType } from '../types';

/* eslint-disable react/no-unused-prop-types */
interface Props {
  avatar: ReactNode;
  /** Change background color */
  backgroundColor?: string;
  /** A custom component to use instead of the default span. */
  component?: ComponentType<any>;
  /** Provides a url for avatars being used as a link. */
  href?: string;
  /** Change the style to indicate the item is active. */
  isActive?: boolean;
  /** Change the style to indicate the item is disabled. */
  isDisabled?: boolean;
  /** Change the style to indicate the item is focused. */
  isFocus?: boolean;
  /** Change the style to indicate the item is hovered. */
  isHover?: boolean;
  /** Change the style to indicate the item is selected. */
  isSelected?: boolean;
  /** Handler to be called on click. */
  onClick?: AvatarClickType;
  /** PrimaryText text */
  primaryText?: ReactNode;
  /** SecondaryText text */
  secondaryText?: ReactNode;
  /** Pass target down to the anchor, if href is provided. */
  target?: '_blank' | '_self' | '_top' | '_parent';
  /** The item's theme. */
  theme?: ThemeProp<ThemeItemTokens, {}>;
  /** Whether or not overflowing primary and secondary text is truncated */
  enableTextTruncate?: boolean;
}

class AvatarItem extends Component<Props> {
  node?: HTMLElement;

  static defaultProps = {
    enableTextTruncate: true,
  };

  // expose blur/focus to consumers via ref
  blur = () => {
    if (this.node) this.node.blur();
  };

  focus = () => {
    if (this.node) this.node.focus();
  };

  // disallow click on disabled avatars
  guardedClick = (event: React.MouseEvent) => {
    const { isDisabled, onClick } = this.props;

    if (isDisabled || typeof onClick !== 'function') return;

    const item: {} = omit(this.props, ...propsOmittedFromClickData);

    onClick({ item, event });
  };

  setNode = (ref?: HTMLElement) => {
    this.node = ref;
  };

  render() {
    const {
      avatar,
      enableTextTruncate,
      primaryText,
      secondaryText,
      href,
      onClick,
    } = this.props;

    // distill props from context, props, and state
    const enhancedProps = getProps(this);

    // provide element interface based on props
    const StyledComponent: any = getStyledAvatarItem(this.props);

    return (
      <GlobalTheme.Consumer>
        {({ mode }: any) => (
          <ThemeItem.Provider value={this.props.theme}>
            <ThemeItem.Consumer>
              {tokens => {
                // maintain the illusion of a mask around presence/status
                const borderColor = getBackgroundColor({
                  ...this.props,
                  ...tokens,
                  mode,
                });

                return (
                  <StyledComponent
                    innerRef={this.setNode}
                    {...enhancedProps}
                    isInteractive={!!href || !!onClick}
                    onClick={this.guardedClick}
                  >
                    {React.isValidElement(avatar)
                      ? cloneElement(avatar, { borderColor })
                      : null}
                    <Content truncate={enableTextTruncate!}>
                      <PrimaryText truncate={enableTextTruncate!}>
                        {primaryText}
                      </PrimaryText>
                      <SecondaryText truncate={enableTextTruncate!}>
                        {secondaryText}
                      </SecondaryText>
                    </Content>
                  </StyledComponent>
                );
              }}
            </ThemeItem.Consumer>
          </ThemeItem.Provider>
        )}
      </GlobalTheme.Consumer>
    );
  }
}

export default withPseudoState(AvatarItem);
