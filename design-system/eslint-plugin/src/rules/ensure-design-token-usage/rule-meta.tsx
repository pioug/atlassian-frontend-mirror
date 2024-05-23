import type { LintRuleMeta } from '@atlaskit/eslint-utils/create-rule';

import { type Domains } from './types';

const domainsToLint: Domains = ['color', 'spacing', 'shape'];

const ruleMeta: LintRuleMeta = {
  name: 'ensure-design-token-usage',
  hasSuggestions: true,
  schema: {
    type: 'array',
    items: {
      type: 'object',
      properties: {
        applyImport: {
          type: 'boolean',
        },
        shouldEnforceFallbacks: {
          type: 'boolean',
        },
        domains: {
          type: 'array',
          items: {
            enum: domainsToLint,
          },
        },
        exceptions: {
          type: 'array',
        },
      },
    },
  },
  type: 'problem',
  fixable: 'code',
  docs: {
    description:
      'Enforces usage of design tokens rather than hard-coded values.',
    recommended: true,
    severity: 'error',
  },
  messages: {
    noRawRadiusValues:
      'The use of shape tokens is preferred over the direct application of border properties.\n\n@meta <<{{payload}}>>',
    noRawSpacingValues:
      'The use of spacing primitives or tokens is preferred over the direct application of spacing properties.\n\n@meta <<{{payload}}>>',
    autofixesPossible:
      'Automated corrections available for spacing values. Apply autofix to replace values with appropriate tokens',
    noCalcUsage:
      'The use of space tokens is preferred over using the CSS calc function. If using a value that is not aligned to the spacing scale, consider aligning to the scale and using tokens instead.',
    hardCodedColor: `Colors can be sourced from the global theme using the token function.`,
    legacyElevation: `Elevations can be sourced from the global theme using the token function made of both a background and shadow. Use "card" for card elevations, and "overlay" for anything else that should appear elevated.`,
  },
};

export default ruleMeta;
