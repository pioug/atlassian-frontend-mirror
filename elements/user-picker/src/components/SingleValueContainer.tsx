import React from 'react';
import styled from 'styled-components';
import { components, ValueContainerProps } from '@atlaskit/select';
import { SizeableAvatar } from './SizeableAvatar';
import { BORDER_PADDING } from './styles';
import { User, Option } from '../types';

const PlaceholderIconContainer = styled.div`
  padding-left: ${BORDER_PADDING}px;
  line-height: 0;
`;

const showUserAvatar = (inputValue?: string, value?: Option<User>) =>
  value && value.data && inputValue === value.label;

export class SingleValueContainer extends React.Component<
  ValueContainerProps<Option<User>>
> {
  private renderAvatar = () => {
    const {
      hasValue,
      selectProps: { appearance, isFocused, inputValue, value },
    } = this.props;

    if (isFocused || !hasValue) {
      return (
        <SizeableAvatar
          appearance={appearance}
          src={
            showUserAvatar(inputValue, value as Option<User>)
              ? (value as Option<User>).data.avatarUrl
              : undefined
          }
        />
      );
    }
    return null;
  };

  render() {
    const { children, ...valueContainerProps } = this.props;

    return (
      <components.ValueContainer {...valueContainerProps}>
        <PlaceholderIconContainer>
          {this.renderAvatar()}
        </PlaceholderIconContainer>
        {children}
      </components.ValueContainer>
    );
  }
}
