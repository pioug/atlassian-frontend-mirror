import React from 'react';
import { shallow } from 'enzyme';
import { PreviewUnavailable } from '../previewUnavailable';
import { Breakpoint } from '../../common';
import { PreviewUnavailableText } from '../styled';

describe('When the preview is unavailable for a card', () => {
  it('the preview unavailable text should be rendered properly', () => {
    const previewUnavailable = shallow(
      <PreviewUnavailable breakpoint={Breakpoint.SMALL} />,
    );
    const wrapper = previewUnavailable.find(PreviewUnavailableText);
    expect(wrapper).toHaveLength(1);
    expect(wrapper.prop('breakpoint')).toBe(Breakpoint.SMALL);
  });

  it('the breakpoint value should be passed in correctly', () => {
    const previewUnavailable = shallow(
      <PreviewUnavailable breakpoint={Breakpoint.LARGE} />,
    );
    const wrapper = previewUnavailable.find(PreviewUnavailableText);
    expect(wrapper).toHaveLength(1);
    expect(wrapper.prop('breakpoint')).toBe(Breakpoint.LARGE);
  });
});
