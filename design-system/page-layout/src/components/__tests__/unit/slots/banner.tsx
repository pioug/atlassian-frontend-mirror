import React from 'react';

import { render } from '@testing-library/react';

import { Banner, PageLayout } from '../../../index';

const emptyGridState = { gridState: {} };
describe('<Banner />', () => {
  it('should render with the height passed to it', () => {
    const { getByTestId } = render(
      <PageLayout testId="grid">
        <Banner testId="component" height={50}>
          Contents
        </Banner>
      </PageLayout>,
    );

    expect(getByTestId('component')).toHaveStyleDeclaration(
      'height',
      'var(--bannerHeight,0px)',
    );
    expect(getByTestId('component').querySelector('style')!.innerHTML).toEqual(
      expect.stringContaining(':root{--bannerHeight:50px;}'),
    );
  });

  it('should hydrate with the the height passed to it', () => {
    const { getByTestId } = render(
      <PageLayout testId="grid">
        <Banner testId="component" height={50}>
          Contents
        </Banner>
      </PageLayout>,
      { hydrate: true },
    );

    expect(getByTestId('component')).toHaveStyleDeclaration(
      'height',
      'var(--bannerHeight,0px)',
    );
    expect(getByTestId('component').querySelector('style')!.innerHTML).toEqual(
      expect.stringContaining(':root{--bannerHeight:50px;}'),
    );
  });

  it('should be "fixed" when isFixed prop is passed', () => {
    const { getByTestId } = render(
      <PageLayout testId="grid">
        <Banner testId="component" isFixed height={50}>
          Contents
        </Banner>
      </PageLayout>,
    );

    expect(getByTestId('component')).toHaveStyleDeclaration(
      'position',
      'fixed',
    );
  });

  it('should store the width in localStorage on mount', () => {
    render(
      <PageLayout testId="grid">
        <Banner testId="component" isFixed height={50}>
          Contents
        </Banner>
      </PageLayout>,
    );

    expect(localStorage.getItem('DS_PAGE_LAYOUT_UI_STATE')).toEqual(
      JSON.stringify({
        gridState: {
          bannerHeight: 50,
        },
      }),
    );
  });

  it('should remove the height in localStorage on unmount', () => {
    const { unmount } = render(
      <PageLayout testId="grid">
        <Banner testId="component" isFixed height={50}>
          Contents
        </Banner>
      </PageLayout>,
    );

    unmount();
    expect(localStorage.getItem('DS_PAGE_LAYOUT_UI_STATE')).toEqual(
      JSON.stringify({ ...emptyGridState }),
    );
  });

  it('should respect the shouldPersistWidth prop', () => {
    const { rerender, getByTestId } = render(
      <PageLayout testId="grid">
        <Banner testId="component" isFixed height={200} shouldPersistHeight>
          Contents
        </Banner>
      </PageLayout>,
    );

    expect(getByTestId('component').querySelector('style')!.innerHTML).toEqual(
      expect.stringContaining(':root{--bannerHeight:200px;}'),
    );

    rerender(
      <PageLayout testId="grid">
        <Banner testId="component" isFixed height={50} shouldPersistHeight>
          Contents
        </Banner>
      </PageLayout>,
    );

    expect(getByTestId('component').querySelector('style')!.innerHTML).toEqual(
      expect.stringContaining(':root{--bannerHeight:200px;}'),
    );
  });
});
