import type core from 'jscodeshift';

import { uniqueWordsFromTokens } from '../../utils/tokens';

import { getClosestDecendantOfType } from './ast';

export function getMetaFromAncestors(
  j: core.JSCodeshift,
  path: any,
  meta: string[] = [],
): string[] {
  const parent = path.parentPath;
  const grandParent = parent && parent.parentPath;

  if (parent && parent.value.type === 'ObjectProperty') {
    let value = '';

    if (
      parent.value.key.type === 'Literal' ||
      parent.value.key.type === 'StringLiteral' ||
      parent.value.key.type === 'NumericLiteral'
    ) {
      value = parent.value.key.value.toString();
    } else {
      value = parent.value.key.name;
    }

    meta.push(value);
  }

  if (parent && grandParent && grandParent.value.type === 'TemplateLiteral') {
    const expressionIndex = grandParent.value.expressions.findIndex(
      (exp: any) => exp.name === path.value.name,
    );
    const quasi = grandParent.value.quasis[expressionIndex];
    const propertyName = (quasi.value.cooked || quasi.value.raw || '')
      .replace(/\n/g, '')
      .split(/;|{|}/)
      .filter((el: string) => !el.match(/\.|\@|\(|\)/))
      .pop()
      .split(/:/g)[0]
      .trim();

    grandParent.value.quasis
      .slice(0, expressionIndex + 1)
      .map((q: any) => q.value.cooked)
      // We reverse so the most nested one is first which we're more likely than not interested in
      .reverse()
      .some((str: string) => {
        const result = /(hover|active|disabled|focus)/.exec(str.toLowerCase());

        if (result) {
          meta.push(result[0]);
          return true;
        }
      });

    meta.push(propertyName);
  }

  if (parent && parent.value.type === 'JSXAttribute') {
    if (
      !['css', 'styles', 'style', 'fill', 'stopColor', 'startColor'].includes(
        parent.value.name.name,
      )
    ) {
      meta.push(parent.value.name.name);
    }
  }

  const closestJSXElement = getClosestDecendantOfType(
    j,
    path,
    j.JSXOpeningElement,
  );

  if (closestJSXElement) {
    const jsxElementName = closestJSXElement.value.name.name;
    const nameComponents = jsxElementName
      .replace(/([a-z])([A-Z])/g, '$1 $2')
      .split(' ');

    meta.push(...nameComponents);
  }

  if (parent && parent.value.type === 'VariableDeclarator') {
    meta.push(parent.value.id.name);
  }

  if (parent) {
    return getMetaFromAncestors(j, parent, meta);
  }

  return meta;
}

export function cleanMeta(meta: string[]) {
  return meta
    .reduce<string[]>(
      (accum, val) => [
        ...accum,
        ...(typeof val === 'string'
          ? val.split(/(?=[A-Z])/g).map((e) => e.toLowerCase())
          : []),
      ],
      [],
    )
    .reduce<string[]>((accum, val) => {
      const cleanVal = val
        .replace(/:/g, '')
        .replace(/,/g, '')
        .replace('grey', 'neutral')
        .replace('skeleton', 'neutral')
        .replace('texts', 'text')
        .replace('red', 'danger')
        .replace('error', 'danger')
        .replace('invalid', 'danger')
        .replace('removed', 'danger')
        .replace('removal', 'danger')
        .replace('remove', 'danger')
        .replace('focus', 'focused')
        .replace('valid', 'success')
        .replace('successful', 'success')
        .replace('risk', 'warning')
        .replace('caution', 'warning')
        .replace('primary', 'bold')
        .replace('secondary', 'subtle')
        .replace('hyperlink', 'link')
        .replace('anchor', 'link')
        .replace('active', 'pressed')
        .replace('hover', 'hovered')
        .replace('card', 'raised')
        .replace('dragged', 'surface overlay')
        .replace('dragging', 'surface overlay')
        .replace('drag', 'surface overlay')
        .replace('background-color', 'background')
        .replace('color', 'text')
        .replace('icons', 'icon')
        .replace('glyph', 'icon')
        .replace('stroke', 'border')
        .replace('border-left', 'border')
        .replace('border-right', 'border')
        .replace('border-top', 'border')
        .replace('border-bottom', 'border')
        .replace('box-shadow', 'shadow');

      accum.push(...cleanVal.split(' '));

      return accum;
    }, [])
    .filter((val) => uniqueWordsFromTokens.includes(val))
    .reduce<string[]>((accum, val) => {
      if (!accum.includes(val)) {
        accum.push(val);
      }

      return accum;
    }, []);
}
