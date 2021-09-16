import cases from 'jest-in-case';

import { Theme, ThemeProps } from '../../types';
import getTheme from '../get-theme';

cases(
  'getTheme(props)',
  ({ input, output }: { input?: ThemeProps; output: Theme }) => {
    expect(getTheme(input)).toStrictEqual(output);
  },
  [
    { input: undefined, output: { mode: 'light' } },
    { input: null, output: { mode: 'light' } },
    { input: {}, output: { mode: 'light' } },
    { input: { theme: undefined }, output: { mode: 'light' } },
    { input: { theme: null }, output: { mode: 'light' } },
    { input: { theme: {} }, output: { mode: 'light' } },
    {
      input: {
        theme: {
          __ATLASKIT_THEME__: undefined,
        },
      },
      output: undefined,
    },
    {
      input: {
        theme: {
          __ATLASKIT_THEME__: null,
        },
      },
      output: null,
    },
    {
      input: {
        theme: {
          __ATLASKIT_THEME__: {},
        },
      },
      output: {},
    },
    {
      input: {
        theme: {
          __ATLASKIT_THEME__: { mode: 'dark' },
        },
      },
      output: { mode: 'dark' },
    },
    {
      input: {
        theme: { mode: undefined },
      },
      output: { mode: 'light' },
    },
    {
      input: {
        theme: { mode: null },
      },
      output: { mode: 'light' },
    },
    {
      input: {
        theme: { mode: {} },
      },
      output: { mode: 'light' },
    },
    {
      input: {
        theme: { mode: 'something' },
      },
      output: { mode: 'light' },
    },
    {
      input: {
        theme: { mode: 'dark' },
      },
      output: { mode: 'dark' },
    },
  ],
);
