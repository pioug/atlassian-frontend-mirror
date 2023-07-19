import React from 'react';

import { render } from '@testing-library/react';

import SkeletonItem from '../../../menu-item/skeleton-item';
import Section from '../../section';

describe('<Section />', () => {
  it('should render heading when `title` is passed in', () => {
    const { queryByTestId } = render(
      <Section testId="section" title="title">
        <SkeletonItem />
      </Section>,
    );
    expect(queryByTestId('section--heading')).not.toBeNull();
  });

  it('should pass an id to the section', () => {
    const { queryByTestId } = render(
      <Section id="foo" testId="section" title="title">
        <SkeletonItem />
      </Section>,
    );
    expect(queryByTestId('section')?.id).toEqual('foo');
  });

  it('should spread props because confluence relies on this to apply their hacks', () => {
    const { queryByTestId } = render(
      <Section id="foo" testId="section" data-hack="hackydoody">
        <SkeletonItem />
      </Section>,
    );

    expect(queryByTestId('section')?.getAttribute('data-hack')).toEqual(
      'hackydoody',
    );
  });

  it('should not render a heading when `title` is not passed in', () => {
    const { queryByTestId } = render(
      <Section testId="section">
        <SkeletonItem />
      </Section>,
    );
    expect(queryByTestId('section--heading')).toBeNull();
  });

  it('should give section an aria-label equal to the `title` prop', () => {
    const { getByTestId } = render(
      <>
        <Section testId="section" title="title">
          <SkeletonItem />
        </Section>
        ,
      </>,
    );

    expect(getByTestId('section').getAttribute('aria-label')).toEqual('title');
  });
});
