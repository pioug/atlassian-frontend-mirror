const getWidth = jest.fn();

jest.mock('../hooks/useContainerWidth', () => () => ({
  containerWidth: getWidth(),
  ContainerWidthMonitor: jest.fn(),
}));

import { renderHook } from '@testing-library/react-hooks';
import { DEVICE_BREAKPOINT_NUMBERS } from '../constants';
import useContainerWidth from '../hooks/useContainerWidth';

describe('useContainerWidth', () => {
  it('returns the right measured container width', () => {
    getWidth.mockReturnValueOnce(DEVICE_BREAKPOINT_NUMBERS.small);
    const {
      result: {
        current: { containerWidth },
      },
    } = renderHook(() => useContainerWidth());
    expect(containerWidth).toStrictEqual(DEVICE_BREAKPOINT_NUMBERS.small);
  });
});
