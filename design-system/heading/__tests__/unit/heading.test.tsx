import React from 'react';

import { render, screen } from '@testing-library/react';

import Heading, { HeadingContextProvider } from '../../src';

describe('Heading (Legacy)', () => {
  it('renders', () => {
    render(
      <Heading level="h100" testId="test">
        Hello
      </Heading>,
    );

    expect(screen.getByTestId('test')).toBeInTheDocument();
  });

  it('sets level based on nesting', () => {
    render(
      <HeadingContextProvider value={5}>
        <Heading level="h100" testId="test">
          Hello
        </Heading>
      </HeadingContextProvider>,
    );

    expect(screen.getByTestId('test').tagName).toEqual('H5');
  });

  it('sets min level if with user provided value exceeding range', () => {
    render(
      // @ts-expect-error invalid level still produces valid dom element
      <HeadingContextProvider value={10}>
        <Heading level="h100" testId="test">
          Hello
        </Heading>
      </HeadingContextProvider>,
    );

    expect(screen.getByTestId('test').tagName).toEqual('DIV');
  });

  it('observes deeper context', () => {
    // should be H1 --> H2 --> H3
    render(
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

    expect(screen.getByTestId('h2').tagName).toEqual('H2');
    expect(screen.getByTestId('h3').tagName).toEqual('H3');
  });
});

describe('Heading', () => {
  it('renders', () => {
    render(
      <Heading variant="xxsmall" testId="test">
        Hello
      </Heading>,
    );

    expect(screen.getByTestId('test')).toBeInTheDocument();
  });

  it('sets variant based on nesting', () => {
    render(
      <HeadingContextProvider value={5}>
        <Heading variant="xxsmall" testId="test">
          Hello
        </Heading>
      </HeadingContextProvider>,
    );

    expect(screen.getByTestId('test').tagName).toEqual('H5');
  });

  it('sets min variant if with user provided value exceeding range', () => {
    render(
      // @ts-expect-error invalid nesting still produces valid dom element
      <HeadingContextProvider value={10}>
        <Heading variant="xxsmall" testId="test">
          Hello
        </Heading>
      </HeadingContextProvider>,
    );

    expect(screen.getByTestId('test').tagName).toEqual('DIV');
  });

  it('observes deeper context', () => {
    // should be H1 --> H2 --> H3
    render(
      <HeadingContextProvider>
        <HeadingContextProvider>
          <Heading variant="xxsmall" testId="h2">
            Hello
          </Heading>
          <HeadingContextProvider>
            <Heading variant="xxsmall" testId="h3">
              Hello
            </Heading>
          </HeadingContextProvider>
        </HeadingContextProvider>
      </HeadingContextProvider>,
    );

    expect(screen.getByTestId('h2').tagName).toEqual('H2');
    expect(screen.getByTestId('h3').tagName).toEqual('H3');
  });
});
