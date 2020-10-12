import React from 'react';

import { render } from '@testing-library/react';

import { NestedContext } from '../../../NestableNavigationContent/context';
import LoadingItems from '../../index';

describe('<LoadingItems />', () => {
  const markup = (loading: boolean = true) => (
    <LoadingItems
      testId="test"
      isLoading={loading}
      fallback={<div>loading...</div>}
    >
      <div>hello, world</div>
    </LoadingItems>
  );

  it('should not affect position when entering', () => {
    const { getByTestId } = render(markup());

    expect(getByTestId('test--entering')).not.toHaveStyleDeclaration(
      'position',
      'absolute',
    );
  });

  it('should position itself absolutely when exiting', () => {
    const { getByTestId, rerender } = render(markup());

    rerender(markup(false));

    expect(getByTestId('test--exiting')).toHaveStyleDeclaration(
      'position',
      'absolute',
    );
  });

  it('should take up all the available space when exiting', () => {
    const { getByTestId, rerender } = render(markup());

    rerender(markup(false));

    expect(getByTestId('test--exiting')).toHaveStyleDeclaration('top', '0');
    expect(getByTestId('test--exiting')).toHaveStyleDeclaration('left', '0');
    expect(getByTestId('test--exiting')).toHaveStyleDeclaration('right', '0');
  });

  it('should position entering elements over exiting elements', () => {
    const { getByTestId, rerender } = render(markup());

    rerender(markup(false));

    expect(getByTestId('test--exiting')).toHaveStyleDeclaration('z-index', '1');
    expect(getByTestId('test--entering')).toHaveStyleDeclaration(
      'z-index',
      '2',
    );
  });

  it('should use medium duration', () => {
    const { getByTestId, rerender } = render(markup());

    rerender(markup(false));

    expect(getByTestId('test--exiting')).toHaveStyleDeclaration(
      'animation-duration',
      '175ms',
    );
  });

  it('should render nothing when not apart of the active view', () => {
    const { queryByTestId } = render(
      <NestedContext.Provider
        value={{
          currentStackId: '1',
          parentId: '2',
          onNest: () => {},
          onUnNest: () => {},
          stack: [],
        }}
      >
        {markup()}
      </NestedContext.Provider>,
    );

    expect(queryByTestId('test--entering')).toBeNull();
  });
});
