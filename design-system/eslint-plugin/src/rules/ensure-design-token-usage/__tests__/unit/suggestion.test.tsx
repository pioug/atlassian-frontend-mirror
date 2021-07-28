import { tester } from '../../../__tests__/utils/_tester';
import rule from '../../index';

tester.run('ensure-design-token-usage', rule, {
  valid: [],
  invalid: [
    {
      code: `css({ backgroundColor: 'red' })`,
      output: `css({ backgroundColor: 'red' })`,
      errors: [
        {
          messageId: 'hardCodedColor',
          suggestions: [
            {
              desc: `Convert to token with fallback`,
              output: `css({ backgroundColor: token('', 'red') })`,
            },
          ],
        },
      ],
    },
    {
      code: `css({ backgroundColor: 'rgb(123,123,123)' })`,
      output: `css({ backgroundColor: 'rgb(123,123,123)' })`,
      errors: [
        {
          messageId: 'hardCodedColor',
          suggestions: [
            {
              desc: `Convert to token with fallback`,
              output: `css({ backgroundColor: token('', 'rgb(123,123,123)') })`,
            },
          ],
        },
      ],
    },
    {
      code: `css({ backgroundColor: '#423234' })`,
      output: `css({ backgroundColor: '#423234' })`,
      errors: [
        {
          messageId: 'hardCodedColor',
          suggestions: [
            {
              desc: `Convert to token with fallback`,
              output: `css({ backgroundColor: token('', '#423234') })`,
            },
          ],
        },
      ],
    },
    {
      code: `css({ backgroundColor: background() })`,
      output: `css({ backgroundColor: background() })`,
      errors: [
        {
          messageId: 'hardCodedColor',
          suggestions: [
            {
              desc: `Convert to token with fallback`,
              output: `css({ backgroundColor: token('', background()) })`,
            },
          ],
        },
      ],
    },
    {
      code: `css({ backgroundColor: DN100 })`,
      output: `css({ backgroundColor: DN100 })`,
      errors: [
        {
          messageId: 'hardCodedColor',
          suggestions: [
            {
              desc: `Convert to token with fallback`,
              output: `css({ backgroundColor: token('', DN100) })`,
            },
          ],
        },
      ],
    },
    {
      code: `css({ boxShadow: '0px 1px 1px #161A1D32' })`,
      output: `css({ boxShadow: '0px 1px 1px #161A1D32' })`,
      errors: [
        {
          messageId: 'hardCodedColor',
          suggestions: [
            {
              desc: `Convert to token with fallback`,
              output: `css({ boxShadow: token('', '0px 1px 1px #161A1D32') })`,
            },
          ],
        },
      ],
    },
  ],
});
