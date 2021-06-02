import { waitUntil } from '@atlaskit/elements-test-helpers';
import {
  OnProviderChange,
  SecurityOptions,
  ServiceConfig,
} from '@atlaskit/util-service-support';
import 'es6-promise/auto'; // 'whatwg-fetch' needs a Promise polyfill

import fetchMock from 'fetch-mock/cjs/client';
import * as sinon from 'sinon';
import EmojiResource, {
  EmojiProvider,
  EmojiResourceConfig,
  supportsUploadFeature,
  UploadingEmojiProvider,
} from '../../../api/EmojiResource';
import SiteEmojiResource from '../../../api/media/SiteEmojiResource';
import { selectedToneStorageKey } from '../../../util/constants';
import {
  EmojiDescription,
  EmojiId,
  EmojiSearchResult,
  EmojiUpload,
  SearchOptions,
  ToneSelection,
} from '../../../types';
import {
  evilburnsEmoji,
  grinEmoji,
  mediaEmoji,
  siteServiceEmojis,
  siteUrl,
  standardServiceEmojis,
} from '../_test-data';
import { alwaysPromise } from '../_test-util';

// used to access window.localStorage in tests below
declare var global: any;

const baseUrl = 'https://bogus/';
const p1Url = 'https://p1/';

const defaultSecurityHeader = 'X-Bogus';

const header = (code: string | number): SecurityOptions => ({
  headers: {
    [defaultSecurityHeader]: code,
  },
});

const defaultSecurityCode = '10804';

const provider1: ServiceConfig = {
  url: p1Url,
  securityProvider: () => header(defaultSecurityCode),
};

const defaultApiConfig: EmojiResourceConfig = {
  recordConfig: {
    url: baseUrl,
    securityProvider() {
      return header(defaultSecurityCode);
    },
  },
  providers: [provider1],
};

const providerServiceData1 = standardServiceEmojis;

describe('UploadingEmojiResource', () => {
  beforeEach(() => {
    fetchMock.mock({
      matcher: `begin:${provider1.url}`,
      response: providerServiceData1,
    });
  });

  afterEach(() => {
    fetchMock.restore();
  });

  class TestUploadingEmojiResource extends EmojiResource {
    private mockSiteEmojiResource?: SiteEmojiResource;

    constructor(
      mockSiteEmojiResource?: SiteEmojiResource,
      config?: EmojiResourceConfig,
    ) {
      super({
        providers: [provider1],
        allowUpload: true,
        ...config,
      });
      this.mockSiteEmojiResource = mockSiteEmojiResource;
    }

    protected initSiteEmojiResource() {
      this.siteEmojiResource = this.mockSiteEmojiResource;
      return Promise.resolve();
    }
  }

  describe('#isUploadSupported', () => {
    it('resource has custom emoji with media support and upload token', () => {
      const siteEmojiResource = sinon.createStubInstance(
        SiteEmojiResource,
      ) as any;
      const hasUploadTokenStub = siteEmojiResource.hasUploadToken;
      hasUploadTokenStub.returns(Promise.resolve(true));
      const config: EmojiResourceConfig = {
        allowUpload: true,
      } as EmojiResourceConfig;

      const emojiResource = new TestUploadingEmojiResource(
        siteEmojiResource,
        config,
      );

      return emojiResource.isUploadSupported().then((supported) => {
        expect(supported).toEqual(true);
      });
    });

    it('should not allow upload if no upload token', () => {
      const siteEmojiResource = sinon.createStubInstance(
        SiteEmojiResource,
      ) as any;
      const hasUploadTokenStub = siteEmojiResource.hasUploadToken;
      hasUploadTokenStub.returns(Promise.resolve(false));
      const config: EmojiResourceConfig = {
        allowUpload: true,
      } as EmojiResourceConfig;

      const emojiResource = new TestUploadingEmojiResource(
        siteEmojiResource,
        config,
      );
      return emojiResource.isUploadSupported().then((supported) => {
        expect(supported).toEqual(false);
      });
    });

    it('resource has no media support', () => {
      const emojiResource = new TestUploadingEmojiResource();
      return emojiResource.isUploadSupported().then((supported) => {
        expect(supported).toEqual(false);
      });
    });

    it('allowUpload is false', () => {
      const emojiResource = new TestUploadingEmojiResource(
        sinon.createStubInstance(SiteEmojiResource) as any,
        { allowUpload: false } as EmojiResourceConfig,
      );
      return emojiResource.isUploadSupported().then((supported) => {
        expect(supported).toEqual(false);
      });
    });
  });

  describe('#uploadCustomEmoji', () => {
    const upload = {
      name: 'cheese',
      shortName: ':cheese:',
      filename: 'cheese.png',
      dataURL: 'data:blah',
      width: 32,
      height: 32,
    };

    it('no media support - throw error', () => {
      const emojiResource = new TestUploadingEmojiResource();
      return emojiResource
        .uploadCustomEmoji(upload)
        .then(() => {
          expect(true).toEqual(false);
        })
        .catch(() => {
          expect(true).toEqual(true);
        });
    });

    it('media support - upload successful', () => {
      const siteEmojiResource = sinon.createStubInstance(
        SiteEmojiResource,
      ) as any;
      const hasUploadTokenStub = siteEmojiResource.hasUploadToken;
      hasUploadTokenStub.returns(Promise.resolve(true));
      const uploadEmojiStub = siteEmojiResource.uploadEmoji;
      uploadEmojiStub.returns(Promise.resolve(mediaEmoji));

      const emojiResource = new TestUploadingEmojiResource(siteEmojiResource);

      return emojiResource.uploadCustomEmoji(upload).then((emoji) => {
        expect(uploadEmojiStub.calledWith(upload)).toEqual(true);
        expect(emoji).toEqual(mediaEmoji);
      });
    });

    it('media support - upload error', () => {
      const siteEmojiResource = sinon.createStubInstance(
        SiteEmojiResource,
      ) as any;
      const hasUploadTokenStub = siteEmojiResource.hasUploadToken;
      hasUploadTokenStub.returns(Promise.resolve(true));
      const uploadEmojiStub = siteEmojiResource.uploadEmoji;
      uploadEmojiStub.returns(Promise.reject('bad things'));

      const emojiResource = new TestUploadingEmojiResource(siteEmojiResource);
      return emojiResource
        .uploadCustomEmoji(upload)
        .then(() => {
          expect(true).toEqual(false);
        })
        .catch(() => {
          expect(uploadEmojiStub.calledWith(upload)).toEqual(true);
          expect(true).toEqual(true);
        });
    });
  });

  describe('#prepareForUpload', () => {
    it('no media support - no error', () => {
      const emojiResource = new TestUploadingEmojiResource();
      emojiResource.prepareForUpload();
      expect(true).toEqual(true);
    });

    it('media support - token primed', () => {
      const siteEmojiResource = sinon.createStubInstance(
        SiteEmojiResource,
      ) as any;
      const prepareForUploadStub = siteEmojiResource.prepareForUpload;
      const emojiResource = new TestUploadingEmojiResource(siteEmojiResource);
      emojiResource.prepareForUpload();
      return waitUntil(() => prepareForUploadStub.called).then(() => {
        expect(prepareForUploadStub.called).toEqual(true);
      });
    });
  });

  describe('#deleteSiteEmoji', () => {
    it('calls delete in SiteEmojiResource', () => {
      const siteEmojiResource = sinon.createStubInstance(
        SiteEmojiResource,
      ) as any;
      const emojiResource = new TestUploadingEmojiResource(siteEmojiResource);
      const deleteStub = siteEmojiResource.deleteEmoji;
      deleteStub.returns(new Promise(() => {}));
      emojiResource.deleteSiteEmoji(mediaEmoji);
      return waitUntil(() => deleteStub.called).then(() => {
        expect(deleteStub.called).toEqual(true);
      });
    });

    it('can find mediaEmoji by id if not yet deleted', () => {
      fetchMock.mock({
        matcher: `begin:${siteUrl}`,
        response: siteServiceEmojis(),
        times: 1,
      });

      const config = {
        providers: [
          {
            url: siteUrl,
          },
        ],
      };
      const siteEmojiResource = sinon.createStubInstance(
        SiteEmojiResource,
      ) as any;
      siteEmojiResource.deleteEmoji = () => Promise.resolve(true);
      const emojiResource = new TestUploadingEmojiResource(
        siteEmojiResource,
        config,
      );
      return alwaysPromise(emojiResource.findById(mediaEmoji.id!))
        .then((emoji) => expect(emoji).toEqual(mediaEmoji))
        .catch(() => expect(true).toEqual(false));
    });

    it('removes the deleted emoji from the emoji repository', () => {
      fetchMock.mock({
        matcher: `begin:${siteUrl}`,
        response: siteServiceEmojis(),
        times: 1,
      });

      const config = {
        providers: [
          {
            url: siteUrl,
          },
        ],
      };
      const siteEmojiResource = sinon.createStubInstance(
        SiteEmojiResource,
      ) as any;
      siteEmojiResource.deleteEmoji = () => Promise.resolve(true);
      const emojiResource = new TestUploadingEmojiResource(
        siteEmojiResource,
        config,
      );
      return emojiResource
        .deleteSiteEmoji(mediaEmoji)
        .then((result) => {
          expect(result).toEqual(true);
          const emojiPromise = alwaysPromise(
            emojiResource.findById(mediaEmoji.id!),
          );
          return emojiPromise.then((emoji) => expect(emoji).toEqual(undefined));
        })
        .catch(() => expect(true).toEqual(false));
    });
  });
});

describe('#toneSelectionStorage', () => {
  it('retrieves previously stored tone selection upon construction', () => {
    // eslint-disable-next-line no-unused-expressions
    new EmojiResource(defaultApiConfig);

    global
      .expect(localStorage.getItem)
      .toHaveBeenCalledWith(selectedToneStorageKey);
  });

  it('calling setSelectedTone calls setItem in localStorage', () => {
    const resource = new EmojiResource(defaultApiConfig);
    const tone = 3;
    resource.setSelectedTone(tone);

    global
      .expect(localStorage.setItem)
      .toHaveBeenCalledWith(selectedToneStorageKey, '' + tone);
  });
});

describe('helpers', () => {
  class TestEmojiProvider implements EmojiProvider {
    getAsciiMap = () =>
      Promise.resolve(new Map([[grinEmoji.ascii![0], grinEmoji]]));
    findByShortName = (_shortName: string) => Promise.resolve(evilburnsEmoji);
    findByEmojiId = (_emojiId: EmojiId) => Promise.resolve(evilburnsEmoji);
    findById = (_emojiIdStr: string) => Promise.resolve(evilburnsEmoji);
    findInCategory = (_categoryId: string) => Promise.resolve([]);
    getSelectedTone = () => -1;
    setSelectedTone = (_tone: ToneSelection) => {};
    deleteSiteEmoji = (_emoji: EmojiDescription) => Promise.resolve(false);
    getCurrentUser = () => undefined;
    filter = (_query?: string, _options?: SearchOptions) => {};
    subscribe = (
      _onChange: OnProviderChange<EmojiSearchResult, any, void>,
    ) => {};
    unsubscribe = (
      _onChange: OnProviderChange<EmojiSearchResult, any, void>,
    ) => {};
    loadMediaEmoji = () => undefined;
    optimisticMediaRendering = () => false;
    getFrequentlyUsed = (_options?: SearchOptions) => Promise.resolve([]);
  }

  class TestUploadingEmojiProvider
    extends TestEmojiProvider
    implements UploadingEmojiProvider {
    isUploadSupported = () => Promise.resolve(true);
    uploadCustomEmoji = (_upload: EmojiUpload) =>
      Promise.resolve(evilburnsEmoji);
    prepareForUpload = () => Promise.resolve();
  }

  it('supportsUploadFeature for UploadingEmojiProvider is true', () => {
    expect(supportsUploadFeature(new TestUploadingEmojiProvider())).toEqual(
      true,
    );
  });

  it('supportsUploadFeature for plain old EmojiProvider is false', () => {
    expect(supportsUploadFeature(new TestEmojiProvider())).toEqual(false);
  });
});
