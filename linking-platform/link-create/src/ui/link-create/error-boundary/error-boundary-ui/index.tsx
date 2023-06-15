import React from 'react';

import { FormattedMessage, useIntl } from 'react-intl-next';

import Button from '@atlaskit/button';
import EmptyState from '@atlaskit/empty-state';

import ErrorSVG from './error-svg';
import messages from './messages';

export const CONTACT_SUPPORT_LINK = 'https://support.atlassian.com/contact/';

export const ErrorBoundaryUI = () => {
  const intl = useIntl();

  return (
    <EmptyState
      maxImageWidth={82}
      testId={'link-create-error-boundary-ui'}
      header={intl.formatMessage(messages.heading)}
      description={
        <FormattedMessage
          {...messages.description}
          values={{
            a: (label: string) => (
              <Button
                appearance="link"
                spacing="none"
                href={CONTACT_SUPPORT_LINK}
                target="_blank"
                rel="noopener noreferrer"
              >
                {label}
              </Button>
            ),
          }}
        />
      }
      renderImage={() => <ErrorSVG />}
    />
  );
};
