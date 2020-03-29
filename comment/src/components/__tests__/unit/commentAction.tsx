import React, { Component } from 'react';
import { shallow, mount } from 'enzyme';
import Button from '@atlaskit/button';

import CommentActionWithAnalytics, {
  Props,
  CommentActionWithoutAnalytics as CommentAction,
} from '../../ActionItem';

describe('@atlaskit comments', () => {
  describe('CommentAction', () => {
    describe('exports', () => {
      it('the CommentAction component', () => {
        expect(CommentAction).not.toBe(undefined);
        expect(new CommentAction({})).toBeInstanceOf(Component);
      });
    });

    describe('construction', () => {
      it('should be able to create a component', () => {
        const wrapper = shallow(<CommentAction />);
        expect(wrapper).not.toBe(undefined);
        expect(wrapper.instance()).toBeInstanceOf(Component);
      });

      it('should render a Button containing the children', () => {
        const children = <span>children</span>;
        const wrapper = shallow(<CommentAction>{children}</CommentAction>);
        expect(wrapper.find(Button).length).toBeGreaterThan(0);
        expect(wrapper.find(Button).contains(children)).toBe(true);
      });

      it('should reflect onClick, onFocus, and onMouseOver to a wrapping element', () => {
        const props: Props = {
          onClick: () => {},
          onFocus: () => {},
          onMouseOver: () => {},
        };
        const wrapper = shallow(<CommentAction {...props} />);
        const Keys = Object.keys(props) as (keyof Props)[];
        Keys.forEach(propName => {
          expect(wrapper.prop(propName)).toBe(props[propName]);
        });
      });
    });
  });
});

describe('CommentActionWithAnalytics', () => {
  beforeEach(() => {
    jest.spyOn(global.console, 'warn');
    jest.spyOn(global.console, 'error');
  });
  afterEach(() => {
    // @ts-ignore - Property 'mockRestore' does not exist
    global.console.warn.mockRestore();
    // @ts-ignore - Property 'mockRestore' does not exist
    global.console.error.mockRestore();
  });

  it('should mount without errors', () => {
    mount(<CommentActionWithAnalytics />);
    /* eslint-disable no-console */
    expect(console.warn).not.toHaveBeenCalled();
    expect(console.error).not.toHaveBeenCalled();
    /* eslint-enable no-console */
  });
});
