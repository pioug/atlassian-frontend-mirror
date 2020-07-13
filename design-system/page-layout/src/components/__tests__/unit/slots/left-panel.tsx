import React from 'react';

import { render } from '@testing-library/react';

import { LeftPanel, PageLayout } from '../../../index';

const emptyGridState = { gridState: {} };
describe('<LeftPanel />', () => {
  it('should render with the width passed to it', () => {
    const { getByTestId } = render(
      <PageLayout testId="grid">
        <LeftPanel testId="component" width={200}>
          Contents
        </LeftPanel>
      </PageLayout>,
    );
    expect(getByTestId('component')).toHaveStyleDeclaration(
      'grid-area',
      'left-panel',
    );
    expect(getByTestId('component').querySelector('style')!.innerHTML).toEqual(
      expect.stringContaining(':root{--leftPanelWidth:200px;}'),
    );
  });

  it('should hydrate with the width passed to it', () => {
    const { getByTestId } = render(
      <PageLayout testId="grid">
        <LeftPanel testId="component" width={200}>
          Contents
        </LeftPanel>
      </PageLayout>,
      { hydrate: true },
    );
    expect(getByTestId('component')).toHaveStyleDeclaration(
      'grid-area',
      'left-panel',
    );
    expect(getByTestId('component').querySelector('style')!.innerHTML).toEqual(
      expect.stringContaining(':root{--leftPanelWidth:200px;}'),
    );
  });

  it('should be "fixed" when isFixed prop is passed', () => {
    const { getByTestId } = render(
      <PageLayout testId="grid">
        <LeftPanel isFixed testId="component" width={200}>
          Contents
        </LeftPanel>
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
        <LeftPanel testId="component" isFixed width={50}>
          Contents
        </LeftPanel>
      </PageLayout>,
    );

    expect(localStorage.getItem('DS_PAGE_LAYOUT_UI_STATE')).toEqual(
      JSON.stringify({
        gridState: {
          leftPanelWidth: 50,
        },
      }),
    );
  });

  it('should remove the height in localStorage on unmount', () => {
    const { unmount } = render(
      <PageLayout testId="grid">
        <LeftPanel testId="component" isFixed width={50}>
          Contents
        </LeftPanel>
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
        <LeftPanel testId="component" isFixed width={200}>
          Contents
        </LeftPanel>
      </PageLayout>,
    );

    expect(getByTestId('component').querySelector('style')!.innerHTML).toEqual(
      expect.stringContaining(':root{--leftPanelWidth:200px;}'),
    );

    rerender(
      <PageLayout testId="grid">
        <LeftPanel testId="component" isFixed width={50} shouldPersistWidth>
          Contents
        </LeftPanel>
      </PageLayout>,
    );

    expect(getByTestId('component').querySelector('style')!.innerHTML).toEqual(
      expect.stringContaining(':root{--leftPanelWidth:200px;}'),
    );
  });
});
