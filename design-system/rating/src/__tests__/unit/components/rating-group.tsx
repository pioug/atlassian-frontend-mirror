import React from 'react';

import { fireEvent, render } from '@testing-library/react';

import RatingGroup from '../../../components/rating-group';
import Star from '../../../components/star';

describe('<RatingGroup />', () => {
  it('should start initially checked on a hidden checkbox', () => {
    const { getByTestId } = render(
      <RatingGroup testId="rating">
        <Star label="one" value="one" />
        <Star label="two" value="two" />
      </RatingGroup>,
    );

    expect(
      (getByTestId('rating--input-empty') as HTMLInputElement).checked,
    ).toEqual(true);
  });

  it('should remove the hidden checkbox after initial selection which will ensure a value is always selected', () => {
    const { baseElement, getByTestId } = render(
      <RatingGroup testId="rating">
        <Star label="one" value="one" />
        <Star label="two" value="two" />
      </RatingGroup>,
    );

    fireEvent.click(getByTestId('rating--0--label'));

    expect(
      baseElement.querySelector('[data-testid="rating--input-empty"]'),
    ).toEqual(null);
  });

  it('should remove the hidden checkbox if default value was used', () => {
    const { baseElement } = render(
      <RatingGroup testId="rating" defaultValue="one">
        <Star label="one" value="one" />
        <Star label="two" value="two" />
      </RatingGroup>,
    );

    expect(
      baseElement.querySelector('[data-testid="rating--input-empty"]'),
    ).toEqual(null);
  });

  it('should remove the hidden checkbox if value was used', () => {
    const { baseElement } = render(
      <RatingGroup testId="rating" value="one">
        <Star label="one" value="one" />
        <Star label="two" value="two" />
      </RatingGroup>,
    );

    expect(
      baseElement.querySelector('[data-testid="rating--input-empty"]'),
    ).toEqual(null);
  });

  it('should respect default value when uncontrolled', () => {
    const { getByTestId } = render(
      <RatingGroup defaultValue="one" testId="rating">
        <Star label="one" value="one" />
        <Star label="two" value="two" />
      </RatingGroup>,
    );

    expect(
      (getByTestId('rating--0--input') as HTMLInputElement).checked,
    ).toEqual(true);
  });

  it('should callback when selecting a rating', () => {
    const callback = jest.fn();
    const { getByTestId } = render(
      <RatingGroup onChange={callback} testId="rating">
        <Star label="one" value="one" />
        <Star label="two" value="two" />
      </RatingGroup>,
    );

    fireEvent.click(getByTestId('rating--1--label'));

    expect(callback).toHaveBeenCalledWith('two');
  });

  it('should respect value when controlled', () => {
    const { getByTestId } = render(
      <RatingGroup value="one" testId="rating">
        <Star label="one" value="one" />
        <Star label="two" value="two" />
      </RatingGroup>,
    );

    expect(
      (getByTestId('rating--0--input') as HTMLInputElement).checked,
    ).toEqual(true);
  });

  it('should progress to the next checked radio button after using a default value when uncontrolled', () => {
    const { getByTestId } = render(
      <RatingGroup defaultValue="one" testId="rating">
        <Star label="one" value="one" />
        <Star label="two" value="two" />
      </RatingGroup>,
    );

    fireEvent.click(getByTestId('rating--1--label'));

    expect(
      (getByTestId('rating--1--input') as HTMLInputElement).checked,
    ).toEqual(true);
  });

  it('should respect updated value when controlled', () => {
    const { getByTestId, rerender } = render(
      <RatingGroup value="one" testId="rating">
        <Star label="one" value="one" />
        <Star label="two" value="two" />
      </RatingGroup>,
    );

    rerender(
      <RatingGroup value="two" testId="rating">
        <Star label="one" value="one" />
        <Star label="two" value="two" />
      </RatingGroup>,
    );

    expect(
      (getByTestId('rating--1--input') as HTMLInputElement).checked,
    ).toEqual(true);
  });

  it('should log in dev mode when trying to both use it as a controlled & uncontrolled component', () => {
    jest.spyOn(console, 'error');

    render(
      <RatingGroup value="one" defaultValue="two">
        <Star label="one" value="one" />
        <Star label="two" value="two" />
      </RatingGroup>,
    );

    // eslint-disable-next-line no-console
    expect(console.error).toHaveBeenCalledWith(`@atlaskit/rating
Don't use "defaultValue" with "value" you're trying to mix uncontrolled and controlled modes.
Use "defaultValue" or "value" happy days :-).
`);
  });
});
