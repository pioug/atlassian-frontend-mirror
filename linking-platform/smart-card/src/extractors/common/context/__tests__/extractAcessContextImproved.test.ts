import { extractRequestAccessContextImproved } from '../extractAccessContext';
import { TEST_META_DATA, TEST_VISIT_URL } from '../../__mocks__/jsonld';

describe('extractors.access.context', () => {
  afterEach(() => jest.clearAllMocks());

  it('returns undefined if no request access context', () => {
    expect(
      extractRequestAccessContextImproved({
        jsonLd: TEST_META_DATA,
        url: TEST_VISIT_URL,
        product: 'mock-product',
      }),
    ).toEqual(undefined);
  });

  it('returns original object if request access type is not valid', () => {
    const jsonLd = { ...TEST_META_DATA };
    jsonLd.requestAccess = {
      accessType: 'invalid',
    };
    expect(
      extractRequestAccessContextImproved({
        jsonLd,
        url: TEST_VISIT_URL,
        product: 'mock-product',
      }),
    ).toEqual({
      accessType: 'invalid',
    });
  });

  it('returns direct access metadata if request access type is direct access', () => {
    const jsonLd = { ...TEST_META_DATA };
    jsonLd.requestAccess = {
      accessType: 'DIRECT_ACCESS',
    };
    expect(
      extractRequestAccessContextImproved({
        jsonLd,
        url: TEST_VISIT_URL,
        product: 'mock-product',
      }),
    ).toMatchObject({
      accessType: 'DIRECT_ACCESS',
      titleMessageKey: 'direct_access_title_crossjoin',
      descriptiveMessageKey: 'direct_access_description_crossjoin',
      callToActionMessageKey: 'direct_access_crossjoin',
      action: {
        buttonAppearance: 'default',
        id: 'direct_access',
        promise: expect.any(Function),
        text: expect.any(Object),
      },
    });
  });

  it('returns request access metadata if request access type is request access', () => {
    const jsonLd = { ...TEST_META_DATA };
    jsonLd.requestAccess = {
      accessType: 'REQUEST_ACCESS',
    };
    expect(
      extractRequestAccessContextImproved({
        jsonLd,
        url: TEST_VISIT_URL,
        product: 'mock-product',
      }),
    ).toMatchObject({
      accessType: 'REQUEST_ACCESS',
      titleMessageKey: 'default_no_access_title_crossjoin',
      descriptiveMessageKey: 'request_access_description_crossjoin',
      callToActionMessageKey: 'request_access_crossjoin',
      action: {
        buttonAppearance: 'default',
        id: 'request_access',
        promise: expect.any(Function),
        text: expect.any(Object),
      },
    });
  });

  it('returns pending request exists metadata if request access type is pending request exists', () => {
    const jsonLd = { ...TEST_META_DATA };
    jsonLd.requestAccess = {
      accessType: 'PENDING_REQUEST_EXISTS',
    };
    expect(
      extractRequestAccessContextImproved({
        jsonLd,
        url: TEST_VISIT_URL,
        product: 'mock-product',
      }),
    ).toMatchObject({
      accessType: 'PENDING_REQUEST_EXISTS',
      titleMessageKey: 'request_access_pending_title_crossjoin',
      descriptiveMessageKey: 'request_access_pending_description_crossjoin',
      callToActionMessageKey: 'request_access_pending_crossjoin',
      action: {
        buttonAppearance: 'default',
        id: 'request_access_pending',
        promise: expect.any(Function),
        text: expect.any(Object),
      },
    });
  });

  it('returns forbidden metadata if request access type is forbidden', () => {
    const jsonLd = { ...TEST_META_DATA };
    jsonLd.requestAccess = {
      accessType: 'FORBIDDEN',
    };
    expect(
      extractRequestAccessContextImproved({
        jsonLd,
        url: TEST_VISIT_URL,
        product: 'mock-product',
      }),
    ).toMatchObject({
      accessType: 'FORBIDDEN',
      titleMessageKey: 'forbidden_title_crossjoin',
      descriptiveMessageKey: 'forbidden_description_crossjoin',
    });
  });

  it('returns denied metadata if request access type is denied', () => {
    const jsonLd = { ...TEST_META_DATA };
    jsonLd.requestAccess = {
      accessType: 'DENIED_REQUEST_EXISTS',
    };
    expect(
      extractRequestAccessContextImproved({
        jsonLd,
        url: TEST_VISIT_URL,
        product: 'mock-product',
      }),
    ).toMatchObject({
      accessType: 'DENIED_REQUEST_EXISTS',
      titleMessageKey: 'default_no_access_title_crossjoin',
      descriptiveMessageKey: 'request_denied_description_crossjoin',
    });
  });

  it('returns access exists metadata if request access type is access exists', () => {
    const jsonLd = { ...TEST_META_DATA };
    jsonLd.requestAccess = {
      accessType: 'ACCESS_EXISTS',
    };
    expect(
      extractRequestAccessContextImproved({
        jsonLd,
        url: TEST_VISIT_URL,
        product: 'mock-product',
      }),
    ).toMatchObject({
      accessType: 'ACCESS_EXISTS',
      titleMessageKey: 'default_no_access_title_crossjoin',
      descriptiveMessageKey: 'access_exists_description_crossjoin',
      action: {
        buttonAppearance: 'default',
        id: 'access_exists',
        promise: expect.any(Function),
        text: expect.any(Object),
      },
    });
  });
});
