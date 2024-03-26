/** @jsx jsx */
import { css, jsx } from '@emotion/react';
import { MessageDescriptor, useIntl } from 'react-intl-next';

import { Flex, xcss } from '@atlaskit/primitives';
import { token } from '@atlaskit/tokens';

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

interface NoInstanceViewProps {
  title: MessageDescriptor;
  description: MessageDescriptor;
  testId: string;
}

export const NoInstancesView = ({
  title,
  description,
  testId,
}: NoInstanceViewProps) => {
  const { formatMessage } = useIntl();
  return (
    <Flex
      testId={testId}
      direction="column"
      alignItems="center"
      xcss={containerStyles}
    >
      <NoInstancesSvg />
      <span css={titleStyles}>{formatMessage(title)}</span>
      <span css={descriptionStyles}>{formatMessage(description)}</span>
    </Flex>
  );
};
