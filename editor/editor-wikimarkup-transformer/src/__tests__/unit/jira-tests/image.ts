import {
  doc,
  p,
  img,
  a as link,
} from '@atlaskit/editor-test-helpers/doc-builder';
import { checkParseEncodeRoundTrips } from '../_test-helpers';
import { defaultSchema } from '@atlaskit/adf-schema';

// Nodes

describe.skip('WikiMarkup Transformer', () => {
  describe('image macro', () => {
    const WIKI_NOTATION = `!http://www.atlassian.com/images/test.jpg!`;

    checkParseEncodeRoundTrips(
      WIKI_NOTATION,
      defaultSchema,
      WIKI_NOTATION,
      doc(p(img({ src: 'http://www.atlassian.com/images/test.jpg' })())),
    );
  });

  describe('image macro with underscores', () => {
    const WIKI_NOTATION = `!http://www.atlassian.com/images/test_thisstyle_too.jpg!`;

    checkParseEncodeRoundTrips(
      WIKI_NOTATION,
      defaultSchema,
      WIKI_NOTATION,
      doc(
        p(
          img({
            src: 'http://www.atlassian.com/images/test_thisstyle_too.jpg',
          })(),
        ),
      ),
    );
  });

  // @TODO Should this be a media element? Migration issues?
  describe.skip('attached image', () => {
    const WIKI_NOTATION = `!http://www.atlassian.com/images/test_thisstyle_too.jpg!`;

    checkParseEncodeRoundTrips(
      WIKI_NOTATION,
      defaultSchema,
      WIKI_NOTATION,
      doc(
        p(
          img({
            src:
              'http://localhost:8080/download/attachments/0/attachedpicture.jpg',
          })(),
        ),
      ),
    );
  });

  describe('linked image', () => {
    const WIKI_NOTATION = `[!attachedpicture.jpg|align=right!|http://confluence.atlassian.com]`;

    // @TODO Linkable images not supported, confirm with JIRA
    checkParseEncodeRoundTrips(
      WIKI_NOTATION,
      defaultSchema,
      WIKI_NOTATION,
      doc(
        p(
          link({
            href: 'http://confluence.atlassian.com',
          })('!attachedpicture.jpg|align=right!'),
        ),
      ),
    );
  });

  describe('linked image with title', () => {
    const WIKI_NOTATION = `[!attachedpicture.jpg|align=right!|http://confluence.atlassian.com|link to confluence]`;

    // @TODO Linkable images not supported, confirm with JIRA
    checkParseEncodeRoundTrips(
      WIKI_NOTATION,
      defaultSchema,
      WIKI_NOTATION,
      doc(
        p(
          link({
            href: 'http://confluence.atlassian.com',
            title: 'link to confluence',
          })('!attachedpicture.jpg|align=right!'),
        ),
      ),
    );
  });

  describe('escaped image macro', () => {
    const WIKI_NOTATION = `\\\\!http://www.atlassian.com/images/test.jpg!`;

    checkParseEncodeRoundTrips(
      WIKI_NOTATION,
      defaultSchema,
      WIKI_NOTATION,
      doc(p('&#33;http://www.atlassian.com/images/test.jpg!')),
    );
  });

  describe('image macro with no URL', () => {
    const WIKI_NOTATION = `!?!`;

    checkParseEncodeRoundTrips(
      WIKI_NOTATION,
      defaultSchema,
      WIKI_NOTATION,
      doc(p('!?!')),
    );
  });

  describe('image macro with no extension', () => {
    const WIKI_NOTATION = `!http://www.atlassian.com/images/test!`;

    checkParseEncodeRoundTrips(
      WIKI_NOTATION,
      defaultSchema,
      WIKI_NOTATION,
      doc(p(img({ src: 'http://www.atlassian.com/images/test' })())),
    );
  });

  // @TODO Should this be a media element? Migration issues?
  describe.skip('attached image with nbsp before', () => {
    const WIKI_NOTATION = `&nbsp;!19137-picture.jpg!`;

    checkParseEncodeRoundTrips(
      WIKI_NOTATION,
      defaultSchema,
      WIKI_NOTATION,
      doc(
        p(
          '&nbsp;',
          img({
            src:
              'http://localhost:8080/download/attachments/0/19137-picture.jpg',
          })(),
        ),
      ),
    );
  });

  // @TODO Should this be a media element? Migration issues?
  describe.skip('attached image with nbsp and space before', () => {
    const WIKI_NOTATION = `&nbsp; !19137-picture.jpg!`;

    checkParseEncodeRoundTrips(
      WIKI_NOTATION,
      defaultSchema,
      WIKI_NOTATION,
      doc(
        p(
          '&nbsp; ',
          img({
            src:
              'http://localhost:8080/download/attachments/0/19137-picture.jpg',
          })(),
        ),
      ),
    );
  });

  // @TODO Should this be a media element? Migration issues?
  describe.skip('image macro inside text', () => {
    const WIKI_NOTATION = `inltokxyzkdtnhgnsbdfinltok!19137-picture.jpg!`;

    checkParseEncodeRoundTrips(
      WIKI_NOTATION,
      defaultSchema,
      WIKI_NOTATION,
      doc(
        p(
          'inltokxyzkdtnhgnsbdfinltok',
          img({
            src:
              'http://localhost:8080/download/attachments/0/19137-picture.jpg',
          })(),
        ),
      ),
    );
  });

  // @TODO Should this be a media element? Migration issues?
  describe.skip('image macro after text', () => {
    const WIKI_NOTATION = `inltokxyzkdtnhgnsbdfinltok!19137-picture.jpg!`;

    checkParseEncodeRoundTrips(
      WIKI_NOTATION,
      defaultSchema,
      WIKI_NOTATION,
      doc(
        p(
          'inltokxyzkdtnhgnsbdfinltok ',
          img({
            src:
              'http://localhost:8080/download/attachments/0/19137-picture.jpg',
          })(),
        ),
      ),
    );
  });

  describe('xss check', () => {
    const WIKI_NOTATION = `!http://[http://onmouseover=alert(0)//]!`;

    checkParseEncodeRoundTrips(
      WIKI_NOTATION,
      defaultSchema,
      WIKI_NOTATION,
      doc(p(img({ src: 'http://[http://onmouseover=alert(0)//]' })())),
    );
  });
});
