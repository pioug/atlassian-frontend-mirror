import React from 'react';
import { render, RenderResult } from '@testing-library/react';
import TextColor from '../../../../react/marks/textColor';

describe('Renderer - React/Marks/TextColor', () => {
  let wrapper: RenderResult;
  beforeEach(() => {
    wrapper = render(
      <TextColor
        dataAttributes={{ 'data-renderer-mark': true }}
        color="#ff0000"
      >
        This is a red text
      </TextColor>,
    );
  });

  it('should wrap content with <span>-tag', async () => {
    const mark = await wrapper.getByText('This is a red text');
    expect(mark.tagName).toEqual('SPAN');
  });

  it('should output correct html', async () => {
    const mark = await wrapper.getByText('This is a red text');

    expect(mark.outerHTML).toEqual(
      `<span data-renderer-mark=\"true\" data-text-custom-color=\"#ff0000\" class=\"fabric-text-color-mark\" style=\"--custom-text-color: #ff0000;\">This is a red text</span>`,
    );
  });
});
