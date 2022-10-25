import React, { ReactNode } from 'react';
import { IntlProvider } from 'react-intl-next';

import { ufologger } from '@atlaskit/ufo';

interface WrapperProps {
  children: ReactNode;
}

export function PageWrapper({ children }: WrapperProps) {
  ufologger.enable();

  return (
    <div className="example" style={{ padding: 50 }}>
      <IntlProvider locale="en">{children}</IntlProvider>
    </div>
  );
}

export function PageHeader({ children }: WrapperProps) {
  return <div style={{ marginBottom: '2em', maxWidth: 700 }}>{children}</div>;
}
