import WikiMarkupTransformer from '../../../index';

describe('JIRA wiki markup - Tables', () => {
  const testCases: Array<[string, string]> = [
    [
      'should find and convert tables',
      `||heading 1||heading 2||heading 3||
|col A1|col A2|col A3|
|col B1|col B2|h1. heading|`,
    ],
    [
      'should find text nodes at the end of the table',
      `|| foo || bar
| baz | multiline
yep
still going
yeah good luck closing this`,
    ],
    ['should not render trailing space into a new cell', '|cell 1|cell 2|   '],
    [
      'should remove trailing space before and after cell open and close',
      `|cell 1|cell 2|
              |cell 3|             cell 4 |`,
    ],
    [
      'should not include new line text in table',
      `||foo || bar ||
this is a new line text, not in the table`,
    ],
    [
      'should parse properly links inside a cell',
      '||hfoo||hbar|||[http://atlassian.com]||[link 1|https://atlassian.com], [link 2|https://atlassian.com]||',
    ],
    [
      'should parse properly medias inside a cell',
      '|!quicktime.mov|width=300,height=400!|',
    ],
    [
      '[CS-1404] should parse multiple attachments separated by non-whitespace characters inside tables as separate media groups',
      '|colum 1 [^a-doc (jadsjdasjadsjkdasjk).pdf]\r\n[^not-empty (askjsajnkjknads).txt] abc [^a-doc (jadsjdasjadsjkdasjk).pdf]\r\n[^not-empty (askjsajnkjknads).txt]|column 2|',
    ],
    [
      'HOT-87510 should respect emoji first in table content',
      `
|| Day / Status || Mon (!) || Tue (!) || Wed (!) || Thu (!) || Fri (!) ||
| Queue Size | 4 | 4 | 4 | 2 | 5 |`,
    ],
    [
      'CS-916 should respect empty columns',
      `
||Heading 1||Heading 2||
|Empty cell on the right ->| |

|Empty cell on the right ->| |
|Col A1|Col A2|

|Empty cell on the right ->| |
|Empty cell on the right ->| |

|Heading 1|Empty cell on the right ->| |
|Two empty cells on the right ->| | |

|Empty cell on the right ->| |<- Empty cell on the left|
|Empty cell on the right ->| |<- Empty cell on the left|`,
    ],
    [
      'should not terminate non-empty cell on whitespace at end of line',
      `
||*H1*||*H2*||*H3*||
|Trailing space on this line 
* Dot point|foo|foo|`,
    ],
    [
      'should remove whole row if no content is present',
      `
||*H1*||*H2*||*H3*||
| 
|* Dot point|foo|foo|`,
    ],
    [
      'should process \\r\\n correctly',
      '||Heading 1||Heading 2||\r\n|Col A1|Col A2|\r\n',
    ],
    [
      'should convert table with header column',
      `
||Header 0||Header Row 1||Header Row 2||
||Header Column 1|Cell 1|Cell 2|
||Header Column 2|Cell 3|Cell 4|
`,
    ],
    [
      'ADFS-700 Should not consider trailing spaces as a cell at the end of row',
      '|a| \n|b|',
    ],
    [
      'ADFS-80 Pipes inside invalid links do not close a table cell',
      `
|test|
|test|
|asdasd[{color:red}test{color}|test]asdasdasd|
|test|`,
    ],
  ];

  const context = {
    conversion: {
      mediaConversion: {
        'a-doc (jadsjdasjadsjkdasjk).pdf': {
          transform: 'abc-123',
          embed: true,
        },
        'not-empty (askjsajnkjknads).txt': {
          transform: 'abc-456',
          embed: true,
        },
        'quicktime.mov': { transform: 'abc-789', embed: true },
      },
    },
  };

  for (const [testCaseDescription, markup] of testCases) {
    it(testCaseDescription, () => {
      const transformer = new WikiMarkupTransformer();
      expect(transformer.parse(markup, context)).toMatchSnapshot();
    });
  }

  describe('macros', () => {
    const testCases: Array<[string, string]> = [
      ['should parse panel', `|{panel}foo{panel}|`],
      ['should parse color', `|{color:red}foo{panel}|`],
      ['should parse noformat', `|{noformat}foo{noformat}|`],
      ['should parse code', `|{code:javascript}foo{code}|`],
      ['should parse quote', `|{quote}foo{quote}|`],
      ['should parse anchor', `|{anchor}foo{anchor}|`],
    ];

    for (const [testCaseDescription, markup] of testCases) {
      it(testCaseDescription, () => {
        const transformer = new WikiMarkupTransformer();
        expect(transformer.parse(markup)).toMatchSnapshot();
      });
    }
  });
});
