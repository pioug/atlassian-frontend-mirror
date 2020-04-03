import {
  getLinkMatch,
  normalizeUrl,
} from '../../../../plugins/hyperlink/utils';
import { activityProviderFactory } from '@atlaskit/editor-test-helpers/activity-provider';
import { ProviderFactory } from '@atlaskit/editor-common';

/**
 * Provides sample data for this suite of tests.
 */
export const activityProviderMock = activityProviderFactory([
  {
    objectId: 'recent1',
    name: 'recent item 1',
    container: 'container 1',
    iconUrl:
      'https://wac-cdn.atlassian.com/assets/img/favicons/atlassian/favicon.png',
    url: 'recent1-url.com',
  },
  {
    objectId: 'recent2',
    name: 'recent item 2',
    container: 'container 2',
    iconUrl:
      'https://wac-cdn.atlassian.com/assets/img/favicons/atlassian/favicon.png',
    url: 'recent2-url.com',
  },
  {
    objectId: 'recent3',
    name: 'recent item 3',
    container: 'container 3',
    iconUrl:
      'https://wac-cdn.atlassian.com/assets/img/favicons/atlassian/favicon.png',
    url: 'recent3-url.com',
  },
]);

export const providerFactory = ProviderFactory.create({
  activityProvider: activityProviderMock,
});

describe('hyperlink', () => {
  describe('#normalizeUrl', () => {
    const examples = [
      ['prettyandsimple@example.com', 'mailto:prettyandsimple@example.com'],
      [
        'mailto:prettyandsimple@example.com',
        'mailto:prettyandsimple@example.com',
      ],
      ['example.com', 'http://example.com'],
      ['http://example.com', 'http://example.com'],
      ['', ''],
      ['javascript:alert(1)', ''],
    ];

    examples.forEach(([actual, expected]) => {
      it(`should convert from "${actual}" -> "${expected}"`, () => {
        expect(normalizeUrl(actual)).toEqual(expected);
      });
    });
  });

  describe('getLinkMatch', () => {
    const noise = (url: string) =>
      `some text before ${url} and some more text after`;
    it('should match web URLs', () => {
      expect(getLinkMatch('http://localhost:1988')).not.toBe(undefined);
      expect(getLinkMatch('http://www.atlassian.com')).not.toBe(undefined);
      expect(getLinkMatch('http://www.atlassian.com/')).not.toBe(undefined);
      expect(getLinkMatch('https://atlassian.com')).not.toBe(undefined);
      expect(getLinkMatch('https://atlassian.com/')).not.toBe(undefined);
      expect(getLinkMatch('www.atlassian.com')).not.toBe(undefined);
      expect(getLinkMatch('www.atlassian.com/')).not.toBe(undefined);
      expect(getLinkMatch('www.atlassian.com/foo/bar')).not.toBe(undefined);
      expect(getLinkMatch('www.atlassian.com:12313/foo/bar')).not.toBe(
        undefined,
      );
      expect(getLinkMatch('www.atlassian.com/foo/bar#foo')).not.toBe(undefined);
      expect(getLinkMatch('www.atlassian.com/foo/bar?foo#bar')).not.toBe(
        undefined,
      );
    });

    it('should match only the link when surrounded with text', () => {
      expect(getLinkMatch(noise('http://localhost:1988'))!.raw).toEqual(
        'http://localhost:1988',
      );
      expect(getLinkMatch(noise('http://www.atlassian.com'))!.raw).toEqual(
        'http://www.atlassian.com',
      );
      expect(getLinkMatch(noise('http://www.atlassian.com/'))!.raw).toEqual(
        'http://www.atlassian.com/',
      );
      expect(getLinkMatch(noise('https://atlassian.com'))!.raw).toEqual(
        'https://atlassian.com',
      );
      expect(getLinkMatch(noise('https://atlassian.com/'))!.raw).toEqual(
        'https://atlassian.com/',
      );
      expect(getLinkMatch(noise('www.atlassian.com'))!.raw).toEqual(
        'www.atlassian.com',
      );
      expect(getLinkMatch(noise('www.atlassian.com/'))!.raw).toEqual(
        'www.atlassian.com/',
      );
      expect(getLinkMatch(noise('www.atlassian.com/foo/bar'))!.raw).toEqual(
        'www.atlassian.com/foo/bar',
      );
      expect(
        getLinkMatch(noise('www.atlassian.com:12313/foo/bar'))!.raw,
      ).toEqual('www.atlassian.com:12313/foo/bar');
      expect(getLinkMatch(noise('www.atlassian.com/foo/bar#foo'))!.raw).toEqual(
        'www.atlassian.com/foo/bar#foo',
      );
      expect(
        getLinkMatch(noise('www.atlassian.com/foo/bar?foo#bar'))!.raw,
      ).toEqual('www.atlassian.com/foo/bar?foo#bar');
    });

    it('should not match non-web schemes', () => {
      expect(getLinkMatch('#hello')).toEqual(null);
      expect(getLinkMatch('./index.php')).toEqual(null);
      expect(getLinkMatch('/index.php')).toEqual(null);
      expect(getLinkMatch('app://atlassian.com')).toEqual(null);
      expect(getLinkMatch('tcp://173.123.21.12')).toEqual(null);
      expect(getLinkMatch('javascript:alert(1);')).toEqual(null);
    });

    it('should not match special characters', () => {
      expect(getLinkMatch('[www.atlassian.com?hello=there]')!.raw).toEqual(
        'www.atlassian.com?hello=there',
      );
      expect(getLinkMatch('(www.atlassian.com#hello>')!.raw).toEqual(
        'www.atlassian.com#hello',
      );
      expect(getLinkMatch('(www.atlassian.com/hello<')!.raw).toEqual(
        'www.atlassian.com/hello',
      );
      expect(getLinkMatch('(www.atlassian.com/hello?foo=bar^)')!.raw).toEqual(
        'www.atlassian.com/hello?foo=bar^',
      );
    });

    it('should match EMAILs', () => {
      expect(getLinkMatch('prettyandsimple@example.com')).not.toBe(undefined);
      expect(getLinkMatch('very.common@example.com')).not.toBe(undefined);
      expect(
        getLinkMatch('disposable.style.email.with+symbol@example.com'),
      ).not.toBe(undefined);
      expect(getLinkMatch('other.email-with-dash@example.com')).not.toBe(
        undefined,
      );
      expect(getLinkMatch('x@example.com')).not.toBe(undefined);
      expect(getLinkMatch('example-indeed@strange-example.com')).not.toBe(
        undefined,
      );
      expect(getLinkMatch('example@s.solutions')).not.toBe(undefined);
    });

    it('should not match invalid EMAILs', () => {
      expect(getLinkMatch('john.doe@example..com')).toEqual(null);
    });

    it('should match only the EMAIL when surrounded with text', () => {
      expect(getLinkMatch(noise('http://localhost:1988'))!.raw).toEqual(
        'http://localhost:1988',
      );
      expect(getLinkMatch(noise('prettyandsimple@example.com'))!.raw).toEqual(
        'prettyandsimple@example.com',
      );
      expect(getLinkMatch(noise('very.common@example.com'))!.raw).toEqual(
        'very.common@example.com',
      );
      expect(
        getLinkMatch(noise('disposable.style.email.with+symbol@example.com'))!
          .raw,
      ).toEqual('disposable.style.email.with+symbol@example.com');
      expect(
        getLinkMatch(noise('other.email-with-dash@example.com'))!.raw,
      ).toEqual('other.email-with-dash@example.com');
      expect(getLinkMatch(noise('x@example.com'))!.raw).toEqual(
        'x@example.com',
      );
      expect(
        getLinkMatch(noise('example-indeed@strange-example.com'))!.raw,
      ).toEqual('example-indeed@strange-example.com');
    });

    it('should not match filename extensions', () => {
      expect(getLinkMatch('test.sh')).toEqual(null);
      expect(getLinkMatch('test.as')).toEqual(null);
      expect(getLinkMatch('test.ms')).toEqual(null);
      expect(getLinkMatch('test.py')).toEqual(null);
      expect(getLinkMatch('test.ps')).toEqual(null);
      expect(getLinkMatch('test.so')).toEqual(null);
      expect(getLinkMatch('test.pl')).toEqual(null);
    });
  });
});
