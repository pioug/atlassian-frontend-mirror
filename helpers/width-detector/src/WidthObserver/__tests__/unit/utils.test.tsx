/* eslint-disable no-global-assign */
import { getIEVersion } from '../../utils';

interface Document {
  documentMode?: any;
}

let initialUserAgent: string;
let initialDocumentMode: string;

beforeAll(() => {
  initialUserAgent = navigator.userAgent;
  initialDocumentMode = (document as Document).documentMode;
});

afterAll(() => {
  Object.defineProperty(navigator, 'userAgent', {
    value: initialUserAgent,
    configurable: true,
  });
  Object.defineProperty(document, 'documentMode', {
    value: initialDocumentMode,
    configurable: true,
  });
});

const mockUserAgent = (value: string) => {
  Object.defineProperty(navigator, 'userAgent', {
    value,
    configurable: true,
  });
};

describe('getIEVersion', () => {
  it('should return IE 6', () => {
    mockUserAgent('Mozilla/4.0 (compatible; MSIE 6.0; Windows NT 5.1; SV1)');
    expect(getIEVersion()).toEqual(6);
  });

  it('should return IE 7 when documentMode exists', () => {
    mockUserAgent('Mozilla/4.0 (compatible; MSIE 6.0; Windows NT 5.1; SV1)');
    Object.defineProperty(document, 'documentMode', {
      value: 7,
      configurable: true,
    });
    expect(getIEVersion()).toEqual(7);
  });

  it('should return 11', () => {
    mockUserAgent(
      'Mozilla/5.0 CK={} (Windows NT 6.1; WOW64; Trident/7.0; rv:11.0) like Gecko',
    );
    expect(getIEVersion()).toEqual(11);
  });

  it('should return 12', () => {
    mockUserAgent(
      'Mozilla/5.0 CK={} (Windows NT 6.1; WOW64; Trident/7.0; rv:12.0) like Gecko',
    );
    expect(getIEVersion()).toEqual(12);
  });

  it('should return edge number', () => {
    mockUserAgent(
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/64.0.3282.140 Safari/537.36 Edge/17.17134',
    );
    expect(getIEVersion()).toEqual(17);
  });

  it('should return null for chrome', () => {
    mockUserAgent(
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/74.0.3729.169 Safari/537.36',
    );
    expect(getIEVersion()).toEqual(null);
  });

  it('should return null for firefox', () => {
    mockUserAgent(
      'Mozilla/5.0 (Windows NT 6.1; WOW64; rv:54.0) Gecko/20100101 Firefox/54.0',
    );
    expect(getIEVersion()).toEqual(null);
  });
});
