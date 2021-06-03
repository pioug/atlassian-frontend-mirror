/* eslint-disable react/prop-types */
import React, { Component } from 'react';
import styled from 'styled-components';
import {
  withAnalyticsEvents,
  withAnalyticsContext,
  createAndFireEvent,
} from '@atlaskit/analytics-next';
import Base, { Label } from '@atlaskit/field-base';
import TextArea from './styled/TextArea';

const packageName = process.env._PACKAGE_NAME_;
const packageVersion = process.env._PACKAGE_VERSION_;

const Wrapper = styled.div`
  flex: 1 1 100%;
`;

if (process.env.NODE_ENV !== 'production' && !process.env.CI) {
  // eslint-disable-next-line no-console
  console.warn(
    '@atlaskit/field-text-area has been deprecated. Please use the @atlaskit/textarea package instead.',
  );
}

class FieldTextAreaStateless extends Component {
  input; // eslint-disable-line react/sort-comp

  static defaultProps = {
    compact: false,
    disabled: false,
    isReadOnly: false,
    required: false,
    isInvalid: false,
    label: '',
    type: 'text',
    isSpellCheckEnabled: true,
    minimumRows: 1,
    isValidationHidden: false,
  };

  focus() {
    this.input.focus();
  }

  render() {
    const {
      autoFocus,
      compact,
      disabled,
      id,
      invalidMessage,
      isInvalid,
      isLabelHidden,
      isMonospaced,
      isReadOnly,
      isSpellCheckEnabled,
      label,
      maxLength,
      minimumRows,
      name,
      onBlur,
      onChange,
      onFocus,
      placeholder,
      enableResize,
      required,
      shouldFitContainer,
      value,
      isValidationHidden,
    } = this.props;

    return (
      <Wrapper>
        {!isLabelHidden && (
          <Label
            htmlFor={id}
            isDisabled={disabled}
            isLabelHidden={isLabelHidden}
            isRequired={required}
            label={label}
          />
        )}
        <Base
          isCompact={compact}
          isDisabled={disabled}
          isInvalid={isInvalid}
          isReadOnly={isReadOnly}
          isRequired={required}
          invalidMessage={invalidMessage}
          isFitContainerWidthEnabled={shouldFitContainer}
          isValidationHidden={isValidationHidden}
        >
          <TextArea
            disabled={disabled}
            readOnly={isReadOnly}
            name={name}
            placeholder={placeholder}
            value={value}
            required={required}
            isMonospaced={isMonospaced}
            minimumRows={minimumRows}
            enableResize={enableResize}
            onBlur={onBlur}
            onChange={onChange}
            onFocus={onFocus}
            id={id}
            autoFocus={autoFocus}
            spellCheck={isSpellCheckEnabled}
            maxLength={maxLength}
            innerRef={(input) => {
              this.input = input;
            }}
          />
        </Base>
      </Wrapper>
    );
  }
}

export { FieldTextAreaStateless as FieldTextAreaStatelessWithoutAnalytics };
const createAndFireEventOnAtlaskit = createAndFireEvent('atlaskit');

export default withAnalyticsContext({
  componentName: 'fieldTextArea',
  packageName,
  packageVersion,
})(
  withAnalyticsEvents({
    onBlur: createAndFireEventOnAtlaskit({
      action: 'blurred',
      actionSubject: 'textArea',

      attributes: {
        componentName: 'fieldTextArea',
        packageName,
        packageVersion,
      },
    }),

    onFocus: createAndFireEventOnAtlaskit({
      action: 'focused',
      actionSubject: 'textArea',

      attributes: {
        componentName: 'fieldTextArea',
        packageName,
        packageVersion,
      },
    }),
  })(FieldTextAreaStateless),
);
