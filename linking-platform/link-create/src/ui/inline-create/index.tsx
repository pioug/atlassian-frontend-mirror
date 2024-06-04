/** @jsx jsx */
import { memo } from 'react';

import { jsx } from '@emotion/react';

import { AnalyticsContext } from '@atlaskit/analytics-next';
import { IntlMessagesProvider } from '@atlaskit/intl-messages-provider';

import { PACKAGE_DATA } from '../../common/constants';
import type { LinkCreateWithModalProps } from '../../common/types';
import { ErrorBoundary } from '../../common/ui/error-boundary';
import { ErrorBoundaryModal } from '../../common/ui/error-boundary-modal';
import { Experience } from '../../common/ui/experience-tracker';
import { withLinkCreateAnalyticsContext } from '../../common/utils/analytics';
import { fetchMessagesForLocale } from '../../common/utils/locale/fetch-messages-for-locale';
import i18nEN from '../../i18n/en';

import InlineCreate from './main';

const LinkCreateWithAnalyticsContext = withLinkCreateAnalyticsContext(
  memo((props: LinkCreateWithModalProps) => {
    return (
      <Experience>
        {/* todo: EDM-10093 - move to a non-modal error boundary */}
        <ErrorBoundary
          errorComponent={
            <ErrorBoundaryModal
              active={props.active}
              onClose={props.onCancel}
            />
          }
        >
          <InlineCreate {...props} />
        </ErrorBoundary>
      </Experience>
    );
  }),
);

const ComposedLinkCreate = memo((props: LinkCreateWithModalProps) => {
  return (
    <AnalyticsContext data={PACKAGE_DATA}>
      <IntlMessagesProvider
        defaultMessages={i18nEN}
        loaderFn={fetchMessagesForLocale}
      >
        <LinkCreateWithAnalyticsContext {...props} />
      </IntlMessagesProvider>
    </AnalyticsContext>
  );
});

export default ComposedLinkCreate;
