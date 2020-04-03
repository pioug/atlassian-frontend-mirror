import React, { Component } from 'react';
import { shallow, mount } from 'enzyme';

import CommentField from '../../Field';
import { Anchor, Span } from '../../../styled/FieldStyles';

describe('@atlaskit comments', () => {
  describe('CommentField', () => {
    describe('exports', () => {
      it('the CommentField component', () => {
        expect(CommentField).not.toBe(undefined);
        expect(new CommentField({})).toBeInstanceOf(Component);
      });
    });

    describe('construction', () => {
      it('should be able to create a component', () => {
        const wrapper = shallow(<CommentField />);
        expect(wrapper).not.toBe(undefined);
        expect(wrapper.instance()).toBeInstanceOf(Component);
      });

      describe('if href provided', () => {
        it('should render a link', () => {
          const children = <span>children</span>;
          const href = '/test-href';
          const wrapper = mount(
            <CommentField href={href}>{children}</CommentField>,
          );

          expect(wrapper.find(Anchor).length).toBe(1);
          expect(wrapper.find(Anchor).contains(children)).toBe(true);
          expect(wrapper.find(Anchor).prop('href')).toBe(href);
        });

        it('should render link with extra styles', () => {
          const wrapper = mount(<CommentField href="#" hasAuthor />);
          expect(wrapper.find(Anchor).prop('hasAuthor')).toBe(true);
        });

        it('should reflect onClick, onFocus, and onMouseOver to the link element', () => {
          const props: { [index: string]: () => void } = {
            onClick: () => {},
            onFocus: () => {},
            onMouseOver: () => {},
          };
          const wrapper = shallow(<CommentField href="#" {...props} />);
          Object.keys(props).forEach(propName => {
            expect(wrapper.find(Anchor).prop(propName)).toBe(props[propName]);
          });
        });
      });

      describe('if href not provided', () => {
        it('should render a span', () => {
          const children = <span>children</span>;
          const wrapper = mount(<CommentField>{children}</CommentField>);

          expect(wrapper.find(Span).length).toBe(1);
          expect(wrapper.find(Span).contains(children)).toBe(true);
        });

        it('should render span with author styles', () => {
          const wrapper = mount(<CommentField hasAuthor />);
          expect(wrapper.find(Span).prop('hasAuthor')).toBe(true);
        });

        it('should reflect onClick, onFocus, and onMouseOver to the span', () => {
          const props: { [index: string]: () => void } = {
            onClick: () => {},
            onFocus: () => {},
            onMouseOver: () => {},
          };
          const wrapper = shallow(<CommentField {...props} />);
          Object.keys(props).forEach(propName => {
            expect(wrapper.find(Span).prop(propName)).toBe(props[propName]);
          });
        });
      });
    });
  });
});
