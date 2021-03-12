import React from 'react';

import { render } from '@testing-library/react';

import LinkItem from '../../../menu-item/link-item';
import Section from '../../section';

describe('<Section />', () => {
  it('should render heading when `title` is passed in', () => {
    const { queryByTestId } = render(
      <Section testId="section" title="title">
        <LinkItem>Test Item</LinkItem>
      </Section>,
    );
    expect(queryByTestId('section--heading')).not.toBeNull();
  });

  it('should not render a heading when `title` is not passed in', () => {
    const { queryByTestId } = render(
      <Section testId="section">
        <LinkItem>Test Item</LinkItem>
      </Section>,
    );
    expect(queryByTestId('section--heading')).toBeNull();
  });

  it('should give section an aria-label equal to the `title` prop', () => {
    const { getByTestId } = render(
      <>
        <Section testId="section" title="title">
          <LinkItem>Test Item</LinkItem>
        </Section>
        ,
      </>,
    );

    expect(getByTestId('section').getAttribute('aria-label')).toEqual('title');
  });
});
