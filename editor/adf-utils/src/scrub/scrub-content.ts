import { ValueReplacements } from './default-value-replacements';

const DUMMY_TEXT = `Lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore et dolore magna aliqua Ut enim ad minim veniam quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur Excepteur sint occaecat cupidatat non proident sunt in culpa qui officia deserunt mollit anim id est laborum`;
const DUMMY_DIGITS = ['2', '7', '4', '3', '5', '9', '1', '8', '0', '5'];

const BYPASS_ATTR_LIST: { [key: string]: Array<string> } = {
  bodiedExtension: ['extensionKey', 'extensionType', 'layout'],
  codeBlock: ['language'],
  decisionItem: ['state'],
  embedCard: ['layout', 'originalHeight', 'originalWidth', 'width'],
  extension: ['extensionKey', 'extensionType', 'layout', 'type'],
  heading: ['level'],
  inlineExtension: ['extensionKey', 'extensionType', 'layout'],
  layoutColumn: ['width'],
  media: ['__fileMimeType', '__fileSize', 'height', 'width', 'type'],
  mediaSingle: ['layout', 'width'],
  orderedList: ['order'],
  panel: ['panelType'],
  status: ['color', 'style'],
  table: ['isNumberColumnEnabled', 'layout'],
  tableCell: ['background', 'colspan', 'colwidth', 'defaultMarks', 'rowspan'],
  tableHeader: ['background', 'colspan', 'colwidth', 'defaultMarks', 'rowspan'],
  tableRow: ['defaultMarks'],
  taskItem: ['state'],
};

type Entry<T> = [string, T];
const fromEntries = <T>(iterable: Entry<T>[]): { [key: string]: any } => {
  return [...iterable].reduce<{ [key: string]: T }>((obj, [key, val]) => {
    obj[key] = val;
    return obj;
  }, {});
};

const scrubNum = (val: number, start = 0) => {
  return parseInt(
    val
      .toString()
      .split('')
      .map((_, index) => {
        const base = start + index;
        const len = DUMMY_DIGITS.length - 1;
        return DUMMY_DIGITS[base % len];
      })
      .join(''),
    10,
  );
};

export const scrubStr = (val: string, offset = 0) => {
  const base = DUMMY_TEXT.repeat(
    Math.ceil((offset + val.length) / DUMMY_TEXT.length),
  );

  // using [...val] splits emoji character pairs correctly, compared to
  // something like "".split('')
  return [...val]
    .map((char, index, chars) => {
      if (/^\p{Nd}$/u.test(char)) {
        // Decimal digits
        return scrubNum(parseInt(char, 10), index).toString();
      } else if (/^\p{So}$/u.test(char)) {
        // Emoji
        return chars[index - 1]?.codePointAt(0) === 8205 ? '' : '⭐️';
      } else if (/^\p{Sc}$/u.test(char)) {
        // Currency
        return '$';
      } else if (/^[\p{P}\p{Z}\p{C}]$/u.test(char)) {
        // Punctuation, Seperators, Control
        return char;
      } else if (
        char.codePointAt(0) === 65039 &&
        /^\p{So}$/u.test(chars[index - 1])
      ) {
        // Ingore compound emoji control char
        return '';
      } else {
        // Everything else
        const correction = base[offset] === ' ' ? 1 : 0;
        const raw = base[offset + correction];
        const isLower = char.toLowerCase() === char;
        const result = isLower ? raw.toLowerCase() : raw.toUpperCase();
        offset += 1 + correction;
        return result;
      }
    })
    .join('');
};

export type ScrubLinkOptions = {
  valueReplacements: ValueReplacements;
};

export const scrubLink = (
  marks: Array<{ [key: string]: any }>,
  { valueReplacements }: ScrubLinkOptions,
) => {
  return marks.map((mark) => {
    if (mark.type === 'link' && mark.attrs.href) {
      return {
        ...mark,
        attrs: { ...mark.attrs, href: valueReplacements.href(mark.attrs.href) },
      };
    }
    return mark;
  });
};

const scrubObj = (nodeType: string, attrsObj: Object) => {
  const entries: Array<[string, any]> = Object.entries(
    attrsObj,
  ).map(([key, value]) =>
    BYPASS_ATTR_LIST[nodeType]?.includes(key)
      ? [key, value]
      : [key, scrubAttrs(nodeType, value)],
  );

  return fromEntries(entries);
};

export const scrubAttrs = (
  nodeType: string,
  attrs: unknown,
  offset = 0,
): any => {
  if (typeof attrs === 'number') {
    return scrubNum(attrs, offset);
  }
  if (typeof attrs === 'string') {
    return scrubStr(attrs, offset);
  }
  if (typeof attrs === 'boolean') {
    return attrs;
  }
  if (!attrs) {
    return attrs;
  }

  const attrsObj = attrs as Object;
  if (
    attrsObj &&
    attrsObj.constructor === Object &&
    Object.keys(attrsObj).length === 0
  ) {
    return {};
  }

  if (typeof attrsObj === 'object' && !Array.isArray(attrsObj)) {
    return scrubObj(nodeType, attrsObj);
  }

  if (Array.isArray(attrsObj)) {
    return attrsObj.map((el) => {
      return typeof el === 'object'
        ? scrubObj(nodeType, el)
        : scrubAttrs(nodeType, el);
    });
  }

  throw new TypeError(
    `scrubAttrs: encountered unsupported attributes type "${typeof attrsObj}"
    of value ${JSON.stringify(attrsObj)}`,
  );
};
