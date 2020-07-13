import React from 'react';

import { render } from '@testing-library/react';

import {
  Content,
  LeftSidebar,
  Main,
  PageLayout,
  RightSidebar,
} from '../../../index';

describe('<Main />', () => {
  it('should take up all space between the sidebars', () => {
    const { getByTestId } = render(
      <PageLayout testId="grid">
        <Content>
          <LeftSidebar testId="left" width={200}>
            Contents
          </LeftSidebar>
          <Main testId="main">Main content</Main>
          <RightSidebar testId="right" width={200}>
            Contents
          </RightSidebar>
        </Content>
      </PageLayout>,
    );

    expect(getByTestId('main')).toHaveStyleDeclaration('flex-grow', '1');
    expect(getByTestId('left')).toHaveStyleDeclaration(
      'width',
      'var(--leftSidebarWidth,0px)',
    );
    expect(getByTestId('right')).toHaveStyleDeclaration(
      'width',
      'var(--rightSidebarWidth,0px)',
    );
  });
});
