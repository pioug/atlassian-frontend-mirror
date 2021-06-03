/* eslint-disable react/prop-types */
import React, { Component } from 'react';
import styled from 'styled-components';
import {
  withAnalyticsEvents,
  withAnalyticsContext,
  createAndFireEvent,
} from '@atlaskit/analytics-next';
import Base, { Label } from '@atlaskit/field-base';
import Input from './styled/Input';

const packageName = process.env._PACKAGE_NAME_;
const packageVersion = process.env._PACKAGE_VERSION_;

const Wrapper = styled.div`
  flex: 1 1 100%;
`;

if (process.env.NODE_ENV !== 'production' && !process.env.CI) {
  // eslint-disable-next-line no-console
  console.warn(
    '@atlaskit/field-text has been deprecated. Please use the @atlaskit/textfield package instead.',
  );
}

class FieldTextStateless extends Component {
  static defaultProps = {
    compact: false,
    disabled: false,
    isInvalid: false,
    isReadOnly: false,
    isSpellCheckEnabled: true,
    onChange: () => {},
    required: false,
    type: 'text',
    isValidationHidden: false,
    innerRef: () => {},
  };

  input;

  focus() {
    if (this.input) {
      this.input.focus();
    }
  }

  setInputRef = (input) => {
    this.input = input;
    this.props.innerRef(input);
  };

  render() {
    return (
      <Wrapper>
        {!this.props.isLabelHidden && (
          <Label
            htmlFor={this.props.id}
            isDisabled={this.props.disabled}
            isLabelHidden={this.props.isLabelHidden}
            isRequired={this.props.required}
            label={this.props.label || ''}
          />
        )}
        <Base
          invalidMessage={this.props.invalidMessage}
          isCompact={this.props.compact}
          isDisabled={this.props.disabled}
          isFitContainerWidthEnabled={this.props.shouldFitContainer}
          isInvalid={this.props.isInvalid}
          isReadOnly={this.props.isReadOnly}
          isRequired={this.props.required}
          isValidationHidden={this.props.isValidationHidden}
        >
          <Input
            autoComplete={this.props.autoComplete}
            autoFocus={this.props.autoFocus}
            disabled={this.props.disabled}
            form={this.props.form}
            id={this.props.id}
            innerRef={this.setInputRef}
            isMonospaced={this.props.isMonospaced}
            maxLength={this.props.maxLength}
            min={this.props.min}
            max={this.props.max}
            name={this.props.name}
            onBlur={this.props.onBlur}
            onChange={this.props.onChange}
            onFocus={this.props.onFocus}
            onKeyDown={this.props.onKeyDown}
            onKeyPress={this.props.onKeyPress}
            onKeyUp={this.props.onKeyUp}
            pattern={this.props.pattern}
            placeholder={this.props.placeholder}
            readOnly={this.props.isReadOnly}
            required={this.props.required}
            spellCheck={this.props.isSpellCheckEnabled}
            type={this.props.type}
            value={this.props.value}
          />
        </Base>
      </Wrapper>
    );
  }
}

export { FieldTextStateless as FieldTextStatelessWithoutAnalytics };
const createAndFireEventOnAtlaskit = createAndFireEvent('atlaskit');

export default withAnalyticsContext({
  componentName: 'fieldText',
  packageName,
  packageVersion,
})(
  withAnalyticsEvents({
    onBlur: createAndFireEventOnAtlaskit({
      action: 'blurred',
      actionSubject: 'textField',

      attributes: {
        componentName: 'fieldText',
        packageName,
        packageVersion,
      },
    }),

    onFocus: createAndFireEventOnAtlaskit({
      action: 'focused',
      actionSubject: 'textField',

      attributes: {
        componentName: 'fieldText',
        packageName,
        packageVersion,
      },
    }),
  })(FieldTextStateless),
);
