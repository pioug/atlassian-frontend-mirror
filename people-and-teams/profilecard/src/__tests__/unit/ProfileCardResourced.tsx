import React from 'react';

import { mount, shallow } from 'enzyme';

import ProfileClient from '../../client/ProfileCardClient';
import { ErrorMessage } from '../../components/Error';
import { ProfileCardResourcedInternal as ProfileCardResourced } from '../../components/User/ProfileCardResourced';
import { profileCardRendered } from '../../util/analytics';

const clientUrl = 'https://foo/';
const client = new ProfileClient({
  url: clientUrl,
  teamCentralUrl: clientUrl,
});

const flexiTime = (event: Record<string, any>) => ({
  ...event,
  attributes: {
    ...event.attributes,
    firedAt: expect.anything(),
  },
});

const mockAnalytics = jest.fn();
mockAnalytics.mockReturnValue({
  fire: () => null,
});

// Mock for runItLater
(window as any).requestIdleCallback = (callback: () => void) => callback();

const defaultProps: React.ComponentProps<typeof ProfileCardResourced> = {
  cloudId: 'test-cloud-id',
  userId: 'test-user-id',
  resourceClient: client,
  createAnalyticsEvent: mockAnalytics,
};

const waitForPromises = () => new Promise((resolve) => setTimeout(resolve));
const renderShallow = (props = {}) =>
  shallow(<ProfileCardResourced {...defaultProps} {...props} />);
const renderMount = (props = {}) =>
  mount(<ProfileCardResourced {...defaultProps} {...props} />);

beforeEach(() => {
  jest.spyOn(client, 'getProfile').mockResolvedValue({});
  jest.spyOn(client, 'getReportingLines').mockResolvedValue({});
});

describe('Fetching data', () => {
  it('should start to fetch data when mounting', () => {
    renderShallow();
    expect(defaultProps.resourceClient.getProfile).toHaveBeenCalledWith(
      defaultProps.cloudId,
      defaultProps.userId,
      expect.any(Function),
    );
    expect(defaultProps.resourceClient.getReportingLines).toHaveBeenCalledWith(
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

    await waitForPromises();

    expect(wrapper.state('isLoading')).toEqual(false);
    expect(defaultProps.resourceClient.getProfile).toHaveBeenCalledWith(
      defaultProps.cloudId,
      'new-test-user-id',
      expect.any(Function),
    );
    expect(defaultProps.resourceClient.getReportingLines).toHaveBeenCalledWith(
      'new-test-user-id',
    );
  });

  it('should re-fetch when "resourceClient" prop changes', async () => {
    const newClient = new ProfileClient({
      url: clientUrl,
    });
    jest.spyOn(newClient, 'getProfile').mockResolvedValue({});

    const wrapper = renderShallow();

    await waitForPromises();

    expect(wrapper.state('isLoading')).toEqual(false);
    expect(defaultProps.resourceClient.getProfile).toHaveBeenCalledWith(
      defaultProps.cloudId,
      'test-user-id',
      expect.any(Function),
    );
    expect(defaultProps.resourceClient.getReportingLines).toHaveBeenCalledWith(
      'test-user-id',
    );

    // update a new resourceClient prop
    wrapper.setProps({
      resourceClient: newClient,
    });

    await waitForPromises();

    // expect(wrapper.state('isLoading')).toEqual(false);
    expect(newClient.getProfile).toHaveBeenCalledWith(
      defaultProps.cloudId,
      'test-user-id',
      expect.any(Function),
    );
    expect(defaultProps.resourceClient.getReportingLines).toHaveBeenCalledWith(
      'test-user-id',
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

    it('should trigger analytics', async () => {
      const expectedErrorEvent = flexiTime(
        profileCardRendered('user', 'error', {
          hasRetry: true,
          errorType: 'default',
        }),
      );
      mockAnalytics.mockClear();
      const wrapper = renderMount();
      expect(mockAnalytics).not.toHaveBeenCalledWith(expectedErrorEvent);

      wrapper.setState({
        isLoading: false,
        hasError: true,
      });
      wrapper.update();

      await waitForPromises();

      expect(mockAnalytics).toHaveBeenCalledWith(expectedErrorEvent);
    });
  });
});
