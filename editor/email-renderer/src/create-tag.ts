import { escapeHtmlString } from './escape-html-string';

export const createTag = (
  tagName: string,
  attrs?: { [key: string]: string | number | undefined },
  content?: string | null,
) => {
  const attrsList: string[] = [];

  Object.keys(attrs || {}).forEach(key => {
    const value = attrs![key];

    if (value === undefined) {
      return;
    }

    const attrValue = escapeHtmlString(String(value)).replace(/"/g, "'");

    attrsList.push(`${key}="${attrValue}"`);
  });

  const attrsSerialized = attrsList.length ? ` ${attrsList.join(' ')}` : '';

  return content
    ? `<${tagName}${attrsSerialized}>${content}</${tagName}>`
    : `<${tagName}${attrsSerialized}/>`;
};
