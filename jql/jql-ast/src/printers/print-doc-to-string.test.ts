import { printDocToString } from './print-doc-to-string';
import { group, ifBreak, newLine } from './utils';

describe('printDocToString', () => {
  it('prints overflowing text on a single line', () => {
    const overflowingText = 'x'.repeat(101);
    expect(printDocToString(overflowingText)).toEqual(overflowingText);
  });

  it('prints group on a single line if text does not overflow', () => {
    const argument = 'x';
    const doc = group([
      'func',
      '(',
      ifBreak(newLine(), ''),
      argument,
      ',',
      ifBreak(newLine(), ' '),
      argument,
      ifBreak(newLine(), ''),
      ')',
    ]);
    const expected = `func(${argument}, ${argument})`;
    expect(printDocToString(doc)).toEqual(expected);
  });

  it('prints group on multiple lines if text overflows default print width', () => {
    const argument = 'x'.repeat(101);
    const doc = group([
      'func',
      '(',
      ifBreak(newLine(), ''),
      argument,
      ',',
      ifBreak(newLine(), ' '),
      argument,
      ifBreak(newLine(), ''),
      ')',
    ]);
    const expected = `func(\n${argument},\n${argument}\n)`;
    expect(printDocToString(doc)).toEqual(expected);
  });

  it('prints group on multiple lines if text overflows provided print width', () => {
    const argument = 'x'.repeat(20);
    const doc = group([
      'func',
      '(',
      ifBreak(newLine(), ''),
      argument,
      ',',
      ifBreak(newLine(), ' '),
      argument,
      ifBreak(newLine(), ''),
      ')',
    ]);
    const expected = `func(\n${argument},\n${argument}\n)`;
    expect(printDocToString(doc, { printWidth: 30 })).toEqual(expected);
  });

  it('prints group on single lines if printWidth is set to null', () => {
    const argument = 'x'.repeat(101);
    const doc = group([
      'func',
      '(',
      ifBreak(newLine(), ''),
      argument,
      ',',
      ifBreak(newLine(), ' '),
      argument,
      ifBreak(newLine(), ''),
      ')',
    ]);
    const expected = `func(${argument}, ${argument})`;
    expect(printDocToString(doc, { printWidth: null })).toEqual(expected);
  });

  it('wraps outer group before inner group', () => {
    const doc = group([
      group([
        '(status = closed',
        ifBreak(newLine(), ' '),
        `and assignee = currentUser())`,
      ]),
      ifBreak(newLine(), ' '),
      'or ',
      group(['(status = open and assignee is EMPTY)']),
      ifBreak(newLine(), ' '),
      'order by ',
      group(['created desc', ',', ifBreak(newLine(), ' '), 'key asc']),
    ]);
    const expected =
      '(status = closed and assignee = currentUser())\nor (status = open and assignee is EMPTY)\norder by created desc, key asc';
    expect(printDocToString(doc)).toEqual(expected);
  });

  it('wraps outer and inner group if both groups overflow', () => {
    const overflowingText = 'x'.repeat(101);
    const doc = group([
      group([
        '(status = closed',
        ifBreak(newLine(), ' '),
        `and assignee = ${overflowingText})`,
      ]),
      ifBreak(newLine(), ' '),
      'or ',
      group(['(status = open and assignee is EMPTY)']),
      ifBreak(newLine(), ' '),
      'order by ',
      group(['created desc', ',', ifBreak(newLine(), ' '), 'key asc']),
    ]);
    const expected = `(status = closed\nand assignee = ${overflowingText})\nor (status = open and assignee is EMPTY)\norder by created desc, key asc`;
    expect(printDocToString(doc)).toEqual(expected);
  });
});
