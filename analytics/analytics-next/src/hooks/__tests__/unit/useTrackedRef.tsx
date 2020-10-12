import React, { MutableRefObject, useCallback } from 'react';

import { fireEvent, render } from '@testing-library/react';

import { useTrackedRef } from '../../useTrackedRef';

const ComponentUsingHook = ({
  data,
  callback,
}: {
  data: string;
  callback: (data: MutableRefObject<string>) => void;
}) => {
  const dataRef = useTrackedRef(data);

  const onClick = useCallback(() => {
    callback(dataRef);
  }, [dataRef, callback]);

  return <button onClick={onClick}>Button</button>;
};

describe('useTrackedRef', () => {
  it('should return a reference that tracks the last value rendered', () => {
    const callback = jest.fn();

    const { rerender, getByText } = render(
      <ComponentUsingHook data="firstValue" callback={callback} />,
    );

    fireEvent.click(getByText('Button'));

    expect(callback).toBeCalled();

    const ref = callback.mock.calls[0][0];
    expect(ref.current).toBe('firstValue');

    callback.mockReset();

    rerender(<ComponentUsingHook data="secondValue" callback={callback} />);

    fireEvent.click(getByText('Button'));

    expect(callback).toBeCalledWith(ref);
    expect(ref.current).toBe('secondValue');
  });
});
