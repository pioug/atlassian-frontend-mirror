import { css, CSSObject, SerializedStyles } from '@emotion/core';

function flatten<T>(lists: T[][]): T[] {
  return Array.prototype.concat.apply([], lists);
}

function getCssRules(cssText: string): string[] {
  return (
    cssText
      .split(';')
      // removing any empty string values that might occur from the split
      .filter((value) => Boolean(value))
      // normalising different sources whitespace
      .map((value) => value.trim().replace(': ', ':'))
  );
}

// Not using the standard approach because that relies on the react-test-renderer
// By using standard browser behaviour through public API we are being less brital
// https://emotion.sh/docs/jest-emotion
export function hasStyleRule(selector: string, expected: CSSObject): boolean {
  const allRules: CSSStyleRule[] = flatten(
    Array.from(document.styleSheets).map((sheet: StyleSheet): CSSStyleRule[] =>
      // @ts-ignore
      [...(sheet as StyleSheet & CSSGroupingRule).cssRules],
    ),
  );
  const matchSelector: CSSStyleRule[] = allRules.filter((rule) =>
    rule.selectorText.trim().split(',').includes(selector),
  );

  if (!matchSelector.length) {
    // eslint-disable-next-line no-console
    console.warn('Could not find any style rules matching selector:', selector);
    return false;
  }

  const serialized: SerializedStyles = css(expected);
  const targets: string[] = getCssRules(serialized.styles);

  return targets.every((target: string) => {
    return matchSelector.some((rule: CSSStyleRule): boolean => {
      const all: string[] = getCssRules(rule.style.cssText);
      return all.includes(target);
    });
  });
}
