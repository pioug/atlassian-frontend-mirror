import React from 'react';

import styled from 'styled-components';

import LocaleIntlProvider from './helper/locale-intl-provider';
import ProfilecardInteractive from './helper/profile-interactive';

export const MainStage = styled.div`
  margin: 16px;
`;

export const Section = styled.div`
  margin: 16px 0;

  h4 {
    margin: 8px 0;
  }
`;

export default function Example() {
  return (
    <LocaleIntlProvider>
      <MainStage>
        <Section>
          <h4>Interactive Profilecard</h4>
          <ProfilecardInteractive />
        </Section>
      </MainStage>
    </LocaleIntlProvider>
  );
}
