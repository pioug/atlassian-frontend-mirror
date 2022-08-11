/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import React, { useCallback, useMemo } from 'react';
import Button from '@atlaskit/button/standard-button';
import Form, { ErrorMessage, Field, HelperMessage } from '@atlaskit/form';
import Textfield from '@atlaskit/textfield';
import { token } from '@atlaskit/tokens';
import Tooltip from '@atlaskit/tooltip';

const loadLinkStyles = css`
  align-content: stretch;
  align-items: center;
  display: flex;
  gap: 1rem;
`;

const tooltipStyles = css`
  a {
    color: ${token('color.background.accent.blue.subtle', '#579DFF')};
    :active {
      color: ${token('color.text.information', '#85B8FF')};
    }
    :hover {
      color: ${token('color.background.accent.blue.subtle', '#579DFF')};
    }
  }
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

  const helpMessage = useMemo(
    () => (
      <Tooltip
        content={
          <div css={tooltipStyles}>
            <p>
              We know it's not a usual "log in" but we need to acquire
              ASAP-signed JWT token through a micros static server for our
              Atlaskit examples.{' '}
              <a
                href="https://product-fabric.atlassian.net/wiki/spaces/MEX/pages/3057025945"
                target="_blank"
              >
                Read more about that here.
              </a>
            </p>
            <p>
              For Atlassian product links such as Confluence or Jira, please use
              staging links such as pug or jdog. Production links including
              hello and product fabric will not resolve on staging environment.
            </p>
          </div>
        }
      >
        {(tooltipProps) => (
          <a
            href="https://commerce-components-preview.dev.atlassian.com"
            target="_blank"
            {...tooltipProps}
          >
            To load link, please log in to staging environment (required VPN).
          </a>
        )}
      </Tooltip>
    ),
    [],
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
                <HelperMessage>{helpMessage}</HelperMessage>
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
