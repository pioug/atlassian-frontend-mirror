import hyphenate from 'fbjs/lib/hyphenateStyleName';

/**
 * The below code is inspired by the css function in styled components
 * https://github.com/styled-components/styled-components/blob/master/src/constructors/css.js
 */
export default function evaluateInner(styles, ...interpolations) {
  return flatten(interleave(styles, interpolations)).join('');
}

function interleave(strings, interpolations) {
  const result = [strings[0]];
  for (let i = 0, len = interpolations.length; i < len; i += 1) {
    result.push(interpolations[i], strings[i + 1]);
  }

  return result;
}

function flatten(
  chunks,
  executionContext = { theme: { __ATLASKIT_THEME__: { mode: 'light' } } },
) {
  return chunks.reduce((ruleSet, chunk) => {
    /* Remove falsey values */
    if (
      chunk === undefined ||
      chunk === null ||
      chunk === false ||
      chunk === ''
    ) {
      return ruleSet;
    }

    /* Flatten ruleSet */
    if (Array.isArray(chunk)) {
      ruleSet.push(...flatten(chunk, executionContext));
      return ruleSet;
    }

    /* Either execute or defer the function */
    if (typeof chunk === 'function') {
      if (executionContext) {
        const nextChunk = chunk(executionContext);
        ruleSet.push(...flatten([nextChunk], executionContext));
      } else ruleSet.push(chunk);

      return ruleSet;
    }
    ruleSet.push(isPlainObject(chunk) ? objToCss(chunk) : chunk.toString());

    return ruleSet;
  }, []);
}

function isPlainObject(x) {
  return typeof x === 'object' && x.constructor === Object;
}

function objToCss(obj, prevKey) {
  const css = Object.keys(obj)
    .filter((key) => {
      const chunk = obj[key];
      return (
        chunk !== undefined && chunk !== null && chunk !== false && chunk !== ''
      );
    })
    .map((key) => {
      if (isPlainObject(obj[key])) return objToCss(obj[key], key);
      return `${hyphenate(key)}: ${obj[key]};`;
    })
    .join(' ');
  return prevKey
    ? `${prevKey} {
    ${css}
  }`
    : css;
}
