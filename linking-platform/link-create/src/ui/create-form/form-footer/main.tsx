/** @jsx jsx */
import { Fragment } from 'react';

import { css, jsx } from '@emotion/react';
import { useIntl } from 'react-intl-next';

import Button, { ButtonGroup } from '@atlaskit/button';
import LoadingButton from '@atlaskit/button/loading-button';
import ErrorIcon from '@atlaskit/icon/glyph/error';
import { getBooleanFF } from '@atlaskit/platform-feature-flags';
import { token } from '@atlaskit/tokens';

import { EditButton } from './edit-button';
import { messages } from './messages';
import { SubmitButton } from './submit-button';

const formFooterWrapperStyles = css({
  display: 'flex',
  marginTop: token('space.300', '24px'),
  justifyContent: 'flex-end',
});

const errorStyles = css({
  display: 'flex',
  alignItems: 'center',
  marginRight: 'auto',
});

export interface CreateFormFooterProps {
  formErrorMessage: string | undefined;
  handleCancel: () => void;
  submitting: boolean;
  testId?: string;
}
/**
 * Footer for the Create Form, used as a wrapper for action buttons
 * and form error messages. This component is unmounted if
 * hideFooter is true in the Create Form.
 */
export function CreateFormFooter({
  formErrorMessage,
  handleCancel,
  submitting,
  testId,
}: CreateFormFooterProps) {
  const intl = useIntl();

  return (
    <footer data-testid={`${testId}-footer`} css={formFooterWrapperStyles}>
      {formErrorMessage && (
        <div css={errorStyles} data-testid={`${testId}-error`}>
          <ErrorIcon
            label={formErrorMessage}
            primaryColor={token('color.icon.danger', '#E34935')}
          />
          {formErrorMessage}
        </div>
      )}
      <ButtonGroup>
        <Button
          type="button"
          appearance="subtle"
          onClick={handleCancel}
          testId={`${testId}-button-cancel`}
        >
          {intl.formatMessage(messages.close)}
        </Button>
        {getBooleanFF('platform.linking-platform.link-create.enable-edit') ? (
          <Fragment>
            <EditButton />
            <SubmitButton />
          </Fragment>
        ) : (
          <LoadingButton
            type="submit"
            appearance="primary"
            isLoading={submitting}
            testId={`${testId}-button-submit`}
          >
            {intl.formatMessage(messages.create)}
          </LoadingButton>
        )}
      </ButtonGroup>
    </footer>
  );
}
