import { shallow } from 'enzyme';
import React from 'react';
import { ABTestProvider } from '../../AbTestProvider';
import { QuickSearchContext } from '../../../api/types';
import { ABTest, DEFAULT_AB_TEST } from '../../../api/CrossProductSearchClient';

describe('ABTestProvider', () => {
  const DummyComponent = ({ abTest }: { abTest: ABTest }) => (
    //@ts-ignore
    <div id="child" abTest={abTest} />
  );
  const getAbTestData = jest.fn();
  const defaultProps = {
    crossProductSearchClient: {
      getAbTestDataForProduct: getAbTestData,
    } as any,
    context: 'confluence' as QuickSearchContext,
  };

  const waitForStateUpdate = async () => {
    // We need to wait for the end of the event loop to see the state update
    await Promise.resolve({});
  };

  const ABTEST: ABTest = {
    abTestId: `abtest id`,
    controlId: `abtest control id`,
    experimentId: `abtest experiment id`,
  };

  beforeEach(() => {
    jest.clearAllMocks();
    getAbTestData.mockResolvedValue(ABTEST);
  });

  it('should render nothing on mount', () => {
    const wrapper = shallow(
      <ABTestProvider {...defaultProps}>
        {(abTest: ABTest) => <DummyComponent abTest={abTest} />}
      </ABTestProvider>,
    );

    expect(wrapper.isEmptyRender()).toBe(true);
  });

  it('should render child once abtest data is retrieved', async () => {
    const wrapper = shallow(
      <ABTestProvider {...defaultProps}>
        {(abTest: ABTest) => <DummyComponent abTest={abTest} />}
      </ABTestProvider>,
    );

    await waitForStateUpdate();
    wrapper.update();

    expect(getAbTestData).toBeCalledTimes(1);
    expect(getAbTestData).toHaveBeenCalledWith(defaultProps.context);
    expect(wrapper.find(DummyComponent)).toHaveLength(1);
    expect(wrapper.find(DummyComponent).prop('abTest')).toEqual(ABTEST);
  });

  it('should render with default abtest data if abtest data retrieves a null', async () => {
    getAbTestData.mockResolvedValue(null);

    const wrapper = shallow(
      <ABTestProvider {...defaultProps}>
        {(abTest: ABTest) => <DummyComponent abTest={abTest} />}
      </ABTestProvider>,
    );

    await waitForStateUpdate();
    wrapper.update();

    expect(wrapper.find(DummyComponent)).toHaveLength(1);
    expect(wrapper.find(DummyComponent).prop('abTest')).toEqual(
      DEFAULT_AB_TEST,
    );
  });

  it('should render with default abtest data if abtest data throws an error', async () => {
    getAbTestData.mockRejectedValue('error');

    const wrapper = shallow(
      <ABTestProvider {...defaultProps}>
        {(abTest: ABTest) => <DummyComponent abTest={abTest} />}
      </ABTestProvider>,
    );

    await waitForStateUpdate();
    wrapper.update();

    expect(wrapper.find(DummyComponent)).toHaveLength(1);
    expect(wrapper.find(DummyComponent).prop('abTest')).toEqual(
      DEFAULT_AB_TEST,
    );
  });

  it('should only attempt to retrieve abtest data once no matter how many its updated', async () => {
    const wrapper = shallow(
      <ABTestProvider {...defaultProps} key={'1'}>
        {(abTest: ABTest) => <DummyComponent abTest={abTest} />}
      </ABTestProvider>,
    );

    // Wait for first render to complete
    await waitForStateUpdate();
    wrapper.update();

    // Update props to trigger second render
    wrapper.setProps({ key: '2' });
    wrapper.update();

    // Wait for second render to complete
    await waitForStateUpdate();
    wrapper.update();

    expect(getAbTestData).toBeCalledTimes(1);
    expect(getAbTestData).toHaveBeenCalledWith(defaultProps.context);
    expect(wrapper.find(DummyComponent)).toHaveLength(1);
    expect(wrapper.find(DummyComponent).prop('abTest')).toEqual(ABTEST);
  });
});
