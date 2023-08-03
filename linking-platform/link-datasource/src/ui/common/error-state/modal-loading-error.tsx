/** @jsx jsx */
import { useEffect } from 'react';

import { css, jsx } from '@emotion/react';
import { FormattedMessage } from 'react-intl-next';

import { token } from '@atlaskit/tokens';

import { useDatasourceAnalyticsEvents } from '../../../analytics';

import { LoadingErrorSVG } from './loading-error-svg';
import { loadingErrorMessages } from './messages';

const errorContainerStyles = css({
  display: 'grid',
  gap: token('space.300', '24px'),
  placeItems: 'center',
  placeSelf: 'center',
});

const errorMessageContainerStyles = css({
  display: 'grid',
  gap: token('space.100', '8px'),
  placeItems: 'center',
});

const errorMessageStyles = css({
  fontWeight: token('font.weight.semibold', '600'),
  fontSize: token('font.size.200', '16px'),
});

const errorDescriptionStyles = css({
  margin: 0,
});

interface ModalLoadingErrorProps {
  url?: string;
}

export const ModalLoadingError = ({ url }: ModalLoadingErrorProps) => {
  const { fireEvent } = useDatasourceAnalyticsEvents();

  useEffect(() => {
    fireEvent('ui.error.shown', {
      reason: 'network',
    });
  }, [fireEvent]);

  return (
    <div
      css={errorContainerStyles}
      data-testid="jira-jql-datasource-modal--loading-error"
    >
      <LoadingErrorSVG />
      <div css={errorMessageContainerStyles}>
        <span css={errorMessageStyles}>
          <FormattedMessage {...loadingErrorMessages.unableToLoadResults} />
        </span>
        <p css={errorDescriptionStyles}>
          {url ? (
            <FormattedMessage
              {...loadingErrorMessages.checkConnectionWithSource}
              values={{ a: (chunk: any) => <a href={url}>{chunk}</a> }}
            />
          ) : (
            <FormattedMessage {...loadingErrorMessages.checkConnection} />
          )}
        </p>
      </div>
    </div>
  );
};
