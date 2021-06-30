import WikiMarkupTransformer from '../../../index';

describe('JIRA wiki markup - Links', () => {
  const testCases: Array<[string, string]> = [
    [
      'should convert simple links to link marks',
      'This is a [https://www.atlassian.com] link',
    ],
    [
      'should convert links with text to link marks',
      'This is an [Atlassian|https://www.atlassian.com] link',
    ],
    [
      'should convert mailto: links to link marks + remove mailto: prefix',
      'This is a [mailto:legendaryservice@atlassian.com] link',
    ],
    [
      'should ignore file links',
      'This is a local file [file:///c:/temp/foo.txt] link',
    ],
    ['should accept anchor-links starting with #', 'This is an [#anchor] link'],
    ['should ignore anchors', 'Anchor {anchor:anchorname} here'],
    [
      'should handle anchors with text and title',
      '[link-text|#anchor-text|link title]',
    ],
    [
      'should convert links with port to link marks',
      'Link with port [http://localhost:8080] here',
    ],
    [
      'should convert normal url text to link marks',
      'Hey, checkout atlassian=http://www.atlassian.com',
    ],
    [
      'should convert url text inside <> to link marks',
      'Hey, this is amazing <https://www.atlassian.com>',
    ],
    [
      'should convert IRC address text',
      'An IRC address: irc://atlassian.com/confluence',
    ],
    [
      'should convert mailto address text',
      'An IRC address: mailto:example@email.com',
    ],
    [
      'should ignore invalid protocal',
      'An invalid URL: invalid://nowhere.com/hello',
    ],
    [
      'should create Media Image and Link from linkable-image',
      'This is a linkable image [!image.jpg!|https://www.atlassian.com]',
    ],
    [
      '[CS-240] should know where to end the link',
      `[Link Title|http://www.google.com] boy I hope this doesn't go all the way to here] that would be bad.`,
    ],
    [
      '[CS-240] should handle links with titles',
      `[Link Description|http://www.google.com|title] boy I hope this doesn't go all the way to here] that would be bad.`,
    ],
    [
      '[CS-385] should link text in link format',
      `[https://splunk.paas-inf.net/en-GB/app/search/search?earliest=\-1d&latest=now|https://www.google.com]`,
    ],
    [
      '[CS-478] should resolve link with | in the url',
      `[page|https://hello.atlassian.net/wiki/spaces/Engage/pages/296780133/EP+Chrome+Extension#Set-test-metadata-without-having-to-create-a-message-in-targeting--|-title-=-3rd-Iteration-|-colour-=-Red-|-MAKEITSO-3652]`,
    ],
    [
      '[CS-542] should correctly style superscript links',
      `[^link title^|http://example.com]`,
    ],
    [
      '[CS-542] should correctly style superscript links',
      `[~link title~|http://example.com]`,
    ],
    [
      '[CS-542] should not parse nested links',
      '[test[test|http://example.com]',
    ],
    [
      '[EX-500] should jump over the link if it is invalid',
      'This \\\\[waves hands around\\\\]. Be',
    ],
    [
      '[CS-676] should trim escape in href',
      'This is a link https://extranet.atlassian.com/display/JPLAT/Atlaskit\\+components\\+needed\\+for\\+Bento',
    ],
    [
      '[CS-787] should convert back to inline card',
      'This is a smart link [https://www.dropbox.com/s/2mh79iuglsnmbwf/Get%20Started%20with%20Dropbox.pdf?dl=0|https://www.dropbox.com/s/2mh79iuglsnmbwf/Get%20Started%20with%20Dropbox.pdf?dl=0|smart-link]',
    ],
    [
      '[ADFS-80] should render color in links',
      'asdasd[{color:red}test{color}|test]asdasdasd',
    ],
  ];

  for (const [testCaseDescription, markup] of testCases) {
    it(testCaseDescription, () => {
      const transformer = new WikiMarkupTransformer();
      expect(
        transformer.parse(markup, {
          conversion: {
            mediaConversion: {
              'image.jpg': { transform: 'abc-123', embed: true },
            },
          },
        }),
      ).toMatchSnapshot();
    });
  }
});
