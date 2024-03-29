import { segmentText } from '../../../react/utils/segment-text';
import type { TextHighlighter } from '../../../react/types';

test('segment text no text', () => {
  const highlighter: TextHighlighter = {
    pattern: /(\b[A-Z]{2,}\b)/g,
    component: () => null,
  };
  const text = '';
  const segments = segmentText(text, highlighter);
  expect(segments.length).toBe(1);
  expect(segments[0].type).toBe('plain');
});

test('segment text no highlighter', () => {
  const text = '';
  const segments = segmentText(text, undefined);
  expect(segments.length).toBe(1);
  expect(segments[0].type).toBe('plain');
});

test('segment text simple regex', () => {
  const highlighter: TextHighlighter = {
    pattern: /(\b[A-Z]{2,}\b)/g,
    component: () => null,
  };
  const text =
    'Some text with an acronym ADF in the middle of the text, followed by another acronym ADF';
  const segments = segmentText(text, highlighter);
  expect(segments.length).toBe(4);
  expect(segments[0].type).toBe('plain');
  expect(segments[1].type).toBe('match');
  expect(segments[3].type).toBe('match');
});

test('segment text simple regex full string match', () => {
  const highlighter: TextHighlighter = {
    pattern: /(\b[A-Z]{2,}\b)/g,
    component: () => null,
  };
  const text = 'ADF';
  const segments = segmentText(text, highlighter);
  expect(segments.length).toBe(1);
  expect(segments[0].type).toBe('match');
});

test('segment text simple regex no match', () => {
  const highlighter: TextHighlighter = {
    pattern: /(\b[A-Z]{2,}\b)/g,
    component: () => null,
  };
  const text =
    'Some text with no acronym in the middle of the text, followed by another acronym which is missing';
  const segments = segmentText(text, highlighter);
  expect(segments.length).toBe(1);
  expect(segments[0].type).toBe('plain');
});

test('segment text simple regex no match single char string', () => {
  const highlighter: TextHighlighter = {
    pattern: /(\b[A-Z]{2,}\b)/g,
    component: () => null,
  };
  const text = ' ';
  const segments = segmentText(text, highlighter);
  expect(segments.length).toBe(1);
  expect(segments[0].type).toBe('plain');
});

test('segment text simple regex with named groups', () => {
  const highlighter: TextHighlighter = {
    pattern: /(?<acronym>\b[A-Z]{2,}\b)/g,
    component: () => null,
  };
  const text =
    'Some text with an acronym ADF in the middle of the text, followed by another acronym ADF';
  const segments = segmentText(text, highlighter);
  expect(segments.length).toBe(4);
  expect((segments[1] as any).groups).toContain('acronym');
});

test('segment text simple regex with multiple matches one after another', () => {
  const highlighter: TextHighlighter = {
    pattern: /(?<acronym>\b[A-Z]{2,}\b)/g,
    component: () => null,
  };
  const text = 'Some text with an acronym ADF ADF ADF ADF ADF';
  const segments = segmentText(text, highlighter);
  expect(segments.length).toBe(10);
});

test('segment text with multiple non-overlaping named groups', () => {
  const highlighter: TextHighlighter = {
    pattern: /((?<acronym>\b[A-Z]{4,}\b)|(?<adf>\bADF\b))/g,
    component: () => null,
  };
  const text = 'Some text with an acronym HELP ADF text ADF';
  const segments = segmentText(text, highlighter);

  expect(segments.length).toBe(6);
  expect((segments[1] as any).groups).toContain('acronym');
  expect((segments[1] as any).groups).not.toContain('adf');

  expect((segments[5] as any).groups).toContain('adf');
  expect((segments[5] as any).groups).not.toContain('acronym');
});

test('segment text with multiple overlaping named groups', () => {
  const highlighter: TextHighlighter = {
    pattern: /((?<acronym>\b[A-Z]{2,}\b)|(?<adf>\bADF\b))/g,
    component: () => null,
  };
  const text = 'Some text with an acronym HELP ADF text ADF';
  const segments = segmentText(text, highlighter);

  expect(segments.length).toBe(6);
  expect((segments[1] as any).groups).toContain('acronym');
  expect((segments[1] as any).groups).not.toContain('adf');

  expect((segments[5] as any).groups).toContain('acronym');
  expect((segments[5] as any).groups).not.toContain('adf');
});
