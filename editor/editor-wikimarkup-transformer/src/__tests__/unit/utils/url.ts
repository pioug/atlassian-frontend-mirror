import { decode } from '../../../parser/utils/url';

const raw =
  'https://example.com/test%2C,%20, space?qu ery=some%20text&query=a%20a,b b,c%2Cc#d,e%2Ce f%20g';
const origURL = window.URL;
const origCreateElement = document.createElement;

describe(`Decoding url`, () => {
  afterEach(() => {
    // @ts-ignore
    window.URL = origURL;
    document.createElement = origCreateElement;
  });

  it(`URL class does not exist`, () => {
    const mockCreateElement = jest.fn();
    // @ts-ignore
    window.URL = undefined;
    // @ts-ignore
    document.createElement = (...args: any) => {
      mockCreateElement();
      return origCreateElement.apply(document, args);
    };
    expect(decode(raw)).toMatchSnapshot();
    expect(mockCreateElement).toHaveBeenCalledTimes(1);
  });

  it(`URL class does not have a href property`, () => {
    const mockCreateElement = jest.fn();
    const mockCtor = jest.fn();
    // @ts-ignore
    window.URL = function(...args: any) {
      mockCtor();
    };
    // @ts-ignore
    document.createElement = (...args: any) => {
      mockCreateElement();
      return origCreateElement.apply(document, args);
    };
    expect(decode(raw)).toMatchSnapshot();
    expect(mockCreateElement).toHaveBeenCalledTimes(1);
    expect(mockCtor).toHaveBeenCalledTimes(1);
  });

  it(`URL class is used if it exists`, () => {
    const mockCreateElement = jest.fn();
    const mockCtor = jest.fn();
    // @ts-ignore
    window.URL = function(...args: any) {
      mockCtor();
      return new origURL(args);
    };
    // @ts-ignore
    document.createElement = (...args: any) => {
      mockCreateElement();
      return origCreateElement.apply(document, args);
    };
    expect(decode(raw)).toMatchSnapshot();
    expect(mockCreateElement).toHaveBeenCalledTimes(0);
    expect(mockCtor).toHaveBeenCalledTimes(1);
  });
});
