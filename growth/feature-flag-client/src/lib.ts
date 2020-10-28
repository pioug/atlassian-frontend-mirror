import { FlagShape, Flags, CustomAttributes, Reason, ErrorKind } from './types';

export const isType = (value: any, type: string): boolean => {
  return value !== null && typeof value === type;
};

export const isObject = (value: any) => isType(value, 'object');
export const isBoolean = (value: any) => isType(value, 'boolean');
export const isString = (value: any) => isType(value, 'string');

export const isFlagWithEvaluationDetails = (flag: FlagShape): boolean => {
  return isObject(flag) && 'value' in flag && 'explanation' in flag;
};

export const isSimpleFlag = (flag: FlagShape): boolean => {
  return isObject(flag) && 'value' in flag && !('explanation' in flag);
};

export const isOneOf = (value: string, list: string[]): boolean =>
  list.indexOf(value) > -1;

export const enforceAttributes = (
  obj: any,
  attributes: string[],
  identifier?: string,
) => {
  const title = identifier ? `${identifier}: ` : '';
  attributes.forEach((attribute: string) => {
    if (!obj.hasOwnProperty(attribute) && obj[attribute] !== null) {
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

  if (reservedAttributes.some(attribute => keys.includes(attribute))) {
    throw new TypeError(
      `exposureData contains a reserved attribute. Reserved attributes are: ${reservedAttributes.join(
        ', ',
      )}`,
    );
  }
};

const validateFlag: any = (flagKey: string, flag: FlagShape) => {
  if (isSimpleFlag(flag) || isFlagWithEvaluationDetails(flag)) {
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
  Object.keys(flags).forEach(key => validateFlag(key, flags[key]));
};

const setReasonAndKindErrors = (flag: FlagShape): FlagShape['explanation'] => {
  let explanation = {
    kind: 'ERROR' as Reason,
    errorKind: 'WRONG_TYPE' as ErrorKind,
  };
  if (flag.explanation) {
    explanation = {
      ...flag.explanation,
      ...explanation,
    };
  }
  return explanation;
};

export const validateFlagExplanation = (
  flag: FlagShape,
  defaultValue: boolean | string | object,
): FlagShape['explanation'] => {
  if (typeof flag.value !== typeof defaultValue) {
    return setReasonAndKindErrors(flag);
  }
  return flag.explanation;
};
