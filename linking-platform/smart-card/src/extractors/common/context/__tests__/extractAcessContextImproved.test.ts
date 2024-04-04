import { extractRequestAccessContextImproved } from '../extractAccessContext';
import { JsonLd } from 'json-ld-types';
import { TEST_META_DATA, TEST_VISIT_URL } from '../../__mocks__/jsonld';
import { ANALYTICS_CHANNEL } from '../../../../utils/analytics';
import '@atlaskit/link-test-helpers/jest';

describe('extractors.access.context', () => {
  afterEach(() => jest.clearAllMocks());

  it('returns undefined if no request access context', () => {
    expect(
      extractRequestAccessContextImproved({
        jsonLd: TEST_META_DATA,
        url: TEST_VISIT_URL,
        product: 'mock-product',
        createAnalyticsEvent: jest.fn(),
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
        createAnalyticsEvent: jest.fn(),
      }),
    ).toEqual({
      accessType: 'invalid',
      hostname: 'visit.url.com',
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
        createAnalyticsEvent: jest.fn(),
      }),
    ).toMatchObject({
      accessType: 'DIRECT_ACCESS',
      titleMessageKey: 'direct_access_title',
      descriptiveMessageKey: 'direct_access_description',
      callToActionMessageKey: 'direct_access',
      action: {
        buttonAppearance: 'default',
        id: 'direct_access',
        promise: expect.any(Function),
        text: expect.any(Object),
      },
      hostname: 'visit.url.com',
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
        createAnalyticsEvent: jest.fn(),
      }),
    ).toMatchObject({
      accessType: 'REQUEST_ACCESS',
      titleMessageKey: 'default_no_access_title',
      descriptiveMessageKey: 'request_access_description',
      callToActionMessageKey: 'request_access',
      action: {
        buttonAppearance: 'default',
        id: 'request_access',
        promise: expect.any(Function),
        text: expect.any(Object),
      },
      hostname: 'visit.url.com',
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
        createAnalyticsEvent: jest.fn(),
      }),
    ).toMatchObject({
      accessType: 'PENDING_REQUEST_EXISTS',
      titleMessageKey: 'request_access_pending_title',
      descriptiveMessageKey: 'request_access_pending_description',
      callToActionMessageKey: 'request_access_pending',
      action: {
        buttonAppearance: 'default',
        id: 'request_access_pending',
        promise: expect.any(Function),
        text: expect.any(Object),
      },
      hostname: 'visit.url.com',
      buttonDisabled: true,
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
        createAnalyticsEvent: jest.fn(),
      }),
    ).toMatchObject({
      accessType: 'FORBIDDEN',
      titleMessageKey: 'forbidden_title',
      descriptiveMessageKey: 'forbidden_description',
      hostname: 'visit.url.com',
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
        createAnalyticsEvent: jest.fn(),
      }),
    ).toMatchObject({
      accessType: 'DENIED_REQUEST_EXISTS',
      titleMessageKey: 'forbidden_title',
      descriptiveMessageKey: 'request_denied_description',
      hostname: 'visit.url.com',
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
        createAnalyticsEvent: jest.fn(),
      }),
    ).toMatchObject({
      accessType: 'ACCESS_EXISTS',
      titleMessageKey: 'forbidden_title',
      descriptiveMessageKey: 'access_exists_description',
      action: {
        buttonAppearance: 'default',
        id: 'access_exists',
        promise: expect.any(Function),
        text: expect.any(Object),
      },
      hostname: 'visit.url.com',
    });
  });

  it('returns access exists metadata with not found context', () => {
    const jsonLd: JsonLd.Meta.BaseMeta = {
      ...TEST_META_DATA,
      visibility: 'not_found',
      requestAccess: {
        accessType: 'ACCESS_EXISTS',
      },
    };

    expect(
      extractRequestAccessContextImproved({
        jsonLd,
        url: TEST_VISIT_URL,
        product: 'mock-product',
        createAnalyticsEvent: jest.fn(),
      }),
    ).toMatchObject({
      accessType: 'ACCESS_EXISTS',
      titleMessageKey: 'not_found_title',
      descriptiveMessageKey: 'not_found_description',
      hostname: 'visit.url.com',
    });
  });

  it('an analytics event is invoked when the request access type is REQUEST_ACCESS and createAnalyticsEvent is supplied', async () => {
    window.open = jest.fn();

    const jsonLd = { ...TEST_META_DATA };
    jsonLd.requestAccess = {
      accessType: 'REQUEST_ACCESS',
    };

    const createAnalyticsEventMock = jest.fn();
    const fireMock = jest.fn();
    createAnalyticsEventMock.mockReturnValue({
      fire: fireMock,
    });

    const requestAccessContext = extractRequestAccessContextImproved({
      jsonLd,
      url: TEST_VISIT_URL,
      product: 'mock-product',
      createAnalyticsEvent: createAnalyticsEventMock,
    });

    await requestAccessContext.action?.promise();

    expect(createAnalyticsEventMock).toHaveBeenCalledWith({
      action: 'clicked',
      actionSubject: 'button',
      actionSubjectId: 'requestAccess',
      eventType: 'ui',
    });

    expect(fireMock).toHaveBeenCalledWith(ANALYTICS_CHANNEL);
  });

  it('an analytics event is invoked when the request access type is DIRECT_ACCESS and createAnalyticsEvent is supplied', async () => {
    window.open = jest.fn();

    const jsonLd = { ...TEST_META_DATA };
    jsonLd.requestAccess = {
      accessType: 'DIRECT_ACCESS',
    };

    const createAnalyticsEventMock = jest.fn();
    const fireMock = jest.fn();
    createAnalyticsEventMock.mockReturnValue({
      fire: fireMock,
    });

    const requestAccessContext = extractRequestAccessContextImproved({
      jsonLd,
      url: TEST_VISIT_URL,
      product: 'mock-product',
      createAnalyticsEvent: createAnalyticsEventMock,
    });

    await requestAccessContext.action?.promise();

    expect(createAnalyticsEventMock).toHaveBeenCalledWith({
      action: 'clicked',
      actionSubject: 'button',
      actionSubjectId: 'crossJoin',
      eventType: 'ui',
    });

    expect(fireMock).toHaveBeenCalledWith(ANALYTICS_CHANNEL);
  });
});
