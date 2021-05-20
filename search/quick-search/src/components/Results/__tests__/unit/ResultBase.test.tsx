import { mount, ReactWrapper } from 'enzyme';
import React from 'react';
import ResultBase from '../../ResultBase';
import ResultItem from '../../../ResultItem/ResultItem';
import { ResultContextType } from '../../../context';

describe('Result Base', () => {
  let resultWrapper: ReactWrapper;
  beforeEach(() => {
    const context: ResultContextType = {
      registerResult: () => {},
      unregisterResult: () => {},
      onMouseEnter: () => {},
      onMouseLeave: () => {},
      sendAnalytics: () => {},
      getIndex: (n) => Number(n),
    };

    resultWrapper = mount(
      <ResultBase
        text=""
        resultId="testResult"
        type="base"
        isCompact={false}
        onClick={() => {}}
        context={context}
      />,
    );
  });

  it('should pass { `resultId`,  `type` } to onClick handler', () => {
    const spy = jest.fn();
    resultWrapper.setProps({ onClick: spy });
    const resultItem = resultWrapper.find(ResultItem);
    expect(resultItem).toHaveLength(1);
    const onClick = resultItem.prop('onClick');
    expect(onClick).toBeInstanceOf(Function);
    const mockedEvent = { preventDefault() {} } as MouseEvent;
    if (onClick) {
      onClick(mockedEvent);
    }
    expect(spy).toBeCalledWith({
      resultId: 'testResult',
      type: 'base',
      event: mockedEvent,
    });
  });

  it('should pass { `resultId`,  `type` } to onMouseEnter handler', () => {
    const spy = jest.fn();
    resultWrapper.setProps({
      context: {
        onMouseEnter: spy,
        registerResult: () => {},
      },
    });

    const resultItem = resultWrapper.find(ResultItem);
    expect(resultItem).toHaveLength(1);
    const onMouseEnter = resultItem.prop('onMouseEnter');
    expect(onMouseEnter).toBeInstanceOf(Function);
    const mockedEvent = { preventDefault() {} } as MouseEvent;
    if (onMouseEnter) {
      onMouseEnter(mockedEvent);
    }
    expect(spy).toBeCalledWith({
      resultId: 'testResult',
      type: 'base',
      event: mockedEvent,
    });
  });

  it('should unregister itself on unmount event', () => {
    const unregisterResult = jest.fn();
    resultWrapper.setProps({
      context: {
        unregisterResult,
        registerResult: () => {},
      },
    });

    resultWrapper.unmount();

    expect(unregisterResult).toHaveBeenCalledTimes(1);
    expect(unregisterResult.mock.calls[0][0].constructor.name).toBe(
      'ResultBase',
    );
  });

  it('should register itself on mount event', () => {
    const registerResult = jest.fn();
    resultWrapper.setProps({
      context: {
        registerResult,
        unregisterResult: () => {},
      },
    });
    expect(registerResult).toHaveBeenCalledTimes(1);
    expect(registerResult.mock.calls[0][0].constructor.name).toBe('ResultBase');
  });
});
