/* eslint-disable react/prop-types */
/* eslint-disable import/no-named-as-default-member */
import React, { Component } from 'react';
import InlineDialog from '@atlaskit/inline-dialog';
import { Content, ContentWrapper, ChildWrapper } from '../styled/Content';
// eslint-disable-next-line import/no-named-as-default
import ValidationElement from './ValidationElement';

if (process.env.NODE_ENV !== 'production' && !process.env.CI) {
  // eslint-disable-next-line no-console
  console.warn(
    'The @atlaskit/field-base package has been deprecated. Please use the Form/Textfield/Textarea/etc packages instead.',
  );
}

export default class FieldBaseStateless extends Component {
  static defaultProps = {
    appearance: 'standard',
    invalidMessage: '',
    isCompact: false,
    isDialogOpen: false,
    isDisabled: false,
    isFitContainerWidthEnabled: false,
    isFocused: false,
    isInvalid: false,
    isLoading: false,
    isPaddingDisabled: false,
    isReadOnly: false,
    onDialogBlur: () => {},
    onDialogClick: () => {},
    onDialogFocus: () => {},
    shouldReset: false,
    isValidationHidden: false,
  };

  componentDidUpdate() {
    if (this.props.shouldReset) {
      this.props.onBlur();
    }
  }

  render() {
    const {
      appearance,
      children,
      invalidMessage,
      isCompact,
      isDialogOpen,
      isDisabled,
      isFitContainerWidthEnabled,
      isFocused,
      isInvalid,
      isLoading,
      isPaddingDisabled,
      isReadOnly,
      maxWidth,
      onBlur,
      onDialogBlur,
      onDialogClick,
      onDialogFocus,
      onFocus,
      isValidationHidden,
    } = this.props;

    function getAppearance(a) {
      if (isDisabled) return 'disabled';
      if (isInvalid) return 'invalid';

      return a;
    }

    return (
      <ContentWrapper
        disabled={isDisabled}
        maxWidth={maxWidth}
        grow={isFitContainerWidthEnabled}
      >
        <InlineDialog
          content={invalidMessage}
          isOpen={isDialogOpen && !!invalidMessage && !isValidationHidden}
          onContentBlur={onDialogBlur}
          onContentClick={onDialogClick}
          onContentFocus={onDialogFocus}
          placement="right"
        >
          <ChildWrapper compact={isCompact}>
            <Content
              appearance={getAppearance(appearance)}
              compact={isCompact}
              disabled={isDisabled}
              isFocused={isFocused}
              invalid={isInvalid && !isFocused}
              none={appearance === 'none'}
              onBlurCapture={onBlur}
              onFocusCapture={onFocus}
              paddingDisabled={isPaddingDisabled}
              readOnly={isReadOnly}
              subtle={appearance === 'subtle'}
            >
              {children}
              {!isValidationHidden ? (
                <ValidationElement
                  isDisabled={isDisabled}
                  isInvalid={isInvalid}
                  isLoading={isLoading}
                />
              ) : null}
            </Content>
          </ChildWrapper>
        </InlineDialog>
      </ContentWrapper>
    );
  }
}
