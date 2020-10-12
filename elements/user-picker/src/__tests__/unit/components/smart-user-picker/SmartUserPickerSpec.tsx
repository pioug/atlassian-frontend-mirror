import React from 'react';
import { ReactWrapper } from 'enzyme';
import { mountWithIntl } from 'enzyme-react-intl';
import {
  AnalyticsListener,
  AnalyticsEventPayload,
} from '@atlaskit/analytics-next';

import { DefaultValue, OptionData } from '../../../../types';
import { UserPicker } from '../../../../components/UserPicker';
import { flushPromises } from '../../_testUtils';
import {
  SmartUserPicker,
  SmartUserPickerProps,
} from '../../../../components/smart-user-picker/index';
import RecommendationsClient from '../../../../components/smart-user-picker/service/recommendationClient';
import UsersClient from '../../../../components/smart-user-picker/service/UsersClient';
import Select from '@atlaskit/select/Select';

const PREFETCH_SESSION_ID = 'prefetch-session-id';

jest.mock('uuid/v4', () => ({
  __esModule: true, // needed for default imports
  default: jest.fn(() => PREFETCH_SESSION_ID),
}));

jest.mock(
  '../../../../components/smart-user-picker/service/recommendationClient',
  () => ({
    __esModule: true,
    default: jest.fn(),
  }),
);

jest.mock(
  '../../../../components/smart-user-picker/service/UsersClient',
  () => ({
    __esModule: true,
    default: jest.fn(),
  }),
);

interface DebounceFunction {
  cancel: jest.Mock;
}

jest.mock('lodash/debounce', () => (fn: DebounceFunction) => {
  fn.cancel = jest.fn();
  return fn;
});

const defaultProps: SmartUserPickerProps = {
  fieldId: 'test',
  principalId: 'Context',
  productKey: 'jira',
  siteId: 'site-id',
};

const mockReturnOptions: OptionData[] = [
  {
    id: 'user1',
    name: 'user1',
    type: 'user',
  },
  {
    id: 'team1',
    name: 'team1',
    type: 'team',
  },
];

const usersById = [
  {
    id: 'abc-123',
    type: 'user',
    avatarUrl: 'someavatar.com',
    name: 'Oliver Oldfield-Hodge',
    email: 'a@b.com',
  },
  {
    id: '123-abc',
    type: 'user',
    avatarUrl: 'someavatar1.com',
    name: 'Ann Other',
    email: 'b@b.com',
  },
];
const userById = [
  {
    id: 'abc-123',
    type: 'user',
    avatarUrl: 'someavatar.com',
    name: 'Oliver Oldfield-Hodge',
    email: 'a@b.com',
  },
];
const defaultValue: DefaultValue = [
  {
    id: 'abc-123',
    type: 'user',
  },
  {
    id: '123-abc',
    type: 'user',
  },
];

const mockDefaultValueOptions: OptionData[] = [
  {
    id: 'abc-123',
    name: 'Hydrated User 1',
    type: 'user',
  },
  {
    id: '123-abc',
    name: 'Hydrated User 2',
    type: 'user',
  },
];

const singleDefaultValue: DefaultValue = {
  id: 'abc-123',
  type: 'user',
};

const mockReturnOptionsForAnalytics = mockReturnOptions.map(({ id, type }) => ({
  id,
  type,
}));

describe('SmartUserPicker', () => {
  let getUserRecommendationsMock = RecommendationsClient as jest.Mock;
  let getUsersByIdMock = UsersClient as jest.Mock;

  const smartUserPickerWrapper = (
    props: Partial<SmartUserPickerProps> = {},
  ) => {
    const smartUserPickerProps = { ...defaultProps, ...props };
    return mountWithIntl(<SmartUserPicker {...smartUserPickerProps} />);
  };

  beforeEach(() => {
    getUserRecommendationsMock.mockReturnValue(Promise.resolve([]));
    getUsersByIdMock.mockReturnValue(Promise.resolve([]));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should hydrate defaultValues for jira on mount', async () => {
    getUsersByIdMock.mockReturnValue(Promise.resolve(usersById));

    const component = smartUserPickerWrapper({ defaultValue });
    await flushPromises();
    component.update();
    expect(getUsersByIdMock).toHaveBeenCalledTimes(1);
    const select = component.find(Select);
    expect(select.prop('value')).toEqual([
      {
        label: 'Oliver Oldfield-Hodge',
        value: 'abc-123',
        data: {
          id: 'abc-123',
          type: 'user',
          avatarUrl: 'someavatar.com',
          name: 'Oliver Oldfield-Hodge',
          email: 'a@b.com',
        },
      },
      {
        label: 'Ann Other',
        value: '123-abc',
        data: {
          id: '123-abc',
          type: 'user',
          avatarUrl: 'someavatar1.com',
          name: 'Ann Other',
          email: 'b@b.com',
        },
      },
    ]);
  });

  it('should hydrate defaultValue for confluence on mount', async () => {
    getUsersByIdMock.mockReturnValue(Promise.resolve(userById));

    const component = smartUserPickerWrapper({
      defaultValue: singleDefaultValue,
      productKey: 'confluence',
    });

    await flushPromises();
    component.update();
    expect(getUsersByIdMock).toHaveBeenCalledTimes(1);
    const select = component.find(Select);
    expect(select.prop('value')).toEqual([
      {
        label: 'Oliver Oldfield-Hodge',
        value: 'abc-123',
        data: {
          id: 'abc-123',
          type: 'user',
          avatarUrl: 'someavatar.com',
          name: 'Oliver Oldfield-Hodge',
          email: 'a@b.com',
        },
      },
    ]);
  });

  it('should not hydrate defaultValues if not jira or confluence', async () => {
    getUsersByIdMock.mockReturnValue(Promise.resolve(usersById));

    const component = smartUserPickerWrapper({
      defaultValue,
      productKey: 'people',
    });

    await flushPromises();
    component.update();
    expect(getUsersByIdMock).toHaveBeenCalledTimes(0);
    const select = component.find(Select);
    expect(select.prop('value')).toEqual([
      {
        label: 'abc-123',
        value: 'abc-123',
        data: {
          id: 'abc-123',
          type: 'user',
          name: 'abc-123',
        },
      },
      {
        label: '123-abc',
        value: '123-abc',
        data: {
          id: '123-abc',
          type: 'user',
          name: '123-abc',
        },
      },
    ]);
  });

  it('should hydrate or set nothing if empty', async () => {
    getUsersByIdMock.mockReturnValue(Promise.resolve(usersById));
    const component = smartUserPickerWrapper({
      defaultValue: [],
      productKey: 'people',
    });
    await flushPromises();
    component.update();
    expect(getUsersByIdMock).toHaveBeenCalledTimes(0);
    const select = component.find(Select);
    expect(select.prop('value')).toBeUndefined();
  });

  it('should execute onValueError if internal hydration fails', async () => {
    const mockError = new Error();
    getUsersByIdMock.mockImplementation(() => {
      throw mockError;
    });

    const onValueError = jest.fn(error => {
      expect(error).toEqual(mockError);
      return Promise.resolve(mockDefaultValueOptions);
    });

    const component = smartUserPickerWrapper({ defaultValue, onValueError });
    await flushPromises();
    component.update();

    expect(onValueError).toHaveBeenCalledWith(mockError, defaultValue);
    const select = component.find(Select);
    expect(select.prop('value')).toEqual([
      {
        label: 'Hydrated User 1',
        value: 'abc-123',
        data: {
          id: 'abc-123',
          type: 'user',
          name: 'Hydrated User 1',
        },
      },
      {
        label: 'Hydrated User 2',
        value: '123-abc',
        data: {
          id: '123-abc',
          type: 'user',
          name: 'Hydrated User 2',
        },
      },
    ]);
  });

  it('should fetch users on focus', () => {
    const component = smartUserPickerWrapper();
    component.find(UserPicker).props().onFocus('new-session');
    expect(getUserRecommendationsMock).toHaveBeenCalledTimes(1);
  });

  it('should fetch users on query change', () => {
    const component = smartUserPickerWrapper();
    component.find(UserPicker).props().onFocus('new-session');
    component.find(UserPicker).props().onInputChange('a', 'new-session');
    expect(getUserRecommendationsMock).toHaveBeenCalledTimes(2);
    expect(getUserRecommendationsMock).toHaveBeenNthCalledWith(
      1,
      expect.objectContaining({ query: '' }),
    );
    expect(getUserRecommendationsMock).toHaveBeenNthCalledWith(
      2,
      expect.objectContaining({ query: 'a' }),
    );
  });

  it('should filter options from suggested options', async () => {
    getUserRecommendationsMock.mockReturnValue(
      Promise.resolve(mockReturnOptions),
    );
    const filterOptions = jest.fn((options: OptionData[]) => {
      return options.filter(option => option.type === 'user');
    });

    let component = smartUserPickerWrapper({ filterOptions });
    expect(component.find(UserPicker).props().options).toEqual([]);

    await component.find(UserPicker).props().onFocus('new-session');
    await component
      .find(UserPicker)
      .props()
      .onInputChange('user', 'new-session');
    await flushPromises();
    component.update();
    expect(filterOptions).toHaveBeenCalledWith(mockReturnOptions);
    expect(component.find(UserPicker).prop('options')).toEqual(
      filterOptions(mockReturnOptions),
    );
  });

  it('should execute onError when recommendations client returns with error', async () => {
    const mockError = new Error();
    getUserRecommendationsMock.mockImplementation(() => {
      throw mockError;
    });
    const onError = jest.fn(error => {
      expect(error).toEqual(mockError);
      return Promise.resolve(mockReturnOptions);
    });
    const component = smartUserPickerWrapper({ onError });
    expect(component.find(UserPicker).prop('options')).toEqual([]);
    await component.find(UserPicker).props().onFocus('new-session');
    await flushPromises();

    expect(onError).toHaveBeenCalledWith(mockError, '');
    component.update();
    expect(component.find(UserPicker).prop('options')).toEqual(
      mockReturnOptions,
    );
  });

  it('should prefetch users when prefetch props is true', async () => {
    getUserRecommendationsMock.mockReturnValue(
      Promise.resolve(mockReturnOptions),
    );
    const component = smartUserPickerWrapper({ prefetch: true });
    await flushPromises();
    component.update();
    expect(getUserRecommendationsMock).toHaveBeenCalledTimes(1);
    expect(component.find(UserPicker).prop('options')).toEqual(
      mockReturnOptions,
    );
    jest.clearAllMocks();
    await component.find(UserPicker).props().onFocus('new-session');
    await flushPromises();
    expect(getUserRecommendationsMock).not.toHaveBeenCalled();
  });

  it('should not call onEmpty when picker has some results', async () => {
    getUserRecommendationsMock.mockReturnValue(
      Promise.resolve(mockReturnOptions),
    );

    const user3: OptionData = {
      id: 'user3',
      name: 'user3',
      type: 'user',
    };
    const onEmpty = jest.fn(() => Promise.resolve([user3]));

    const component = smartUserPickerWrapper({ onEmpty });
    // trigger on focus
    await component.find(UserPicker).props().onFocus('new-session');

    await flushPromises();

    // expect load items from server
    expect(getUserRecommendationsMock).toHaveBeenCalledTimes(1);

    // expect on Empty to be called
    expect(onEmpty).toHaveBeenCalledTimes(0);

    await component.update();
    expect(component.find(UserPicker).prop('options')).toEqual(
      mockReturnOptions,
    );
  });

  it('should use provided promise onEmpty', async () => {
    getUserRecommendationsMock.mockReturnValue(
      Promise.resolve(mockReturnOptions),
    );

    const user3: OptionData = {
      id: 'user3',
      name: 'user3',
      type: 'user',
    };
    const onEmpty = jest.fn(() => Promise.resolve([user3]));
    const filterOptions = jest.fn(() => []);

    const component = smartUserPickerWrapper({
      filterOptions,
      onEmpty,
    });

    // trigger on focus
    await component.find(UserPicker).props().onFocus('new-session');

    await flushPromises();

    // expect load items from server
    expect(getUserRecommendationsMock).toHaveBeenCalledTimes(1);

    // expect filter is applied
    expect(filterOptions).toHaveBeenCalledTimes(1);

    // expect on Empty to be called
    expect(onEmpty).toHaveBeenCalledTimes(1);

    await component.update();
    expect(component.find(UserPicker).prop('options')).toEqual([user3]);
  });

  describe('analytics', () => {
    const onEvent = jest.fn();
    let component: ReactWrapper;

    const constructPayload = (
      action: String,
      actionSubject: String,
      attributes = {},
    ): AnalyticsEventPayload => {
      return expect.objectContaining({
        eventType: 'operational',
        action,
        actionSubject,
        source: 'smart-user-picker',
        attributes: expect.objectContaining({
          context: 'test',
          prefetch: false,
          packageName: '@atlaskit/user-picker',
          sessionId: 'new-session',
          queryLength: 0,
          ...attributes,
        }),
      });
    };

    const constructPayloadWithQueryAttributes = (
      action: String,
      actionSubject: String,
      attributes = {},
    ): AnalyticsEventPayload => {
      const defaultQueryAttributes = {
        principalId: 'Context',
        productKey: 'jira',
        siteId: 'site-id',
      };
      return constructPayload(action, actionSubject, {
        ...defaultQueryAttributes,
        ...attributes,
      });
    };

    const AnalyticsTestComponent = (
      props: Partial<SmartUserPickerProps> = {},
    ) => {
      const smartUserPickerProps = { ...defaultProps, ...props };
      return (
        <AnalyticsListener channel="fabric-elements" onEvent={onEvent}>
          <SmartUserPicker {...smartUserPickerProps} />
        </AnalyticsListener>
      );
    };

    beforeEach(() => {
      component = mountWithIntl(<AnalyticsTestComponent />);
      getUserRecommendationsMock.mockReturnValue(
        Promise.resolve(mockReturnOptions),
      );
    });

    afterEach(() => {
      onEvent.mockClear();
    });

    it('should trigger users requested event', () => {
      component.find(UserPicker).props().onFocus!('new-session');
      expect(onEvent).toHaveBeenCalledTimes(2);
      expect(onEvent).toHaveBeenCalledWith(
        expect.objectContaining({
          payload: constructPayloadWithQueryAttributes('requested', 'users'),
        }),
        'fabric-elements',
      );
      component.find(UserPicker).props().onInputChange!('a', 'new-session');
      expect(onEvent).toHaveBeenCalledWith(
        expect.objectContaining({
          payload: constructPayloadWithQueryAttributes('requested', 'users', {
            queryLength: 1,
          }),
        }),
        'fabric-elements',
      );
    });

    it('should trigger users filtered event', async () => {
      // load initial list so query-based filter can be applied
      await component.find(UserPicker).props().onFocus!('new-session');
      await flushPromises();
      component.update();

      // initial filter when no reults returned
      expect(onEvent).toHaveBeenCalledWith(
        expect.objectContaining({
          payload: constructPayload('filtered', 'users', {
            all: [],
            filtered: [],
          }),
        }),
        'fabric-elements',
      );

      // don't wait so that filter can be applied while loading is true
      component.find(UserPicker).props().onInputChange!('u', 'new-session');
      expect(onEvent).toHaveBeenCalledWith(
        expect.objectContaining({
          payload: constructPayload('filtered', 'users', {
            queryLength: 1,
            filtered: [{ id: 'user1', type: 'user' }],
            all: mockReturnOptionsForAnalytics,
          }),
        }),
        'fabric-elements',
      );
    });

    it('should trigger user request successful event', async () => {
      const filterOptions = jest.fn((options: OptionData[]) => {
        return options.filter(option => option.type === 'user');
      });
      component = mountWithIntl(AnalyticsTestComponent({ filterOptions }));

      await component.find(UserPicker).props().onFocus!('new-session');
      await flushPromises();

      expect(onEvent).toHaveBeenCalledWith(
        expect.objectContaining({
          payload: constructPayloadWithQueryAttributes(
            'successful',
            'usersRequest',
            {
              users: mockReturnOptionsForAnalytics,
              filteredUsers: [{ id: 'user1', type: 'user' }],
            },
          ),
        }),
        'fabric-elements',
      );
    });

    it('should trigger prefetch mounted event', async () => {
      component = mountWithIntl(AnalyticsTestComponent({ prefetch: true }));

      await flushPromises();
      expect(onEvent).toHaveBeenCalledWith(
        expect.objectContaining({
          payload: constructPayloadWithQueryAttributes('mounted', 'prefetch', {
            prefetch: true,
            sessionId: PREFETCH_SESSION_ID,
          }),
        }),
        'fabric-elements',
      );

      expect(onEvent).toHaveBeenCalledWith(
        expect.objectContaining({
          payload: constructPayloadWithQueryAttributes(
            'successful',
            'usersRequest',
            {
              prefetch: true,
              users: mockReturnOptionsForAnalytics,
              sessionId: PREFETCH_SESSION_ID,
            },
          ),
        }),
        'fabric-elements',
      );
    });

    it('should trigger user request failed event', async () => {
      const mockError = new Error();
      getUserRecommendationsMock.mockImplementation(() => {
        throw mockError;
      });

      await component.find(UserPicker).props().onFocus!('new-session');
      await flushPromises();

      expect(onEvent).toHaveBeenCalledWith(
        expect.objectContaining({
          payload: constructPayloadWithQueryAttributes(
            'failed',
            'usersRequest',
          ),
        }),
        'fabric-elements',
      );
    });

    it('should trigger preparedUsers loaded event', async () => {
      component = mountWithIntl(AnalyticsTestComponent({ prefetch: true }));

      await flushPromises();

      await component.find(UserPicker).props().onFocus!('new-session');
      await component.find(UserPicker).props().onInputChange!(
        'a',
        'new-session',
      );
      await flushPromises();
      expect(onEvent).toHaveBeenCalledWith(
        expect.objectContaining({
          payload: constructPayloadWithQueryAttributes(
            'loaded',
            'preparedUsers',
            {
              prefetch: true,
              preparedSessionId: PREFETCH_SESSION_ID,
              sessionId: 'new-session',
            },
          ),
        }),
        'fabric-elements',
      );
    });
  });
});
