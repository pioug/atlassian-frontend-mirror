import React, { PropsWithChildren, ReactElement } from 'react';
import { render, RenderOptions, RenderResult } from '@testing-library/react';
import { IntlProvider } from 'react-intl-next';

const IntlWrapper = ({
  children,
  locale = 'en',
}: PropsWithChildren<{ locale?: string }>) => {
  return <IntlProvider locale={locale}>{children}</IntlProvider>;
};

export const renderWithIntl: (
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>,
) => RenderResult = (ui, options = {}) =>
  render(ui, { wrapper: IntlWrapper, ...options });
