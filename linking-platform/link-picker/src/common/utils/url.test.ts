import { normalizeUrl } from './url';

describe('normalizeUrl', () => {
  it.each<string | { input: string; expected: string | null }>([
    'https://google.com',
    'https://google.com/some-path',
    'https://google.com/some-path/index.html',
    'http://google.com',
    'http://google.com/some-path',
    'http://google.com/some-path/index.html',
    // Text highlight link
    'https://github.com/atlassian/react-sweet-state#:~:text=/-,react%2Dsweet%2Dstate,-Public',
    // ftp
    'ftp://xyz.com/',
    'ftp://xyz.com/some-path/',
    'ftps://xyz.com/',
    'ftps://xyz.com/some-path/',
    // Scheme relative
    '//help.html',
    // This is a root-relative url
    '/etc',
    '/etc/xyz/index.html',
    // mailto
    'mailto:',
    'mailto:hello@test.com',
    // skype https://docs.microsoft.com/en-us/skype-sdk/skypeuris/skypeuris
    'skype:',
    'skype:echo123?call',
    // https://daringfireball.net/2005/12/callto_uris_safari
    'callto://+12125551234',
    { input: 'callto://+12125551234 xyz', expected: null },
    { input: 'xyz callto://+12125551234', expected: null },
    // https://developer.apple.com/library/archive/featuredarticles/iPhoneURLScheme_Reference/FacetimeLinks/FacetimeLinks.html
    'facetime:14085551234',
    'facetime:user@example.com',
    'facetime://user@example.com',
    { input: 'facetime://user@example.com xyz', expected: null },
    { input: 'xyz facetime://user@example.com', expected: null },
    'facetime:',
    // Not supported currently
    { input: 'facetime-audio:14085551234', expected: null },
    // Git
    'git://github.com/atlassian/react-sweet-state.git',
    // irc6
    'irc6://host:9000/channel?password',
    // nntp
    'nntp://news.server.example/example.group.this/12345',
    // news
    'news://news.server.example/example.group.this',
    // feed
    'feed:https://example.com/entries.atom',
    'feed://example.com/entries.atom',
    // svn
    'svn://svn.example.com/repos/MyRepo/MyProject/branches/MyBranch',
    // mvn
    'mvn:org.apache.servicemix.nmr/org.apache.servicemix.nmr.api/1.0.0-m2',
    // ssh
    'ssh://username@hostname:path',
    'ssh://username@hostname:/path',
    'ssh://login@server.com:12345/~/repository.git',
    // scp
    'scp://example.com/file.zip',
    { input: 'scp:', expected: null },
    // sftp
    'sftp://host.example.com:22/orders.xml?Delete=true',
    { input: 'sftp:', expected: null },
    // itms
    'itms:',
    'itms://itunes.com/apps/app',
    // notes
    'notes:',
    'notes://servername/database/view/documentuniqueid',
    // hipchat
    'hipchat://',
    // sourcetree
    'sourcetree:',
    // urn
    'urn:',
    'urn:isbn:0451450523',
    // tel
    'tel:',
    'tel:555-666-7777',
    //xmpp
    'xmpp:',
    'xmpp:romeo@montague.net?message',
    // telnet
    'telnet:',
    'telnet://foo',
    // vnc
    'vnc:',
    'vnc://hostname?foo=bar',
    // rdp
    'rdp:',
    'rdp://full%20address=s:mypc:3389&audiomode=i:2&disable%20themes=i:1',
    // whatspp
    'whatsapp:',
    'whatsapp://send',
    'whatsapp://send?phone=1234&text=Hello%20world',
    // slack
    'slack:',
    'slack://open',
    // sips
    'sip:',
    'sips:',
    'sip:joe.bloggs@212.123.1.213',
    'sip:support@phonesystem.xyz.com',
    'sip:22444032@phonesystem.xyz.com:6000',
    'sips:joe.bloggs@212.123.1.213',
    'sips:support@phonesystem.xyz.com',
    'sips:22444032@phonesystem.xyz.com:6000',
    // magnet
    'magnet:',
    'magnet:?xt=urn:btih:5dee65101db281ac9c46344cd6b175cdcad53426',
    // Hash/ID/Anchor
    '#',
    '#xyz',
    // This is a valid url
    'https://google.com/https://youtube.com',
    // This has undesireable text before a 'linkable' url
    { input: 'hello google.com', expected: null },
    // This has undesireable text before the url
    { input: 'hello https://google.com', expected: null },
    // This has undesirable text after the url
    { input: 'https://google.com um this shouldnt be here', expected: null },
    // Query string
    'https://google.com/search?q=query',
    // Query + hash
    'https://google.com/search?q=query#id',
    // Trims url
    { input: 'https://google.com    ', expected: 'https://google.com' },
    // Jamf Self Service on MacOS
    {
      input: 'jamfselfservice://content?entity=policy&id=551&action=view ',
      expected: 'jamfselfservice://content?entity=policy&id=551&action=view',
    },
  ])('correctly handles normalizeUrl case for `%o`', testData => {
    // If testdata is string only, expected value is the input value
    if (typeof testData === 'string') {
      expect(normalizeUrl(testData)).toBe(testData);
    } else {
      const { input, expected } = testData;
      expect(normalizeUrl(input)).toBe(expected);
    }
  });
});
