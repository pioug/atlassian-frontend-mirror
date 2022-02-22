jest.mock('../../../components/styles', () => ({
  getStyles: jest.fn(),
}));

jest.mock('../../../components/creatableEmailSuggestion', () => ({
  getCreatableSuggestedEmailProps: jest.fn(),
}));

jest.mock('../../../components/creatable', () => ({
  getCreatableProps: jest.fn(),
}));

jest.mock('../../../components/components', () => ({
  getComponents: jest.fn(),
}));

jest.mock('../../../components/MessagesIntlProvider', () =>
  jest.fn().mockImplementation(({ children }) => children),
);

const mockUfoStart = jest.fn();
const mockUfoSuccess = jest.fn();
const mockUfoFailure = jest.fn();
jest.mock('@atlaskit/ufo', () => ({
  __esModule: true,
  ...jest.requireActual<Object>('@atlaskit/ufo'),
  ConcurrentExperience: (): ConcurrentExperience => ({
    // @ts-expect-error partial getInstance mock
    getInstance: (id: string) => ({
      start: mockUfoStart,
      success: mockUfoSuccess,
      failure: mockUfoFailure,
    }),
  }),
}));

jest.mock('@atlaskit/select', () => ({
  __esModule: true,
  ...jest.requireActual<Object>('@atlaskit/select'),
  CreatableSelect: () => {
    throw new Error('Error from inside CreatableSelect');
  },
}));

import Select, { CreatableSelect } from '@atlaskit/select';
import { shallow, mount } from 'enzyme';
import React from 'react';
import { ConcurrentExperience } from '@atlaskit/ufo';
import { getComponents } from '../../../components/components';
import { getCreatableProps } from '../../../components/creatable';
import { getCreatableSuggestedEmailProps } from '../../../components/creatableEmailSuggestion';
import { getStyles } from '../../../components/styles';
import { UserPickerWithoutAnalytics } from '../../../components/UserPicker';
import { User, UserPickerProps } from '../../../types';

const mockFormatMessage = (descriptor: any) => descriptor.defaultMessage;
const mockIntl = { formatMessage: mockFormatMessage };
jest.mock('react-intl-next', () => {
  return {
    ...(jest.requireActual('react-intl-next') as any),
    FormattedMessage: (descriptor: any) => (
      <span>{descriptor.defaultMessage}</span>
    ),
    injectIntl: (Node: any) => (props: any) => (
      <Node {...props} intl={mockIntl} />
    ),
  };
});

describe('UserPicker', () => {
  // dive twice to get to BaseUserPicker
  const shallowUserPicker = (props: Partial<UserPickerProps> = {}) =>
    shallow(<UserPickerWithoutAnalytics fieldId="test" {...props} />)
      .dive()
      .dive()
      .dive()
      .dive();

  const mountUserPicker = (props: Partial<UserPickerProps> = {}) =>
    mount(<UserPickerWithoutAnalytics fieldId="test" {...props} />);

  const options: User[] = [
    {
      id: 'abc-123',
      name: 'Jace Beleren',
      publicName: 'jbeleren',
    },
    {
      id: '123-abc',
      name: 'Chandra Nalaar',
      publicName: 'cnalaar',
    },
  ];

  afterEach(() => {
    (getCreatableProps as jest.Mock).mockClear();
  });

  describe('default picker', () => {
    it('should render Select by default', () => {
      const component = shallowUserPicker({ options }).dive();
      const select = component.find(Select);
      expect(select).toHaveLength(1);
      expect(getStyles).toHaveBeenCalledWith(350, false, undefined);
    });

    it('should set width', () => {
      shallowUserPicker({ width: 500 });
      expect(getStyles).toHaveBeenCalledWith(500, false, undefined);
    });

    it('should call getComponents with false if single picker', () => {
      shallowUserPicker({ isMulti: false });
      expect(getComponents).toHaveBeenCalledWith(false, undefined);
    });

    it('should call getComponents with true if multi picker', () => {
      shallowUserPicker({ isMulti: true });
      expect(getComponents).toHaveBeenCalledWith(true, undefined);
    });
  });

  describe('allowEmail', () => {
    beforeEach(() => {
      jest.unmock('@atlaskit/select');
    });

    it('should use CreatableSelect', () => {
      const component = shallowUserPicker({ allowEmail: true }).dive();
      const select = component.find(CreatableSelect);
      expect(select).toHaveLength(1);
      expect(getCreatableProps).toHaveBeenCalledTimes(1);
      expect(getCreatableProps).toHaveBeenCalledWith(undefined);
    });

    it('should pass creatable props as pickerProps', () => {
      const component = shallowUserPicker({ allowEmail: true }).dive();
      expect(getCreatableProps).toHaveBeenCalledTimes(1);
      expect(component.prop('pickerProps')).toEqual(getCreatableProps());
    });
  });

  describe('emailLabel', () => {
    it('should pass prop if allowEmail is true', () => {
      const emailLabel = 'This is a test';
      const component = shallowUserPicker({ allowEmail: true, emailLabel });
      expect(component.dive().prop('emailLabel')).toBeDefined();
      expect(component.dive().prop('emailLabel')).toEqual(emailLabel);
    });
  });

  describe('recommendedEmailDomain', () => {
    it('uses getCreatableRecommendedEmailProps instead of getCreatableProps', () => {
      shallowUserPicker({
        allowEmail: true,
        suggestEmailsForDomain: 'test.com',
      });
      expect(getCreatableProps).toHaveBeenCalledTimes(0);
      expect(getCreatableSuggestedEmailProps).toHaveBeenCalledTimes(1);
    });
  });

  describe('UFO', () => {
    beforeEach(() => {
      mockUfoStart.mockReset();
      mockUfoSuccess.mockReset();
      mockUfoFailure.mockReset();
    });

    it('should send a UFO success metric when mounted successfully', async () => {
      mountUserPicker();
      expect(mockUfoStart).toHaveBeenCalled();
      expect(mockUfoSuccess).toHaveBeenCalled();
    });

    it('should send a UFO failure metric when mount fails', async () => {
      mountUserPicker({
        // allowEmail:true causes CreatableSelect to be used,
        // which at the top of this file is mocks to throw an error
        allowEmail: true,
      });
      expect(mockUfoStart).toHaveBeenCalled();
      expect(mockUfoFailure).toHaveBeenCalled();
    });
  });
});
