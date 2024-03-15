/** @jsx jsx */
import { jsx } from '@emotion/react';
import { defineMessages, useIntl } from 'react-intl-next';

import EmptyState from '@atlaskit/empty-state';
import { getBooleanFF } from '@atlaskit/platform-feature-flags';

import { LINK_PICKER_MIN_HEIGHT_IN_PX_FALLBACK } from '../../../common/constants';
import { GenericErrorSVG } from '../../../common/generic-error-svg';
import { EmptyState as EmptyStateInternal } from '../../../common/ui/empty-state';
import { MinHeightContainer } from '../../../common/ui/min-height-container';
// eslint-disable-next-line @atlassian/tangerine/import/no-parent-imports
import { rootContainerStyles } from '../../link-picker/styled';

import { errorBoundaryFallbackStyles } from './styled';

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

  const EmptyStateComponent = getBooleanFF(
    'platform.linking-platform.link-picker.remove-dst-empty-state',
  )
    ? EmptyStateInternal
    : EmptyState;

  if (
    getBooleanFF(
      'platform.linking-platform.link-picker.fixed-height-search-results',
    )
  ) {
    return (
      <MinHeightContainer
        css={errorBoundaryFallbackStyles}
        minHeight={LINK_PICKER_MIN_HEIGHT_IN_PX_FALLBACK}
        data-testid="link-picker-root-error-boundary-ui"
      >
        <EmptyStateComponent
          header={header}
          renderImage={() => <GenericErrorSVG />}
          description={description}
        />
      </MinHeightContainer>
    );
  }
  return (
    <div
      css={rootContainerStyles}
      data-testid="link-picker-root-error-boundary-ui"
    >
      <EmptyStateComponent
        header={header}
        renderImage={() => <GenericErrorSVG />}
        description={description}
      />
    </div>
  );
};
