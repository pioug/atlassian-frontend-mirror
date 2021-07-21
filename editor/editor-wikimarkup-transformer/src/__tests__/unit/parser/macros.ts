import WikiMarkupTransformer from '../../../index';

describe('JIRA wiki markup - Macros', () => {
  const testCases: Array<[string, string]> = [
    [
      'should convert simple quotes into a top level node',
      '{quote}simple quote{quote}',
    ],
    [
      'should convert string with quote into paragraph and quote',
      'this is a string with a {quote}quote{quote}',
    ],
    [
      'should not process noformat contents',
      '{noformat}{code}code inside noformat{code}{noformat}',
    ],
    [
      'should title of noformat',
      '{noformat:title=title}code inside noformat{noformat}',
    ],
    [
      'should not process code contents',
      '{code:xml}this is a {color:red}colored text{color}{noformat}{code}',
    ],
    ['should process code with title', '{code:title=title}const i = 0;{code}'],
    [
      'should convert panels',
      '{panel:title=My Title|borderStyle=dashed}Panel with nested quote here{panel}',
    ],
    [
      'should map panel bgColor in colorName to panel type',
      '{panel:title=My Title|bgColor=red}Panel with nested quote here{panel}',
    ],
    [
      'should map panel bgColor in hex value to panel type',
      '{panel:title=My Title|bgColor=#00FF00}Panel with nested quote here{panel}',
    ],
    [
      'should map panel bgColor in hex value to panel type',
      '{panel:title=My Title|bgColor=#rgb(0, 255, 255)}Panel with nested quote here{panel}',
    ],
    [
      'should convert multiple quotes containing string',
      'This is a {quote}quote1{quote}{quote}quote2{quote}',
    ],
    [
      'should split nodes if there is more than one level of depth',
      'This is a {quote}quote with a {panel}panel{panel} inside{quote}.',
    ],
    [
      'should support strings with a wrong order of macros',
      'This is a {panel:foo=bar} panel with a {quote}quote inside{panel} but it is broken{quote}',
    ],
    [
      'should collapse outer macros',
      '{panel:title=My Title|borderStyle=dashed}{quote}Panel with nested quote here{quote}{panel}.',
    ],
    [
      'should collapse and join outer macros',
      '{panel:title=My Title|borderStyle=dashed}This text is inside panel{quote}quote{panel}only quote{quote}',
    ],
    [
      'should lift rule node when it is inside macro',
      `{panel}this is a text
----
this is a text as well{panel}`,
    ],
    [
      'should lift attachment node when it is inside macro',
      `{panel}this is a text
[^attachment-file11.txt] [^attachment-file12.txt] [^attachment-file13.txt]

[^attachment-file21.txt] [^attachment-file22.txt] [^attachment-file23.txt]
[^attachment-file31.txt] [^attachment-file32.txt] [^attachment-file33.txt]text[^attachment-file41.txt] [^attachment-file42.txt] [^attachment-file43.txt]
this is a text as well{panel}`,
    ],
    [
      'should render rule node if it is on the top level',
      `this is a text
----
this is a text as well`,
    ],
    [
      'should transform h1 to Bold and Uppercase under blockquote',
      '{quote}h1. header one{quote}',
    ],
    [
      'should transform h2 to Bold and Italic under blockquote',
      '{quote}h2. header two{quote}',
    ],
    [
      'should transform h3 to Bold under blockquote',
      '{quote}h3. header three{quote}',
    ],
    [
      'should transform h4 to Bold and Gray under blockquote',
      '{quote}h4. header four{quote}',
    ],
    [
      'should transform h5 to Italic and Gray under blockquote',
      '{quote}h5. header five{quote}',
    ],
    [
      'should transform h6 to Gray under blockquote',
      '{quote}h6. header six{quote}',
    ],
    [
      'should lift list in a blockquote',
      `{quote}something
* list item
{quote}`,
    ],
    [
      'should lift attachment node when it is inside quote',
      `{quote}this is text inside a quote
[^attachment-file11.txt] [^attachment-file12.txt] [^attachment-file13.txt]

[^attachment-file21.txt] [^attachment-file22.txt] [^attachment-file23.txt]
[^attachment-file31.txt] [^attachment-file32.txt] [^attachment-file33.txt]text[^attachment-file41.txt] [^attachment-file42.txt] [^attachment-file43.txt]
this is text at end of a quote{quote}`,
    ],
    [
      'should render {anchor} as empty string',
      `You cannot see this {anchor:here}`,
    ],
    [
      'should render {loremipsum} as plain text',
      `This is plain text {loremipsum}`,
    ],
    [
      'should render macro likes {macrolike} as plain text',
      `This is plain text {macrolike}`,
    ],
    [
      'should render green success panel',
      `{panel:bgColor=green}
green
{panel}`,
    ],
    [
      'should render red error panel',
      `{panel:bgColor=red}
red
{panel}`,
    ],
    [
      '[CS-602] macro keyword is case insensitive',
      `{panEl:bgColor=red}
red
{panEl}`,
    ],
    [
      '[CS-1470] noformat macro converts to code node with no language',
      `{noformat}preformatted
text
with
linebreaks{noformat}`,
    ],
    [
      '[CS-1470] code macro converts to code node with xml language',
      `{code:xml}<test attr='value'><nested/></test>{code}`,
    ],
    [
      '[CS-1470] code macro converts to code node with java language',
      `{code:java}
      public static main(String test) {
        System.out.print("test");
     }{code}`,
    ],
    [
      'should allow pipes within colour macro, and not render as a table',

      '{color:#6554c0}|{color}',
    ],
    [
      '[CS-3139] code macro accepts C++ as language',
      `{code:C++|title="This is a plus + sign"}const a = 3 + 7{code}`,
    ],
    [
      'Should take only first occurrence of attribute into account',
      `{code:title="the real title"|title=the ignored title}const a = 3 + 7{code}`,
    ],
    [
      'Should work with multiple equal signs in a single attribute',
      `{code:title=title with = multiple=equal=signs}const a = 3 + 7{code}`,
    ],
    [
      'ADFS-277 should not blow up when default color is passed',

      '{color:default}foo{color}',
    ],
    [
      'ADFS-719 should place invalid adf macro inside a code block w/err msg',

      '{adf}{"invalid": "foobar"}{adf}',
    ],
    [
      'ADFS-719 should not blow up when a valid adf macro is passed in',

      '{adf}{"type":"paragraph","content":[]}{adf}',
    ],
  ];

  const context = {
    conversion: {
      mediaConversion: {
        'attachment-file11.txt': { transform: 'abc-file11' },
        'attachment-file12.txt': { transform: 'abc-file12' },
        'attachment-file13.txt': { transform: 'abc-file13' },
        'attachment-file21.txt': { transform: 'abc-file21' },
        'attachment-file22.txt': { transform: 'abc-file22' },
        'attachment-file23.txt': { transform: 'abc-file23' },
        'attachment-file31.txt': { transform: 'abc-file31' },
        'attachment-file32.txt': { transform: 'abc-file32' },
        'attachment-file33.txt': { transform: 'abc-file33' },
        'attachment-file41.txt': { transform: 'abc-file41' },
        'attachment-file42.txt': { transform: 'abc-file42' },
        'attachment-file43.txt': { transform: 'abc-file43' },
      },
    },
  };

  for (const [testCaseDescription, markup] of testCases) {
    it(testCaseDescription, () => {
      const transformer = new WikiMarkupTransformer();
      expect(transformer.parse(markup, context)).toMatchSnapshot();
    });
  }
});
