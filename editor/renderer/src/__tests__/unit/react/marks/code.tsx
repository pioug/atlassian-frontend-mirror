import React from 'react';
import { mount } from 'enzyme';
import Code from '../../../../react/marks/code';
import InlineComment from '../../../../react/marks/confluence-inline-comment';

describe('Renderer - React/Marks/Code', () => {
  it('should generate content with a <Code>-tag', () => {
    const mark = mount(<Code>This is code</Code>);
    expect(mark.find(Code).length).toEqual(1);
    mark.unmount();
  });

  it('should output correct html', () => {
    const mark = mount(<Code>This is code</Code>);
    expect(mark.html()).toContain('<span class="code">This is code</span>');
    mark.unmount();
  });

  it('should handle arrays correctly', () => {
    const markWithArray = mount(<Code>{['This ', 'is', ' code']}</Code>);
    expect(markWithArray.html()).toContain(
      '<span class="code">This is code</span>',
    );
    markWithArray.unmount();
  });

  it('should render in combination with other marks', () => {
    const marks = mount(
      <Code>
        This <InlineComment reference={undefined as any}>is code</InlineComment>
      </Code>,
    );
    expect(marks.html()).toContain(
      '<span class="code">This <span data-mark-type="confluenceInlineComment">is code</span></span>',
    );
    marks.unmount();
  });
});
