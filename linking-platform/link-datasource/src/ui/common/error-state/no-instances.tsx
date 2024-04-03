/** @jsx jsx */
import { css, jsx } from '@emotion/react';
import { MessageDescriptor, useIntl } from 'react-intl-next';

import { Flex, xcss } from '@atlaskit/primitives';
import { fontFallback } from '@atlaskit/theme/typography';
import { token } from '@atlaskit/tokens';

import { NoInstancesSvg } from './no-instances-svg';

const titleStyles = css({
  font: token('font.heading.small', fontFallback.heading.small),
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
