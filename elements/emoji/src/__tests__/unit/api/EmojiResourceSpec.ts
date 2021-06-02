import 'es6-promise/auto'; // 'whatwg-fetch' needs a Promise polyfill

import fetchMock from 'fetch-mock/cjs/client';
import * as sinon from 'sinon';
import {
  OnProviderChange,
  SecurityOptions,
  ServiceConfig,
} from '@atlaskit/util-service-support';

import { waitUntil } from '@atlaskit/elements-test-helpers';

import {
  EmojiDescription,
  EmojiId,
  EmojiSearchResult,
  EmojiServiceResponse,
  MediaApiRepresentation,
  SearchSort,
} from '../../../types';
import EmojiResource, { EmojiResourceConfig } from '../../../api/EmojiResource';
import EmojiRepository from '../../../api/EmojiRepository';

import {
  atlassianEmojis,
  atlassianServiceEmojis,
  blobResponse,
  defaultMediaApiToken,
  evilburnsEmoji,
  fetchSiteEmojiUrl,
  filterToSearchable,
  grinEmoji,
  mediaEmoji,
  mediaEmojiImagePath,
  missingMediaEmoji,
  missingMediaEmojiId,
  missingMediaServiceEmoji,
  siteServiceEmojis,
  siteUrl,
  standardEmojis,
  standardServiceEmojis,
  thumbsupEmoji,
} from '../_test-data';

import { alwaysPromise } from '../_test-util';
import { convertMediaToImageRepresentation } from '../../../util/type-helpers';
import { ErrorEmojiResource } from './_resource-spec-util';

/**
 * Skipping 3 tests that are failing since the jest 23 upgrade
 * TODO: JEST-23
 */

const baseUrl = 'https://bogus/';
const p1Url = 'https://p1/';
const p2Url = 'https://p2/';

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

const provider2: ServiceConfig = {
  url: p2Url,
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

const providerData1 = filterToSearchable(standardEmojis);
const providerData2 = filterToSearchable(atlassianEmojis);
const providerServiceData1 = standardServiceEmojis;
const providerServiceData2 = atlassianServiceEmojis;

const checkOrder = (
  expected: EmojiDescription[],
  actual: EmojiDescription[],
) => {
  expect(actual.length).toEqual(expected.length);
  expected.forEach((emoji, idx) => {
    checkEmoji(emoji, actual[idx]);
  });
};

const checkEmoji = (
  expected: EmojiDescription,
  actual: EmojiDescription | undefined,
) => {
  expect(actual).not.toEqual(undefined);
  if (actual) {
    expect(actual.id).toEqual(expected.id);
    expect(actual.shortName).toEqual(expected.shortName);
  }
};

class MockOnProviderChange
  implements OnProviderChange<EmojiSearchResult, any, undefined> {
  resultCalls: EmojiSearchResult[] = [];
  errorCalls: any[] = [];
  notReadyCalls: number = 0;

  private toResolve: Function[] = [];
  private toResolveOnResult: Function[] = [];

  private resolvePromises(): void {
    const currentToResolve = this.toResolve;
    this.toResolve = [];
    currentToResolve.forEach((resolve) => {
      resolve();
    });
  }

  private resolvePromisesOnResult(result: EmojiSearchResult): void {
    const currentToResolveOnResult = this.toResolveOnResult;
    this.toResolveOnResult = [];
    currentToResolveOnResult.forEach((resolve) => {
      resolve(result);
    });
  }

  result(result: EmojiSearchResult): void {
    this.resultCalls.push(result);
    this.resolvePromises();
    this.resolvePromisesOnResult(result);
  }

  error?(error: any): void {
    this.errorCalls.push(error);
    this.resolvePromises();
  }

  notReady?(): void {
    this.notReadyCalls++;
    this.resolvePromises();
  }

  waitForAnyCall(): Promise<any> {
    return new Promise<any>((resolve) => {
      this.toResolve.push(resolve);
    });
  }

  waitForResult(): Promise<EmojiSearchResult> {
    return new Promise<EmojiSearchResult>((resolve) => {
      this.toResolveOnResult.push(resolve);
    });
  }

  waitForResults(num: number): Promise<EmojiSearchResult> {
    return new Promise<EmojiSearchResult>((resolve) => {
      const minCountResolver = (response: EmojiSearchResult) => {
        if (this.resultCalls.length >= num) {
          resolve(response);
        } else {
          this.toResolveOnResult.push(minCountResolver);
        }
      };
      this.toResolveOnResult.push(minCountResolver);
    });
  }
}

/**
 * Extend the EmojiResource to provide access to its underlying EmojiRepository.
 */
class EmojiResourceWithEmojiRepositoryOverride extends EmojiResource {
  constructor(config: EmojiResourceConfig, emojiRepository: EmojiRepository) {
    super(config);
    // replace the usageTracker that was just constructed
    this.emojiRepository = emojiRepository;
  }
}

describe('EmojiResource', () => {
  afterEach(() => {
    fetchMock.restore();
  });

  describe('#test data', () => {
    it('expected test data', () => {
      expect(standardEmojis.length > 0).toEqual(true);
      expect(atlassianEmojis.length > 0).toEqual(true);
    });
  });

  describe('#constructor', () => {
    it('activeLoaders is logical amount if SiteEmojiResource errors', async () => {
      fetchMock.mock({
        matcher: `begin:${provider1.url}`,
        response: providerServiceData1,
      });

      const resource = new ErrorEmojiResource(defaultApiConfig);
      const spy = jest.spyOn(resource, 'initSiteEmojiResource');
      await waitUntil(() => spy.mock.calls.length > 0);
      expect(resource.getActiveLoaders()).toEqual(0);
    });
  });

  describe('#filter', () => {
    it('no providers', () => {
      const config = {
        ...defaultApiConfig,
        providers: [],
      };
      try {
        // eslint-disable-next-line no-unused-expressions
        new EmojiResource(config);
        expect(true).toEqual(false);
      } catch (e) {
        expect(true).toEqual(true);
      }
    });

    it('single provider all emoji', () => {
      fetchMock.mock({
        matcher: `begin:${provider1.url}`,
        response: providerServiceData1,
      });

      const config = {
        ...defaultApiConfig,
        providers: [provider1],
      };

      const resource = new EmojiResource(config);
      const onChange = new MockOnProviderChange();
      const filteredPromise = onChange.waitForResult().then((emojiResponse) => {
        expect(onChange.resultCalls.length).toEqual(1);
        expect(emojiResponse.emojis.length).toEqual(providerData1.length);
        checkOrder(providerData1, emojiResponse.emojis);
      });
      resource.subscribe(onChange);
      resource.filter('');
      return filteredPromise;
    });

    it('single provider all emoji with skin tone search option', () => {
      fetchMock.mock({
        matcher: `begin:${provider1.url}`,
        response: providerServiceData1,
      });

      const config = {
        ...defaultApiConfig,
        providers: [provider1],
      };

      const skinTone = 2;
      const resource = new EmojiResource(config);
      const onChange = new MockOnProviderChange();
      const filteredPromise = onChange.waitForResult().then((emojiResponse) => {
        expect(onChange.resultCalls.length).toEqual(1);
        expect(emojiResponse.emojis.length).toEqual(1);
        const expectedSelectedSkinEmoji = (thumbsupEmoji.skinVariations &&
          thumbsupEmoji.skinVariations[skinTone - 1]) as EmojiDescription;
        expect(emojiResponse.emojis[0].id).toEqual(
          expectedSelectedSkinEmoji.id,
        );
        const emoji = emojiResponse.emojis[0];
        expect(emoji.shortName).toEqual(expectedSelectedSkinEmoji.shortName);
        expect(emoji.id).toEqual(expectedSelectedSkinEmoji.id);
      });
      resource.subscribe(onChange);
      resource.filter('thumbsup', { skinTone });
      return filteredPromise;
    });

    it('multiple providers', () => {
      const config = {
        ...defaultApiConfig,
        providers: [provider1, provider2],
      };
      fetchMock
        .mock({
          matcher: `begin:${provider1.url}`,
          response: providerServiceData1,
        })
        .mock({
          matcher: `begin:${provider2.url}`,
          response: providerServiceData2,
        });

      const resource = new EmojiResource(config);
      const onChange = new MockOnProviderChange();
      const filteredPromise = onChange.waitForResults(2).then(() => {
        expect(onChange.resultCalls.length).toEqual(2);
        const emojis = onChange.resultCalls[1].emojis;
        expect(emojis.length).toEqual(
          providerData1.length + providerData2.length,
        );
        checkOrder([...providerData1, ...providerData2], emojis);
      });
      resource.subscribe(onChange);
      resource.filter('', { sort: SearchSort.None });
      return filteredPromise;
    });

    it('multiple providers out of order response, returned in provider config order', () => {
      const config = {
        ...defaultApiConfig,
        providers: [provider1, provider2],
      };

      let resolveProvider1: (value?: any | PromiseLike<any>) => void;

      fetchMock
        .mock({
          matcher: `begin:${provider1.url}`,
          response: new Promise((resolve) => {
            resolveProvider1 = resolve;
          }),
        })
        .mock({
          matcher: `begin:${provider2.url}`,
          response: providerServiceData2,
        });

      const resource = new EmojiResource(config);
      const onChange = new MockOnProviderChange();
      const filteredPromiseChain = onChange
        .waitForResult()
        .then(() => {
          expect(onChange.resultCalls.length).toEqual(1);
          const emojis = onChange.resultCalls[0].emojis;
          expect(emojis.length).toEqual(providerData2.length);
          checkOrder(providerData2, emojis);
          // Complete 1st emoji set
          resolveProvider1(providerServiceData1);
          return onChange.waitForResult();
        })
        .then(() => {
          // After 2nd dataset is loaded, this is for the 1st data set
          expect(onChange.resultCalls.length).toEqual(2);
          const emojis = onChange.resultCalls[1].emojis;
          expect(emojis.length).toEqual(
            providerData1.length + providerData2.length,
          );
          checkOrder([...providerData1, ...providerData2], emojis);
        });
      resource.subscribe(onChange);
      resource.filter('', { sort: SearchSort.None });
      return filteredPromiseChain;
    });

    it('multiple providers, one fails', () => {
      const config = {
        ...defaultApiConfig,
        providers: [provider1, provider2],
      };
      fetchMock
        .mock({
          matcher: `begin:${provider1.url}`,
          response: 401,
        })
        .mock({
          matcher: `begin:${provider2.url}`,
          response: providerServiceData2,
        });

      const resource = new EmojiResource(config);
      const onChange = new MockOnProviderChange();
      const filteredPromise = onChange.waitForResult().then(() => {
        expect(onChange.resultCalls.length).toEqual(1);
        const emojis = onChange.resultCalls[0].emojis;
        expect(emojis.length).toEqual(providerData2.length);
        checkOrder(providerData2, emojis);
        expect(onChange.errorCalls.length).toEqual(1);
      });
      resource.subscribe(onChange);
      resource.filter('', { sort: SearchSort.None });
      return filteredPromise;
    });

    it('single provider slow', () => {
      let resolveProvider1: (value?: any | PromiseLike<any>) => void;

      fetchMock.mock({
        matcher: `begin:${provider1.url}`,
        response: new Promise((resolve) => {
          resolveProvider1 = resolve;
        }),
      });

      const resource = new EmojiResource(defaultApiConfig);
      const onChange = new MockOnProviderChange();
      const filteredPromise = onChange
        .waitForAnyCall()
        .then(() => {
          expect(onChange.notReadyCalls).toEqual(1);
          // Complete 1st emoji set
          resolveProvider1(providerServiceData1);
          return onChange.waitForResult();
        })
        .then(() => {
          expect(onChange.resultCalls.length).toEqual(1);
          const emojis = onChange.resultCalls[0].emojis;
          expect(emojis.length).toEqual(providerData1.length);
          checkOrder(providerData1, emojis);
        });
      resource.subscribe(onChange);
      resource.filter('');
      return filteredPromise;
    });

    it('multiple providers filtered', () => {
      const config = {
        ...defaultApiConfig,
        providers: [provider1, provider2],
      };
      fetchMock
        .mock({
          matcher: `begin:${provider1.url}`,
          response: providerServiceData1,
        })
        .mock({
          matcher: `begin:${provider2.url}`,
          response: providerServiceData2,
        });

      const resource = new EmojiResource(config);
      const onChange = new MockOnProviderChange();
      const filteredPromise = onChange.waitForResults(2).then(() => {
        expect(onChange.resultCalls.length).toEqual(2);
        const emojis = onChange.resultCalls[1].emojis;
        expect(emojis.length).toEqual(2);
        expect(emojis[0].shortName).toEqual(':thumbsup:');
        expect(emojis[1].shortName).toEqual(':thumbsdown:');
      });
      resource.subscribe(onChange);
      resource.filter('thumbs');
      return filteredPromise;
    });
  });

  describe('#recordSelection', () => {
    let mockEmojiRepository: EmojiRepository;
    let mockRecordUsage: sinon.SinonStub;

    beforeEach(() => {
      mockEmojiRepository = <EmojiRepository>{};
      mockRecordUsage = sinon.stub();
      mockEmojiRepository.used = mockRecordUsage;
    });

    it('should call record endpoint and emoji repository', () => {
      fetchMock
        .mock({
          name: 'record',
          matcher: `begin:${baseUrl}`,
          response: {
            body: '',
          },
          method: 'POST',
        })
        .mock({
          matcher: `begin:${provider1.url}`,
          response: providerServiceData1,
        });

      const resource = new EmojiResourceWithEmojiRepositoryOverride(
        defaultApiConfig,
        mockEmojiRepository,
      );

      return resource.recordSelection(grinEmoji).then(() => {
        expect(fetchMock.called('record')).toEqual(true);
        expect(mockRecordUsage.calledWith(grinEmoji)).toEqual(true);
      });
    });

    it('should record usage on emoji repository even when no recordConfig configured', () => {
      const resource = new EmojiResourceWithEmojiRepositoryOverride(
        { providers: [provider1] },
        mockEmojiRepository,
      );
      return resource.recordSelection(grinEmoji).then(() => {
        expect(mockRecordUsage.calledWith(grinEmoji)).toEqual(true);
      });
    });
  });

  describe('#deleteSiteEmoji', () => {
    it('Should not attempt to delete if there is no media emoji resource', () => {
      fetchMock
        .mock({
          matcher: `begin:${siteUrl}`,
          response: {
            emojis: siteServiceEmojis().emojis,
            // no meta.mediaApiToken means no media resource created
          },
          times: 1,
        })
        .mock({
          matcher: `${siteUrl}/${mediaEmoji.id}`,
          response: 200,
        });

      const config = {
        ...defaultApiConfig,
        providers: [
          {
            url: siteUrl,
          },
        ],
      };

      const resource = new EmojiResource(config);
      return resource
        .deleteSiteEmoji(mediaEmoji)
        .then((success) => expect(success).toEqual(false));
    });
  });

  describe('#findByEmojiId', () => {
    it('Before loaded, promise eventually resolved; one provider', () => {
      let resolveProvider1: (value?: any | PromiseLike<any>) => void;

      fetchMock.mock({
        matcher: `begin:${provider1.url}`,
        response: new Promise((resolve) => {
          resolveProvider1 = resolve;
        }),
      });

      const resource = new EmojiResource(defaultApiConfig);

      const emojiPromise = alwaysPromise(
        resource.findByEmojiId({ shortName: ':wontbeused:', id: '1f601' }),
      ); // grin
      const done = emojiPromise.then((emoji) => {
        checkEmoji(grinEmoji, emoji);
      });
      resolveProvider1!(providerServiceData1);
      return done;
    });

    it('one provider, no id', () => {
      let resolveProvider1: (value?: any | PromiseLike<any>) => void;

      fetchMock.mock({
        matcher: `begin:${provider1.url}`,
        response: new Promise((resolve) => {
          resolveProvider1 = resolve;
        }),
      });

      const resource = new EmojiResource(defaultApiConfig);

      const emojiPromise = alwaysPromise(
        resource.findByEmojiId({ shortName: ':grin:' }),
      );
      const done = emojiPromise.then((emoji) => {
        checkEmoji(grinEmoji, emoji);
      });
      resolveProvider1!(providerServiceData1);
      return done;
    });

    it('one provider, unknown id, shortName fallback', () => {
      let resolveProvider1: (value?: any | PromiseLike<any>) => void;

      fetchMock.mock({
        matcher: `begin:${provider1.url}`,
        response: new Promise((resolve) => {
          resolveProvider1 = resolve;
        }),
      });

      const resource = new EmojiResource(defaultApiConfig);

      const emojiPromise = alwaysPromise(
        resource.findByEmojiId({ shortName: ':grin:', id: 'unknownid' }),
      );
      const done = emojiPromise.then((emoji) => {
        checkEmoji(grinEmoji, emoji);
      });
      resolveProvider1!(providerServiceData1);
      return done;
    });

    it('Two providers, found first', () => {
      let resolveProvider1: (value?: any | PromiseLike<any>) => void;
      let resolveProvider2: (value?: any | PromiseLike<any>) => void;

      fetchMock
        .mock({
          matcher: `begin:${provider1.url}`,
          response: new Promise((resolve) => {
            resolveProvider1 = resolve;
          }),
        })
        .mock({
          matcher: `begin:${provider2.url}`,
          response: new Promise((resolve) => {
            resolveProvider2 = resolve;
          }),
        });

      const resource = new EmojiResource({
        ...defaultApiConfig,
        providers: [provider1, provider2],
      });
      const emojiPromise = alwaysPromise(
        resource.findByEmojiId({ shortName: ':wontbeused:', id: '1f601' }),
      ); // grin
      const done = emojiPromise.then((emoji) => {
        checkEmoji(grinEmoji, emoji);
      });
      resolveProvider1!(providerServiceData1);
      resolveProvider2!(providerServiceData2);
      return done;
    });

    it('Two providers, found second', () => {
      let resolveProvider1: (value?: any | PromiseLike<any>) => void;
      let resolveProvider2: (value?: any | PromiseLike<any>) => void;

      fetchMock
        .mock({
          matcher: `begin:${provider1.url}`,
          response: new Promise((resolve) => {
            resolveProvider1 = resolve;
          }),
        })
        .mock({
          matcher: `begin:${provider2.url}`,
          response: new Promise((resolve) => {
            resolveProvider2 = resolve;
          }),
        });

      const resource = new EmojiResource({
        ...defaultApiConfig,
        providers: [provider1, provider2],
      });
      const emojiPromise = alwaysPromise(
        resource.findByEmojiId({
          shortName: ':wontbeused:',
          id: 'atlassian-evilburns',
        }),
      ); // grin
      const done = emojiPromise.then((emoji) => {
        checkEmoji(evilburnsEmoji, emoji);
      });
      resolveProvider1!(providerServiceData1);
      resolveProvider2!(providerServiceData2);
      return done;
    });

    it('Two providers, not found', () => {
      let resolveProvider1: (value?: any | PromiseLike<any>) => void;
      let resolveProvider2: (value?: any | PromiseLike<any>) => void;

      fetchMock
        .mock({
          matcher: `begin:${provider1.url}`,
          response: new Promise((resolve) => {
            resolveProvider1 = resolve;
          }),
        })
        .mock({
          matcher: `begin:${provider2.url}`,
          response: new Promise((resolve) => {
            resolveProvider2 = resolve;
          }),
        });

      const resource = new EmojiResource({
        ...defaultApiConfig,
        providers: [provider1, provider2],
      });
      const emojiPromise = alwaysPromise(
        resource.findByEmojiId({ shortName: ':wontbeused:', id: 'bogus' }),
      ); // does not exist
      const done = emojiPromise.then((emoji) => {
        expect(emoji).toEqual(undefined);
      });
      resolveProvider1!(providerServiceData1);
      resolveProvider2!(providerServiceData2);
      return done;
    });

    it('Two providers, search after loaded', () => {
      fetchMock
        .mock({
          matcher: `begin:${provider1.url}`,
          response: providerServiceData1,
        })
        .mock({
          matcher: `begin:${provider2.url}`,
          response: providerServiceData2,
        });

      const resource = new EmojiResource({
        ...defaultApiConfig,
        providers: [provider1, provider2],
      });
      const emojiPromise = alwaysPromise(
        resource.findByEmojiId({
          shortName: ':wontbeused:',
          id: 'atlassian-evilburns',
        }),
      ); // grin
      const done = emojiPromise.then((emoji) => {
        checkEmoji(evilburnsEmoji, emoji);
      });
      return done;
    });

    it('Two providers, not found in failing provider', () => {
      let resolveProvider2: (value?: any | PromiseLike<any>) => void;

      fetchMock
        .mock({
          matcher: `begin:${provider1.url}`,
          response: 500,
        })
        .mock({
          matcher: `begin:${provider2.url}`,
          response: new Promise((resolve) => {
            resolveProvider2 = resolve;
          }),
        });

      const resource = new EmojiResource({
        ...defaultApiConfig,
        providers: [provider1, provider2],
      });
      const emojiPromise = alwaysPromise(
        resource.findByEmojiId({ shortName: ':wontbeused:', id: '1f601' }),
      ); // grin
      const done = emojiPromise.then((emoji) => {
        expect(emoji).toEqual(undefined);
      });
      resolveProvider2!(providerServiceData2);
      return done;
    });

    it('Two providers, ingore in failing provider', () => {
      let resolveProvider2: (value?: any | PromiseLike<any>) => void;

      fetchMock
        .mock({
          matcher: `begin:${provider1.url}`,
          response: 500,
        })
        .mock({
          matcher: `begin:${provider2.url}`,
          response: new Promise((resolve) => {
            resolveProvider2 = resolve;
          }),
        });

      const resource = new EmojiResource({
        ...defaultApiConfig,
        providers: [provider1, provider2],
      });
      const emojiPromise = alwaysPromise(
        resource.findByEmojiId({
          shortName: ':wontbeused:',
          id: 'atlassian-evilburns',
        }),
      ); // grin
      const done = emojiPromise.then((emoji) => {
        checkEmoji(evilburnsEmoji, emoji);
      });
      resolveProvider2!(providerServiceData2);
      return done;
    });

    it.skip('not found by id - found on server', () => {
      const serviceResponse: EmojiServiceResponse = {
        emojis: [missingMediaServiceEmoji],
        meta: {
          mediaApiToken: defaultMediaApiToken(),
        },
      };

      fetchMock
        .mock({
          matcher: `begin:${fetchSiteEmojiUrl(missingMediaEmojiId)}`,
          response: serviceResponse,
          name: 'fetch-site-emoji',
        })
        .mock({
          matcher: `begin:${siteUrl}`,
          response: siteServiceEmojis(),
          times: 1,
        })
        .mock({
          matcher: mediaEmojiImagePath,
          response: blobResponse(new Blob()),
        });

      const config = {
        ...defaultApiConfig,
        providers: [
          {
            url: siteUrl,
          },
        ],
      };

      const resource = new EmojiResource(config);

      return alwaysPromise(resource.findByEmojiId(missingMediaEmojiId)).then(
        (emoji) => {
          const fetchSiteEmojiCalls = fetchMock.calls('fetch-site-emoji');
          expect(fetchSiteEmojiCalls.length).toEqual(1);
          expect(emoji).toEqual(missingMediaEmoji);
        },
      );
    });

    it.skip('can resolve non-custom emojis from server', () => {
      const standardEmoji = standardServiceEmojis.emojis[0];
      const standardDescription = standardEmojis[0];
      expect(standardEmoji.shortName).toEqual(standardDescription.shortName);
      const standardId: EmojiId = {
        shortName: standardEmoji.shortName,
        id: standardEmoji.id,
        fallback: standardEmoji.fallback,
      };

      const standardResponse: EmojiServiceResponse = {
        emojis: [standardEmoji],
      };

      fetchMock
        .mock({
          matcher: `begin:${fetchSiteEmojiUrl(standardId)}`,
          response: standardResponse,
          name: 'fetch-standard-emoji',
        })
        .mock({
          matcher: `begin:${siteUrl}`,
          response: siteServiceEmojis(),
          times: 1,
        })
        .mock({
          matcher: mediaEmojiImagePath,
          response: blobResponse(new Blob()),
        });

      const config = {
        ...defaultApiConfig,
        providers: [
          {
            url: siteUrl,
          },
        ],
      };
      const resource = new EmojiResource(config);

      return alwaysPromise(resource.findByEmojiId(standardId)).then((emoji) => {
        const fetchStandardEmojiCalls = fetchMock.calls('fetch-standard-emoji');
        expect(fetchStandardEmojiCalls.length).toEqual(1);
        expect(emoji).not.toEqual(undefined);
        expect(emoji!.shortName).toEqual(standardDescription.shortName);
      });
    });

    it.skip('not found by id - not found on server - try by shortName', () => {
      const serviceResponse: EmojiServiceResponse = {
        emojis: [],
        meta: {
          mediaApiToken: defaultMediaApiToken(),
        },
      };

      fetchMock
        .mock({
          matcher: `begin:${fetchSiteEmojiUrl(missingMediaEmojiId)}`,
          response: serviceResponse,
          name: 'fetch-site-emoji',
        })
        .mock({
          matcher: `begin:${siteUrl}`,
          response: siteServiceEmojis(),
          times: 1,
        })
        .mock({
          matcher: mediaEmojiImagePath,
          response: blobResponse(new Blob()),
        });

      const config = {
        ...defaultApiConfig,
        providers: [
          {
            url: siteUrl,
          },
        ],
      };

      const resource = new EmojiResource(config);

      const emojiId = {
        ...missingMediaEmojiId,
        shortName: ':media:', // fallback - match existing by shortName (but different id)
      };

      return alwaysPromise(resource.findByEmojiId(emojiId)).then((emoji) => {
        const fetchSiteEmojiCalls = fetchMock.calls('fetch-site-emoji');
        expect(fetchSiteEmojiCalls.length).toEqual(1);
        expect(emoji).toEqual(mediaEmoji);
      });
    });

    it('not found by id - no media resource - try by shortName', () => {
      fetchMock
        .mock({
          matcher: `begin:${fetchSiteEmojiUrl(missingMediaEmojiId)}`,
          response: 400,
          name: 'fetch-site-emoji',
        })
        .mock({
          matcher: `begin:${siteUrl}`,
          response: {
            emojis: siteServiceEmojis().emojis,
            // no meta.mediaApiToken means not media resource created
          },
          times: 1,
        })
        .mock({
          matcher: mediaEmojiImagePath,
          response: blobResponse(new Blob()),
        });

      const config = {
        ...defaultApiConfig,
        providers: [
          {
            url: siteUrl,
          },
        ],
      };

      const resource = new EmojiResource(config);

      const emojiId = {
        ...missingMediaEmojiId,
        shortName: ':media:', // fallback - match existing by shortName (but different id)
      };

      return alwaysPromise(resource.findByEmojiId(emojiId)).then((emoji) => {
        const fetchSiteEmojiCalls = fetchMock.calls('fetch-site-emoji');
        expect(fetchSiteEmojiCalls.length).toEqual(0);
        // media url not loaded - url pass through
        const representation = convertMediaToImageRepresentation(
          mediaEmoji.representation as MediaApiRepresentation,
        );
        const altRepresentation = convertMediaToImageRepresentation(
          mediaEmoji.altRepresentation as MediaApiRepresentation,
        );
        expect(emoji).toEqual({
          ...mediaEmoji,
          representation,
          altRepresentation,
        });
      });
    });
  });

  describe('#findById', () => {
    it('unknown id', () => {
      let resolveProvider1: (value?: any | PromiseLike<any>) => void;

      fetchMock.mock({
        matcher: `begin:${provider1.url}`,
        response: new Promise((resolve) => {
          resolveProvider1 = resolve;
        }),
      });

      const resource = new EmojiResource(defaultApiConfig);

      const emojiPromise = alwaysPromise(resource.findById('unknownid'));
      const done = emojiPromise.then((emoji) => {
        expect(emoji).toEqual(undefined);
      });
      resolveProvider1!(providerServiceData1);
      return done;
    });

    it('valid emoji id', () => {
      let resolveProvider1: (value?: any | PromiseLike<any>) => void;

      fetchMock.mock({
        matcher: `begin:${provider1.url}`,
        response: new Promise((resolve) => {
          resolveProvider1 = resolve;
        }),
      });

      const resource = new EmojiResource(defaultApiConfig);

      const emojiPromise = alwaysPromise(resource.findById('1f601'));
      const done = emojiPromise.then((emoji) => {
        checkEmoji(grinEmoji, emoji);
      });
      resolveProvider1!(providerServiceData1);
      return done;
    });
  });

  describe('#findByShortName', () => {
    it('Before loaded, promise eventually resolved; one provider', () => {
      let resolveProvider1: (value?: any | PromiseLike<any>) => void;

      fetchMock.mock({
        matcher: `begin:${provider1.url}`,
        response: new Promise((resolve) => {
          resolveProvider1 = resolve;
        }),
      });

      const resource = new EmojiResource(defaultApiConfig);
      const emojiPromise = alwaysPromise(resource.findByShortName(':grin:'));
      const done = emojiPromise.then((emoji) => {
        checkEmoji(grinEmoji, emoji);
      });
      resolveProvider1!(providerServiceData1);
      return done;
    });

    it('Two providers, found first', () => {
      let resolveProvider1: (value?: any | PromiseLike<any>) => void;
      let resolveProvider2: (value?: any | PromiseLike<any>) => void;

      fetchMock
        .mock({
          matcher: `begin:${provider1.url}`,
          response: new Promise((resolve) => {
            resolveProvider1 = resolve;
          }),
        })
        .mock({
          matcher: `begin:${provider2.url}`,
          response: new Promise((resolve) => {
            resolveProvider2 = resolve;
          }),
        });

      const resource = new EmojiResource({
        ...defaultApiConfig,
        providers: [provider1, provider2],
      });
      const emojiPromise = alwaysPromise(resource.findByShortName(':grin:'));
      const done = emojiPromise.then((emoji) => {
        checkEmoji(grinEmoji, emoji);
      });
      resolveProvider1!(providerServiceData1);
      resolveProvider2!(providerServiceData2);
      return done;
    });

    it('Two providers, found second', () => {
      let resolveProvider1: (value?: any | PromiseLike<any>) => void;
      let resolveProvider2: (value?: any | PromiseLike<any>) => void;

      fetchMock
        .mock({
          matcher: `begin:${provider1.url}`,
          response: new Promise((resolve) => {
            resolveProvider1 = resolve;
          }),
        })
        .mock({
          matcher: `begin:${provider2.url}`,
          response: new Promise((resolve) => {
            resolveProvider2 = resolve;
          }),
        });

      const resource = new EmojiResource({
        ...defaultApiConfig,
        providers: [provider1, provider2],
      });
      const emojiPromise = alwaysPromise(
        resource.findByShortName(':evilburns:'),
      );
      const done = emojiPromise.then((emoji) => {
        checkEmoji(evilburnsEmoji, emoji);
      });
      resolveProvider1!(providerServiceData1);
      resolveProvider2!(providerServiceData2);
      return done;
    });

    it('Two providers, duplicate shortName - use from second provider. 1, then 2 resolved.', () => {
      let resolveProvider1: (value?: any | PromiseLike<any>) => void;
      let resolveProvider2: (value?: any | PromiseLike<any>) => void;

      fetchMock
        .mock({
          matcher: `begin:${provider1.url}`,
          response: new Promise((resolve) => {
            resolveProvider1 = resolve;
          }),
        })
        .mock({
          matcher: `begin:${provider2.url}`,
          response: new Promise((resolve) => {
            resolveProvider2 = resolve;
          }),
        });

      const p2grin = {
        ...grinEmoji,
        id: 'atlassian-grin',
      };
      const resource = new EmojiResource({
        ...defaultApiConfig,
        providers: [provider1, provider2],
      });
      const emojiPromise = alwaysPromise(resource.findByShortName(':grin:'));
      const done = emojiPromise.then((emoji) => {
        checkEmoji(p2grin, emoji);
      });
      resolveProvider1!(providerServiceData1);
      resolveProvider2!({
        emojis: [...providerServiceData2.emojis, p2grin],
        meta: providerServiceData2.meta,
      });
      return done;
    });

    it('Two providers, duplicate shortName - use from second provider. 2, then 1 resolved.', () => {
      let resolveProvider1: (value?: any | PromiseLike<any>) => void;
      let resolveProvider2: (value?: any | PromiseLike<any>) => void;

      fetchMock
        .mock({
          matcher: `begin:${provider1.url}`,
          response: new Promise((resolve) => {
            resolveProvider1 = resolve;
          }),
        })
        .mock({
          matcher: `begin:${provider2.url}`,
          response: new Promise((resolve) => {
            resolveProvider2 = resolve;
          }),
        });

      const p2grin = {
        ...grinEmoji,
        id: 'atlassian-grin',
      };
      const resource = new EmojiResource({
        ...defaultApiConfig,
        providers: [provider1, provider2],
      });
      const emojiPromise = alwaysPromise(resource.findByShortName(':grin:'));
      const done = emojiPromise.then((emoji) => {
        checkEmoji(p2grin, emoji);
      });
      resolveProvider2!({
        emojis: [...providerServiceData2.emojis, p2grin],
        meta: providerServiceData2.meta,
      });
      resolveProvider1!(providerServiceData1);
      return done;
    });

    it('Two providers, not found', () => {
      let resolveProvider1: (value?: any | PromiseLike<any>) => void;
      let resolveProvider2: (value?: any | PromiseLike<any>) => void;

      fetchMock
        .mock({
          matcher: `begin:${provider1.url}`,
          response: new Promise((resolve) => {
            resolveProvider1 = resolve;
          }),
        })
        .mock({
          matcher: `begin:${provider2.url}`,
          response: new Promise((resolve) => {
            resolveProvider2 = resolve;
          }),
        });

      const resource = new EmojiResource({
        ...defaultApiConfig,
        providers: [provider1, provider2],
      });
      const emojiPromise = alwaysPromise(resource.findByShortName(':bogus:'));
      const done = emojiPromise.then((emoji) => {
        expect(emoji).toEqual(undefined);
      });
      resolveProvider1!(providerServiceData1);
      resolveProvider2!(providerServiceData2);
      return done;
    });

    it('Two providers, search after loaded', () => {
      fetchMock
        .mock({
          matcher: `begin:${provider1.url}`,
          response: providerServiceData1,
        })
        .mock({
          matcher: `begin:${provider2.url}`,
          response: providerServiceData2,
        });

      const resource = new EmojiResource({
        ...defaultApiConfig,
        providers: [provider1, provider2],
      });
      const emojiPromise = alwaysPromise(
        resource.findByShortName(':evilburns:'),
      );
      const done = emojiPromise.then((emoji) => {
        checkEmoji(evilburnsEmoji, emoji);
      });
      return done;
    });

    it('Two providers, not found in failing provider', () => {
      let resolveProvider2: (value?: any | PromiseLike<any>) => void;

      fetchMock
        .mock({
          matcher: `begin:${provider1.url}`,
          response: 500,
        })
        .mock({
          matcher: `begin:${provider2.url}`,
          response: new Promise((resolve) => {
            resolveProvider2 = resolve;
          }),
        });

      const resource = new EmojiResource({
        ...defaultApiConfig,
        providers: [provider1, provider2],
      });
      const emojiPromise = alwaysPromise(resource.findByShortName(':grin:'));
      const done = emojiPromise.then((emoji) => {
        expect(emoji).toEqual(undefined);
      });
      resolveProvider2!(providerServiceData2);
      return done;
    });

    it('Two providers, ignore in failing provider', () => {
      let resolveProvider2: (value?: any | PromiseLike<any>) => void;

      fetchMock
        .mock({
          matcher: `begin:${provider1.url}`,
          response: 500,
        })
        .mock({
          matcher: `begin:${provider2.url}`,
          response: new Promise((resolve) => {
            resolveProvider2 = resolve;
          }),
        });

      const resource = new EmojiResource({
        ...defaultApiConfig,
        providers: [provider1, provider2],
      });
      const emojiPromise = alwaysPromise(
        resource.findByShortName(':evilburns:'),
      );
      const done = emojiPromise.then((emoji) => {
        checkEmoji(evilburnsEmoji, emoji);
      });
      resolveProvider2!(providerServiceData2);
      return done;
    });
  });
});
