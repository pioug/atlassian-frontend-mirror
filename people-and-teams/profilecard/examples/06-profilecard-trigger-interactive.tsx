import React from 'react';

import styled from 'styled-components';

import InteractiveTrigger from './helper/interactive-trigger';
import LocaleIntlProvider from './helper/locale-intl-provider';
import { getMockProfileClient } from './helper/util';

const mockClient = getMockProfileClient(10, 0);

export const MainStage = styled.div`
  margin: 16px;
`;

export const Section = styled.div`
  margin: 16px 0;
  height: 640px;

  h4 {
    margin: 8px 0;
  }
`;

export default function Example() {
  return (
    <LocaleIntlProvider>
      <MainStage>
        <Section>
          <h4>Profilecard triggered by hover</h4>
          <InteractiveTrigger resourceClient={mockClient} />
        </Section>
      </MainStage>
    </LocaleIntlProvider>
  );
}
