import { getTraceId } from './get-trace-id';

describe('getTraceId', () => {
  test("returns null if expected trace id headers don't exist", () => {
    expect(getTraceId(new Response('', { headers: { bla: '1' } }))).toBeNull();
  });

  test('returns traceId from x-trace-id header', () => {
    expect(
      getTraceId(
        new Response('', { headers: { 'x-trace-id': 'mock-trace-id' } }),
      ),
    ).toEqual('mock-trace-id');
  });

  test('returns traceId from alt-trace-id header', () => {
    expect(
      getTraceId(
        new Response('', { headers: { 'atl-traceid': 'mock-trace-id' } }),
      ),
    ).toEqual('mock-trace-id');
  });

  test('returns traceId from x-trace-id header ignoring case-sensitivity of the header', () => {
    expect(
      getTraceId(
        new Response('', { headers: { 'X-Trace-Id': 'mock-trace-id' } }),
      ),
    ).toEqual('mock-trace-id');
  });

  test('returns traceId from alt-trace-id header ignoring case-sensitivity of the header', () => {
    expect(
      getTraceId(
        new Response('', { headers: { 'Atl-Traceid': 'mock-trace-id' } }),
      ),
    ).toEqual('mock-trace-id');
  });

  test('returns null if a trace id header does not exist', () => {
    expect(getTraceId(new Response('', { headers: {} }))).toBeNull();
  });
});
