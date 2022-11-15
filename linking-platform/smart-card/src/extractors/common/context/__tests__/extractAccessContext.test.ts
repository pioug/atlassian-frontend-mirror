import { extractRequestAccessContext } from '../extractAccessContext';
import { TEST_META_DATA, TEST_VISIT_URL } from '../../__mocks__/jsonld';

describe('extractors.access.context', () => {
  afterEach(() => jest.clearAllMocks());

  it('returns undefined if no request access context', () => {
    expect(
      extractRequestAccessContext({
        jsonLd: TEST_META_DATA,
        url: TEST_VISIT_URL,
      }),
    ).toEqual(undefined);
  });

  it('returns original object if request access type is not valid', () => {
    const jsonLd = { ...TEST_META_DATA };
    jsonLd.requestAccess = {
      accessType: 'invalid',
    };
    expect(
      extractRequestAccessContext({
        jsonLd,
        url: TEST_VISIT_URL,
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
      extractRequestAccessContext({
        jsonLd,
        url: TEST_VISIT_URL,
      }),
    ).toMatchObject({
      accessType: 'DIRECT_ACCESS',
      callToActionMessageKey: 'click_to_join',
      descriptiveMessageKey: 'click_to_join_description',
      action: {
        buttonAppearance: 'default',
        id: 'click_to_join',
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
      extractRequestAccessContext({
        jsonLd,
        url: TEST_VISIT_URL,
      }),
    ).toMatchObject({
      accessType: 'REQUEST_ACCESS',
      callToActionMessageKey: 'request_access',
      descriptiveMessageKey: 'request_access_description',
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
      extractRequestAccessContext({
        jsonLd,
        url: TEST_VISIT_URL,
      }),
    ).toMatchObject({
      accessType: 'PENDING_REQUEST_EXISTS',
      descriptiveMessageKey: 'request_access_pending_description',
    });
  });

  it('returns forbidden metadata if request access type is forbidden', () => {
    const jsonLd = { ...TEST_META_DATA };
    jsonLd.requestAccess = {
      accessType: 'FORBIDDEN',
    };
    expect(
      extractRequestAccessContext({
        jsonLd,
        url: TEST_VISIT_URL,
      }),
    ).toMatchObject({
      accessType: 'FORBIDDEN',
      descriptiveMessageKey: 'forbidden_description',
    });
  });

  it('returns denied metadata if request access type is denied', () => {
    const jsonLd = { ...TEST_META_DATA };
    jsonLd.requestAccess = {
      accessType: 'DENIED_REQUEST_EXISTS',
    };
    expect(
      extractRequestAccessContext({
        jsonLd,
        url: TEST_VISIT_URL,
      }),
    ).toMatchObject({
      accessType: 'DENIED_REQUEST_EXISTS',
      descriptiveMessageKey: 'request_denied_description',
    });
  });
});
