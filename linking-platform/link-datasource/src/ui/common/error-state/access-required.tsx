/** @jsx jsx */
import { useEffect } from 'react';

import { css, jsx } from '@emotion/react';
import { useIntl } from 'react-intl-next';

import EmptyState from '@atlaskit/empty-state';
import { N400 } from '@atlaskit/theme/colors';
import { token } from '@atlaskit/tokens';

import { useDatasourceAnalyticsEvents } from '../../../analytics';

import { AccessRequiredSVG } from './access-required-svg';
import { loadingErrorMessages } from './messages';

const urlStyles = css({
  color: token('color.text.subtlest', N400),
  fontSize: token('font.size.100', '14px'),
  lineHeight: token('font.lineHeight.200', '20px'),
});

const descriptionMessageStyles = css({
  display: 'flex',
  flexDirection: 'column',
  gap: token('space.200', '16px'),
});

const iconContainerStyles = css({
  marginBottom: token('space.200', '16px'),
});

const Description = ({ message, url }: { message: string; url: string }) => {
  return (
    <div css={descriptionMessageStyles}>
      <span css={urlStyles}>{url}</span>
      <span>{message}</span>
    </div>
  );
};

const IconContainer = () => (
  <div css={iconContainerStyles}>
    <AccessRequiredSVG />
  </div>
);

interface AccessRequiredProps {
  /** The url to be displayed to the user when they are unauthorized to query */
  url?: string;
}

export const AccessRequired = ({ url }: AccessRequiredProps) => {
  const { formatMessage } = useIntl();
  const { fireEvent } = useDatasourceAnalyticsEvents();

  useEffect(() => {
    fireEvent('ui.error.shown', {
      reason: 'access',
    });
  }, [fireEvent]);

  if (url) {
    return (
      <EmptyState
        header={formatMessage(loadingErrorMessages.accessRequiredWithSite)}
        description={
          <Description
            message={formatMessage(loadingErrorMessages.accessInstructions)}
            url={url}
          />
        }
        renderImage={IconContainer}
      />
    );
  }

  return (
    <EmptyState
      header={formatMessage(loadingErrorMessages.accessRequired)}
      description={formatMessage(loadingErrorMessages.accessInstructions)}
      renderImage={IconContainer}
    />
  );
};
