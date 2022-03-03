/* eslint-disable jest/no-focused-tests */
/* eslint-disable no-console */
jest.mock('../../local-storage', () => ({
  setItem: jest.fn(),
  getItem: jest.fn(),
}));

import React from 'react';

import { fireEvent, render } from '@testing-library/react';

import App from '../../app';
import localStorageFacade from '../../local-storage';

window.chrome = {
  devtools: {
    // @ts-ignore
    inspectedWindow: {
      tabId: 123,
    },
  },
  // @ts-ignore
  tabs: {
    query: jest.fn(),
  },
  // @ts-ignore
  runtime: {
    connect: jest
      .fn()
      .mockImplementation(() => ({ onMessage: { addListener: jest.fn() } })),
    sendMessage: jest.fn(),
  },
};

describe('Theme Switcher', () => {
  let htmlEl: HTMLHtmlElement;
  afterEach(() => {
    delete htmlEl.dataset.theme;
    jest.clearAllMocks();
  });

  beforeEach(() => {
    htmlEl = document.querySelector('html')!;
    delete htmlEl.dataset.theme;
  });

  it('should change theme to the respective radio button when clicked', () => {
    const { getByTestId } = render(<App />);

    expect(htmlEl.dataset.theme).toEqual(undefined);

    const radioLight = getByTestId('light--radio-input');
    fireEvent.click(radioLight);

    expect(htmlEl.dataset.theme).toEqual('light');
    expect(localStorageFacade.setItem).toHaveBeenCalledWith('theme', 'light');
  });

  it('should be able to switch between themes', () => {
    const { getByTestId } = render(<App />);

    expect(htmlEl.dataset.theme).toEqual(undefined);

    const radioLight = getByTestId('light--radio-input');
    fireEvent.click(radioLight);
    expect(htmlEl.dataset.theme).toEqual('light');
    expect(localStorageFacade.setItem).toHaveBeenCalledWith('theme', 'light');

    const radioDark = getByTestId('dark--radio-input');
    fireEvent.click(radioDark);
    expect(htmlEl.dataset.theme).toEqual('dark');
    expect(localStorageFacade.setItem).toHaveBeenCalledWith('theme', 'dark');
  });

  it('should be able to switch from theme to no theme', () => {
    const { getByTestId } = render(<App />);

    expect(htmlEl.dataset.theme).toEqual(undefined);

    const radioDark = getByTestId('dark--radio-input');
    fireEvent.click(radioDark);
    expect(htmlEl.dataset.theme).toEqual('dark');
    expect(localStorageFacade.setItem).toHaveBeenCalledWith('theme', 'dark');

    const radioNone = getByTestId('none--radio-input');
    fireEvent.click(radioNone);
    expect(htmlEl.dataset.theme).toEqual(undefined);
    expect(localStorageFacade.setItem).toHaveBeenCalledWith('theme', 'none');
  });
});
