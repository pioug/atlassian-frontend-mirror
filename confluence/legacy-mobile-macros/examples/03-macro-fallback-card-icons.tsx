import React from 'react';

import { IntlProvider } from 'react-intl-next';
import styled from 'styled-components';

import { MacroFallbackCard } from '../src/ui';

const MacroWrapper = styled.div`
  padding: 16px 32px;
`;

export default function MacroFallbackCardIconsExample() {
  return (
    <IntlProvider locale="en">
      <MacroWrapper>
        <MacroFallbackCard
          macroName="Table Of Contents"
          extensionKey="toc"
          action="Cancel"
          loading={false}
          secondaryAction=""
        />
      </MacroWrapper>
      <MacroWrapper>
        <MacroFallbackCard
          macroName="Jira"
          extensionKey="jira"
          action="Cancel"
          loading={false}
          secondaryAction=""
        />
      </MacroWrapper>
      <MacroWrapper>
        <MacroFallbackCard
          macroName="Chart"
          extensionKey="chart:default"
          action="Cancel"
          loading={false}
          secondaryAction=""
        />
      </MacroWrapper>
    </IntlProvider>
  );
}
