import React, { ReactNode } from 'react';
import { mount, ReactWrapper } from 'enzyme';
import { IntlProvider } from 'react-intl-next';
import Select from '@atlaskit/select';
import UserPicker, {
  DefaultValue,
  OptionData,
  User,
} from '@atlaskit/user-picker';
import {
  AnalyticsListener,
  AnalyticsEventPayload,
} from '@atlaskit/analytics-next';
import { ConcurrentExperience, UFOExperience } from '@atlaskit/ufo';

import {
  flushPromises,
  temporarilySilenceActAndAtlaskitDeprecationWarnings,
  waitForUpdate,
  MockConcurrentExperienceInstance,
} from '../_testUtils';
import SmartUserPicker, { Props } from '../../../index';
import MessagesIntlProvider from '../../../components/MessagesIntlProvider';

import { getUserRecommendations, hydrateDefaultValues } from '../../../service';

temporarilySilenceActAndAtlaskitDeprecationWarnings();

const mockPREFETCH_SESSION_ID = 'prefetch-session-id';

// This session id should only be needed to be used explicitly in some tests.
// For most tests, triggering onFocus() inside the @atlaskit/select element is
// all that's needed to auto-generate a session ID.
const ANALYTICS_SESSION_ID = 'new-session';

const mockMounted = new MockConcurrentExperienceInstance(
  'smart-user-picker-rendered',
);
const mockOptionsShown = new MockConcurrentExperienceInstance(
  'smart-user-picker-options-shown',
);
const mockUserPickerRendered = new MockConcurrentExperienceInstance(
  'user-picker-rendered',
);
const mockUserPickerOptionsShown = new MockConcurrentExperienceInstance(
  'user-picker-options-shown',
);

jest.mock('@atlaskit/ufo', () => ({
  __esModule: true,
  ...jest.requireActual<Object>('@atlaskit/ufo'),
  ConcurrentExperience: (experienceId: string): ConcurrentExperience => ({
    // @ts-expect-error
    getInstance: (instanceId: string): Partial<UFOExperience> => {
      if (experienceId === 'smart-user-picker-rendered') {
        return mockMounted;
      } else if (experienceId === 'smart-user-picker-options-shown') {
        return mockOptionsShown;
      } else if (experienceId === 'user-picker-rendered') {
        return mockUserPickerRendered;
      } else if (experienceId === 'user-picker-options-shown') {
        return mockUserPickerOptionsShown;
      }
      throw new Error(
        `ConcurrentExperience used without id mocked in SmartUserPickerSpec: ${experienceId}`,
      );
    },
  }),
}));

jest.mock('@atlaskit/select', () => ({
  __esModule: true,
  ...jest.requireActual<Object>('@atlaskit/select'),
  CreatableSelect: () => {
    throw new Error('Error from inside CreatableSelect');
  },
}));

jest.mock('../../../components/MessagesIntlProvider', () => ({
  __esModule: true,
  default: jest.fn().mockImplementation((props) => props.children),
}));

jest.mock('uuid', () => ({
  __esModule: true, // needed for default imports
  v4: jest.fn(() => mockPREFETCH_SESSION_ID),
}));

jest.mock('../../../service', () => ({
  __esModule: true,
  getUserRecommendations: jest.fn(),
  hydrateDefaultValues: jest.fn(),
}));

interface DebounceFunction {
  cancel: jest.Mock;
}

jest.mock('lodash/debounce', () => (fn: DebounceFunction) => {
  fn.cancel = jest.fn();
  return fn;
});

const defaultProps: Props = {
  fieldId: 'test',
  principalId: 'Context',
  productKey: 'jira',
  siteId: 'site-id',
  orgId: 'org-id',
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

const usersById: User[] = [
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
const userById = [usersById[0]];
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

const nextTick = () => {
  new Promise((resolve) => setTimeout(resolve, 0));
};

const mountWithIntl = (component: ReactNode) => {
  return mount(<IntlProvider locale="en">{component}</IntlProvider>);
};

describe('SmartUserPicker', () => {
  let getUserRecommendationsMock = getUserRecommendations as jest.Mock;
  let getUsersByIdMock = hydrateDefaultValues as jest.Mock;

  const smartUserPickerWrapper = (
    initialProps: Partial<Props> = {},
  ): ReactWrapper =>
    mount(
      React.createElement((innerProps) => (
        <IntlProvider locale="en">
          <SmartUserPicker
            {...defaultProps}
            {...initialProps}
            {...innerProps}
          />
        </IntlProvider>
      )),
    );

  beforeEach(() => {
    getUserRecommendationsMock.mockReturnValue(Promise.resolve([]));
    getUsersByIdMock.mockReturnValue(Promise.resolve([]));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('default value hydration', () => {
    it('should hydrate defaultValues for jira on mount', async () => {
      getUsersByIdMock.mockReturnValue(Promise.resolve(usersById));

      const component = smartUserPickerWrapper({ defaultValue });
      await flushPromises();
      component.update();
      await nextTick();

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
      ]);
    });

    it('should set defaultValues if the full hydrated defaultValue is passed in', async () => {
      getUsersByIdMock.mockReturnValue(Promise.resolve(usersById));

      const component = smartUserPickerWrapper({
        defaultValue: usersById,
        productKey: 'people',
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
            avatarUrl: 'someavatar.com',
            email: 'a@b.com',
            id: 'id1',
            type: 'user',
            name: 'Oliver Oldfield-Hodge',
          },
        },
        {
          label: 'Ann Other',
          value: 'id2',
          data: {
            avatarUrl: 'someavatar1.com',
            email: 'b@b.com',
            id: 'id2',
            type: 'user',
            name: 'Ann Other',
          },
        },
      ]);
    });

    it('should set nothing if empty', async () => {
      getUsersByIdMock.mockReturnValue(Promise.resolve([]));
      const component = smartUserPickerWrapper({
        defaultValue: [],
        productKey: 'people',
      });
      await flushPromises();
      component.update();

      expect(getUsersByIdMock).toHaveBeenCalledTimes(1);
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
  });

  it('should fetch users on focus', () => {
    const component = smartUserPickerWrapper();
    component.find(Select).props().onFocus();
    expect(getUserRecommendationsMock).toHaveBeenCalledTimes(1);
  });

  it('should fetch users on query change', () => {
    const component = smartUserPickerWrapper();
    component.find(Select).props().onFocus();
    component.find(UserPicker).props().onInputChange('a');
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
    component.find(Select).props().onFocus();
    component.find(UserPicker).props().onInputChange('a');

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
    await component.find(Select).props().onFocus();

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
        sessionId: mockPREFETCH_SESSION_ID,
        siteId: 'site-id',
        orgId: 'org-id',
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
    await component.find(Select).props().onFocus();
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
    await component.find(Select).props().onFocus();
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
    await component.find(Select).props().onFocus();

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
    await component.find(Select).props().onFocus();

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

      await component.find(Select).props().onFocus();
      await component.find(UserPicker).props().onInputChange('user');
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

      await component.find(Select).props().onFocus();
      await component.find(UserPicker).props().onInputChange('user');
      await flushPromises();
      component.update();

      expect(changedFilterOptions).toHaveBeenCalledTimes(0);
      component.setProps({ filterOptions: changedFilterOptions });
      await flushPromises();
      component.find(SmartUserPicker).update();

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
      await component.find(Select).props().onFocus();
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
      await component.find(Select).props().onFocus();
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
    component.find(Select).props().onFocus();
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
          packageName: '@atlaskit/smart-user-picker',
          sessionId: ANALYTICS_SESSION_ID,
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
        orgId: 'org-id',
      };
      return constructPayload(action, actionSubject, {
        ...defaultQueryAttributes,
        ...attributes,
      });
    };

    const AnalyticsTestComponent = (props: Partial<Props> = {}) => {
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
      component.find(UserPicker).props().onFocus!(ANALYTICS_SESSION_ID);
      expect(onEvent).toHaveBeenCalledTimes(2);
      expect(onEvent).toHaveBeenCalledWith(
        expect.objectContaining({
          payload: constructPayloadWithQueryAttributes('requested', 'users'),
        }),
        'fabric-elements',
      );
      component.find(UserPicker).props().onInputChange!(
        'a',
        ANALYTICS_SESSION_ID,
      );
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
      await component.find(UserPicker).props().onFocus!(ANALYTICS_SESSION_ID);
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
      component.find(UserPicker).props().onInputChange!(
        'u',
        ANALYTICS_SESSION_ID,
      );
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

      await component.find(UserPicker).props().onFocus!(ANALYTICS_SESSION_ID);
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

      await component.find(UserPicker).props().onFocus!(ANALYTICS_SESSION_ID);
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

      await component.find(Select).props().onFocus();
      await component.find(UserPicker).props().onInputChange('a');
      await flushPromises();
      expect(onEvent).toHaveBeenCalledWith(
        expect.objectContaining({
          payload: constructPayloadWithQueryAttributes(
            'loaded',
            'preparedUsers',
            {
              prefetch: true,
              preparedSessionId: mockPREFETCH_SESSION_ID,
              sessionId: mockPREFETCH_SESSION_ID,
            },
          ),
        }),
        'fabric-elements',
      );
    });
  });

  describe('UFO metrics', () => {
    beforeEach(() => {
      mockMounted.mockReset();
      mockOptionsShown.mockReset();
    });

    describe('initial mount UFO event', () => {
      it('should send a UFO success metric when mounted successfully', async () => {
        smartUserPickerWrapper();
        expect(mockMounted.startSpy).toHaveBeenCalled();
        expect(mockMounted.successSpy).toHaveBeenCalled();
        expect(mockOptionsShown.startSpy).not.toHaveBeenCalled();
        expect(mockMounted.transitions).toStrictEqual([
          'NOT_STARTED',
          // Initial mount
          'STARTED',
          'SUCCEEDED',
        ]);
      });

      it('should send a UFO failure metric when mount fails', async () => {
        // @ts-ignore
        MessagesIntlProvider.mockImplementationOnce(() => {
          throw new Error('Mount error1');
        });
        smartUserPickerWrapper();
        expect(mockMounted.startSpy).toHaveBeenCalled();
        expect(mockMounted.failureSpy).toHaveBeenCalled();
        expect(mockOptionsShown.startSpy).not.toHaveBeenCalled();

        expect(mockMounted.transitions).toStrictEqual([
          'NOT_STARTED',
          // Initial mount
          'STARTED',
          'FAILED',
        ]);
      });
    });

    [true, false].forEach((isPrefetch) => {
      describe(`when showing list after focusing in input (prefetch=${isPrefetch})`, () => {
        it('should send a UFO success when the list of users are shown after focus', async () => {
          getUserRecommendationsMock.mockReturnValue(
            Promise.resolve(mockReturnOptions),
          );
          const wrapper = smartUserPickerWrapper({ prefetch: isPrefetch });

          // Focus in the user picker so the user list is shown
          // @ts-ignore in this case UserPicker.onFocus is not undefined
          wrapper.find(Select).props().onFocus();
          await waitForUpdate(wrapper);

          expect(mockOptionsShown.startSpy).toHaveBeenCalled();
          expect(mockOptionsShown.successSpy).toHaveBeenCalled();
          expect(mockOptionsShown.failureSpy).not.toHaveBeenCalled();

          expect(mockOptionsShown.transitions).toStrictEqual([
            'NOT_STARTED',
            // Initial focus
            'STARTED',
            'SUCCEEDED',
          ]);
        });

        it('should send a UFO failure when the list of users cannot be shown after focus', async () => {
          getUserRecommendationsMock.mockImplementationOnce(() => {
            throw new Error('Cannot call getUserRecommendations');
          });
          const wrapper = smartUserPickerWrapper({ prefetch: isPrefetch });

          // Focus in the user picker so the user list is shown
          // @ts-ignore in this case UserPicker.onFocus is not undefined
          wrapper.find(Select).props().onFocus();
          await waitForUpdate(wrapper);

          expect(mockOptionsShown.startSpy).toHaveBeenCalled();
          expect(mockOptionsShown.failureSpy).toHaveBeenCalled();
          expect(mockOptionsShown.successSpy).not.toHaveBeenCalled();

          expect(mockOptionsShown.transitions).toStrictEqual([
            'NOT_STARTED',
            // Initial focus
            'STARTED',
            'FAILED',
          ]);
        });

        it('should send a UFO success when URS request fails but the onError fallback succeeds, so the list of users can be shown after focus', async () => {
          getUserRecommendationsMock.mockImplementationOnce(() => {
            throw new Error('Cannot call getUserRecommendations');
          });
          const wrapper = smartUserPickerWrapper({
            prefetch: isPrefetch,
            onError: async () => [],
          });

          // Focus in the user picker so the user list is shown
          // @ts-ignore in this case UserPicker.onFocus is not undefined
          wrapper.find(Select).props().onFocus();
          await waitForUpdate(wrapper);

          expect(mockOptionsShown.startSpy).toHaveBeenCalled();
          expect(mockOptionsShown.failureSpy).not.toHaveBeenCalled();
          expect(mockOptionsShown.successSpy).toHaveBeenCalled();

          expect(mockOptionsShown.transitions).toStrictEqual([
            'NOT_STARTED',
            // Initial focus
            'STARTED',
            'SUCCEEDED',
          ]);
        });

        it('should send a UFO failure when both the URS and fallback onError requests fail, so the list of users cannot be shown after focus', async () => {
          getUserRecommendationsMock.mockImplementationOnce(() => {
            throw new Error('Cannot call getUserRecommendations');
          });
          const wrapper = smartUserPickerWrapper({
            prefetch: isPrefetch,
            onError: async () => {
              throw new Error('Fallback lookup failed');
            },
          });

          // Focus in the user picker so the user list is shown
          // @ts-ignore in this case UserPicker.onFocus is not undefined
          wrapper.find(Select).props().onFocus();
          await waitForUpdate(wrapper);

          expect(mockOptionsShown.startSpy).toHaveBeenCalled();
          expect(mockOptionsShown.failureSpy).toHaveBeenCalled();
          expect(mockOptionsShown.successSpy).not.toHaveBeenCalled();

          expect(mockOptionsShown.transitions).toStrictEqual([
            'NOT_STARTED',
            // Initial focus
            'STARTED',
            'FAILED',
          ]);
        });
      });
    });

    describe('when showing list after typing input', () => {
      it('should send a UFO success when the list of users are shown after typing', async () => {
        getUserRecommendationsMock.mockReturnValue(
          Promise.resolve(mockReturnOptions),
        );
        const wrapper = smartUserPickerWrapper({ prefetch: true });

        // Focus in the user picker so the user list is shown
        // @ts-ignore in this case UserPicker.onFocus is not undefined
        wrapper.find(Select).props().onFocus();
        await waitForUpdate(wrapper);

        expect(mockOptionsShown.startSpy).toHaveBeenCalledTimes(1);
        expect(mockOptionsShown.successSpy).toHaveBeenCalledTimes(1);
        expect(mockOptionsShown.failureSpy).toHaveBeenCalledTimes(0);

        // Now that the options list is shown, type "user" to filter:
        wrapper.find(UserPicker).props().onInputChange('user');
        await waitForUpdate(wrapper);

        expect(mockOptionsShown.startSpy).toHaveBeenCalledTimes(2);
        expect(mockOptionsShown.successSpy).toHaveBeenCalledTimes(2);
        expect(mockOptionsShown.failureSpy).toHaveBeenCalledTimes(0);

        expect(mockOptionsShown.transitions).toStrictEqual([
          'NOT_STARTED',
          // Initial focus
          'STARTED',
          'SUCCEEDED',
          // First onInputChange which succeeds
          'STARTED',
          'SUCCEEDED',
        ]);
      });

      it('should send a UFO failure when the list of users cannot be shown after typing', async () => {
        getUserRecommendationsMock.mockImplementation(() => {
          throw new Error('Cannot call getUserRecommendations');
        });
        const wrapper = smartUserPickerWrapper({ prefetch: true });

        // Focus in the user picker so the user list is shown
        // @ts-ignore in this case UserPicker.onFocus is not undefined
        wrapper.find(Select).props().onFocus();
        await waitForUpdate(wrapper);

        expect(mockOptionsShown.startSpy).toHaveBeenCalledTimes(1);
        expect(mockOptionsShown.failureSpy).toHaveBeenCalledTimes(1);
        expect(mockOptionsShown.successSpy).toHaveBeenCalledTimes(0);

        // Now that the options list is shown, type "user" to filter:
        wrapper.find(UserPicker).props().onInputChange('user');
        await waitForUpdate(wrapper);

        expect(mockOptionsShown.startSpy).toHaveBeenCalledTimes(2);
        expect(mockOptionsShown.failureSpy).toHaveBeenCalledTimes(2);
        expect(mockOptionsShown.successSpy).toHaveBeenCalledTimes(0);

        expect(mockOptionsShown.transitions).toStrictEqual([
          'NOT_STARTED',
          // Initial focus which fails user lookup
          'STARTED',
          'FAILED',
          // First onInputChange which also fails user lookup
          'STARTED',
          'FAILED',
        ]);
      });

      it('should send a UFO success when URS returns an error but the onError prop is used to show fallback users', async () => {
        getUserRecommendationsMock.mockImplementation(() => {
          throw new Error('Cannot call getUserRecommendations');
        });
        const wrapper = smartUserPickerWrapper({
          prefetch: true,
          onError: async (error, request) => {
            return [
              { id: 'fallback-user-1', name: 'Fallback User 1' },
            ].filter((user) =>
              request.query
                ? user.name.toLowerCase().includes(request.query.toLowerCase())
                : true,
            );
          },
        });

        // Focus in the user picker so the user list is shown
        // @ts-ignore in this case UserPicker.onFocus is not undefined
        wrapper.find(Select).props().onFocus();
        await waitForUpdate(wrapper);

        expect(mockOptionsShown.startSpy).toHaveBeenCalledTimes(1);
        expect(mockOptionsShown.failureSpy).toHaveBeenCalledTimes(0);
        expect(mockOptionsShown.successSpy).toHaveBeenCalledTimes(1);

        // Now that the options list is shown, type "user" to filter:
        wrapper.find(UserPicker).props().onInputChange('Fallback User 1');
        await waitForUpdate(wrapper);

        expect(mockOptionsShown.startSpy).toHaveBeenCalledTimes(2);
        expect(mockOptionsShown.failureSpy).toHaveBeenCalledTimes(0);
        expect(mockOptionsShown.successSpy).toHaveBeenCalledTimes(2);

        expect(mockOptionsShown.transitions).toStrictEqual([
          'NOT_STARTED',
          // Initial focus which fails URS lookup but succeeds with fallback lookup from onError
          'STARTED',
          'SUCCEEDED',
          // First onInputChange which fails URS lookup but succeeds with fallback lookup from onError
          'STARTED',
          'SUCCEEDED',
        ]);
      });

      it('should send a UFO failure when URS returns an error and the onError prop used for fallback users also returns an error', async () => {
        getUserRecommendationsMock.mockImplementation(() => {
          throw new Error('Cannot call getUserRecommendations');
        });
        const wrapper = smartUserPickerWrapper({
          prefetch: true,
          onError: async () => {
            throw new Error('Fallback lookup failed');
          },
        });

        // Focus in the user picker so the user list is shown
        // @ts-ignore in this case UserPicker.onFocus is not undefined
        wrapper.find(Select).props().onFocus();
        await waitForUpdate(wrapper);

        expect(mockOptionsShown.startSpy).toHaveBeenCalledTimes(1);
        expect(mockOptionsShown.failureSpy).toHaveBeenCalledTimes(1);
        expect(mockOptionsShown.successSpy).toHaveBeenCalledTimes(0);

        // Now that the options list is shown, type "user" to filter:
        wrapper.find(UserPicker).props().onInputChange('user');
        await waitForUpdate(wrapper);

        expect(mockOptionsShown.startSpy).toHaveBeenCalledTimes(2);
        expect(mockOptionsShown.failureSpy).toHaveBeenCalledTimes(2);
        expect(mockOptionsShown.successSpy).toHaveBeenCalledTimes(0);

        expect(mockOptionsShown.transitions).toStrictEqual([
          'NOT_STARTED',
          // Initial focus which fails URS lookup and also fails fallback lookup from onError
          'STARTED',
          'FAILED',
          // First onInputChange which fails URS lookup and also fails fallback lookup from onError
          'STARTED',
          'FAILED',
        ]);
      });

      it('should abort the UFO show options request if a new query is typed while a previous query is already loading', async () => {
        const wrapper = smartUserPickerWrapper({ prefetch: true });

        // Focus in the user picker so the user list is shown
        // @ts-ignore in this case UserPicker.onFocus is not undefined
        wrapper.find(Select).props().onFocus();
        await waitForUpdate(wrapper);

        expect(mockOptionsShown.startSpy).toHaveBeenCalledTimes(1);
        expect(mockOptionsShown.successSpy).toHaveBeenCalledTimes(1);

        // Now that the options list is shown, type "us" to filter:
        wrapper.find(UserPicker).props().onInputChange('us');
        wrapper.find(UserPicker).props().onInputChange('user');
        await waitForUpdate(wrapper);

        expect(mockOptionsShown.startSpy).toHaveBeenCalledTimes(3);
        expect(mockOptionsShown.successSpy).toHaveBeenCalledTimes(2);
        expect(mockOptionsShown.abortSpy).toHaveBeenCalledTimes(1);
        expect(mockOptionsShown.failureSpy).toHaveBeenCalledTimes(0);

        expect(mockOptionsShown.transitions).toStrictEqual([
          'NOT_STARTED',
          // Initial focus
          'STARTED',
          'SUCCEEDED',
          // First onInputChange which gets aborted
          'STARTED',
          'ABORTED',
          // 2nd onInputChange which finishes successfully
          'STARTED',
          'SUCCEEDED',
        ]);
      });
    });
  });
});
