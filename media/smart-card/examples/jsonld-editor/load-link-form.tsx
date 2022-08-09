/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import React, { useCallback } from 'react';
import Button from '@atlaskit/button/standard-button';
import Form, { ErrorMessage, Field, HelperMessage } from '@atlaskit/form';
import Textfield from '@atlaskit/textfield';

const loadLinkStyles = css`
  align-content: stretch;
  align-items: center;
  display: flex;
  gap: 1rem;
`;

const pattern = new RegExp(
  '^(https?:\\/\\/)?' + // protocol
    '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + // domain name
    '((\\d{1,3}\\.){3}\\d{1,3}))' + // OR ip (v4) address
    '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // port and path
    '(\\?[;&a-z\\d%_.~+=-]*)?' + // query string
    '(\\#[-a-z\\d_]*)?$',
  'i',
); // fragment locator
const validate = (str: unknown) => {
  if (!pattern.test(str as string)) {
    return 'INCORRECT_URL';
  }
  return undefined;
};

const LoadLinkForm: React.FC<{
  error?: string;
  onSubmit: (url: string) => void;
}> = ({ error: urlError, onSubmit }) => {
  const handleSubmit = useCallback(
    (formState: { url: string }) => {
      onSubmit(formState.url);
    },
    [onSubmit],
  );

  return (
    <Form onSubmit={handleSubmit}>
      {({ formProps }) => (
        <form {...formProps} name="load-link">
          <Field label="URL" name="url" validate={validate} defaultValue="">
            {({ fieldProps, error, meta: { dirtySinceLastSubmit } }: any) => (
              <React.Fragment>
                <div css={loadLinkStyles}>
                  <Textfield {...fieldProps} />
                  <Button type="submit" appearance="primary">
                    Load link
                  </Button>
                </div>
                <HelperMessage>
                  <a
                    href="https://commerce-components-preview.dev.atlassian.com"
                    target="_blank"
                  >
                    To load link, please log in to staging environment.
                  </a>
                </HelperMessage>
                {error === 'INCORRECT_URL' && (
                  <ErrorMessage>Please enter a valid url.</ErrorMessage>
                )}
                {!dirtySinceLastSubmit && urlError && (
                  <ErrorMessage>{urlError}</ErrorMessage>
                )}
              </React.Fragment>
            )}
          </Field>
        </form>
      )}
    </Form>
  );
};

export default LoadLinkForm;
