const mockGetWidth = jest.fn();

jest.mock('../use-container-width', () => () => ({
  containerWidth: mockGetWidth(),
  ContainerWidthMonitor: jest.fn(),
}));

import { renderHook } from '@testing-library/react-hooks';
import { DEVICE_BREAKPOINT_NUMBERS } from '../../constants';
import useContainerWidth from '../use-container-width';

describe('useContainerWidth', () => {
  it('returns the right measured container width', () => {
    mockGetWidth.mockReturnValueOnce(DEVICE_BREAKPOINT_NUMBERS.small);
    const {
      result: {
        current: { containerWidth },
      },
    } = renderHook(() => useContainerWidth());
    expect(containerWidth).toStrictEqual(DEVICE_BREAKPOINT_NUMBERS.small);
  });
});
