import React from 'react';

import { render } from '@testing-library/react';

import Heading from '../../heading';
import HeadingContextProvider from '../../heading-context';

describe('Heading', () => {
  it('renders', () => {
    const { getByTestId } = render(
      <Heading level="xxs" testId="test">
        Hello
      </Heading>,
    );

    expect(getByTestId('test')).toBeDefined();
  });

  it('sets level based on nesting', () => {
    const { getByTestId } = render(
      <HeadingContextProvider value={5}>
        <Heading level="xxs" testId="test">
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
        <Heading level="xxs" testId="test">
          Hello
        </Heading>
      </HeadingContextProvider>,
    );

    expect(getByTestId('test').tagName).toEqual('DIV');
  });

  it('observes deeper context', () => {
    // should be H1 --> H2 --> H3
    const { getByTestId } = render(
      <HeadingContextProvider>
        <HeadingContextProvider>
          <Heading level="xxs" testId="h2">
            Hello
          </Heading>
          <HeadingContextProvider>
            <Heading level="xxs" testId="h3">
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
