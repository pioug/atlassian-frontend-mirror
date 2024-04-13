/* eslint-disable @atlaskit/design-system/ensure-design-token-usage */
import React, { ReactNode } from 'react';

import styled from '@emotion/styled';

import { SizeType } from '@atlaskit/avatar';
import { N100, N200, N900, R400, R50 } from '@atlaskit/theme/colors';
import { token } from '@atlaskit/tokens';

// eslint-disable-next-line @atlaskit/design-system/use-primitives -- needs manual remediation
const Wrapper = styled.div({
  marginTop: token('space.100', '8px'),
});

const ChildrenWrapper = styled.div({
  alignItems: 'baseline',
  color: token('color.text', N900),
  display: 'flex',
  '> *': {
    marginRight: token('space.100', '8px'),
  },
});

// eslint-disable-next-line @atlaskit/design-system/no-styled-tagged-template-expression -- needs manual remediation
export const Note = styled.p<{ size?: SizeType }>`
  color: ${N100};
  font-size: ${(props) => (props.size === 'large' ? '1.15em' : '0.9rem')};
  margin-top: ${token('space.050', '4px')};
  margin-bottom: ${token('space.200', '16px')};
`;

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

export const Dot = styled(Gap)({
  height: token('space.300', '24px'),
  width: token('space.300', '24px'),
});
// eslint-disable-next-line @atlaskit/design-system/ensure-design-token-usage
export const Heading = styled.div({
  color: token('color.text.subtlest', N200),
  display: 'flex',
  fontSize: '0.8rem',
  fontWeight: 500,
  // eslint-disable-next-line @atlaskit/design-system/use-tokens-space -- needs manual remediation
  marginBottom: '0.5em',
  textTransform: 'uppercase',
});

export const ExampleGroup = ({
  children,
  heading,
}: {
  children?: ReactNode;
  heading?: string;
}) => (
  <Wrapper>
    {heading ? <Heading>{heading}</Heading> : null}
    <ChildrenWrapper>{children}</ChildrenWrapper>
  </Wrapper>
);
