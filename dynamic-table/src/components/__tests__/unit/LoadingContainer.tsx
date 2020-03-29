import React from 'react';
import { mount, shallow } from 'enzyme';
import Spinner from '@atlaskit/spinner';
import {
  Container,
  ContentsContainer,
  SpinnerContainer,
} from '../../../styled/LoadingContainer';

import LoadingContainer from '../../LoadingContainer';

describe('LoadingContainer', () => {
  const Contents = () => <div>Contents</div>;

  it('should always wrap contents into the container with a relative position so absolute positioned elements inside the children behave consistently despite the loading mode', () => {
    const wrapper = mount(
      <LoadingContainer isLoading>
        <Contents />
      </LoadingContainer>,
    );
    expect(wrapper.find(Container).length).toBe(1);

    wrapper.setProps({ isLoading: false });
    expect(wrapper.find(Container).length).toBe(1);
  });

  describe('when loading is disabled', () => {
    it('should render children as is right inside the container', () => {
      const wrapper = shallow(
        <LoadingContainer isLoading={false}>
          <Contents />
        </LoadingContainer>,
      );
      const container = wrapper.find(Container);
      expect(container.children().is(Contents)).toBe(true);
    });

    it('should not render the spinner container', () => {
      const wrapper = mount(
        <LoadingContainer isLoading={false}>
          <Contents />
        </LoadingContainer>,
      );
      const spinnerContainer = wrapper.find(SpinnerContainer);
      expect(spinnerContainer.length).toBe(0);
    });
  });

  describe('when loading is enabled', () => {
    it('should render with a proper default values', () => {
      const wrapper = mount(
        <LoadingContainer>
          <Contents />
        </LoadingContainer>,
      );
      expect(wrapper.props().isLoading).toBe(true);
      expect(wrapper.find(ContentsContainer).props().contentsOpacity).toBe(
        0.22,
      );
      expect(wrapper.find(Spinner).prop('size')).toBe('large');
    });

    it('should wrap children into another container with a specified opacity', () => {
      const wrapper = shallow(
        <LoadingContainer contentsOpacity={0.5}>
          <Contents />
        </LoadingContainer>,
      );
      const contentsContainer = wrapper.children(ContentsContainer);
      expect(contentsContainer.children().is(Contents)).toBe(true);
      expect(contentsContainer.props().contentsOpacity).toBe(0.5);
    });

    it('should render the spinner of a given size', () => {
      const wrapper = mount(
        <LoadingContainer spinnerSize="xlarge">
          <Contents />
        </LoadingContainer>,
      );
      expect(wrapper.find(Spinner).prop('size')).toBe('xlarge');
    });
  });
});
