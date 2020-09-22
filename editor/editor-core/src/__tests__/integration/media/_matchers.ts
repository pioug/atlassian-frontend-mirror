declare global {
  // eslint-disable-next-line
  namespace jest {
    interface Matchers<R> {
      toBeAroundNumber(received: number, expected: number, delta?: number): R;
    }
    interface Expect {
      toBeAroundNumber(expected: number, delta?: number): any;
    }
  }
}

export const withInRangeMatchers: jest.ExpectExtendMap = {
  toBeAroundNumber(received: number, expected: number, delta: number = 2) {
    const pass = received >= expected - delta && received <= expected + delta;
    return {
      message: () =>
        `expected ${received} ${
          pass ? ' not' : ''
        } to be around ${expected} (+- ${delta})`,
      pass,
    };
  },
};
