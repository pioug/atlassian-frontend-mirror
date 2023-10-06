import React from 'react';
import { shallow } from 'enzyme';
import { Menu } from '../../../components/Menu';

describe('Menu', () => {
  const shallowMenu = (props: any) => shallow(<Menu id="menu" {...props} />);

  it('should render footer if footer is passed into Menu', () => {
    const footer = (
      <div id="footer">
        <button>Test</button>
      </div>
    );
    const component = shallowMenu({
      selectProps: { footer },
    });

    expect(component.find('#menu')).toHaveLength(1);
    expect(component.find('#footer')).toHaveLength(1);
  });

  it('should render Menu without footer if footer is not passed in', () => {
    const component = shallowMenu({
      selectProps: {},
    });

    expect(component.find('#menu')).toHaveLength(1);
    expect(component.find('#footer')).toHaveLength(0);
  });

  it('should render header if header is passed into Menu', () => {
    const header = <div id="header">header</div>;
    const component = shallowMenu({
      selectProps: { header },
    });

    expect(component.find('#menu')).toHaveLength(1);
    expect(component.find('#header')).toHaveLength(1);
  });

  it('should render Menu without header if header is not passed in', () => {
    const component = shallowMenu({
      selectProps: {},
    });

    expect(component.find('#menu')).toHaveLength(1);
    expect(component.find('#header')).toHaveLength(0);
  });
});
