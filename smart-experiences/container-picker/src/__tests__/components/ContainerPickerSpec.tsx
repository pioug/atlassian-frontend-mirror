import React from 'react';
import { shallow, ShallowWrapper } from 'enzyme';
import Select from '@atlaskit/select';
import {
  ProductProps,
  ContainerPickerProps,
  ContainerOption,
} from '../../types';
import { ContainerPickerWithoutAnalytics } from '../../components/ContainerPicker';
import * as RecommendationsService from '../../service';

interface DebounceFunction {
  cancel: jest.Mock;
}

jest.mock('lodash/debounce', () => (fn: DebounceFunction) => {
  fn.cancel = jest.fn();
  return fn;
});

jest.mock('../../service', () => ({
  client: jest.fn(),
}));

const defaultProps: ContainerPickerProps & ProductProps = {
  cloudId: 'cloud-id',
  contextType: 'container',
  baseUrl: 'baseUrl',
  isMulti: false,
  maxOptions: 10,
  maxRequestOptions: 100,
  formatOptionLabel: jest.fn(),
  product: 'jira',
};

const defaultContext = {
  baseUrl: defaultProps.baseUrl,
  cloudId: defaultProps.cloudId,
  sessionId: expect.stringContaining('-'),
};

const mockReturnOptions: ContainerOption[] = [
  {
    label: 'project1',
    value: {
      id: 'id1',
      name: 'project1',
      type: 'jiraProject',
      url: 'https://jdog.jira-dev.com/browse/PROJ',
      iconUrl:
        'https://jdog.jira-dev.com/secure/projectavatar?pid=123&avatarId=123',
    },
  },
  {
    label: 'space1',
    value: {
      id: 'id2',
      name: 'space1',
      type: 'confluenceSpace',
      url: 'https://jdog.jira-dev.com/wiki/spaces/PROJ',
      iconUrl:
        'https://jdog.jira-dev.com/secure/projectavatar?pid=234&avatarId=234',
    },
  },
];

describe('ContainerPicker', () => {
  let component: ShallowWrapper<any, any>;
  let getContainerRecommendationsMock = RecommendationsService.client as jest.Mock;

  const createContainerPickerWrapper = (
    props: Partial<ContainerPickerProps> = {},
  ) => {
    const containerPickerProps = { ...defaultProps, ...props };
    return shallow(
      <ContainerPickerWithoutAnalytics {...containerPickerProps} />,
    );
  };

  beforeEach(() => {
    component = createContainerPickerWrapper();
    getContainerRecommendationsMock.mockResolvedValue([]);
  });

  afterEach(() => {
    jest.resetAllMocks();
  });
  it('should fetch containers on focus', async () => {
    getContainerRecommendationsMock.mockResolvedValue(mockReturnOptions);
    await component.find(Select).props().onFocus();
    await new Promise((resolve) => setImmediate(resolve));
    expect(getContainerRecommendationsMock).toHaveBeenCalledTimes(1);
    expect(component.find(Select).prop('options')).toEqual(mockReturnOptions);
  });
  it('should fetch containers on query change', async () => {
    const queryString = 's';
    getContainerRecommendationsMock
      .mockResolvedValueOnce(mockReturnOptions)
      .mockResolvedValueOnce([mockReturnOptions[1]]);
    const componentProps = component.find(Select).props();
    await componentProps.onFocus();
    await new Promise((resolve) => setImmediate(resolve));
    await componentProps.onInputChange(queryString);
    await new Promise((resolve) => setImmediate(resolve));
    //product, context, contextType, query
    expect(getContainerRecommendationsMock).toHaveBeenCalledTimes(2);
    expect(getContainerRecommendationsMock).toHaveBeenNthCalledWith(
      1,
      defaultProps.product,
      defaultContext,
      defaultProps.contextType,
      defaultProps.maxRequestOptions,
      '',
    );
    expect(getContainerRecommendationsMock).toHaveBeenNthCalledWith(
      2,
      defaultProps.product,
      defaultContext,
      defaultProps.contextType,
      defaultProps.maxRequestOptions,
      queryString,
    );
    expect(component.find(Select).prop('options')).toEqual([
      mockReturnOptions[1],
    ]);
  });
  it('should use provided formatOptionLabel prop', async () => {
    getContainerRecommendationsMock.mockResolvedValueOnce(mockReturnOptions);
    const mockFormatOptionLabel = jest.fn();
    component = createContainerPickerWrapper({
      formatOptionLabel: mockFormatOptionLabel,
    });
    await component
      .find(Select)
      .props()
      .formatOptionLabel(mockReturnOptions[0]);
    expect(mockFormatOptionLabel).toHaveBeenCalledTimes(1);
    expect(mockFormatOptionLabel).toHaveBeenCalledWith(
      mockReturnOptions[0],
      undefined,
    );
  });
  it('should use provided maxOptions prop', async () => {
    getContainerRecommendationsMock.mockResolvedValueOnce(mockReturnOptions);
    component = createContainerPickerWrapper({
      maxOptions: 1,
    });
    await component.find(Select).props().onFocus();
    await new Promise((resolve) => setImmediate(resolve));
    expect(component.find(Select).props().options).toEqual([
      mockReturnOptions[0],
    ]);
  });
  describe('isMulti', () => {
    beforeEach(() => {
      component = createContainerPickerWrapper({ isMulti: true });
    });

    it('should filter out items if already chosen', async () => {
      getContainerRecommendationsMock.mockResolvedValueOnce(mockReturnOptions);
      const componentProps = component.find(Select).props();
      await componentProps.onFocus();
      await new Promise((resolve) => setImmediate(resolve));
      // choose first option
      await componentProps.onChange([mockReturnOptions[0]], {
        action: 'select-option',
      });
      expect(getContainerRecommendationsMock).toHaveBeenCalledTimes(1);
      // should only see second option left
      expect(component.find(Select).prop('options')).toEqual([
        mockReturnOptions[1],
      ]);
    });
  });
});
