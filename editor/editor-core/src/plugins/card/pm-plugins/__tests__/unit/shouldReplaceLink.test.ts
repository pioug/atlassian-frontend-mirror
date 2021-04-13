import { a, cleanOne, text } from '@atlaskit/editor-test-helpers/doc-builder';
import defaultSchema from '@atlaskit/editor-test-helpers/schema';
import { shouldReplaceLink } from '../../shouldReplaceLink';
import { Node } from 'prosemirror-model';

describe('shouldReplaceLink()', () => {
  it('returns true for regular link, same href and text', () => {
    const link = cleanOne(
      a({ href: 'https://invis.io/P8OKINLRQEH' })(
        'https://invis.io/P8OKINLRQEH',
      ),
    )(defaultSchema);

    expect(shouldReplaceLink(link)).toBe(true);
  });

  it('returns false for regular link, differing href and text', () => {
    const link = cleanOne(
      a({ href: 'https://invis.io/P8OKINLRQEH' })(
        'https://invis.io/P8OKINLRQE',
      ),
    )(defaultSchema);

    expect(shouldReplaceLink(link)).toBe(false);
  });

  it('returns true for differing href and text if compare is skipped', () => {
    const link = cleanOne(
      a({ href: 'https://invis.io/P8OKINLRQEH' })('https://www.atlassian.com/'),
    )(defaultSchema);

    expect(shouldReplaceLink(link, false)).toBe(true);
  });

  it('returns false for same href and text if compare url differs', () => {
    const link = cleanOne(
      a({
        href: 'https://invis.io/P8OKINLRQEH',
      })('https://invis.io/P8OKINLRQEH'),
    )(defaultSchema);

    expect(shouldReplaceLink(link, true, 'http://www.atlassian.com/')).toBe(
      false,
    );
  });

  it('returns true for same href and text if compare url matches', () => {
    const link = cleanOne(
      a({
        href: 'https://invis.io/P8OKINLRQEH',
      })('https://invis.io/P8OKINLRQEH'),
    )(defaultSchema);

    expect(shouldReplaceLink(link, true, 'https://invis.io/P8OKINLRQEH')).toBe(
      true,
    );
  });

  it('returns true for link with encoded spaces in url and text', () => {
    const link = cleanOne(
      a({
        href:
          'https://www.dropbox.com/s/2mh79iuglsnmbwf/Get%20Started%20with%20Dropbox.pdf?dl=0',
      })(
        'https://www.dropbox.com/s/2mh79iuglsnmbwf/Get%20Started%20with%20Dropbox.pdf?dl=0',
      ),
    )(defaultSchema);

    expect(shouldReplaceLink(link)).toBe(true);
  });

  it('returns true for link with url encoded spaces, text unencoded', () => {
    const link = cleanOne(
      a({
        href:
          'https://www.dropbox.com/s/2mh79iuglsnmbwf/Get%20Started%20with%20Dropbox.pdf?dl=0',
      })(
        'https://www.dropbox.com/s/2mh79iuglsnmbwf/Get Started with Dropbox.pdf?dl=0',
      ),
    )(defaultSchema);

    expect(shouldReplaceLink(link)).toBe(true);
  });

  it('returns true for link with text encoded spaces, url unencoded', () => {
    const link = cleanOne(
      a({
        href:
          'https://www.dropbox.com/s/2mh79iuglsnmbwf/Get Started with Dropbox.pdf?dl=0',
      })(
        'https://www.dropbox.com/s/2mh79iuglsnmbwf/Get%20Started%20with%20Dropbox.pdf?dl=0',
      ),
    )(defaultSchema);

    expect(shouldReplaceLink(link)).toBe(true);
  });

  it('returns true for link with slash', () => {
    const link = cleanOne(
      a({
        href: 'https://invis.io/P8OKINLRQEH/',
      })('https://invis.io/P8OKINLRQEH/'),
    )(defaultSchema);

    expect(shouldReplaceLink(link, true, 'https://invis.io/P8OKINLRQEH/')).toBe(
      true,
    );
  });

  it('returns true for link which ends with a full stop', () => {
    const link = cleanOne(
      a({
        href:
          'https://pug.jira-dev.com/wiki/spaces/~896045072/pages/4554883643/title.',
      })(
        'https://pug.jira-dev.com/wiki/spaces/~896045072/pages/4554883643/title.',
      ),
    )(defaultSchema);
    expect(
      shouldReplaceLink(
        link,
        true,
        'https://pug.jira-dev.com/wiki/spaces/~896045072/pages/4554883643/title.',
      ),
    ).toBe(true);
  });

  it('returns false for text node', () => {
    const textRefNode = text('https://invis.io/P8OKINLRQEH', defaultSchema);
    const textNode = Node.fromJSON(
      defaultSchema,
      (textRefNode as Node).toJSON(),
    );

    expect(shouldReplaceLink(textNode)).toBe(false);
  });
});
