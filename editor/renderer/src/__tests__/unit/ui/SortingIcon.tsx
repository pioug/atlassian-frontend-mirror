import React from 'react';
import { SortOrder } from '@atlaskit/editor-common/types';

import SortingIcon from '../../../ui/SortingIcon';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
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
    sortingIcon.find(`div[role="button"]`).simulate('click');
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
    sortingIcon.find(`div[role="button"]`).simulate('click');
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
      .find(`div[role="button"]`)
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
      .find(`div[role="button"]`)
      .simulate('keyDown', { key: 'Enter' });
    expect(onKeyDown).not.toBeCalled();
  });

  it('should have an appropriate aria-label if sorting is not applied', () => {
    const sortingIcon = mountWithIntl(
      <SortingIcon
        isSortingAllowed
        onClick={jest.fn()}
        sortOrdered={SortOrder.NO_ORDER}
        onKeyDown={jest.fn()}
      />,
    );
    expect(
      sortingIcon.find(`div[role="button"]`).props()['aria-label'],
    ).toEqual('No sort applied to the column');
  });

  it('should have an appropriate aria-label when ascending sorting is applied', () => {
    const sortingIcon = mountWithIntl(
      <SortingIcon
        isSortingAllowed
        onClick={jest.fn()}
        sortOrdered={SortOrder.ASC}
        onKeyDown={jest.fn()}
      />,
    );
    expect(
      sortingIcon.find(`div[role="button"]`).props()['aria-label'],
    ).toEqual('Ascending sort applied');
  });

  it('should have an appropriate aria-label when descending sorting is applied', () => {
    const sortingIcon = mountWithIntl(
      <SortingIcon
        isSortingAllowed
        onClick={jest.fn()}
        sortOrdered={SortOrder.DESC}
        onKeyDown={jest.fn()}
      />,
    );
    expect(
      sortingIcon.find(`div[role="button"]`).props()['aria-label'],
    ).toEqual('Descending sort applied');
  });
});
