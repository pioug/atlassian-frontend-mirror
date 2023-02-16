import React from 'react';

import { mount, shallow } from 'enzyme';

import CommentField from '../../field';

describe('@atlaskit comments', () => {
  describe('CommentField', () => {
    describe('exports', () => {
      it('the CommentField component', () => {
        expect(CommentField).not.toBe(undefined);
      });
    });

    describe('construction', () => {
      it('should be able to create a component', () => {
        const wrapper = shallow(<CommentField />);
        expect(wrapper).not.toBe(undefined);
      });

      describe('if href provided', () => {
        it('should render a link', () => {
          const children = <span>children</span>;
          const href = '/test-href';
          const wrapper = mount(
            <CommentField href={href}>{children}</CommentField>,
          );

          expect(wrapper.find('a').length).toBe(1);
          expect(wrapper.find('a').contains(children)).toBe(true);
          expect(wrapper.find('a').prop('href')).toBe(href);
        });

        it('should render link with extra styles', () => {
          const wrapper = mount(<CommentField href="#" hasAuthor />);
          expect(wrapper.find('a')).toBeDefined();
        });
      });

      describe('if href not provided', () => {
        it('should render a span', () => {
          const children = <p>children</p>;
          const wrapper = mount(<CommentField>{children}</CommentField>);

          expect(wrapper.find('span').length).toBe(1);
          expect(wrapper.find('span').contains(children)).toBe(true);
        });

        it('should render span with author styles', () => {
          const wrapper = mount(<CommentField hasAuthor />);
          expect(wrapper.find('span')).toBeDefined();
        });
      });
    });
  });
});
