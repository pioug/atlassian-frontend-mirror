import { renderHook } from '@testing-library/react-hooks';
import fetchMock from 'jest-fetch-mock';
import { useAISummary } from '../index';
import TestRenderer from 'react-test-renderer';
const { act } = TestRenderer;

describe('useAISummary', () => {
  beforeEach(() => {
    fetchMock.resetMocks();
  });

  it('sets status on summariseUrl error', async () => {
    fetchMock.mockRejectOnce(new Error('foo'));
    const { result } = renderHook(() => useAISummary({ url: 'test-url' }));
    await act(async () => {
      await result.current.summariseUrl();
    });
    expect(result.current.state?.status).toBe('error');
    expect(result.current.state?.content).toBe('');
  });
});
