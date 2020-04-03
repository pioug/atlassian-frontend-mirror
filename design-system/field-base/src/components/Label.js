/* eslint-disable react/prop-types */
import React, { Component } from 'react';

import { LabelWrapper, RequiredIndicator, LabelInner } from '../styled/Label';

if (process.env.NODE_ENV !== 'production' && !process.env.CI) {
  // eslint-disable-next-line no-console
  console.warn(
    'The @atlaskit/field-base package has been deprecated. Please use the Form/Textfield/Textarea/etc packages instead.',
  );
}

export default class Label extends Component {
  static defaultProps = {
    appearance: 'default',
  };

  /* eslint-disable jsx-a11y/no-static-element-interactions */
  render() {
    const {
      appearance,
      children,
      htmlFor,
      isFirstChild,
      isLabelHidden,
      isDisabled,
      isRequired,
      label,
      onClick,
    } = this.props;
    /* eslint-disable jsx-a11y/click-events-have-key-events */
    return (
      <LabelWrapper htmlFor={htmlFor}>
        <LabelInner
          isHidden={isLabelHidden}
          inlineEdit={appearance === 'inline-edit'}
          firstChild={isFirstChild}
          isDisabled={isDisabled}
        >
          <span onClick={onClick}>{label}</span>
          {isRequired ? (
            <RequiredIndicator role="presentation">*</RequiredIndicator>
          ) : null}
        </LabelInner>
        {children}
      </LabelWrapper>
    );
  }
}
