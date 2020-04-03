jest.mock('../../isRetina');
jest.mock('../../getElementDimension');

import React from 'react';
import { Component } from 'react';
import { shallow } from 'enzyme';
import { getDataURIDimension } from '../../getDataURIDimension';
import { isRetina } from '../../isRetina';
import { getElementDimension } from '../../getElementDimension';

describe('getDataURIDimension()', () => {
  class SomeComponent extends Component<any, any> {
    render() {
      return <div />;
    }
  }

  const setup = () => {
    const component = shallow(<SomeComponent />) as any;

    return {
      component,
    };
  };

  it('should use passed dimensions', () => {
    const { component } = setup();
    const dimensions = {
      width: 100,
      height: 50,
    };
    const width = getDataURIDimension('width', {
      component,
      dimensions,
    });
    const height = getDataURIDimension('height', {
      component,
      dimensions,
    });

    expect(width).toEqual(100);
    expect(height).toEqual(50);
  });

  it('should use default dimensions', () => {
    const { component } = setup();
    const noAppearanceWidth = getDataURIDimension('width', {
      component,
    });
    const appearanceWidth = getDataURIDimension('width', {
      component,
      appearance: 'horizontal',
    });
    const noAppearanceHeight = getDataURIDimension('height', {
      component,
    });
    const appearanceHeight = getDataURIDimension('height', {
      component,
      appearance: 'square',
    });

    expect(noAppearanceWidth).toEqual(156);
    expect(appearanceWidth).toEqual(156);
    expect(noAppearanceHeight).toEqual(125);
    expect(appearanceHeight).toEqual(125);
  });

  it('should use getElementDimension when dimension is percentage unit', () => {
    (getElementDimension as any).mockReturnValueOnce(50);
    const { component } = setup();
    const width = getDataURIDimension('width', {
      component,
      dimensions: {
        width: '25%',
      },
    });
    expect(width).toEqual(50);
  });

  it('should return double size dimensions when is retina factor', () => {
    (isRetina as any).mockReturnValue(true);
    const { component } = setup();

    const width = getDataURIDimension('width', {
      component,
      dimensions: {
        width: 10,
      },
    });
    const height = getDataURIDimension('height', {
      component,
      dimensions: {
        height: 20,
      },
    });

    expect(width).toEqual(20);
    expect(height).toEqual(40);
  });
});
