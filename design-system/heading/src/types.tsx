// Allows support for heading levels 1-9 via aria-level
export type HeadingLevel = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;
export type HeadingElement = `h${1 | 2 | 3 | 4 | 5 | 6}` | 'div';
