import React, { ReactElement } from 'react';
import { render, RenderOptions, RenderResult } from '@testing-library/react';
import { FC } from 'react';
import { IntlProvider } from 'react-intl-next';

const IntlWrapper: FC = ({ children }) => {
  return <IntlProvider locale="en">{children}</IntlProvider>;
};

export const renderWithIntl: (
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>,
) => RenderResult = (ui, options = {}) =>
  render(ui, { wrapper: IntlWrapper, ...options });
