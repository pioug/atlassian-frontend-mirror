import React from 'react';
import { ExpandIconButton, CustomButton } from '../../ui/ExpandIconButton';
import { create } from 'react-test-renderer';
import Tooltip from '@atlaskit/tooltip';

describe('ExpandIconButton', () => {
  it('should render CustomButton by default', () => {
    const wrapper = create(
      <ExpandIconButton allowInteractiveExpand={false} expanded={true} />,
    );
    expect(wrapper.root.findByType(CustomButton)).not.toBeFalsy();
  });

  it('should NOT render Tooltip by default', () => {
    const wrapper = create(
      <ExpandIconButton allowInteractiveExpand={false} expanded={true} />,
    );
    expect(wrapper.root.findAllByType(Tooltip).length).toBeFalsy();
  });

  it('should render Tooltip if allowInteractiveExpand === true ', () => {
    const wrapper = create(
      <ExpandIconButton allowInteractiveExpand={true} expanded={true} />,
    );
    expect(wrapper.root.findByType(Tooltip)).not.toBeFalsy();
  });

  it('should NOT render Tooltip if matchMedia returns false ', () => {
    // force test to return false matchMedia hover state
    // @ts-ignore
    window.matchMedia = (param: string) => {
      if (param === '(any-hover: hover)') {
        return { matches: false };
      } else {
        return { matches: true };
      }
    };

    const wrapper = create(
      <ExpandIconButton allowInteractiveExpand={true} expanded={true} />,
    );
    expect(wrapper.root.findAllByType(Tooltip).length).toBeFalsy();
  });
});
