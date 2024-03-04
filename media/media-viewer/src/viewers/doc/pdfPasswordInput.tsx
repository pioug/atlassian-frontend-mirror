import React, { useEffect, useRef, useState } from 'react';
import LoadingButton from '@atlaskit/button/loading-button';
import TextField from '@atlaskit/textfield';
import LockIcon from '@atlaskit/icon/glyph/lock';
import Form, { ErrorMessage, Field, OnSubmitHandler } from '@atlaskit/form';
import { token } from '@atlaskit/tokens';
import { FormattedMessage, useIntl } from 'react-intl-next';
import { messages } from '@atlaskit/media-ui';
import Heading from '@atlaskit/heading';
import { xcss, Box, Flex } from '@atlaskit/primitives';

interface PDFPasswordInputProps {
  onSubmit: OnSubmitHandler<{ password: string }>;
  hasPasswordError?: boolean;
  onRender?: () => void;
}

const headerStyles = xcss({
  textAlign: 'center',
  marginTop: 'space.300',
  marginBottom: 'space.100',
});

const inputStyle = xcss({
  width: '330px',
});

const footerStyles = xcss({
  marginTop: 'space.200',
  display: 'flex',
  justifyContent: 'center',
});

export const PDFPasswordInput = ({
  onSubmit,
  hasPasswordError,
  onRender,
}: PDFPasswordInputProps) => {
  const passwordInputRef = useRef<HTMLInputElement>(null);
  const onRenderRef = useRef(onRender);
  const [formError, setFormError] = useState(hasPasswordError);
  const intl = useIntl();

  useEffect(() => {
    onRenderRef.current?.();
  }, []);

  useEffect(() => {
    if (hasPasswordError) {
      setFormError(true);
      passwordInputRef.current?.focus();
    }
  }, [hasPasswordError]);

  return (
    <Form<{ password: string }> onSubmit={onSubmit}>
      {({ formProps, submitting }) => (
        <form {...formProps}>
          <Flex justifyContent="center" aria-hidden={true}>
            <LockIcon
              label="forbidden-lock-icon"
              size="xlarge"
              primaryColor={token('color.text', '#c7d1db')}
            />
          </Flex>
          <Box xcss={headerStyles}>
            <Heading as="h1" level="h200">
              <FormattedMessage {...messages.password_protected_pdf} />
            </Heading>
          </Box>
          <Field
            aria-required={true}
            name="password"
            label="Password"
            isRequired
          >
            {({ fieldProps }) => (
              <Box xcss={inputStyle}>
                <TextField
                  {...fieldProps}
                  type="password"
                  placeholder={intl.formatMessage(messages.enter_password)}
                  ref={passwordInputRef}
                  onChange={(value) => {
                    fieldProps.onChange(value);
                    setFormError(false);
                  }}
                />
                {formError && (
                  <ErrorMessage>
                    <FormattedMessage {...messages.incorrect_password} />
                  </ErrorMessage>
                )}
              </Box>
            )}
          </Field>
          <Box xcss={footerStyles}>
            <LoadingButton
              appearance="primary"
              type="submit"
              isLoading={submitting}
            >
              <FormattedMessage {...messages.submit} />
            </LoadingButton>
          </Box>
        </form>
      )}
    </Form>
  );
};
