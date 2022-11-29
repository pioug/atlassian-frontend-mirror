import React from 'react';

import { render } from '@testing-library/react';

import Heading, { HeadingContextProvider } from '../../src';

describe('Heading', () => {
  it('renders', () => {
    const { getByTestId } = render(
      <Heading level="h100" testId="test">
        Hello
      </Heading>,
    );

    expect(getByTestId('test')).toBeDefined();
  });

  it('sets level based on nesting', () => {
    const { getByTestId } = render(
      <HeadingContextProvider value={5}>
        <Heading level="h100" testId="test">
          Hello
        </Heading>
      </HeadingContextProvider>,
    );

    expect(getByTestId('test').tagName).toEqual('H5');
  });

  it('sets min level if with user provided value exceeding range', () => {
    const { getByTestId } = render(
      // @ts-ignore invalid nesting still produces valid dom element
      <HeadingContextProvider value={10}>
        <Heading level="h100" testId="test">
          Hello
        </Heading>
      </HeadingContextProvider>,
    );

    expect(getByTestId('test').tagName).toEqual('H6');
  });

  it('observes deeper context', () => {
    // should be H1 --> H2 --> H3
    const { getByTestId } = render(
      <HeadingContextProvider>
        <HeadingContextProvider>
          <Heading level="h100" testId="h2">
            Hello
          </Heading>
          <HeadingContextProvider>
            <Heading level="h100" testId="h3">
              Hello
            </Heading>
          </HeadingContextProvider>
        </HeadingContextProvider>
      </HeadingContextProvider>,
    );

    expect(getByTestId('h2').tagName).toEqual('H2');
    expect(getByTestId('h3').tagName).toEqual('H3');
  });
});
