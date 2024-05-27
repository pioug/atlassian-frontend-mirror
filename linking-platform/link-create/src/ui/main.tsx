/** @jsx jsx */
import { memo } from 'react';

import { jsx } from '@emotion/react';

import { AnalyticsContext } from '@atlaskit/analytics-next';
import { IntlMessagesProvider } from '@atlaskit/intl-messages-provider';

import { COMPONENT_NAME } from '../common/constants';
import { type LinkCreateWithModalProps } from '../common/types';
import { ErrorBoundaryModal } from '../common/ui/error-boundary-modal';
import { withLinkCreateAnalyticsContext } from '../common/utils/analytics';
import { type PackageMetaDataType } from '../common/utils/analytics/analytics.codegen';
import { fetchMessagesForLocale } from '../common/utils/locale/fetch-messages-for-locale';
import { Experience } from '../controllers/experience-tracker';
import i18nEN from '../i18n/en';

import LinkCreate from './link-create';
import { ErrorBoundary } from './link-create/error-boundary';

const LinkCreateWithAnalyticsContext = withLinkCreateAnalyticsContext(
  memo((props: LinkCreateWithModalProps) => {
    return (
      <Experience>
        <ErrorBoundary
          errorComponent={
            <ErrorBoundaryModal
              active={props.active}
              onClose={props.onCancel}
            />
          }
        >
          <LinkCreate {...props} />
        </ErrorBoundary>
      </Experience>
    );
  }),
);

export const PACKAGE_DATA: PackageMetaDataType = {
  packageName: process.env._PACKAGE_NAME_ || '',
  packageVersion: process.env._PACKAGE_VERSION_ || '',
  component: COMPONENT_NAME,
  componentName: COMPONENT_NAME,
};

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
