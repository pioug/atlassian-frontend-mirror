import React from 'react';
import AkCodeBlock from '@atlaskit/code/block';
import { mount } from 'enzyme';
import cases from 'jest-in-case';
import Example, { ToggleTitle, Toggle } from '../../Example';

cases(
  '<Example />',
  ({ props = {}, should }) => {
    const defaultProps = {
      Component: () => <div>Mock Component</div>,
      language: 'javascript',
      source: '<div>Mock Component</div>',
      title: 'Some title we have',
      packageName: '@atlaskit/somewhere',
      highlight: '1',
    };

    const combinedProps = { ...defaultProps, ...props };
    const Mock = mount(<Example {...combinedProps} />);

    should(Mock, combinedProps);
  },
  [
    {
      name: 'default render',
      should: (Mock, { Component, title }) => {
        expect(Mock.find(Component).length).toBe(1);
        expect(Mock.state()).toMatchObject({
          sourceVisible: false,
          isHover: false,
        });
        expect(Mock.find(ToggleTitle).text()).toBe(title);
      },
    },
    {
      name: 'toggle sourceIsVisible',
      should: (Mock, { language, source, highlight }) => {
        expect(Mock.find(AkCodeBlock).length).toBe(0);
        // eslint-disable-next-line no-unused-vars
        const toggle = Mock.find(Toggle).simulate('click');

        const CodeBlock = Mock.find(AkCodeBlock);
        expect(CodeBlock.prop('text')).toBe(source);
        expect(CodeBlock.prop('language')).toBe(language);
        expect(CodeBlock.prop('highlight')).toBe(highlight);
      },
    },
    {
      name: 'control with sourceVisible',
      props: { sourceVisible: false },
      should: Mock => {
        let CodeBlock = Mock.find(AkCodeBlock);
        expect(CodeBlock.length).toBe(0);

        // Clicking shouldn't do anything when controlled
        Mock.find(Toggle).simulate('click');

        CodeBlock = Mock.find(AkCodeBlock);
        expect(CodeBlock.length).toBe(0);
      },
    },
  ],
);
