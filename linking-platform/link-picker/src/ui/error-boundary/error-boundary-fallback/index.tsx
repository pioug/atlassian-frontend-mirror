/** @jsx jsx */
import { jsx } from '@emotion/react';
import { defineMessages, useIntl } from 'react-intl-next';

import EmptyState from '@atlaskit/empty-state';

import { GenericErrorSVG } from '../../../common/generic-error-svg';
// eslint-disable-next-line @atlassian/tangerine/import/no-parent-imports
import { rootContainerStyles } from '../../link-picker/styled';

const messages = defineMessages({
  heading: {
    defaultMessage: 'Something went wrong!',
    description: 'Heading displayed when an unhandled error occurs.',
    id: 'fabric.linkPicker.unhandledError.heading',
  },
  description: {
    defaultMessage: 'Try reloading the page.',
    description:
      'Body message shown underneath the heading when an unhandled error occurs.',
    id: 'fabric.linkPicker.unhandledError.description',
  },
});

export const ErrorBoundaryFallback = () => {
  const intl = useIntl();
  const header = intl.formatMessage(messages.heading);
  const description = intl.formatMessage(messages.description);

  return (
    <div
      css={rootContainerStyles}
      data-testid="link-picker-root-error-boundary-ui"
    >
      <EmptyState
        header={header}
        renderImage={() => <GenericErrorSVG />}
        description={description}
      />
    </div>
  );
};
