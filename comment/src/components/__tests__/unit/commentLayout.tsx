import React, { Component } from 'react';
import { mount, shallow } from 'enzyme';
import Avatar from '@atlaskit/avatar';

import { CommentLayout } from '../../..';
import {
  AvatarSectionDiv,
  Container,
  NestedCommentsDiv,
} from '../../../styled/LayoutStyles';

describe('@atlaskit comments', () => {
  describe('CommentLayout', () => {
    describe('exports', () => {
      it('the CommentLayout component', () => {
        expect(CommentLayout).not.toBe(undefined);
        expect(new CommentLayout({})).toBeInstanceOf(Component);
      });
    });

    describe('construction', () => {
      it('should be able to create a component', () => {
        const wrapper = shallow(<CommentLayout />);
        expect(wrapper).not.toBe(undefined);
        expect(wrapper.instance()).toBeInstanceOf(Component);
      });
    });

    describe('props', () => {
      describe('avatar prop', () => {
        it('should render the avatar in the correct location', () => {
          const avatar = <Avatar src="test/src" label="test label" />;
          const wrapper = mount(<CommentLayout avatar={avatar} />);
          expect(wrapper.find(Avatar).length).toBe(1);
          expect(wrapper.find(AvatarSectionDiv).contains(avatar)).toBe(true);
        });

        it('can render non-Avatar nodes as the comment avatar', () => {
          const avatar = <img src="test/src" alt="test alt" />;
          const wrapper = mount(<CommentLayout avatar={avatar} />);
          expect(wrapper.find(AvatarSectionDiv).contains(avatar)).toBe(true);
        });

        it('does not render the avatar container if no avatar is provided', () => {
          const wrapper = shallow(<CommentLayout />);
          expect(wrapper.find(AvatarSectionDiv).length).toBe(0);
        });
      });

      describe('content prop', () => {
        it('should render the provided content in the correct container', () => {
          const content = <p>My sample content</p>;
          const wrapper = mount(<CommentLayout content={content} />);
          expect(wrapper.find(Container).contains(content)).toBe(true);
        });
      });
    });

    describe('nesting', () => {
      it('should render child comments in the correct container', () => {
        const childComment = <CommentLayout content="child" />;
        const wrapper = mount(
          <CommentLayout content="parent'">{childComment}</CommentLayout>,
        );

        const commentsContainer = wrapper.find(NestedCommentsDiv);
        expect(commentsContainer.contains(childComment)).toBe(true);
      });

      it('should render multiple adjacent siblings', () => {
        const childComments = [
          <CommentLayout key="1" content="child1" />,
          <CommentLayout key="2" content="child2" />,
        ];
        const wrapper = mount(
          <CommentLayout content="parent'">{childComments}</CommentLayout>,
        );

        const commentsContainer = wrapper.find(NestedCommentsDiv);
        childComments.forEach(childComment =>
          expect(commentsContainer.contains(childComment)).toBe(true),
        );
      });

      it('should not render the container if no nested comments are provided', () => {
        const wrapper = mount(<CommentLayout />);
        expect(wrapper.contains('NestedCommentsDiv')).toBe(false);
      });

      it('should not unmount the component when the children change', () => {
        // Extend the class to bind an inspectable componentWillUnmount
        const componentWillUnmount = jest.fn();
        class CommentLayoutTest extends CommentLayout {
          componentWillUnmount = componentWillUnmount;
        }

        const child1 = <CommentLayoutTest key="1" content="child1" />;
        const child2 = <CommentLayoutTest key="2" content="child2" />;
        const children = [child1];

        const wrapper = mount(
          <CommentLayoutTest content="parent'">{children}</CommentLayoutTest>,
        );

        // First child
        expect(wrapper.find(NestedCommentsDiv)).toBeDefined();
        expect(wrapper.find(NestedCommentsDiv).contains(child1)).toBe(true);

        // Add another child - should not unmount
        wrapper.setProps({ children: [child1, child2] });
        expect(wrapper.find(NestedCommentsDiv).contains(child2)).toBe(true);
        expect(componentWillUnmount.mock.calls.length).toEqual(0);
      });
    });
  });
});
