import {
  WithAnalyticsEventsProps,
  withAnalyticsEvents,
} from '@atlaskit/analytics-next';
import { isFileIdentifier } from '@atlaskit/media-client';
import { withMediaAnalyticsContext } from '@atlaskit/media-common';
import React from 'react';
import {
  IntlProvider,
  WrappedComponentProps,
  injectIntl,
} from 'react-intl-next';
import { CardProps } from '../../types';
import { ExternalImageCard } from './externalImageCard';
import { FileCard } from './fileCard';

const packageName = process.env._PACKAGE_NAME_ as string;
const packageVersion = process.env._PACKAGE_VERSION_ as string;

export type CardV2BaseProps = CardProps &
  WithAnalyticsEventsProps &
  Partial<WrappedComponentProps>;

export const CardV2Base = ({
  identifier,
  ...otherProps
}: CardV2BaseProps & WrappedComponentProps) => {
  const innerContent = isFileIdentifier(identifier) ? (
    <FileCard {...otherProps} identifier={identifier} key={identifier.id} />
  ) : (
    <ExternalImageCard
      {...otherProps}
      identifier={identifier}
      key={identifier.dataURI}
    />
  );
  return otherProps.intl ? (
    innerContent
  ) : (
    <IntlProvider locale="en">{innerContent}</IntlProvider>
  );
};

export const CardV2: React.ComponentType<CardV2BaseProps> =
  withMediaAnalyticsContext({
    packageVersion,
    packageName,
    componentName: 'mediaCard',
    component: 'mediaCard',
  })(
    withAnalyticsEvents()(
      injectIntl(CardV2Base, {
        enforceContext: false,
      }),
    ),
  );
