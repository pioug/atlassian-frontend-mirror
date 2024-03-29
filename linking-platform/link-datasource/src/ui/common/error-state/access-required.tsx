/** @jsx jsx */
import { useEffect } from 'react';

import { css, jsx } from '@emotion/react';
import { useIntl } from 'react-intl-next';

import EmptyState from '@atlaskit/empty-state';
import { Box, xcss } from '@atlaskit/primitives';
import { N400 } from '@atlaskit/theme/colors';
import { token } from '@atlaskit/tokens';

import { useDatasourceAnalyticsEvents } from '../../../analytics';

import { AccessRequiredSVG } from './access-required-svg';
import { loadingErrorMessages } from './messages';

const urlStyles = css({
  color: token('color.text.subtlest', N400),
  font: token(
    'font.body',
    'normal 400 14px/20px ui-sans-serif, -apple-system, BlinkMacSystemFont, "Segoe UI", Ubuntu, system-ui, "Helvetica Neue", sans-serif',
  ),
});

const descriptionMessageStyles = css({
  display: 'flex',
  flexDirection: 'column',
  gap: token('space.200', '16px'),
});

const iconContainerStyles = xcss({
  marginBottom: 'space.200',
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
  <Box xcss={iconContainerStyles}>
    <AccessRequiredSVG />
  </Box>
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
        testId="datasource--access-required-with-url"
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
      testId="datasource--access-required"
      header={formatMessage(loadingErrorMessages.accessRequired)}
      description={formatMessage(loadingErrorMessages.accessInstructions)}
      renderImage={IconContainer}
    />
  );
};
