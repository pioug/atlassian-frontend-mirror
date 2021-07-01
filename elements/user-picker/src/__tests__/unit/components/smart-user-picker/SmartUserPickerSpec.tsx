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

const mockPREFETCH_SESSION_ID = 'prefetch-session-id';

jest.mock('uuid/v4', () => ({
  __esModule: true, // needed for default imports
  default: jest.fn(() => mockPREFETCH_SESSION_ID),
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

const mockConfluenceGuestUserOptions: OptionData[] = [
  {
    avatarUrl: 'someavatar.com',
    id: 'id1',
    name: 'Pranay Marella',
    type: 'user',
    lozenge: {
      text: 'GUEST',
      appearance: 'new',
    },
  },
];

const mockConfluenceGuestUserAndGroupOptions: OptionData[] = [
  {
    avatarUrl: 'someavatar.com',
    id: 'id1',
    name: 'Pranay Marella',
    type: 'user',
    lozenge: {
      text: 'GUEST',
      appearance: 'new',
    },
  },
  {
    id: 'id2',
    type: 'group',
    name: 'Group with Guests',
    lozenge: {
      text: 'GUEST',
      appearance: 'new',
    },
  },
];

const usersById = [
  {
    id: 'id1',
    type: 'user',
    avatarUrl: 'someavatar.com',
    name: 'Oliver Oldfield-Hodge',
    email: 'a@b.com',
  },
  {
    id: 'id2',
    type: 'user',
    avatarUrl: 'someavatar1.com',
    name: 'Ann Other',
    email: 'b@b.com',
  },
];
const userById = [
  {
    id: 'id1',
    type: 'user',
    avatarUrl: 'someavatar.com',
    name: 'Oliver Oldfield-Hodge',
    email: 'a@b.com',
  },
];
const defaultValue: DefaultValue = [
  {
    id: 'id2',
    type: 'user',
  },
  {
    id: 'id1',
    type: 'user',
  },
];

const preHydratedDefaultValues: OptionData[] = [
  {
    id: 'id1',
    name: 'Pre Hydrated User 1',
    type: 'user',
  },
  {
    id: 'id2',
    name: 'Pre Hydrated User 2',
    type: 'user',
  },
];

const mockOnValueErrorDefaultValues: OptionData[] = [
  {
    id: 'id1',
    name: 'Hydrated User 1',
    type: 'user',
  },
  {
    id: 'id2',
    name: 'Hydrated User 2',
    type: 'user',
  },
];

const singleDefaultValue: DefaultValue = {
  id: 'id1',
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
  ): ReactWrapper => {
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
        label: 'Ann Other',
        value: 'id2',
        data: {
          id: 'id2',
          type: 'user',
          avatarUrl: 'someavatar1.com',
          name: 'Ann Other',
          email: 'b@b.com',
        },
      },
      {
        label: 'Oliver Oldfield-Hodge',
        value: 'id1',
        data: {
          id: 'id1',
          type: 'user',
          avatarUrl: 'someavatar.com',
          name: 'Oliver Oldfield-Hodge',
          email: 'a@b.com',
        },
      },
    ]);
  });

  it('should hydrate single defaultValue for confluence on mount', async () => {
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
        value: 'id1',
        data: {
          id: 'id1',
          type: 'user',
          avatarUrl: 'someavatar.com',
          name: 'Oliver Oldfield-Hodge',
          email: 'a@b.com',
        },
      },
    ]);
  });

  it('should hydrate multiple defaultValue for confluence on mount', async () => {
    getUsersByIdMock.mockReturnValue(Promise.resolve(usersById));

    const component = smartUserPickerWrapper({
      defaultValue: defaultValue,
      productKey: 'confluence',
    });

    await flushPromises();
    component.update();
    expect(getUsersByIdMock).toHaveBeenCalledTimes(1);
    const select = component.find(Select);
    //Note the order from defaultValue should be preserved despite the order of the returned usersById
    expect(select.prop('value')).toEqual([
      {
        label: 'Ann Other',
        value: 'id2',
        data: {
          id: 'id2',
          type: 'user',
          avatarUrl: 'someavatar1.com',
          name: 'Ann Other',
          email: 'b@b.com',
        },
      },
      {
        label: 'Oliver Oldfield-Hodge',
        value: 'id1',
        data: {
          id: 'id1',
          type: 'user',
          avatarUrl: 'someavatar.com',
          name: 'Oliver Oldfield-Hodge',
          email: 'a@b.com',
        },
      },
    ]);
  });

  it('should return Unknown user if the id is not known', async () => {
    getUsersByIdMock.mockReturnValue(Promise.resolve(usersById));

    const component = smartUserPickerWrapper({
      defaultValue: [
        {
          id: 'idunknown',
          type: 'user',
        },
        ...defaultValue,
      ],
      productKey: 'confluence',
    });

    await flushPromises();
    component.update();
    expect(getUsersByIdMock).toHaveBeenCalledTimes(1);
    const select = component.find(Select);
    //Note the order from defaultValue should be preserved despite the order of the returned usersById
    expect(select.prop('value')).toEqual([
      {
        label: 'Unknown',
        value: 'idunknown',
        data: {
          id: 'idunknown',
          type: 'user',
          name: 'Unknown',
        },
      },
      {
        label: 'Ann Other',
        value: 'id2',
        data: {
          id: 'id2',
          type: 'user',
          avatarUrl: 'someavatar1.com',
          name: 'Ann Other',
          email: 'b@b.com',
        },
      },
      {
        label: 'Oliver Oldfield-Hodge',
        value: 'id1',
        data: {
          id: 'id1',
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
        label: 'id2',
        value: 'id2',
        data: {
          id: 'id2',
          type: 'user',
          name: 'id2',
        },
      },
      {
        label: 'id1',
        value: 'id1',
        data: {
          id: 'id1',
          type: 'user',
          name: 'id1',
        },
      },
    ]);
  });

  it('should set but not hydrate defaultValues if the full hydrated defaultValue is passed in', async () => {
    getUsersByIdMock.mockReturnValue(Promise.resolve(usersById));

    const component = smartUserPickerWrapper({
      defaultValue: preHydratedDefaultValues,
      productKey: 'people',
    });

    await flushPromises();
    component.update();
    expect(getUsersByIdMock).toHaveBeenCalledTimes(0);
    const select = component.find(Select);
    expect(select.prop('value')).toEqual([
      {
        label: 'Pre Hydrated User 1',
        value: 'id1',
        data: {
          id: 'id1',
          type: 'user',
          name: 'Pre Hydrated User 1',
        },
      },
      {
        label: 'Pre Hydrated User 2',
        value: 'id2',
        data: {
          id: 'id2',
          type: 'user',
          name: 'Pre Hydrated User 2',
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

    const onValueError = jest.fn((error) => {
      expect(error).toEqual(mockError);
      return Promise.resolve(mockOnValueErrorDefaultValues);
    });

    const component = smartUserPickerWrapper({ defaultValue, onValueError });
    await flushPromises();
    component.update();

    expect(onValueError).toHaveBeenCalledWith(mockError, defaultValue);
    const select = component.find(Select);
    expect(select.prop('value')).toEqual([
      {
        label: 'Hydrated User 1',
        value: 'id1',
        data: {
          id: 'id1',
          type: 'user',
          name: 'Hydrated User 1',
        },
      },
      {
        label: 'Hydrated User 2',
        value: 'id2',
        data: {
          id: 'id2',
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
      expect.objectContaining({ defaultLocale: 'en' }),
    );
    expect(getUserRecommendationsMock).toHaveBeenNthCalledWith(
      2,
      expect.objectContaining({ query: 'a' }),
      expect.objectContaining({ defaultLocale: 'en' }),
    );
  });

  it('should use requests in submit order', async () => {
    type Deferrable<T> = Promise<T> & {
      resolve: (value: T) => void;
      reject: (err: any) => void;
    };

    const defer = <T,>(): Deferrable<T> => {
      let resolve: (value: T) => void;
      let reject: (err: any) => void;

      const p = new Promise((_resolve, _reject) => {
        resolve = _resolve;
        reject = _reject;
      });

      (p as any).resolve = (value: T) => resolve(value);
      (p as any).reject = (err: any) => reject(err);
      return p as any;
    };

    const queries = new Map<string, Deferrable<OptionData[]>>();

    /**
     * Simulate a requst race for two queries
     * 1. query ''
     * 2. query 'a'
     * 3. response 'a' ➞ [{}, {}]
     * 4. response '' ➞ []
     */
    getUserRecommendationsMock.mockImplementation(({ query }) => {
      if (query === '') {
        const empty = defer<OptionData[]>();
        queries.set(query, empty);
        return empty;
      }

      if (query === 'a') {
        const empty = queries.get('');
        return Promise.resolve(mockConfluenceGuestUserOptions).then(
          (results) => {
            setTimeout(() => empty?.resolve([]), 0);
            return results;
          },
        );
      }

      return Promise.resolve([]);
    });

    const component = smartUserPickerWrapper();
    component.find(UserPicker).props().onFocus('new-session');
    component.find(UserPicker).props().onInputChange('a', 'new-session');

    // wait until the deferrable for the initial request has been resolved
    await queries.get('');
    component.update();

    expect(component.find(UserPicker).prop('options')).toEqual(
      mockConfluenceGuestUserOptions,
    );
  });

  it('should fetch a confluence guest user and guest group', async () => {
    getUserRecommendationsMock.mockReturnValue(
      Promise.resolve(mockConfluenceGuestUserAndGroupOptions),
    );

    const guestUser: OptionData[] = [
      {
        avatarUrl: 'someavatar.com',
        id: 'id1',
        name: 'Pranay Marella',
        type: 'user',
        lozenge: {
          text: 'GUEST',
          appearance: 'new',
        },
      },
      {
        id: 'id2',
        type: 'group',
        name: 'Group with Guests',
        lozenge: {
          text: 'GUEST',
          appearance: 'new',
        },
      },
    ];

    const filterOptions = jest.fn(() => {
      return guestUser;
    });

    const component = smartUserPickerWrapper({
      filterOptions,
      productKey: 'confluence',
    });

    // trigger on focus
    await component.find(UserPicker).props().onFocus('new-session');

    // expect api to run and fetch a guest user
    expect(getUserRecommendationsMock).toHaveBeenCalledTimes(1);

    // expect filterOptions to be called, mocks the response of a guest user
    expect(filterOptions).toHaveBeenCalled();

    await component.update();
    // expect the user picker options prop to match the mock guest user data
    expect(component.find(UserPicker).prop('options')).toEqual(
      mockConfluenceGuestUserAndGroupOptions,
    );
  });

  it('should execute onError when recommendations client returns with error', async () => {
    const request = {
      baseUrl: '',
      context: {
        childObjectId: undefined,
        containerId: undefined,
        contextType: 'test',
        objectId: undefined,
        principalId: 'Context',
        productAttributes: undefined,
        productKey: 'jira',
        sessionId: 'new-session',
        siteId: 'site-id',
      },
      includeGroups: false,
      includeTeams: false,
      includeUsers: true,
      maxNumberOfResults: 100,
      query: '',
      searchQueryFilter: undefined,
    };

    const mockError = new Error();
    getUserRecommendationsMock.mockImplementation(() => {
      throw mockError;
    });
    const onError = jest.fn((error) => {
      expect(error).toEqual(mockError);
      return Promise.resolve(mockReturnOptions);
    });
    const component = smartUserPickerWrapper({
      onError,
    });
    expect(component.find(UserPicker).prop('options')).toEqual([]);
    await component.find(UserPicker).props().onFocus('new-session');
    await flushPromises();

    expect(onError).toHaveBeenCalledWith(mockError, request);

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
    getUserRecommendationsMock.mockReturnValue(Promise.resolve([]));

    const user3: OptionData = {
      id: 'user3',
      name: 'user3',
      type: 'user',
    };
    const onEmpty = jest.fn(() => Promise.resolve([user3]));

    const component = smartUserPickerWrapper({
      onEmpty,
    });

    // trigger on focus
    await component.find(UserPicker).props().onFocus('new-session');

    await flushPromises();

    // expect load items from server
    expect(getUserRecommendationsMock).toHaveBeenCalledTimes(1);

    // expect on Empty to be called
    expect(onEmpty).toHaveBeenCalledTimes(1);

    await component.update();
    expect(component.find(UserPicker).prop('options')).toEqual([user3]);
  });

  describe('filterOptions', () => {
    it('should filter options from suggested options', async () => {
      getUserRecommendationsMock.mockReturnValue(
        Promise.resolve(mockReturnOptions),
      );
      const filterOptions = jest.fn((options: OptionData[]) => {
        return options.filter((option) => option.type === 'user');
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
      expect(filterOptions).toHaveBeenCalledWith(mockReturnOptions, 'user');
      expect(component.find(UserPicker).prop('options')).toEqual(
        filterOptions(mockReturnOptions),
      );
    });

    it('should apply new filterOptions if filterOptions changes', async () => {
      getUserRecommendationsMock.mockReturnValue(
        Promise.resolve(mockReturnOptions),
      );
      const filterOptions = jest.fn((options: OptionData[]) => {
        return options.filter((option) => option.type === 'user');
      });
      const changedFilterOptions = jest.fn((options: OptionData[]) => {
        return options.filter((option) => option.type === 'team');
      });

      let component = smartUserPickerWrapper({ filterOptions });

      await component.find(UserPicker).props().onFocus('new-session');
      await component
        .find(UserPicker)
        .props()
        .onInputChange('user', 'new-session');
      await flushPromises();
      component.update();

      expect(changedFilterOptions).toHaveBeenCalledTimes(0);

      component.setProps({ filterOptions: changedFilterOptions });
      component.update();

      expect(component.find(UserPicker).prop('options')).toEqual(
        changedFilterOptions(mockReturnOptions),
      );
    });

    it('should override onError when recommendations client returns with error', async () => {
      const mockError = new Error();
      getUserRecommendationsMock.mockImplementation(() => {
        throw mockError;
      });
      const filterOptions = jest.fn(() => mockReturnOptions);
      const onError = jest.fn((error) => {
        expect(error).toEqual(mockError);
        return Promise.resolve([]);
      });
      const component = smartUserPickerWrapper({
        filterOptions,
        onError,
      });
      await component.find(UserPicker).props().onFocus('new-session');
      await flushPromises();

      expect(onError).toHaveBeenCalled();
      expect(filterOptions).toHaveBeenCalled();

      component.update();
      expect(component.find(UserPicker).prop('options')).toEqual(
        mockReturnOptions,
      );
    });

    it('should apply filter to onEmpty results', async () => {
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
      await component.update();

      expect(component.find(UserPicker).prop('options')).toEqual([]);
    });

    it('should apply filterOptions to bootstrap', () => {
      const bootstrapOptions = mockReturnOptions;
      const filterOptions = jest.fn((options: OptionData[]) => {
        return options.filter((option) => option.type === 'user');
      });

      const component = smartUserPickerWrapper({
        bootstrapOptions,
        filterOptions,
      });

      expect(getUserRecommendationsMock).toHaveBeenCalledTimes(0);
      expect(filterOptions).toHaveBeenCalled();
      expect(component.find(UserPicker).prop('options')).toEqual(
        filterOptions(mockReturnOptions),
      );
    });
  });

  it('should pass default principalId if principalId not provided as props', async () => {
    const component = smartUserPickerWrapper({ principalId: undefined });
    component.find(UserPicker).props().onFocus('new-session');
    expect(getUserRecommendationsMock).toHaveBeenCalledTimes(1);
    expect(getUserRecommendationsMock).toHaveBeenCalledWith(
      expect.objectContaining({
        context: expect.objectContaining({ principalId: 'Context' }),
      }),
      expect.objectContaining({ defaultLocale: 'en' }),
    );
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
      const productAttributes = {
        isEntitledConfluenceExternalCollaborator: false,
      };
      const filterOptions = jest.fn((options: OptionData[]) => {
        return options.filter((option) => option.type === 'user');
      });
      component = mountWithIntl(
        AnalyticsTestComponent({ filterOptions, productAttributes }),
      );

      await component.find(UserPicker).props().onFocus!('new-session');
      await flushPromises();

      expect(onEvent).toHaveBeenCalledWith(
        expect.objectContaining({
          payload: constructPayloadWithQueryAttributes(
            'successful',
            'usersRequest',
            {
              users: mockReturnOptionsForAnalytics,
              productAttributes,
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
            sessionId: mockPREFETCH_SESSION_ID,
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
              sessionId: mockPREFETCH_SESSION_ID,
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

    it('should return the options that it was passed in bootstrapOptions', async () => {
      getUserRecommendationsMock.mockReturnValue(
        Promise.resolve(mockReturnOptions),
      );

      const exampleUsers: OptionData[] = [
        {
          id: 'id2',
          avatarUrl: 'someavatar1.com',
          name: 'Ann Other',
        },
        {
          id: 'id1',
          avatarUrl: 'someavatar.com',
          name: 'Oliver Oldfield-Hodge',
        },
        {
          id: 'id2',
          avatarUrl: 'someavatar.com',
          name: 'Kira Molloy',
        },
      ];
      const bootstrapOptions = exampleUsers;

      const component = smartUserPickerWrapper({
        bootstrapOptions,
      });

      expect(getUserRecommendationsMock).toHaveBeenCalledTimes(0);

      expect(component.find(UserPicker).prop('options')).toEqual(exampleUsers);
    });

    it('should return the empty options that it was passed in bootstrapOptions', async () => {
      getUserRecommendationsMock.mockReturnValue(
        Promise.resolve(mockReturnOptions),
      );

      const exampleUsers: OptionData[] = [];
      const bootstrapOptions = exampleUsers;

      const component = smartUserPickerWrapper({
        bootstrapOptions,
      });

      expect(getUserRecommendationsMock).toHaveBeenCalledTimes(0);

      expect(component.find(UserPicker).prop('options')).toEqual(exampleUsers);
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
              preparedSessionId: mockPREFETCH_SESSION_ID,
              sessionId: 'new-session',
            },
          ),
        }),
        'fabric-elements',
      );
    });
  });
});
