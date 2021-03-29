import WikiMarkupTransformer from '../../../index';
import { Context } from '../../../interfaces';

describe('JIRA wiki markup - Images and attachments', () => {
  const testCases: Array<[string, string]> = [
    ['should find images in the text', '!image.png!'],
    [
      'should find absolute URL images and convert it to external media item',
      '!http://www.host.com/image.gif!',
    ],
    [
      'should find attachments with attributes',
      '!quicktime.mov|width=300,height=400!',
    ],
    [
      'should find attachments with percentage width attribute',
      '!fizzbuzz.txt|width=50%!',
    ],
    [
      'should clamp media with percentage width > 100%',
      '!fizzbuzz.txt|width=500%!',
    ],
    [
      'should find attachments in multiline string',
      `this is a line of text
!image.gif|align=right, vspace=4!
yep`,
    ],
    [
      'should find images in a multiline string with return symbols',
      '!Kapture 2018-04-04 at 16.36.13.gif!\r\n\r\nFoo',
    ],
    [
      '[CS-1879] should parse media with alt text in quotes',
      '!foo.png|alt="hello world"!',
    ],
    [
      '[CS-1879] should parse media with alt text without quotes',
      '!foo.png|alt=hello world!',
    ],
    [
      '[CS-1879] should parse media with alt text with sensitive characters',
      '!foo.png|alt=hello world, this is me, width=50%!',
    ],
    [
      '[CS-216] should parse media filename with "(" and ")"',
      '!Screen Shot (9db1eca8-8257-4763-92fb-e6417f9e34c9).jpeg|thumbnail!',
    ],
    [
      '[CS-1404] should parse attachments as one media group',
      '[^a-doc (jadsjdasjadsjkdasjk).pdf][^not-empty (askjsajnkjknads).txt]',
    ],
    [
      '[CS-1404] should parse attachments separated by a single new line as one media group',
      '[^a-doc (jadsjdasjadsjkdasjk).pdf]\r\n[^not-empty (askjsajnkjknads).txt]',
    ],
    [
      '[CS-1404] should parse attachments separated by any number of spaces as one media group',
      '[^a-doc (jadsjdasjadsjkdasjk).pdf]   [^not-empty (askjsajnkjknads).txt]',
    ],
    [
      '[CS-1404] should parse attachments separated by non-space character as separate media groups',
      '[^a-doc (jadsjdasjadsjkdasjk).pdf]a[^not-empty (askjsajnkjknads).txt]',
    ],
    [
      '[CS-1404] should parse attachments separated by multiple new lines as separate media groups',
      '[^a-doc (jadsjdasjadsjkdasjk).pdf]\r\n\r\n[^not-empty (askjsajnkjknads).txt]',
    ],
    [
      '[CS-1404] should parse consecutive attachments separated by one new line as one media group',
      '[^file1.txt]\r\n[^file2.txt]\r\n[^file3.txt]',
    ],
    [
      '[CS-1404] should parse list of multiple attachments separated by multiple new lines as separate media groups with multiple child media elements',
      '[^a-doc (jadsjdasjadsjkdasjk).pdf]\r\n[^not-empty (askjsajnkjknads).txt]\r\n\r\n[^a-doc (jadsjdasjadsjkdasjk).pdf]\r\n[^not-empty (askjsajnkjknads).txt]',
    ],
    [
      '[CS-1404] should parse attachments inside tables as single media group',
      '|colum 1 [^a-doc (jadsjdasjadsjkdasjk).pdf]\r\n[^not-empty (askjsajnkjknads).txt]|column 2|',
    ],
    [
      'should transform filename to id for embeddable attachments if NOT present in context',
      '!Screen Shot.jpeg!',
    ],
    [
      'should transform filename to id for attachment links if NOT present in context',
      '[^document.pdf]',
    ],
    [
      'should transform attachment next to image',
      '[^document.pdf] !image.png!',
    ],
    [
      '[CS-3136] should keep two media after one another',
      `[^2.png]
!2.png|thumbnail!
foo`,
    ],
    [
      'Should parse image with links',
      '!73b39312-2853-486c-bc63-9ce187c4bfc7|width=250,height=250,href="http://google.com"!',
    ],
  ];

  const context: Context = {
    conversion: {
      mediaConversion: {
        'file1.txt': { transform: 'uuid-file1', embed: true },
        'file2.txt': { transform: 'uuid-file2', embed: true },
        'file3.txt': { transform: 'uuid-file3', embed: true },
        'image.png': { transform: 'uuid-image', embed: true },
        'http://www.host.com/image.gif': {
          transform: 'uuid-http://www.host.com/image',
          embed: true,
        },
        'quicktime.mov': { transform: 'uuid-quicktime', embed: true },
        'image.gif': { transform: 'uuid-image', embed: true },
        'Kapture 2018-04-04 at 16.36.13.gif': {
          transform: 'uuid-Kapture',
          embed: true,
        },
        'Screen Shot (9db1eca8-8257-4763-92fb-e6417f9e34c9).jpeg': {
          transform: 'uuid-ScreenShot',
          embed: true,
        },
        'a-doc (jadsjdasjadsjkdasjk).pdf': {
          transform: 'uuid-a-doc (jadsjdasjadsjkdasjk)',
          embed: true,
        },
        'not-empty (askjsajnkjknads).txt': {
          transform: 'uuid-not-empty (askjsajnkjknads)',
          embed: true,
        },
      },
    },
  };

  for (const [testCaseDescription, markup] of testCases) {
    it(testCaseDescription, () => {
      const transformer = new WikiMarkupTransformer();
      expect(transformer.parse(markup, context)).toMatchSnapshot();
    });
  }

  it('should add collection from context', () => {
    const markup = 'Hello! !Screen Shot.jpeg!';
    const context: Context = {
      conversion: {
        mediaConversion: {
          'Screen Shot.jpeg': {
            transform: '9db1eca8-8257-4763-92fb-e6417f9e34c9',
            embed: true,
          },
        },
      },
      hydration: {
        media: {
          targetCollectionId: 'my-test-collection',
        },
      },
    };
    const transformer = new WikiMarkupTransformer();
    expect(transformer.parse(markup, context)).toMatchSnapshot();
  });
});
