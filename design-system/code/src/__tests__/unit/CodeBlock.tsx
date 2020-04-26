import React from 'react';

import { mount, ReactWrapper } from 'enzyme';

import CodeBlock from '../../components/CodeBlock';
import ThemedCodeBlock from '../../ThemedCodeBlock';

const code = `
  const a = 'foo';
  const b = 'bar';
  const c = [a, b].map(item => item + item);
  const d = 'hello-world';
`;

const longCode = `
  // 1
  // 2
  // 3
  // 4
  // 5
  // 6
  // 7
  // 8
  // 9
  // 10
  // 11
`;

const theme = { mode: 'dark' };

describe('CodeBlock', () => {
  const findCodeLine = <TWrapper extends {}>(
    wrapper: ReactWrapper<TWrapper>,
    line: number,
  ) => {
    return wrapper
      .find('code')
      .last()
      .childAt(line - 1);
  };

  const findCodeLineNumber = <TWrapper extends {}>(
    wrapper: ReactWrapper<TWrapper>,
    line: number,
  ) => {
    return wrapper
      .find('code')
      .first()
      .childAt(line - 1);
  };

  it('should have "text" as the default language', () => {
    expect(
      mount(<ThemedCodeBlock text={code} />)
        .find(CodeBlock)
        .prop('language'),
    ).toBe('text');
  });

  it('should have "showLineNumbers" enabled by default', () => {
    expect(
      mount(<ThemedCodeBlock text={code} />)
        .find(CodeBlock)
        .prop('showLineNumbers'),
    ).toBe(true);
  });

  it('should apply theme', () => {
    expect(
      mount(<ThemedCodeBlock text={code} language="java" theme={theme} />)
        .find(CodeBlock)
        .prop('theme'),
    ).toBe(theme);
  });

  it('should highlight the second line', () => {
    const wrapper = mount(<CodeBlock text={code} highlight="2" />);

    expect(findCodeLine(wrapper, 2).props().style.opacity).toEqual(1);
    expect(findCodeLineNumber(wrapper, 2).props().style.opacity).toEqual(1);
  });

  it('should highlight lines when grouping from single to double digits', () => {
    const wrapper = mount(<CodeBlock text={longCode} highlight="9-10,2" />);

    expect(findCodeLine(wrapper, 9).props().style.opacity).toEqual(1);
    expect(findCodeLineNumber(wrapper, 10).props().style.opacity).toEqual(1);
  });

  it('should highlight the multiple lines', () => {
    const wrapper = mount(<CodeBlock text={code} highlight="2,4" />);

    expect(findCodeLine(wrapper, 2).props().style.opacity).toEqual(1);
    expect(findCodeLineNumber(wrapper, 2).props().style.opacity).toEqual(1);
    expect(findCodeLine(wrapper, 4).props().style.opacity).toEqual(1);
    expect(findCodeLineNumber(wrapper, 4).props().style.opacity).toEqual(1);
  });

  it('should partially hide other lines', () => {
    const wrapper = mount(<CodeBlock text={code} highlight="2" />);

    expect(findCodeLine(wrapper, 1).props().style.opacity).toEqual(0.3);
    expect(findCodeLineNumber(wrapper, 1).props().style.opacity).toEqual(0.3);
    expect(findCodeLine(wrapper, 3).props().style.opacity).toEqual(0.3);
    expect(findCodeLineNumber(wrapper, 3).props().style.opacity).toEqual(0.3);
  });

  it('should highlight a group lines', () => {
    const wrapper = mount(<CodeBlock text={code} highlight="1-3" />);

    expect(findCodeLine(wrapper, 1).props().style.opacity).toEqual(1);
    expect(findCodeLineNumber(wrapper, 1).props().style.opacity).toEqual(1);
    expect(findCodeLine(wrapper, 2).props().style.opacity).toEqual(1);
    expect(findCodeLineNumber(wrapper, 2).props().style.opacity).toEqual(1);
    expect(findCodeLine(wrapper, 3).props().style.opacity).toEqual(1);
    expect(findCodeLineNumber(wrapper, 3).props().style.opacity).toEqual(1);
  });

  it('should partially hide other lines outside of group', () => {
    const wrapper = mount(<CodeBlock text={code} highlight="1-3" />);

    expect(findCodeLine(wrapper, 4).props().style.opacity).toEqual(0.3);
    expect(findCodeLineNumber(wrapper, 4).props().style.opacity).toEqual(0.3);
  });

  it('should highlight nothing', () => {
    const wrapper = mount(<CodeBlock text={code} />);

    expect(findCodeLineNumber(wrapper, 1).props().style.opacity).toEqual(1);
    expect(findCodeLineNumber(wrapper, 2).props().style.opacity).toEqual(1);
    expect(findCodeLineNumber(wrapper, 3).props().style.opacity).toEqual(1);
    expect(findCodeLineNumber(wrapper, 4).props().style.opacity).toEqual(1);
  });
});
