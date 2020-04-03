import React from 'react';
import { mount, ReactWrapper } from 'enzyme';
import { Description, DismissButton, Title } from '../../Flag/styledFlag';
import { FlagWithoutAnalytics as Flag } from '../../Flag';
import ExpanderInternal from '../../Expander/styledExpander';
import { FlagProps } from '../../../types';

describe('Flag Expander', () => {
  const generateFlag = (extraProps: Partial<FlagProps>) => (
    <Flag id="" icon={<div />} title="Flag" {...extraProps} />
  );
  let flag: ReactWrapper;
  beforeEach(() => {
    flag = mount(
      generateFlag({
        appearance: 'info',
        isDismissAllowed: true,
        description: 'Hi!',
      }),
    );
  });
  it('should only render children when isExpanded true (and while doing expand/contract animation)', () => {
    // Check that default collapsed state doesn't render children
    expect(flag.find(Description).length).toBe(0);

    // Trigger expand
    flag.find(DismissButton).simulate('click');
    expect(flag.find(Description).length).toBe(1);

    // Trigger collapse
    flag.find(DismissButton).simulate('click');
    expect(flag.find(Description).length).toBe(1);

    // ..once collapse animation finishes, children not rendered
    flag.find(ExpanderInternal).simulate('transitionEnd');
    expect(flag.find(Description).length).toBe(0);
  });
  it('should set aria-hidden true on content when isExpanded is false', () => {
    expect(flag.state('isExpanded')).toBe(false);
    expect(flag.find(ExpanderInternal).prop('aria-hidden')).toBe(true);
  });

  it('should set aria-hidden false on content when isExpanded is true', () => {
    flag.setState({ isExpanded: true });
    expect(flag.find(ExpanderInternal).prop('aria-hidden')).toBe(false);
  });

  it('should pass appearance value on to styled sub-components', () => {
    flag.setState({ isExpanded: true });
    flag.setProps({
      actions: [{ content: 'Hello!', onClick: () => {} }],
      description: 'Hi there',
    });

    expect(flag.find(Title).prop('appearance')).toBe('info');
    expect(flag.find(DismissButton).prop('appearance')).toBe('info');
    expect(flag.find(Description).prop('appearance')).toBe('info');
  });
});
