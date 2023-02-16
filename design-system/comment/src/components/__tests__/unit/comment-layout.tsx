import React from 'react';

import { mount, shallow } from 'enzyme';

import Avatar from '@atlaskit/avatar';

import { CommentLayout } from '../../../index';

describe('@atlaskit comments', () => {
  describe('CommentLayout', () => {
    describe('exports', () => {
      it('the CommentLayout component', () => {
        expect(CommentLayout).not.toBe(undefined);
      });
    });

    describe('construction', () => {
      it('should be able to create a component', () => {
        const wrapper = shallow(<CommentLayout />);
        expect(wrapper).not.toBe(undefined);
      });
    });

    describe('props', () => {
      describe('avatar prop', () => {
        it('should render the avatar in the correct location', () => {
          const avatar = <Avatar src="test/src" />;
          const wrapper = mount(<CommentLayout avatar={avatar} />);
          expect(wrapper.find(Avatar).length).toBe(1);
          expect(wrapper.find(Avatar).contains(avatar)).toBe(true);
        });

        it('can render non-Avatar nodes as the comment avatar', () => {
          const avatar = <img src="test/src" alt="test alt" />;
          const wrapper = mount(<CommentLayout avatar={avatar} />);
          expect(wrapper.find(CommentLayout).contains(avatar)).toBe(true);
        });
      });

      describe('content prop', () => {
        it('should render the provided content in the correct container', () => {
          const content = <p>My sample content</p>;
          const wrapper = mount(<CommentLayout content={content} />);
          expect(wrapper.contains(content)).toBe(true);
        });
      });
    });

    describe('nesting', () => {
      it('should render child comments in the correct container', () => {
        const childComment = <CommentLayout content="child" />;
        const wrapper = mount(
          <CommentLayout content="parent'">{childComment}</CommentLayout>,
        );

        expect(wrapper.contains(childComment)).toBe(true);
      });

      it('should render multiple adjacent siblings', () => {
        const childComments = [
          <CommentLayout key="1" content="child1" />,
          <CommentLayout key="2" content="child2" />,
        ];
        const wrapper = mount(
          <CommentLayout content="parent'">{childComments}</CommentLayout>,
        );

        const commentsContainer = wrapper.find(CommentLayout);
        childComments.forEach((childComment) =>
          expect(commentsContainer.contains(childComment)).toBe(true),
        );
      });
    });
  });
});
