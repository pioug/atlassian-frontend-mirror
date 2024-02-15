import React from 'react';

import { IntlProvider } from 'react-intl-next';
import styled from 'styled-components';

import { token } from '@atlaskit/tokens';

import { MacroFallbackCard } from '../src/ui';

const MacroWrapper = styled.div`
  padding: ${token('space.200', '16px')} ${token('space.400', '32px')};
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
