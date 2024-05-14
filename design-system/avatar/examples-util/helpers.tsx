/* eslint-disable @atlaskit/design-system/ensure-design-token-usage */
import React, { ReactNode } from 'react';

// eslint-disable-next-line no-restricted-imports
import styled from '@emotion/styled';

import { N100, R400, R50 } from '@atlaskit/theme/colors';
import { token } from '@atlaskit/tokens';

const Wrapper = styled.div({
  marginTop: token('space.100', '8px'),
});

const ChildrenWrapper = styled.div({
  alignItems: 'baseline',
  color: token('color.text'),
  display: 'flex',
  flexWrap: 'wrap',
  '> *': {
    marginRight: token('space.100', '8px'),
  },
});

export const Note = styled.p<{ size?: string }>((props) => ({
  color: N100,
  fontSize: props.size === 'large' ? '1.15em' : '0.9rem',
  marginTop: token('space.050', '4px'),
  marginBottom: token('space.200', '16px'),
}));

// eslint-disable-next-line @atlaskit/design-system/ensure-design-token-usage
export const Code = styled.code({
  backgroundColor: R50,
  borderRadius: '0.2em',
  color: R400,
  fontSize: '0.85em',
  lineHeight: 1.1,
  padding: '0.1em 0.4em',
});

export const Gap = styled.span({
  marginRight: token('space.100', '8px'),
});

export const ShrinkWrap = styled(Gap)({
  height: token('space.300', '24px'),
  width: token('space.300', '24px'),
});
// eslint-disable-next-line @atlaskit/design-system/ensure-design-token-usage
export const Heading = styled.div({
  color: token('color.text.subtlest'),
  display: 'flex',
  fontSize: '0.8rem',
  fontWeight: 500,
  marginBottom: token('space.100', '0.5em'),
  textTransform: 'uppercase',
});

export const Block = ({
  children,
  heading,
  testId,
}: {
  children?: ReactNode;
  heading?: string;
  testId?: string;
}) => (
  <Wrapper data-testid={testId}>
    {heading ? <Heading>{heading}</Heading> : null}
    <ChildrenWrapper>{children}</ChildrenWrapper>
  </Wrapper>
);
