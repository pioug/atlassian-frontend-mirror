import { tester } from '../../../__tests__/utils/_tester';
import rule from '../../index';

tester.run('ensure-design-token-usage', rule, {
  valid: [],
  invalid: [
    // Using config -> shouldEnforceFallbacks: false
    {
      code: `css({ backgroundColor: 'red' })`,
      output: `css({ backgroundColor: 'red' })`,
      errors: [
        {
          messageId: 'hardCodedColor',
          suggestions: [
            {
              desc: `Convert to token`,
              output: `css({ backgroundColor: token('') })`,
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
              desc: `Convert to token`,
              output: `css({ backgroundColor: token('') })`,
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
              desc: `Convert to token`,
              output: `css({ backgroundColor: token('') })`,
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
              desc: `Convert to token`,
              output: `css({ backgroundColor: token('') })`,
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
              desc: `Convert to token`,
              output: `css({ backgroundColor: token('') })`,
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
              desc: `Convert to token`,
              output: `css({ boxShadow: token('') })`,
            },
          ],
        },
      ],
    },
    {
      code: `css({ boxShadow: token('color.text.danger', '#000') })`,
      output: `css({ boxShadow: token('color.text.danger') })`,
      errors: [
        {
          messageId: 'tokenFallbackRestricted',
        },
      ],
    },
    // Using config -> shouldEnforceFallbacks: true
    {
      options: [{ shouldEnforceFallbacks: true }],
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
      options: [{ shouldEnforceFallbacks: true }],
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
      options: [{ shouldEnforceFallbacks: true }],
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
      options: [{ shouldEnforceFallbacks: true }],
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
      options: [{ shouldEnforceFallbacks: true }],
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
      options: [{ shouldEnforceFallbacks: true }],
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
    {
      options: [{ shouldEnforceFallbacks: true }],
      code: `<Star primaryColor="rgb(255, 171, 0)" />`,
      output: `<Star primaryColor="rgb(255, 171, 0)" />`,
      errors: [
        {
          messageId: 'hardCodedColor',
          suggestions: [
            {
              desc: `Convert to token with fallback`,
              output: `<Star primaryColor={token('', rgb(255, 171, 0))} />`,
            },
          ],
        },
      ],
    },
    {
      options: [{ shouldEnforceFallbacks: true }],
      code: `<Star primaryColor={Y500} />`,
      output: `<Star primaryColor={Y500} />`,
      errors: [
        {
          messageId: 'hardCodedColor',
          suggestions: [
            {
              desc: `Convert to token with fallback`,
              output: `<Star primaryColor={token('', Y500)} />`,
            },
          ],
        },
      ],
    },
    {
      options: [{ shouldEnforceFallbacks: true }],
      code: `<Star primaryColor={color.Y500} />`,
      output: `<Star primaryColor={color.Y500} />`,
      errors: [
        {
          messageId: 'hardCodedColor',
          suggestions: [
            {
              desc: `Convert to token with fallback`,
              output: `<Star primaryColor={token('', color.Y500)} />`,
            },
          ],
        },
      ],
    },
  ],
});
