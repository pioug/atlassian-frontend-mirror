/* eslint-disable @atlaskit/design-system/ensure-design-token-usage */
import React, { ReactNode } from 'react';

// eslint-disable-next-line no-restricted-imports
import styled from '@emotion/styled';

import { N100, R400, R50, subtleHeading, text } from '@atlaskit/theme/colors';
import { gridSize } from '@atlaskit/theme/constants';

const Wrapper = styled.div`
  margin-top: ${gridSize}px;
`;

const ChildrenWrapper = styled.div`
  align-items: baseline;
  color: ${text};
  display: flex;
  flex-wrap: wrap;

  > * {
    margin-right: ${gridSize}px;
  }
`;

export const Note = styled.p<{ size?: string }>`
  color: ${N100};
  font-size: ${(props) => (props.size === 'large' ? '1.15em' : '0.9rem')};
  margin-top: ${gridSize() / 2}px;
  margin-bottom: ${gridSize() * 2}px;
`;

export const Code = styled.code`
  background-color: ${R50};
  border-radius: 0.2em;
  color: ${R400};
  font-size: 0.85em;
  line-height: 1.1;
  padding: 0.1em 0.4em;
`;

export const Gap = styled.span`
  margin-right: ${gridSize}px;
`;

export const ShrinkWrap = styled(Gap)`
  height: ${gridSize() * 3}px;
  width: ${gridSize() * 3}px;
`;
export const Heading = styled.div`
  color: ${subtleHeading};
  display: flex;
  font-size: 0.8rem;
  font-weight: 500;
  margin-bottom: 0.5em;
  text-transform: uppercase;
`;

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
