import { FlagShape, CustomAttributes, Flags } from './types';

export const isObject = (value: any) => typeof value === 'object';

export const enforceAttributes = (
  obj: any,
  attributes: string[],
  identifier?: string,
) => {
  attributes.forEach((attribute: string) => {
    if (!(attribute in obj)) {
      const title = identifier ? `${identifier}: ` : '';
      throw new Error(`${title}Missing ${attribute}`);
    }
  });
};

export const checkForReservedAttributes = (
  customAttributes: CustomAttributes,
) => {
  const reservedAttributes = [
    'flagKey',
    'ruleId',
    'reason',
    'value',
    'errorKind',
  ];
  const keys = Object.keys(customAttributes);

  if (reservedAttributes.some((attribute) => keys.includes(attribute))) {
    throw new TypeError(
      `exposureData contains a reserved attribute. Reserved attributes are: ${reservedAttributes.join(
        ', ',
      )}`,
    );
  }
};

const validateFlag: any = (flagKey: string, flag: FlagShape) => {
  if (isObject(flag) && 'value' in flag) {
    return true;
  }

  // @ts-ignore
  if (process.env.NODE_ENV !== 'production') {
    throw new Error(
      `${flagKey} is not a valid flag. Missing "value" attribute.`,
    );
  }
};

export const validateFlags = (flags: Flags) => {
  Object.keys(flags).forEach((key) => validateFlag(key, flags[key]));
};
