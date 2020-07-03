import WikiMarkupTransformer from '../../../index';

describe('JIRA wiki markup - Lists', () => {
  const testCases: Array<[string, string]> = [
    [
      'should find unordered lists where items start with *',
      `* some
* bullet
** *indented*
** bullets
* points`,
    ],
    [
      'should find unordered lists where items start with -',
      `- different
- bullet
- types`,
    ],
    [
      'should find unordered lists where items start with spaces',
      `- different
       - bullet
       - types`,
    ],
    [
      'should be able to create nested list with -',
      `- different
-- bullet
-- types`,
    ],
    [
      'should find ordered lists',
      `# a
# numbered
# list`,
    ],
    [
      'should find mixed ordered -> unordered lists',
      `# a
# numbered
#* with
#* nested
#* bullet
# list`,
    ],
    [
      'should find mixed unordered -> ordered lists',
      `* a
* bulleted
*# with
*# nested
*# numbered
* list`,
    ],
    ['should convert blockquotes into paragraphs', '* bq. This is sparta'],
    ['should convert headings into paragraphs', '* h1. Foo'],
    ['should convert rules into paragraphs', '* ----'],
    ['should use mediaSingle nodes', '* !attached-image.gif!'],
    [
      'should not fail for multiple lists',

      "Steps to reproduce:\r\n* Type something\r\n* Type @\r\n* Type few letters\r\n* mention mark disappears \r\n\r\nExpected:\r\n* Mention mark doesn't disappear",
    ],
    [
      'should break out the media group but merge separate media groups into single media group if only separated by space',
      `* This is a media group [^file1.pdf] [^file2.pdf] [^file3.pdf] [^file4.pdf] and text after it [^file5.pdf] [^file6.pdf] [^file7.pdf] [^file8.pdf]`,
    ],
    [
      'should break out the media group',
      `* This is a media group [^file.pdf] and text after it`,
    ],
    [
      'should break out the media group even in nested list',
      `* nested
** media group [^file.pdf] here
** nice nice
* all good`,
    ],
    [
      'should not be a list item if it follows by a line break',
      `* nested
*
*`,
    ],
    [
      'should find the full content of a list item properly',
      `* nested
       spaces in front of me`,
    ],
    [
      'should jump over empty lines in macro successfully',
      `* list with macro
{code}
sadfsadf

{code}
* list 2`,
    ],
    ['should not create a list if started with multiple dashes', `------ a`],
    ['should create a list if started with multiple hash symbols', `## a`],
    ['should create a list if started with multiple star symbols', `** a`],
    [
      'should NOT create a list of more than 20 levels of nesting',
      `********************* a`,
    ],
    [
      'should correctly insert a ruler if it occurs within a list',
      `
- a
----
- b
-- c
--- d
----
`,
    ],
    [
      'should correctly insert a 5 dash ruler if it occurs within a list',
      `
- a
-----
- b
-- c
--- d
-----
`,
    ],
    [
      'should insert a if it is followed by an empty line',
      `
- a
----
`,
    ],
    [
      'should continue list if rule is followed by text on next line',
      `
- a
----
abc
`,
    ],
    [
      'should handle lists with quad dash symbols',
      `
- a
---- b
-- c
`,
    ],
    ['should create single list mention', '- [~someName]'],
    [
      'should create list of mentions with rule in middle',
      `- [~name1]
- [~name2]
----
abc
- [~name3]
-- [~name4]
`,
    ],
    [
      '[CS-617] should not ignore double and triple dash in list item',
      `
* list item -- 1
* list item --- 2
`,
    ],
    [
      'should support codeBlock in listItem now',
      `
* item 1
* item 2 with {code}code block{code}
`,
    ],
    [
      'should not break {color} macro to differnt lines',
      `* {color:#205081}123{color} {color:#d04437}456{color}`,
    ],
    [
      'should allow pipes in a list, and not render as a table',

      `

* |


# |

      `,
    ],
  ];

  const context = {
    conversion: {
      mediaConversion: {
        'attached-image.gif': 'abc-attached',
        'file.pdf': 'abc-0',
        'file1.pdf': 'abc-1',
        'file2.pdf': 'abc-2',
        'file3.pdf': 'abc-3',
        'file4.pdf': 'abc-4',
        'file5.pdf': 'abc-5',
        'file6.pdf': 'abc-6',
        'file7.pdf': 'abc-7',
        'file8.pdf': 'abc-8',
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
