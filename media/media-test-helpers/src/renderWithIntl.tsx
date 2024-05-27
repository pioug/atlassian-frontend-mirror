import React from 'react';
import { IntlProvider } from 'react-intl-next';
import { render, type RenderResult } from '@testing-library/react';

export const renderWithIntl = (component: React.ReactNode): RenderResult => {
  return render(<IntlProvider locale="en">{component}</IntlProvider>);
};
