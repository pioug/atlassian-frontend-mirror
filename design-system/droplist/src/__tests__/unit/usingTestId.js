import React from 'react';

import { render } from '@testing-library/react';

import Item, { ItemGroup } from '@atlaskit/item';

import DropList from '../../index';

const testIdMenu = 'testing--content';

describe('Test Id', () => {
  it('Droplist menu is accessible via data-testid', () => {
    const { getByTestId, rerender } = render(
      <DropList testId="testing" isOpen>
        <ItemGroup title="Australia">
          <Item href="//atlassian.com" target="_blank">
            Sydney
          </Item>
          <Item isHidden>Hidden item</Item>
          <Item isDisabled>Brisbane</Item>
        </ItemGroup>
      </DropList>,
    );

    expect(getByTestId(testIdMenu)).toBeTruthy();

    rerender(
      <DropList isOpen>
        <ItemGroup title="Australia">
          <Item href="//atlassian.com" target="_blank">
            Sydney
          </Item>
          <Item isHidden>Hidden item</Item>
          <Item isDisabled>Brisbane</Item>
        </ItemGroup>
      </DropList>,
    );

    expect(() => getByTestId(testIdMenu)).toThrow();
  });
});
