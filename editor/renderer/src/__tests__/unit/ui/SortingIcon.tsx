import React from 'react';
import { SortOrder } from '@atlaskit/editor-common/types';

import SortingIcon from '../../../ui/SortingIcon';
import { mountWithIntl } from '@atlaskit/editor-test-helpers/enzyme';

describe('Renderer - SortingIcon', () => {
  it('should call onClick when sorting is allowed', () => {
    const onClick = jest.fn();
    const sortingIcon = mountWithIntl(
      <SortingIcon
        isSortingAllowed
        onClick={onClick}
        sortOrdered={SortOrder.NO_ORDER}
        onKeyDown={jest.fn()}
      />,
    );
    sortingIcon.find(`div[aria-label="sort column"]`).simulate('click');
    expect(onClick).toBeCalledTimes(1);
  });

  it('should not call onClick when sorting is not allowed', () => {
    const onClick = jest.fn();
    const sortingIcon = mountWithIntl(
      <SortingIcon
        isSortingAllowed={false}
        onClick={onClick}
        sortOrdered={SortOrder.NO_ORDER}
        onKeyDown={jest.fn()}
      />,
    );
    sortingIcon.find(`div[aria-label="sort column"]`).simulate('click');
    expect(onClick).not.toBeCalled();
  });

  it('should call onKeyDown when sorting is allowed', () => {
    const onKeyDown = jest.fn();
    const sortingIcon = mountWithIntl(
      <SortingIcon
        isSortingAllowed
        onClick={jest.fn()}
        sortOrdered={SortOrder.NO_ORDER}
        onKeyDown={onKeyDown}
      />,
    );
    sortingIcon
      .find(`div[aria-label="sort column"]`)
      .simulate('keyDown', { key: 'Enter' });
    expect(onKeyDown).toBeCalledTimes(1);
    expect(onKeyDown).toBeCalledWith(expect.objectContaining({ key: 'Enter' }));
  });

  it('should not call onKeyDown when sorting is not allowed', () => {
    const onKeyDown = jest.fn();
    const sortingIcon = mountWithIntl(
      <SortingIcon
        isSortingAllowed={false}
        onClick={jest.fn()}
        sortOrdered={SortOrder.NO_ORDER}
        onKeyDown={onKeyDown}
      />,
    );
    sortingIcon
      .find(`div[aria-label="sort column"]`)
      .simulate('keyDown', { key: 'Enter' });
    expect(onKeyDown).not.toBeCalled();
  });
});
