import type { PaletteColorTokenSchema } from '../../src/types';

import defaultPalette, { PaletteValues } from './palette';

/**
 * Simple object check.
 * @param item
 * @returns {boolean}
 */
export function isObject(item: object) {
  return item && typeof item === 'object' && !Array.isArray(item);
}

/**
 * Deep merge two objects.
 * @param target
 * @param ...sources
 */
function mergeDeep(
  target: Record<string, any>,
  ...sources: [Record<string, any>]
): any {
  if (!sources.length) {
    return target;
  }
  const source = sources.shift();

  if (isObject(target) && isObject(source!)) {
    for (const key in source) {
      if (isObject(source[key])) {
        if (!target[key]) {
          Object.assign(target, { [key]: {} });
        }
        mergeDeep(target[key], source[key]);
      } else {
        Object.assign(target, { [key]: source[key] });
      }
    }
  }

  return mergeDeep(target, ...sources);
}

const palette: PaletteColorTokenSchema<PaletteValues> = mergeDeep(
  JSON.parse(JSON.stringify(defaultPalette)),
  {
    color: {
      palette: {
        Blue1000: {
          value: '#1C2B41',
          attributes: {
            group: 'palette',
            category: 'blue',
          },
        },
        Red100: {
          value: '#FFECEB',
          attributes: {
            group: 'palette',
            category: 'red',
          },
        },
        Red200: {
          value: '#FFD5D2',
          attributes: {
            group: 'palette',
            category: 'red',
          },
        },
        Red300: {
          value: '#FD9891',
          attributes: {
            group: 'palette',
            category: 'red',
          },
        },
        Red400: {
          value: '#F87168',
          attributes: {
            group: 'palette',
            category: 'red',
          },
        },
        Red500: {
          value: '#F15B50',
          attributes: {
            group: 'palette',
            category: 'red',
          },
        },
        Red600: {
          value: '#E2483D',
          attributes: {
            group: 'palette',
            category: 'red',
          },
        },
        Red700: {
          value: '#C9372C',
          attributes: {
            group: 'palette',
            category: 'red',
          },
        },
        Red800: {
          value: '#AE2E24',
          attributes: {
            group: 'palette',
            category: 'red',
          },
        },
        Red900: {
          value: '#5D1F1A',
          attributes: {
            group: 'palette',
            category: 'red',
          },
        },
        Red1000: {
          value: '#42221F',
          attributes: {
            group: 'palette',
            category: 'red',
          },
        },
        Yellow1000: {
          value: '#332E1B',
          attributes: {
            group: 'palette',
            category: 'yellow',
          },
        },
        Green100: {
          value: '#DCFFF1',
          attributes: {
            group: 'palette',
            category: 'green',
          },
        },
        Green1000: {
          value: '#1C3329',
          attributes: {
            group: 'palette',
            category: 'green',
          },
        },
        Purple1000: {
          value: '#2B273F',
          attributes: {
            group: 'palette',
            category: 'purple',
          },
        },
        Teal100: {
          value: '#E7F9FF',
          attributes: {
            group: 'palette',
            category: 'teal',
          },
        },
        Teal200: {
          value: '#C6EDFB',
          attributes: {
            group: 'palette',
            category: 'teal',
          },
        },
        Teal300: {
          value: '#9DD9EE',
          attributes: {
            group: 'palette',
            category: 'teal',
          },
        },
        Teal400: {
          value: '#6CC3E0',
          attributes: {
            group: 'palette',
            category: 'teal',
          },
        },
        Teal500: {
          value: '#42B2D7',
          attributes: {
            group: 'palette',
            category: 'teal',
          },
        },
        Teal600: {
          value: '#2898BD',
          attributes: {
            group: 'palette',
            category: 'teal',
          },
        },
        Teal700: {
          value: '#227D9B',
          attributes: {
            group: 'palette',
            category: 'teal',
          },
        },
        Teal800: {
          value: '#206A83',
          attributes: {
            group: 'palette',
            category: 'teal',
          },
        },
        Teal900: {
          value: '#164555',
          attributes: {
            group: 'palette',
            category: 'teal',
          },
        },
        Teal1000: {
          value: '#1E3137',
          attributes: {
            group: 'palette',
            category: 'teal',
          },
        },
        Orange100: {
          value: '#FFF3EB',
          attributes: {
            group: 'palette',
            category: 'orange',
          },
        },
        Orange200: {
          value: '#FEDEC8',
          attributes: {
            group: 'palette',
            category: 'orange',
          },
        },
        Orange300: {
          value: '#FEC195',
          attributes: {
            group: 'palette',
            category: 'orange',
          },
        },
        Orange400: {
          value: '#FEA362',
          attributes: {
            group: 'palette',
            category: 'orange',
          },
        },
        Orange500: {
          value: '#F38A3F',
          attributes: {
            group: 'palette',
            category: 'orange',
          },
        },
        Orange600: {
          value: '#E56910',
          attributes: {
            group: 'palette',
            category: 'orange',
          },
        },
        Orange700: {
          value: '#C25100',
          attributes: {
            group: 'palette',
            category: 'orange',
          },
        },
        Orange800: {
          value: '#A54800',
          attributes: {
            group: 'palette',
            category: 'orange',
          },
        },
        Orange900: {
          value: '#702E00',
          attributes: {
            group: 'palette',
            category: 'orange',
          },
        },
        Orange1000: {
          value: '#38291E',
          attributes: {
            group: 'palette',
            category: 'orange',
          },
        },
        Magenta1000: {
          value: '#3D2232',
          attributes: {
            group: 'palette',
            category: 'magenta',
          },
        },
        Lime100: {
          value: '#EFFFD6',
          attributes: {
            group: 'palette',
            category: 'lime',
          },
        },
        Lime1000: {
          value: '#28311B',
          attributes: {
            group: 'palette',
            category: 'lime',
          },
        },
      },
    },
  },
);

export default palette;
