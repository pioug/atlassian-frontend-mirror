import React from 'react';
import { shallow } from 'enzyme';

import Button, { ButtonGroup } from '@atlaskit/button';
import Spinner from '@atlaskit/spinner';

import EmptyState from '../../EmptyState';

import { Image, Description } from '../../styled';

describe('Empty state', () => {
  it('should render primary action when primaryAction prop is not empty', () => {
    const wrapper = shallow(
      <EmptyState header="Test header" primaryAction={<Button />} />,
    );

    expect(wrapper.find(Button).length).toBe(1);
  });

  it('should render secondary action when secondaryAction prop is not empty', () => {
    const wrapper = shallow(
      <EmptyState header="Test header" secondaryAction={<Button />} />,
    );

    expect(wrapper.find(Button).length).toBe(1);
  });

  it('should render tertiary action when tertiaryAction prop is not empty', () => {
    const wrapper = shallow(
      <EmptyState header="Test header" tertiaryAction={<Button />} />,
    );

    expect(wrapper.find(Button).length).toBe(1);
  });

  it('should render no action when no action prop is provided', () => {
    const wrapper = shallow(<EmptyState header="Test header" />);

    expect(wrapper.find(Button).length).toBe(0);
  });

  it('should render image when imageUrl prop is not empty', () => {
    const wrapper = shallow(
      <EmptyState header="Test header" imageUrl="test" />,
    );

    expect(wrapper.find(Image).length).toBe(1);
  });

  it('should render the image as a presentational element', () => {
    const wrapper = shallow(
      <EmptyState header="Test header" imageUrl="test" />,
    );

    expect(wrapper.find(Image).props()).toHaveProperty('alt', '');
    expect(wrapper.find(Image).props()).toHaveProperty('role', 'presentation');
  });

  it('should render description when description prop is not empty', () => {
    const wrapper = shallow(
      <EmptyState header="Test header" description="test" />,
    );

    expect(wrapper.find(Description).length).toBe(1);
  });

  it('should render spinner when isLoading prop is true', () => {
    const wrapper = shallow(<EmptyState header="Test header" isLoading />);

    expect(wrapper.find(Spinner).length).toBe(1);
  });

  it('should render primary and seconday actions inside a ButtonGroup', () => {
    const wrapper = shallow(
      <EmptyState
        header="Test header"
        primaryAction={<Button />}
        secondaryAction={<Button />}
      />,
    );
    expect(wrapper.find(ButtonGroup).length).toBe(1);
  });

  it('should render image with fixed width and height so it doesnt jump around when the image is loading in', () => {
    const wrapper = shallow(
      <EmptyState
        header="Test header"
        imageUrl="test"
        imageHeight={100}
        imageWidth={200}
      />,
    );

    expect(wrapper.find(Image).props().height).toEqual(100);
    expect(wrapper.find(Image).props().width).toEqual(200);
  });
});
