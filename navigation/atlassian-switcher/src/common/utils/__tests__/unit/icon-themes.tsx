import React from 'react';

import { mount } from 'enzyme';
import { createIcon } from '../../icon-themes';

describe('utils/icon-themes', () => {
  it('createIcon should return a component type with preset props', () => {
    const MockIconComponent = jest.fn().mockImplementation(() => null);
    const ResultingComponentType = createIcon(MockIconComponent, {
      size: 'medium',
    });

    mount(<ResultingComponentType theme="default" />);
    expect(MockIconComponent.mock.calls[0][0]).toMatchObject({
      size: 'medium',
    });
  });
});
