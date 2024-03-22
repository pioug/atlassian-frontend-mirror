/** @jsx jsx */
import { css, jsx } from '@emotion/react';
import { FormattedMessage } from 'react-intl-next';

import { Flex, xcss } from '@atlaskit/primitives';
import { token } from '@atlaskit/tokens';

import { loadingErrorMessages } from './messages';
import { NoInstancesSvg } from './no-instances-svg';

const titleStyles = css({
  font: token(
    'font.heading.small',
    'normal 600 16px/20px ui-sans-serif, -apple-system, BlinkMacSystemFont, "Segoe UI", Ubuntu, system-ui, "Helvetica Neue", sans-serif',
  ),
  marginTop: token('space.200', '16px'),
});

const descriptionStyles = css({
  marginTop: token('space.100', '8px'),
});

const containerStyles = xcss({
  marginTop: '60px',
});

export const NoInstancesView = () => (
  <Flex
    testId="no-jira-instances-content"
    direction="column"
    alignItems="center"
    xcss={containerStyles}
  >
    <NoInstancesSvg />
    <span css={titleStyles}>
      <FormattedMessage {...loadingErrorMessages.noAccessToJiraSitesTitle} />
    </span>
    <span css={descriptionStyles}>
      <FormattedMessage
        {...loadingErrorMessages.noAccessToJiraSitesDescription}
      />
    </span>
  </Flex>
);
