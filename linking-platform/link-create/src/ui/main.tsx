/** @jsx jsx */
import { Fragment, memo } from 'react';

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
import { Experience } from '../controllers/experience-tracker';
import i18nEN from '../i18n/en';

import LinkCreate from './link-create';
import { ErrorBoundary } from './link-create/error-boundary';

const LinkCreateWithAnalyticsContext = withLinkCreateAnalyticsContext(
  memo((props: LinkCreateWithModalProps) => {
    const ExperienceProvider = getBooleanFF(
      'platform.linking-platform.link-create.better-observability',
    )
      ? Experience
      : Fragment;

    return (
      <ExperienceProvider>
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
      </ExperienceProvider>
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
