import React, { Fragment, useEffect, useState } from 'react';

import Button from '@atlaskit/button/standard-button';
import Select, { ValueType } from '@atlaskit/select';
import TextField from '@atlaskit/textfield';

import Form, {
  ErrorMessage,
  Field,
  FormFooter,
  FormHeader,
  RequiredAsterisk,
  ValidMessage,
} from '../../src';

interface Option {
  label: string;
  value: string;
}

const colors = [
  { label: 'blue', value: 'blue' },
  { label: 'red', value: 'red' },
  { label: 'purple', value: 'purple' },
  { label: 'black', value: 'black' },
  { label: 'white', value: 'white' },
  { label: 'gray', value: 'gray' },
  { label: 'yellow', value: 'yellow' },
  { label: 'orange', value: 'orange' },
  { label: 'teal', value: 'teal' },
];

const userNameData = ['jsmith', 'mchan'];

const errorMessages = {
  shortUsername: 'Invalid username, needs to be more than 4 characters',
  validUsername: 'Nice one, this username is available',
  usernameInUse: 'Username already taken, try another one',
  selectError: 'Please select a color',
};

const { shortUsername, validUsername, usernameInUse, selectError } =
  errorMessages;

const checkUserName = (value: string) => {
  return userNameData.includes(value);
};

let isUsernameUsed: boolean = false;

export default function FieldLevelValidationExample() {
  const [fieldValue, setFieldValue] = useState('');
  const [fieldHasError, setFieldHasError] = useState(false);
  const [selectHasError, setSelectHasError] = useState(false);
  const [selectValue, setSelectValue] = useState<ValueType<Option>>();
  const [errorMessageText, setErrorMessageText] = useState('');
  const [messageId, setMessageId] = useState('');

  const handleSubmit = (formState: { command: string }) => {
    console.log('form state', formState);
  };

  const handleBlurEvent = () => {
    isUsernameUsed = checkUserName(fieldValue);
    if (fieldValue.length >= 5 && !isUsernameUsed) {
      setFieldHasError(false);
      setErrorMessageText('IS_VALID');
    } else {
      setFieldHasError(true);
      if (fieldValue.length <= 5) {
        setErrorMessageText('TOO_SHORT');
      } else if (isUsernameUsed) {
        setErrorMessageText('IN_USE');
      }
    }
  };

  const handleSelectBlurEvent = () => {
    selectValue ? setSelectHasError(false) : setSelectHasError(true);
  };

  useEffect(() => {
    switch (errorMessageText) {
      case 'IS_VALID':
        setMessageId('-valid');
        break;
      case 'TOO_SHORT':
      case 'IN_USE':
        setMessageId('-error');
        break;
      default:
        setMessageId('-error');
    }
  }, [errorMessageText]);

  return (
    <div
      style={{
        display: 'flex',
        width: '400px',
        maxWidth: '100%',
        margin: '0 auto',
        flexDirection: 'column',
      }}
    >
      <Form onSubmit={handleSubmit}>
        {({ formProps }) => (
          <form {...formProps}>
            <FormHeader title="Log In">
              <p aria-hidden="true">
                Required fields are marked with an asterisk <RequiredAsterisk />
              </p>
            </FormHeader>
            <Field
              name="username"
              label="Username"
              defaultValue=""
              isRequired
              validate={(value) => {
                if (value) {
                  setFieldValue(value);
                }
              }}
            >
              {({ fieldProps: { id, ...rest } }) => {
                return (
                  <Fragment>
                    <TextField
                      {...rest}
                      aria-describedby={`${id}${messageId}`}
                      isInvalid={fieldHasError}
                      onBlur={handleBlurEvent}
                    />
                    {!fieldHasError && errorMessageText === 'IS_VALID' && (
                      <ValidMessage>{validUsername}</ValidMessage>
                    )}
                    {fieldHasError && errorMessageText === 'TOO_SHORT' && (
                      <ErrorMessage>{shortUsername}</ErrorMessage>
                    )}
                    {fieldHasError && errorMessageText === 'IN_USE' && (
                      <ErrorMessage>{usernameInUse}</ErrorMessage>
                    )}
                  </Fragment>
                );
              }}
            </Field>
            <Field<ValueType<Option>>
              name="colors"
              label="Select a color"
              defaultValue={null}
              isRequired
              validate={(value) => {
                setSelectValue(value);
              }}
            >
              {({ fieldProps: { id, ...rest } }) => {
                return (
                  <Fragment>
                    <Select<Option>
                      inputId={id}
                      {...rest}
                      options={colors}
                      isClearable
                      aria-invalid={selectHasError}
                      aria-describedby={selectHasError && `${id}-error`}
                      onBlur={handleSelectBlurEvent}
                    />
                    {selectHasError && (
                      <ErrorMessage>{selectError}</ErrorMessage>
                    )}
                  </Fragment>
                );
              }}
            </Field>
            <FormFooter>
              <Button type="submit">Next</Button>
            </FormFooter>
          </form>
        )}
      </Form>
    </div>
  );
}
