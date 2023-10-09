import React from 'react';

import { render, screen } from '@testing-library/react';

import AppProvider from '../../src/app-provider';

afterEach(() => {
  jest.resetAllMocks();
});

describe('AppProvider', () => {
  it('should render', async () => {
    render(<AppProvider>Hello</AppProvider>);
    expect(screen.getByText('Hello')).toBeInTheDocument();
  });

  it('should throw when there are nested AppProviders', async () => {
    // @ts-ignore
    jest.spyOn(global.console, 'error').mockImplementation(() => {});

    const app = (
      <AppProvider>
        <AppProvider>Hello</AppProvider>
      </AppProvider>
    );
    expect(() => render(app)).toThrow();
  });
});
