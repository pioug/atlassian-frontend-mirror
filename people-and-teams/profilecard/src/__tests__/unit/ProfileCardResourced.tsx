import React from 'react';
import { shallow } from 'enzyme';
import ProfileCardResourced from '../../components/ProfileCardResourced';
import ErrorMessage from '../../components/ErrorMessage';
import ProfileClient from '../../api/ProfileCardClient';
import { AnalyticsName } from '../../internal/analytics';

const clientUrl = 'https://foo/';
const client = new ProfileClient({
  url: clientUrl,
});

const defaultProps = {
  cloudId: 'test-cloud-id',
  userId: 'test-user-id',
  fullName: 'full name test',
  status: 'active',
  nickname: 'jscrazy',
  companyName: 'Atlassian',
  resourceClient: client,
  analytics: jest.fn(),
};

const renderShallow = (props = {}) =>
  shallow(<ProfileCardResourced {...defaultProps} {...props} />);

beforeEach(() => {
  jest.spyOn(client, 'getProfile').mockResolvedValue({});
});

describe('Fetching data', () => {
  it('should start to fetch data when mounting', () => {
    renderShallow();
    expect(defaultProps.resourceClient.getProfile).toHaveBeenCalledWith(
      defaultProps.cloudId,
      defaultProps.userId,
    );
  });

  it('should start to fetch data when userId prop changes', async () => {
    const wrapper = renderShallow();
    wrapper.setState({
      isLoading: true,
    });
    wrapper.setProps({
      userId: 'new-test-user-id',
    });

    await defaultProps.resourceClient.getProfile;
    expect(wrapper.state('isLoading')).toEqual(false);
    expect(defaultProps.resourceClient.getProfile).toHaveBeenCalledWith(
      defaultProps.cloudId,
      'new-test-user-id',
    );
  });
});

describe('ProfileCardResourced', () => {
  describe('when having error', () => {
    it('should render the ErrorMessage component', () => {
      const wrapper = renderShallow();
      wrapper.setState({
        isLoading: false,
        hasError: true,
      });
      expect(wrapper.find(ErrorMessage).exists()).toBe(true);
    });

    it('should trigger analytics', () => {
      defaultProps.analytics.mockReset();
      const wrapper = renderShallow();
      expect(defaultProps.analytics).not.toHaveBeenCalled();

      wrapper.setState({
        isLoading: false,
        hasError: true,
      });
      expect(defaultProps.analytics).toHaveBeenCalledWith(
        AnalyticsName.PROFILE_CARD_RESOURCED_ERROR,
        {},
      );
    });
  });
});
