import type { BaseToken } from '../../../palettes/palette';
import type { AccentColorTokenSchema, ValueSchema } from '../../../types';

const color: ValueSchema<AccentColorTokenSchema<BaseToken>> = {
  color: {
    text: {
      accent: {
        blue: {
          '[default]': { value: 'Blue800' },
          bolder: { value: 'Blue900' },
        },
        red: {
          '[default]': { value: 'Red800' },
          bolder: { value: 'Red900' },
        },
        orange: {
          '[default]': { value: 'Orange800' },
          bolder: { value: 'Orange900' },
        },
        yellow: {
          '[default]': { value: 'Yellow800' },
          bolder: { value: 'Yellow900' },
        },
        green: {
          '[default]': { value: 'Green800' },
          bolder: { value: 'Green900' },
        },
        purple: {
          '[default]': { value: 'Purple800' },
          bolder: { value: 'Purple900' },
        },
        teal: {
          '[default]': { value: 'Teal800' },
          bolder: { value: 'Teal900' },
        },
        magenta: {
          '[default]': { value: 'Magenta800' },
          bolder: { value: 'Magenta900' },
        },
        gray: {
          '[default]': { value: 'Neutral800' },
          bolder: { value: 'Neutral1000' },
        },
      },
    },
    icon: {
      accent: {
        blue: { value: 'Blue600' },
        red: { value: 'Red600' },
        orange: { value: 'Orange600' },
        yellow: { value: 'Yellow600' },
        green: { value: 'Green600' },
        purple: { value: 'Purple600' },
        teal: { value: 'Teal600' },
        magenta: { value: 'Magenta600' },
        gray: { value: 'Neutral600' },
      },
    },
    border: {
      accent: {
        blue: { value: 'Blue600' },
        red: { value: 'Red600' },
        orange: { value: 'Orange600' },
        yellow: { value: 'Yellow600' },
        green: { value: 'Green600' },
        purple: { value: 'Purple600' },
        teal: { value: 'Teal600' },
        magenta: { value: 'Magenta600' },
        gray: { value: 'Neutral600' },
      },
    },
    background: {
      accent: {
        blue: {
          subtlest: { value: 'Blue100' },
          subtler: { value: 'Blue200' },
          subtle: { value: 'Blue400' },
          bolder: { value: 'Blue700' },
        },
        red: {
          subtlest: { value: 'Red100' },
          subtler: { value: 'Red200' },
          subtle: { value: 'Red400' },
          bolder: { value: 'Red700' },
        },
        orange: {
          subtlest: { value: 'Orange100' },
          subtler: { value: 'Orange200' },
          subtle: { value: 'Orange400' },
          bolder: { value: 'Orange700' },
        },
        yellow: {
          subtlest: { value: 'Yellow100' },
          subtler: { value: 'Yellow200' },
          subtle: { value: 'Yellow400' },
          bolder: { value: 'Yellow700' },
        },
        green: {
          subtlest: { value: 'Green100' },
          subtler: { value: 'Green200' },
          subtle: { value: 'Green400' },
          bolder: { value: 'Green700' },
        },
        purple: {
          subtlest: { value: 'Purple100' },
          subtler: { value: 'Purple200' },
          subtle: { value: 'Purple400' },
          bolder: { value: 'Purple700' },
        },
        teal: {
          subtlest: { value: 'Teal100' },
          subtler: { value: 'Teal200' },
          subtle: { value: 'Teal400' },
          bolder: { value: 'Teal700' },
        },
        magenta: {
          subtlest: { value: 'Magenta100' },
          subtler: { value: 'Magenta200' },
          subtle: { value: 'Magenta400' },
          bolder: { value: 'Magenta700' },
        },
        gray: {
          subtlest: { value: 'Neutral200' },
          subtler: { value: 'Neutral300' },
          subtle: { value: 'Neutral500' },
          bolder: { value: 'Neutral700' },
        },
      },
    },
  },
};

export default color;
