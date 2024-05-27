/** @jsx jsx */
import React, { useEffect } from 'react';

import { css, jsx } from '@emotion/react';
import { useIntl } from 'react-intl-next';

import Button from '@atlaskit/button';
import EmptyState from '@atlaskit/empty-state';
import { type DatasourceMeta } from '@atlaskit/linking-types';
import {
  AuthError,
  auth as outboundAuth,
} from '@atlaskit/outbound-auth-flow-client';
import { token } from '@atlaskit/tokens';

import { useDatasourceAnalyticsEvents } from '../../../analytics';
import useErrorLogger from '../../../hooks/useErrorLogger';

import { loadingErrorMessages } from './messages';
import { ProviderAuthRequiredSVG } from './provider-auth-required-svg';

const buttonStyles = css({
  marginTop: token('space.200', '16px'),
});

const learnMoreAboutSmartLinksUrl =
  'https://support.atlassian.com/confluence-cloud/docs/insert-links-and-anchors/#Smart-Links-from-Jira-and-other-products';

interface ProviderAuthRequiredProps {
  auth: DatasourceMeta['auth'];
  onAuthSuccess: () => void;
  onAuthError: () => void;
  extensionKey: string | null;
  providerName: DatasourceMeta['providerName'];
  datasourceId: string;
}

export const ProviderAuthRequired = ({
  auth = [],
  onAuthSuccess,
  onAuthError,
  extensionKey,
  providerName,
  datasourceId,
}: ProviderAuthRequiredProps) => {
  const { formatMessage } = useIntl();
  const { captureError } = useErrorLogger({ datasourceId });
  const { fireEvent } = useDatasourceAnalyticsEvents();
  const [authInfo] = auth;

  useEffect(() => {
    fireEvent('ui.error.shown', {
      reason: 'access',
    });
  }, [fireEvent]);

  const onAuthRequest = async () => {
    try {
      await outboundAuth(authInfo.url);
      fireEvent('operational.provider.authSuccess', {
        extensionKey,
        experience: 'datasource',
      });
      onAuthSuccess?.();
    } catch (error) {
      fireEvent('operational.provider.authFailure', {
        reason: error instanceof AuthError && error.type ? error.type : null,
        extensionKey,
        experience: 'datasource',
      });
      captureError('ProviderOnAuthRequest', error);
      onAuthError?.();
    }
  };

  const renderAuthDescription = () => (
    <React.Fragment>
      {formatMessage(loadingErrorMessages.authScreenDescriptionText, {
        providerName,
      })}{' '}
      <a
        href={learnMoreAboutSmartLinksUrl}
        target="_blank"
        rel="noreferrer noopener"
      >
        {formatMessage(loadingErrorMessages.learnMoreAboutSmartLinks)}
      </a>
    </React.Fragment>
  );

  const renderAuthConnectButton = () => (
    <Button onClick={onAuthRequest} appearance="primary" css={buttonStyles}>
      {formatMessage(loadingErrorMessages.authConnectButtonText)}
    </Button>
  );

  return (
    <EmptyState
      testId="datasource--access-required-with-auth"
      header={formatMessage(loadingErrorMessages.authScreenHeaderText, {
        providerName,
      })}
      description={renderAuthDescription()}
      renderImage={ProviderAuthRequiredSVG}
      primaryAction={renderAuthConnectButton()}
    />
  );
};
