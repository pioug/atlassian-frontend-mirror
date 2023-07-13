import React from 'react';

import { render } from '@testing-library/react';

import LinkItem from '../../../menu-item/link-item';
import Section from '../../section';

describe('<Section />', () => {
  it('should render heading when `title` is passed in', () => {
    const { queryByTestId } = render(
      <Section testId="section" title="title">
        {/* TODO: Links should go to an actual anchor or link (DSP-11466). */}
        {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
        <LinkItem>Test Item</LinkItem>
      </Section>,
    );
    expect(queryByTestId('section--heading')).not.toBeNull();
  });

  it('should pass an id to the section', () => {
    const { queryByTestId } = render(
      <Section id="foo" testId="section" title="title">
        {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
        <LinkItem>Test Item</LinkItem>
      </Section>,
    );
    expect(queryByTestId('section')?.id).toEqual('foo');
  });

  it('should spread props because confluence relies on this to apply their hacks', () => {
    const { queryByTestId } = render(
      <Section id="foo" testId="section" data-hack="hackydoody">
        {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
        <LinkItem>Test Item</LinkItem>
      </Section>,
    );

    expect(queryByTestId('section')?.getAttribute('data-hack')).toEqual(
      'hackydoody',
    );
  });

  it('should not render a heading when `title` is not passed in', () => {
    const { queryByTestId } = render(
      <Section testId="section">
        {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
        <LinkItem>Test Item</LinkItem>
      </Section>,
    );
    expect(queryByTestId('section--heading')).toBeNull();
  });

  it('should give section an aria-label equal to the `title` prop', () => {
    const { getByTestId } = render(
      <>
        <Section testId="section" title="title">
          {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
          <LinkItem>Test Item</LinkItem>
        </Section>
        ,
      </>,
    );

    expect(getByTestId('section').getAttribute('aria-label')).toEqual('title');
  });
});
