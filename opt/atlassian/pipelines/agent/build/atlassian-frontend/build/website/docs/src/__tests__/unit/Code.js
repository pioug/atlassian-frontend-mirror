import { mount } from 'enzyme';
import { CodeBlock } from '@atlaskit/code';
import code from '../../code';

describe('code string literal', () => {
  it('should highlight code', () => {
    const wrapper = mount(code`highlight=2
      const hello = 'world';
      const maybe = 'people';
    `);

    expect(wrapper.find(CodeBlock).props().highlight).toEqual('2');
  });

  it('should remove highlight config', () => {
    const wrapper = mount(code`highlight=2
    const hello = 'world';
    const maybe = 'people';
  `);

    expect(wrapper.text().indexOf('highlight=2')).toEqual(-1);
  });

  it('should not highlight code', () => {
    const wrapper = mount(code`
    const hello = 'world';
    const maybe = 'people';
  `);

    expect(wrapper.find(CodeBlock).props().highlight).toEqual(undefined);
  });
});
