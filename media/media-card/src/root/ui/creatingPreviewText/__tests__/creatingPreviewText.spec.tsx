import React from 'react';
import { shallow } from 'enzyme';
import { CreatingPreview } from '../creatingPreviewText';
import { Breakpoint } from '../../common';
import { CreatingPreviewText } from '../styled';

describe('When a preview is being generated', () => {
  it('the creating preview text should be rendered properly', () => {
    const previewText = shallow(
      <CreatingPreview breakpoint={Breakpoint.SMALL} />,
    );
    const wrapper = previewText.find(CreatingPreviewText);
    expect(wrapper).toHaveLength(1);
    expect(wrapper.prop('breakpoint')).toBe(Breakpoint.SMALL);
  });

  it('the breakpoint value should be passed in correctly', () => {
    const previewText = shallow(
      <CreatingPreview breakpoint={Breakpoint.LARGE} />,
    );
    const wrapper = previewText.find(CreatingPreviewText);
    expect(wrapper).toHaveLength(1);
    expect(wrapper.prop('breakpoint')).toBe(Breakpoint.LARGE);
  });
});
