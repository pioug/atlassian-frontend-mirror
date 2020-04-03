import { OptionsType } from '../../src/types';

export const cities: OptionsType = [
  { label: 'Adelaide', value: 'adelaide', extra: 'extra' },
  { label: 'Brisbane', value: 'brisbane' },
  { label: 'Canberra', value: 'canberra' },
  { label: 'Darwin', value: 'darwin' },
  { label: 'Hobart', value: 'hobart' },
  { label: 'Melbourne', value: 'melbourne' },
  { label: 'Perth', value: 'perth' },
  { label: 'Sydney', value: 'sydney' },
];

export const longFormValues: OptionsType = [
  { label: 'foo@foo@foo@foo@test@test.com', value: 'silly' },
  {
    label: 'foo@foo@test@test@test@test@test@foo@test@foo.com',
    value: 'even sillier',
  },
  {
    label:
      'foo@foo@test@test@test@test@test@foo@test@foo.comfoo@foo@test@test@test@test@test@foo@test@foo.comfoo@foo@test@test@test@test@test@foo@test@foo.comfoo@foo@test@test@test@test@test@foo@test@foo.com',
    value: 'silliest',
  },
];
