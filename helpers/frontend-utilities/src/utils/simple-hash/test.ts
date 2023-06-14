import { simpleHash } from './index';

describe('simpleHash', () => {
  test('generates the same hash for the same input', () => {
    const input = 'Hello, World!';
    expect(simpleHash(input)).toEqual(simpleHash(input));
  });

  test('generates different hashes for different inputs', () => {
    const input1 = 'Hello, World!';
    const input2 = 'Hello, Jest!';
    expect(simpleHash(input1)).not.toEqual(simpleHash(input2));
  });
});
