import React from 'react';
import styled from 'styled-components';
import * as colors from '@atlaskit/theme/colors';
import Section from './section';
import SwitcherItem from './item';

const IconSkeleton = styled.div`
  background-color: ${colors.N20};
  display: inline-block;
  width: 32px;
  height: 32px;
  border-radius: 8px;
`;

const LineSkeleton = styled.div`
  background-color: ${colors.N20};
  display: inline-block;
  width: 98px;
  height: 10px;
  border-radius: 3px;
`;

export default () => (
  <Section sectionId="skeleton" title={<LineSkeleton />}>
    <SwitcherItem icon={<IconSkeleton />} isDisabled>
      <LineSkeleton />
    </SwitcherItem>
    <SwitcherItem icon={<IconSkeleton />} isDisabled>
      <LineSkeleton />
    </SwitcherItem>
    <SwitcherItem icon={<IconSkeleton />} isDisabled>
      <LineSkeleton />
    </SwitcherItem>
  </Section>
);
