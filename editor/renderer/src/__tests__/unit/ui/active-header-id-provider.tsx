import {
  ActiveHeaderIdConsumer,
  ActiveHeaderIdProvider,
} from '../../../ui/active-header-id-provider';
import React from 'react';
import { mount } from 'enzyme';

describe('ActiveHeaderIdProvider', () => {
  const firstSpy = jest.fn();
  const secondSpy = jest.fn();
  const thirdSpy = jest.fn();
  const Example = ({ activeHeaderId }: any) => (
    <div>
      <ActiveHeaderIdProvider value={activeHeaderId}>
        <ActiveHeaderIdConsumer
          nestedHeaderIds={['test1', 'test2', 'test3']}
          onNestedHeaderIdMatch={firstSpy}
        />
        <ActiveHeaderIdConsumer
          nestedHeaderIds={['test4', 'test5', 'test6']}
          onNestedHeaderIdMatch={secondSpy}
        />
        <ActiveHeaderIdConsumer
          nestedHeaderIds={[]}
          onNestedHeaderIdMatch={thirdSpy}
        />
      </ActiveHeaderIdProvider>
    </div>
  );

  it('should not call any callback when nestedHeaderIds is undefined', () => {
    mount(<Example />);
    expect(firstSpy).toBeCalledTimes(0);
    expect(secondSpy).toBeCalledTimes(0);
    expect(thirdSpy).toBeCalledTimes(0);
  });

  it(`should call onNestedHeaderIdMatch on the right consumers`, () => {
    const wrapper = mount(<Example activeHeaderId="test1" />);
    expect(firstSpy).toBeCalledTimes(1);
    expect(secondSpy).toBeCalledTimes(0);
    expect(thirdSpy).toBeCalledTimes(0);

    wrapper.setProps({
      activeHeaderId: 'test1',
    });
    expect(firstSpy).toBeCalledTimes(1);
    expect(secondSpy).toBeCalledTimes(0);
    expect(thirdSpy).toBeCalledTimes(0);

    wrapper.setProps({
      foo: 'bar',
    });
    expect(firstSpy).toBeCalledTimes(1);
    expect(secondSpy).toBeCalledTimes(0);
    expect(thirdSpy).toBeCalledTimes(0);

    firstSpy.mockReset();

    wrapper.setProps({
      activeHeaderId: 'test4',
    });
    expect(firstSpy).toBeCalledTimes(0);
    expect(secondSpy).toBeCalledTimes(1);
    expect(thirdSpy).toBeCalledTimes(0);
    secondSpy.mockReset();
    wrapper.setProps({
      activeHeaderId: undefined,
    });
    expect(firstSpy).toBeCalledTimes(0);
    expect(secondSpy).toBeCalledTimes(0);
    expect(thirdSpy).toBeCalledTimes(0);
  });
});
