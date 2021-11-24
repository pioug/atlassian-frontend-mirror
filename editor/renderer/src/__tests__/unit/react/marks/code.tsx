import React from 'react';
import { mountWithIntl } from '@atlaskit/editor-test-helpers/enzyme-next';
import Code, { CodeWithIntl } from '../../../../react/marks/code';
import InlineComment from '../../../../react/marks/confluence-inline-comment';

describe('Renderer - React/Marks/Code', () => {
  it('should generate content with a <Code>-tag', () => {
    const mark = mountWithIntl(
      <Code
        codeBidiWarningTooltipEnabled={true}
        dataAttributes={{ 'data-renderer-mark': true }}
      >
        This is code
      </Code>,
    );
    expect(mark.find(CodeWithIntl).length).toEqual(1);
    mark.unmount();
  });

  it('should output correct html', () => {
    const mark = mountWithIntl(
      <Code
        codeBidiWarningTooltipEnabled={true}
        dataAttributes={{ 'data-renderer-mark': true }}
      >
        This is code
      </Code>,
    );
    expect(mark.html()).toContain(
      `<code class="code css-1cocjdk-Code" data-renderer-mark="true">This is code</code>`,
    );
    mark.unmount();
  });

  it('should handle arrays correctly', () => {
    const markWithArray = mountWithIntl(
      <Code
        codeBidiWarningTooltipEnabled={true}
        dataAttributes={{ 'data-renderer-mark': true }}
      >
        {['This ', 'is', ' code']}
      </Code>,
    );
    expect(markWithArray.html()).toContain(
      `<code class="code css-1cocjdk-Code" data-renderer-mark="true">This is code</code>`,
    );
    markWithArray.unmount();
  });

  it('should render in combination with other marks', () => {
    const marks = mountWithIntl(
      <Code
        codeBidiWarningTooltipEnabled={true}
        dataAttributes={{ 'data-renderer-mark': true }}
      >
        This{' '}
        <InlineComment
          dataAttributes={{ 'data-renderer-mark': true }}
          reference={undefined as any}
        >
          is code
        </InlineComment>
      </Code>,
    );
    expect(marks.html()).toContain(
      `<code class="code css-1cocjdk-Code" data-renderer-mark="true">This <span data-mark-type="confluenceInlineComment">is code</span></code>`,
    );
    marks.unmount();
  });
});
