import React, { ReactElement } from 'react';
import { render, RenderOptions, RenderResult } from '@testing-library/react';
import { IntlProvider } from 'react-intl-next';

const IntlWrapper: React.FC<{ locale?: string }> = ({
  children,
  locale = 'en',
}) => {
  return <IntlProvider locale={locale}>{children}</IntlProvider>;
};

export const renderWithIntl: (
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>,
) => RenderResult = (ui, options = {}) =>
  render(ui, { wrapper: IntlWrapper, ...options });
