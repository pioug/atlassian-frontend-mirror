import React from 'react';

import { render } from '@testing-library/react';

import { ROOT_ID } from '../../../NestableNavigationContent';
import { NestedContext } from '../../../NestableNavigationContent/context';
import { default as NestingItem } from '../../../NestingItem';
import { HeadingItem, Section } from '../../index';

describe('Section', () => {
  const callbacks = {
    currentStackId: ROOT_ID,
    onNest: jest.fn(),
    onUnNest: jest.fn(),
    stack: [],
    parentId: ROOT_ID,
  };

  it('should render a Section when contained in an active nested view', () => {
    const { queryByText, rerender } = render(
      <NestedContext.Provider value={{ ...callbacks }}>
        <NestingItem id="1" title="Nest">
          <Section>Hello world</Section>
        </NestingItem>
      </NestedContext.Provider>,
    );

    expect(queryByText('Hello world')).toBeFalsy();

    rerender(
      <NestedContext.Provider value={{ ...callbacks, currentStackId: '1' }}>
        <NestingItem id="1" title="Nest">
          <Section>Hello world</Section>
        </NestingItem>
      </NestedContext.Provider>,
    );

    expect(queryByText('Hello world')).toBeTruthy();
  });

  it('should render a HeadingItem when contained in an active nested view', () => {
    const { queryByText, rerender } = render(
      <NestedContext.Provider value={{ ...callbacks }}>
        <NestingItem id="1" title="Nest">
          <HeadingItem>Hello world</HeadingItem>
        </NestingItem>
      </NestedContext.Provider>,
    );

    expect(queryByText('Hello world')).toBeFalsy();

    rerender(
      <NestedContext.Provider value={{ ...callbacks, currentStackId: '1' }}>
        <NestingItem id="1" title="Nest">
          <HeadingItem>Hello world</HeadingItem>
        </NestingItem>
      </NestedContext.Provider>,
    );

    expect(queryByText('Hello world')).toBeTruthy();
  });
});
