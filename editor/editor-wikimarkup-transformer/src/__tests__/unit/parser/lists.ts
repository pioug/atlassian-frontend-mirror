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
		['should break out the media group', `* This is a media group [^file.pdf] and text after it`],
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
		['should NOT create a list of more than 20 levels of nesting', `********************* a`],
		[
			'ADFS-453 should NOT create a list of more than 20 levels of nesting when nesting different types of lists',
			`# \n********************* a`,
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
			'should lift action list inside an orderedList',
			// Adding this test till the node-nesting changes are added back
			`# item 1
{adf:display=block}{"type":"taskList","attrs":{"localId":"0f945022-3cd7-4243-bc48-ea5cf8d8e03f"},"content":[{"type":"taskItem","attrs":{"localId":"be22aa5c-18e2-4658-a7e0-ff60dcad4fa7","state":"TODO"},"content":[{"type":"text","text":"task 1"}]},{"type":"taskList","attrs":{"localId":"99fbd0cd-4d0a-45aa-9003-e6e61c697454"},"content":[{"type":"taskItem","attrs":{"localId":"93d93d4b-0eae-4d66-9e5e-5d4bd5bf821f","state":"TODO"},"content":[{"type":"text","text":"sub-task 1"}]}]},{"type":"taskItem","attrs":{"localId":"b1e6f046-0def-4652-9b9d-25c1617a488e","state":"TODO"},"content":[{"type":"text","text":"task 2 "}]}]}{adf}
# item 2`,
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
		[
			'ESS-2539 Should render list separated by ruler properly',
			`
      - a
      ----
      -- b
    `,
		],
		[
			'ADFEXP-371 should have strikethrough mark along with textColor',
			`# -{color:red}test{color}-`,
		],
		['ADFEXP-371 should have strong mark along with textColor', `# *{color:red}test{color}*`],
		['ADFEXP-371 should have emphasis mark along with textColor', `# _{color:red}test{color}_`],
		['ADFEXP-371 should not have emphasis mark along with code macro', `# _{code}test{code}_`],
		[
			'ADFEXP-371 should have strikethrough mark along with textColor with inverted order',
			`# {color:red}-test-{color}`,
		],
		[
			'ADFEXP-371 should parse color and code macro with multiple line breaks successfully',
			`# test {color:red}
one


{color} test {code:java}

two





{code}`,
		],
		[
			'ADFEXP-371 should parse color and code macro with multiple line breaks and strikethroughs successfully',
			`# test -{color:red}
one


{color}- test -{code:java}

two





{code}-`,
		],
		[
			'ADFEXP-371 should parse image macro inside a color macro',
			`# {color}!http://example.com/?insection!{color}`,
		],
		[
			'ADFEXP-371 should parse image macro inside a noformat',
			`# {noformat}!http://example.com/?insection!{noformat}`,
		],
		[
			'ADFEXP-371 should parse invalid ADF macro inside a codeBlock',
			'* {adf}{"invalid": "foobar"}{adf}',
		],
		[
			'ADFEXP-371 should parse codeblock inside a noformat',
			'* {noformat}{code}code macro inside noformat{code}{noformat}',
		],
		[
			'ADFEXP-371 should parse codeblock inside a color',
			'* {color:Red}{code}code macro inside noformat{code}{color}',
		],
		[
			'ADFEXP-371 should correctly parse color macro inside a code macro',
			`* {code}
test


{color:red}



code inside noformat


{color:red}{code}`,
		],
	];

	const context = {
		conversion: {
			mediaConversion: {
				'attached-image.gif': { transform: 'abc-attached', embed: true },
				'file.pdf': { transform: 'abc-0', embed: true },
				'file1.pdf': { transform: 'abc-1', embed: true },
				'file2.pdf': { transform: 'abc-2', embed: true },
				'file3.pdf': { transform: 'abc-3', embed: true },
				'file4.pdf': { transform: 'abc-4', embed: true },
				'file5.pdf': { transform: 'abc-5', embed: true },
				'file6.pdf': { transform: 'abc-6', embed: true },
				'file7.pdf': { transform: 'abc-7', embed: true },
				'file8.pdf': { transform: 'abc-8', embed: true },
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
