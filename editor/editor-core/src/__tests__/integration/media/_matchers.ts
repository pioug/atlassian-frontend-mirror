declare global {
  // eslint-disable-next-line
  namespace jest {
    interface Matchers<R> {
      toBeAroundNumber(received: number, expected: number, delta?: number): R;
      toBeOneOf(received: any, items: Array<any>): R;
    }
    interface Expect {
      toBeAroundNumber(expected: number, delta?: number): any;
      toBeOneOf(items: Array<any>): any;
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

export const toBeOneOfMatchers: jest.ExpectExtendMap = {
  toBeOneOf(received: any, items: Array<any>) {
    const pass = items.includes(received);
    const message = () =>
      `expected ${received} to be contained in array [${items}]`;
    if (pass) {
      return {
        message,
        pass: true,
      };
    }
    return {
      message,
      pass: false,
    };
  },
};
