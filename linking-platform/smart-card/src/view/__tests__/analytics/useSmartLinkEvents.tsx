import { useSmartLinkEvents, SmartLinkEvents } from '../../..';
import { renderHook } from '@testing-library/react-hooks';

describe('useSmartLinkEvents hook', () => {
  it('renders custom hook', () => {
    const { result } = renderHook(() => useSmartLinkEvents());
    expect(result.current).toBeInstanceOf(SmartLinkEvents);
  });
});
