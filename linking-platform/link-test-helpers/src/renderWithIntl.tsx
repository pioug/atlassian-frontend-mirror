import React from 'react';

import { render, RenderResult } from '@testing-library/react';
import { IntlProvider } from 'react-intl-next';

export const renderWithIntl = (component: React.ReactNode): RenderResult => {
  return render(<IntlProvider locale="en">{component}</IntlProvider>);
};
