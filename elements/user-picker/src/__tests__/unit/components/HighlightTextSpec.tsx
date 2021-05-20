import { shallow } from 'enzyme';
import React from 'react';
import { HighlightText, Props } from '../../../components/HighlightText';

describe('HighlightText', () => {
  const shallowHighlightText = (props: Partial<Props> = {}) =>
    shallow(<HighlightText children="Some text" {...props} />);

  const testTemplate = (props: Partial<Props> = {}) => (
    expectedHtml: string | null,
  ) => () => {
    const component = shallowHighlightText(props);

    const html = component
      .map((wrapper) => {
        if (wrapper.html() === '') {
          return wrapper.text();
        }
        return wrapper.html();
      })
      .reduce((a, b) => a + b);
    expect(html).toEqual(expectedHtml);
  };

  describe('with no highlight object', () => {
    it('should render plain text', testTemplate()('Some text'));
  });

  describe('with highlight configuration', () => {
    it(
      'should highlight none with an empty highlights array',
      testTemplate({ highlights: [] })('Some text'),
    );

    it(
      'should highlight all the text',
      testTemplate({ highlights: [{ start: 0, end: 9 }] })('<b>Some text</b>'),
    );

    it(
      'should highlight multiple parts',
      testTemplate({
        highlights: [
          { start: 0, end: 1 },
          { start: 3, end: 4 },
        ],
      })('<b>So</b>m<b>e </b>text'),
    );

    it(
      'should not duplicate text with overlapping intervals',
      testTemplate({
        highlights: [
          { start: 0, end: 3 },
          { start: 2, end: 4 },
        ],
      })('<b>Some </b>text'),
    );

    it(
      'should render with out of order highlights',
      testTemplate({
        highlights: [
          { start: 5, end: 7 },
          { start: 0, end: 2 },
        ],
      })('<b>Som</b>e <b>tex</b>t'),
    );

    it(
      'should not break with contained intervals',
      testTemplate({
        highlights: [
          { start: 0, end: 5 },
          { start: 1, end: 4 },
        ],
      })('<b>Some t</b>ext'),
    );

    it(
      'should join contiguous intervals',
      testTemplate({
        highlights: [
          { start: 0, end: 2 },
          { start: 3, end: 5 },
        ],
      })('<b>Some t</b>ext'),
    );

    it(
      'should not break with interval out of bounds',
      testTemplate({
        highlights: [
          { start: -1, end: 2 },
          { start: 5, end: 15 },
        ],
      })('<b>Som</b>e <b>text</b>'),
    );

    it(
      'should highlight all text with two contiguous out bounds intervals',
      testTemplate({
        highlights: [
          { start: -1, end: 3 },
          { start: 4, end: 15 },
        ],
      })('<b>Some text</b>'),
    );

    it(
      'should not add highlight if start is less than end',
      testTemplate({
        highlights: [{ start: 1, end: 0 }],
      })('Some text'),
    );

    it(
      'should not add highlight if start and end are equal',
      testTemplate({
        highlights: [{ start: 1, end: 1 }],
      })('Some text'),
    );
  });
});
