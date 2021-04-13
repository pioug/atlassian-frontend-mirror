import { a as link, doc, p } from '@atlaskit/editor-test-helpers/doc-builder';
import { checkParseEncodeRoundTrips } from '../_test-helpers';
import { defaultSchema } from '@atlaskit/adf-schema';

// Nodes

describe.skip('WikiMarkup Transformer', () => {
  describe('web addresses', () => {
    let WIKI_NOTATION = `http://confluence.atlassian.com`;

    checkParseEncodeRoundTrips(
      WIKI_NOTATION,
      defaultSchema,
      WIKI_NOTATION,
      doc(
        p(
          link({ href: 'http://confluence.atlassian.com' })(
            'http://confluence.atlassian.com',
          ),
        ),
      ),
    );

    WIKI_NOTATION = `http://confluence-url.atlassian.com:10090`;

    checkParseEncodeRoundTrips(
      WIKI_NOTATION,
      defaultSchema,
      WIKI_NOTATION,
      doc(
        p(
          link({ href: 'http://confluence-url.atlassian.com:10090' })(
            'http://confluence-url.atlassian.com:10090',
          ),
        ),
      ),
    );

    WIKI_NOTATION = `atlassian=http://www.atlassian.com`;

    checkParseEncodeRoundTrips(
      WIKI_NOTATION,
      defaultSchema,
      WIKI_NOTATION,
      doc(
        p(
          'atlassian=',
          link({ href: 'http://www.atlassian.com' })(
            'http://www.atlassian.com',
          ),
        ),
      ),
    );
  });

  describe('irc link', () => {
    const WIKI_NOTATION = `An IRC address: irc://atlassian.com/confluence`;

    checkParseEncodeRoundTrips(
      WIKI_NOTATION,
      defaultSchema,
      WIKI_NOTATION,
      doc(
        p(
          'An IRC address: ',
          link({ href: 'irc://atlassian.com/confluence' })(
            'irc://atlassian.com/confluence',
          ),
        ),
      ),
    );
  });

  describe('invalid url', () => {
    const WIKI_NOTATION = `An invalid URL: invalid://nowhere.com/hello`;

    checkParseEncodeRoundTrips(
      WIKI_NOTATION,
      defaultSchema,
      WIKI_NOTATION,
      doc(p('An invalid URL: invalid://nowhere.com/hello')),
    );
  });

  describe('mixed url', () => {
    const WIKI_NOTATION = `http://localhost:8080/manager/install?path=\\\\[path]&war=file:///path/to/directory`;

    checkParseEncodeRoundTrips(
      WIKI_NOTATION,
      defaultSchema,
      WIKI_NOTATION,
      doc(
        p(
          link({
            href:
              'http://localhost:8080/manager/install?path=\\\\[path]&war=file:///path/to/directory',
          })(
            'http://localhost:8080/manager/install?path=\\\\[path]&war=file:///path/to/directory',
          ),
        ),
      ),
    );
  });

  describe('query params', () => {
    const WIKI_NOTATION = `http://atlassian.com/software/DownloadSoftware.action?name=confluence`;

    checkParseEncodeRoundTrips(
      WIKI_NOTATION,
      defaultSchema,
      WIKI_NOTATION,
      doc(
        p(
          link({
            href:
              'http://atlassian.com/software/DownloadSoftware.action?name=confluence',
          })(
            'http://atlassian.com/software/DownloadSoftware.action?name=confluence',
          ),
        ),
      ),
    );
  });

  describe('url in a tag', () => {
    const WIKI_NOTATION = `<http://confluence.atlassian.com>`;

    checkParseEncodeRoundTrips(
      WIKI_NOTATION,
      defaultSchema,
      WIKI_NOTATION,
      doc(
        p(
          '<',
          link({ href: 'http://confluence.atlassian.com' })(
            'http://confluence.atlassian.com',
          ),
          '>',
        ),
      ),
    );
  });
});
