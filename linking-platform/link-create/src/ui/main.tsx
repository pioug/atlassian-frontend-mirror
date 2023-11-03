/** @jsx jsx */
import { memo } from 'react';

import { jsx } from '@emotion/react';

import { AnalyticsContext } from '@atlaskit/analytics-next';
import { IntlMessagesProvider } from '@atlaskit/intl-messages-provider';
import { getBooleanFF } from '@atlaskit/platform-feature-flags';

import { COMPONENT_NAME } from '../common/constants';
import { LinkCreateWithModalProps } from '../common/types';
import { ErrorBoundaryModal } from '../common/ui/error-boundary-modal';
import { withLinkCreateAnalyticsContext } from '../common/utils/analytics';
import { PackageMetaDataType } from '../common/utils/analytics/analytics.codegen';
import { fetchMessagesForLocale } from '../common/utils/locale/fetch-messages-for-locale';
import i18nEN from '../i18n/en';

import LinkCreate from './link-create';
import { ErrorBoundary } from './link-create/error-boundary';

const LinkCreateWithAnalyticsContext = withLinkCreateAnalyticsContext(
  memo(({ ...props }: LinkCreateWithModalProps) => {
    if (
      getBooleanFF('platform.linking-platform.link-create.outer-error-boundary')
    ) {
      return (
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
      );
    }

    return <LinkCreate {...props} />;
  }),
);

export const PACKAGE_DATA: PackageMetaDataType = {
  packageName: process.env._PACKAGE_NAME_ || '',
  packageVersion: process.env._PACKAGE_VERSION_ || '',
  componentName: COMPONENT_NAME,
  source: COMPONENT_NAME,
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
