import {
  extractBetweenParentheses,
  isGradient,
  isKnownCssVariable,
  isLessFunction,
  isNamedColor,
  isRawColor,
} from './colors';
import { extractCssVarName } from './declaration';
import { getCssVarMeta, getNamedColorMeta, getRawColorMeta } from './meta';
import findToken from './tokens';

interface Value {
  getReplacement: (additionalMeta?: string[]) => string;
  getMeta: () => string[];
}

export default function parseValue(value: string): Value | null {
  if (isLessFunction(value)) {
    // eslint-disable-next-line no-console
    console.warn(
      'Cannot parse - less function detected, would cause compilation error',
    );
    return null;
  }
  if (isGradient(value)) {
    return {
      getReplacement(additionalMeta = []) {
        const gradientContent = extractBetweenParentheses(value);
        const values = gradientContent.split(',');
        const replacedValues = values.map((val) => {
          const parsedValue = parseValue(val.trim());
          return parsedValue ? parsedValue.getReplacement(additionalMeta) : val;
        });
        return value.replace(gradientContent, replacedValues.join(', '));
      },
      getMeta() {
        const BASE_META: string[] = [];
        const gradientContent = extractBetweenParentheses(value);
        const values = gradientContent.split(',');
        const metas = values.reduce((acc, val) => {
          const parsedValue = parseValue(val.trim());
          return parsedValue ? [...acc, ...parsedValue.getMeta()] : acc;
        }, BASE_META);
        return metas;
      },
    };
  }
  if (isKnownCssVariable(extractCssVarName(value))) {
    return {
      getReplacement(additionalMeta = []) {
        const token = findToken([...additionalMeta, ...this.getMeta()]);
        return `var(${token}, ${value})`;
      },
      getMeta() {
        return getCssVarMeta(value);
      },
    };
  }
  if (isRawColor(value)) {
    return {
      getReplacement(additionalMeta = []) {
        const token = findToken([...additionalMeta, ...this.getMeta()]);
        return `var(${token}, ${value})`;
      },
      getMeta() {
        return getRawColorMeta(value);
      },
    };
  }

  if (isNamedColor(value)) {
    return {
      getReplacement(additionalMeta = []) {
        const token = findToken([...additionalMeta, ...this.getMeta()]);
        return `var(${token}, ${value})`;
      },
      getMeta() {
        return getNamedColorMeta(value);
      },
    };
  }

  return null;
}
