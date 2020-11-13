const DUMMY_TEXT = `Lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore et dolore magna aliqua Ut enim ad minim veniam quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur Excepteur sint occaecat cupidatat non proident sunt in culpa qui officia deserunt mollit anim id est laborum`;

const BYPASS_ATTR_LIST: { [key: string]: Array<string> } = {
  bodiedExtension: ['extensionKey', 'extensionType', 'layout'],
  codeBlock: ['language'],
  decisionItem: ['state'],
  embedCard: ['layout', 'originalHeight', 'originalWidth', 'width'],
  extension: ['extensionKey', 'extensionType', 'layout'],
  heading: ['level'],
  inlineExtension: ['extensionKey', 'extensionType', 'layout'],
  layoutColumn: ['width'],
  media: ['__fileMimeType', '__fileSize', 'height', 'width'],
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

const scrubNum = (val: number) => {
  const len = `${val}`.length;
  return Math.floor(padNum(1, len) + Math.random() * padNum(9, len));
};

const padNum = (num: number, len: number) =>
  parseInt(`${num}`.padEnd(len, '0'));

export const scrubStr = (val: string, offset = 0) => {
  const base = DUMMY_TEXT.repeat(
    Math.ceil((offset + val.length) / DUMMY_TEXT.length),
  );

  return val
    .split('')
    .map(char => {
      if (/\w/.test(char)) {
        const correction = base[offset] === ' ' ? 1 : 0;
        const raw = base[offset + correction];
        const isLower = char.toLowerCase() === char;
        const result = isLower ? raw.toLowerCase() : raw.toUpperCase();
        offset += 1 + correction;
        return result;
      } else {
        return char;
      }
    })
    .join('');
};

export const scrubLink = (marks: Array<{ [key: string]: any }>) => {
  return marks.map(mark => {
    if (mark.type === 'link' && mark.attrs.href) {
      mark.attrs.href = 'https://www.google.com';
    }
    return mark;
  });
};

export const scrubAttrs = (nodeType: string, attrs: unknown) => {
  if (typeof attrs === 'number') {
    return scrubNum(attrs);
  }
  if (typeof attrs === 'string') {
    return scrubStr(attrs);
  }
  if (typeof attrs === 'boolean') {
    return attrs;
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
    const entries: Array<[string, any]> = Object.entries(
      attrsObj,
    ).map(([key, value]) =>
      BYPASS_ATTR_LIST[nodeType] && BYPASS_ATTR_LIST[nodeType].includes(key)
        ? [key, value]
        : [key, scrubAttrs(nodeType, value)],
    );

    return fromEntries(entries);
  }

  throw new TypeError(
    `scrubAttrs: encountered unsupported attributes type "${typeof attrsObj}"
    ${attrsObj.constructor} of value ${JSON.stringify(attrsObj)}`,
  );
};
