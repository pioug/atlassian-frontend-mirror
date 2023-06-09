import {
  B400,
  G300,
  N0,
  N800,
  P300,
  R300,
  T300,
  Y300,
} from '@atlaskit/theme/colors';

import { generateTheme } from '../../src';

export const theme = [
  generateTheme({
    name: 'atlassian',
    backgroundColor: B400,
    highlightColor: N0,
  }),
  generateTheme({
    name: 'settings',
    backgroundColor: N800,
    highlightColor: N0,
  }),
  generateTheme({
    name: 'white',
    backgroundColor: N0,
    highlightColor: N800,
  }),
  generateTheme({
    name: 'red',
    backgroundColor: R300,
    highlightColor: N0,
  }),
  generateTheme({
    name: 'orange',
    backgroundColor: Y300,
    highlightColor: N800,
  }),
  generateTheme({
    name: 'yellow',
    backgroundColor: '#ffff00',
    highlightColor: N800,
  }),
  generateTheme({
    name: 'green',
    backgroundColor: G300,
    highlightColor: N800,
  }),
  generateTheme({
    name: 'blue',
    backgroundColor: T300,
    highlightColor: N800,
  }),
  generateTheme({
    name: 'violet',
    backgroundColor: P300,
    highlightColor: N0,
  }),
  generateTheme({
    name: 'pink',
    backgroundColor: '#fec8d8',
    highlightColor: N800,
  }),
];

export const themes = [
  generateTheme({
    name: 'huge',
    backgroundColor: '#FFFFFF',
    highlightColor: '#D8388A',
  }),
  generateTheme({
    name: 'showpo',
    backgroundColor: '#E8CBD2',
    highlightColor: '#333333',
  }),
  generateTheme({
    name: 'up',
    backgroundColor: '#EF816B',
    highlightColor: '#FDEE80',
  }),
  generateTheme({
    name: '86400',
    backgroundColor: '#000448',
    highlightColor: '#6FF2B4',
  }),
  generateTheme({
    name: 'netflix',
    backgroundColor: '#272727',
    highlightColor: '#E94E34',
  }),
  generateTheme({
    name: 'atlassian',
    backgroundColor: B400,
    highlightColor: N0,
  }),
];
