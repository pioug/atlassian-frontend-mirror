/* eslint-disable react/prop-types */
import React, { PureComponent } from 'react';
import { Item } from '@atlaskit/droplist';
import FooterDiv from '../styled/Footer';

export default class Footer extends PureComponent {
  render() {
    const {
      appearance,
      children,
      elemBefore,
      isFocused,
      onClick,
      shouldHideSeparator,
    } = this.props;

    return (
      <FooterDiv onClick={onClick} shouldHideSeparator={shouldHideSeparator}>
        <Item
          appearance={appearance}
          elemBefore={elemBefore}
          isFocused={isFocused}
          type="option"
        >
          {children}
        </Item>
      </FooterDiv>
    );
  }
}
