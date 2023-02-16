import React from 'react';

import { mount, shallow } from 'enzyme';

import Button from '@atlaskit/button/custom-theme-button';
import __noop from '@atlaskit/ds-lib/noop';

import CommentActionWithAnalytics, {
  CommentActionWithoutAnalytics as CommentAction,
  CommentActionItemProps,
} from '../../action-item';

describe('@atlaskit comments', () => {
  describe('CommentAction', () => {
    describe('exports', () => {
      it('the CommentAction component', () => {
        expect(CommentAction).not.toBe(undefined);
      });
    });

    describe('construction', () => {
      it('should be able to create a component', () => {
        const wrapper = shallow(<CommentAction />);
        expect(wrapper).not.toBe(undefined);
      });

      it('should render a Button containing the children', () => {
        const children = <span>children</span>;
        const wrapper = shallow(<CommentAction>{children}</CommentAction>);
        expect(wrapper.find(Button).length).toBeGreaterThan(0);
        expect(wrapper.find(Button).contains(children)).toBe(true);
      });

      it('should reflect onClick, onFocus, and onMouseOver to a wrapping element', () => {
        const props: CommentActionItemProps = {
          onClick: __noop,
          onFocus: __noop,
          onMouseOver: __noop,
        };
        const wrapper = shallow(<CommentAction {...props} />);
        const Keys = Object.keys(props) as (keyof CommentActionItemProps)[];
        Keys.forEach((propName) => {
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
