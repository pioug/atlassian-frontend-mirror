/** @jsx jsx */
import React from 'react';
import { css, jsx } from '@emotion/react';
import { components, ValueContainerProps } from '@atlaskit/select';
import { SizeableAvatar } from './SizeableAvatar';
import { BORDER_PADDING } from './styles';
import { User, Option } from '../types';

const placeholderIconContainer = css({
  paddingLeft: `${BORDER_PADDING}px`,
  lineHeight: 0,
  gridArea: '1/1/2/2',
});

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
        <div css={placeholderIconContainer}>{this.renderAvatar()}</div>
        {children}
      </components.ValueContainer>
    );
  }
}
