import Ajv from 'ajv';

import type { DeprecatedConfig } from '../index';

const deprecatedSchema = {
  type: 'object',
  patternProperties: {
    '.+': {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          moduleSpecifier: { type: 'string' },
          namedSpecifiers: {
            type: 'array',
            items: { type: 'string' },
          },
          actionableVersion: { type: 'string' },
        },
        required: ['moduleSpecifier'],
        additionalProperites: false,
      },
    },
  },
  allowMatchingProperties: true,
};

export const getValidatedConfig = (
  originalDeprecatedConfig: string,
): DeprecatedConfig => {
  let parsedDeprecatedConfig: DeprecatedConfig = {};
  try {
    parsedDeprecatedConfig = JSON.parse(originalDeprecatedConfig);
  } catch (e) {
    const error = e as Error;
    throw new Error(`Failed to parse JSON string: ${error.message}`);
  }

  const ajv = new Ajv({ allErrors: true });
  const validate = ajv.compile(deprecatedSchema);
  const valid = validate(parsedDeprecatedConfig);

  if (!valid) {
    const { errors } = validate;
    if (errors && errors.length) {
      throw new Error(`Deprecated APIs config is invalid: ${errors}`);
    } else {
      throw new Error(
        'Failed to validate deprecated APIs config with unknown error.',
      );
    }
  }

  return parsedDeprecatedConfig;
};
