/* eslint-disable react/prop-types */
import React, { PureComponent } from 'react';
import styled from 'styled-components';
import GlobalItemInner, { globalItemStyles } from '../styled/GlobalItemInner';
import DefaultLinkComponent from './DefaultLinkComponent';
import { withGlobalItemAnalytics } from '../../utils/analytics';

class GlobalItem extends PureComponent {
  static defaultProps = {
    onMouseDown: () => {},
    size: 'small',
    appearance: 'round',
  };

  // eslint-disable-next-line no-undef
  handleKeyDown = event => {
    if (event.key === 'Enter' && this.props.onClick) {
      this.props.onClick(event);
    }
  };

  render() {
    const {
      children,
      href,
      linkComponent: CustomComponent,
      isSelected,
      size,
      'aria-haspopup': ariaHasPopup, // eslint-disable-line react/prop-types
      onClick,
      onMouseDown: providedMouseDown,
      role,
      appearance,
    } = this.props;

    const allyAndEventProps = {
      'aria-haspopup': ariaHasPopup,
      onClick,
      role,
      onKeyDown: this.handleKeyDown,
    };

    const hoverOverrideStyles = href ? '&:hover { color: inherit; }' : '';

    if (CustomComponent) {
      const StyledComponent = styled(CustomComponent)`
        ${globalItemStyles};
        ${hoverOverrideStyles};
      `;
      return (
        <StyledComponent
          appearance={appearance}
          href={href}
          isSelected={isSelected}
          onMouseDown={providedMouseDown}
          size={size}
          {...allyAndEventProps}
        >
          {children}
        </StyledComponent>
      );
    }
    if (href) {
      const StyledLink = styled(DefaultLinkComponent)`
        ${globalItemStyles};
        ${hoverOverrideStyles};
      `;
      return (
        <StyledLink
          href={href}
          size={size}
          onMouseDown={providedMouseDown}
          appearance={appearance}
          {...allyAndEventProps}
        >
          {children}
        </StyledLink>
      );
    }

    const onMouseDown = e => {
      providedMouseDown(e);
      e.preventDefault();
    };

    return (
      <GlobalItemInner
        type="button"
        isSelected={isSelected}
        onMouseDown={onMouseDown}
        size={size}
        appearance={appearance}
        {...allyAndEventProps}
      >
        {children}
      </GlobalItemInner>
    );
  }
}

export { GlobalItem as GlobalItemBase };

export default withGlobalItemAnalytics(GlobalItem);
