import { JQLAutocomplete, ORDER_BY_CLAUSE, WHERE_CLAUSE } from '../../src';

const checks = [
	{
		query: '',
		suggestions: {
			tokens: {
				values: ['NOT', 'ORDER BY'],
				matchedText: '',
				replacePosition: [0, 0],
			},
			rules: {
				field: {
					context: {
						clause: WHERE_CLAUSE,
					},
					matchedText: '',
					replacePosition: [0, 0],
				},
			},
		},
	},
	{
		query: 'or',
		suggestions: {
			tokens: {
				values: ['NOT', 'ORDER BY'],
				matchedText: 'or',
				replacePosition: [0, 2],
			},
			rules: {
				field: {
					context: {
						clause: WHERE_CLAUSE,
					},
					matchedText: 'or',
					replacePosition: [0, 2],
				},
			},
		},
	},
	{
		query: 'proj',
		suggestions: {
			tokens: {
				values: ['NOT', 'ORDER BY'],
				matchedText: 'proj',
				replacePosition: [0, 4],
			},
			rules: {
				field: {
					context: {
						clause: WHERE_CLAUSE,
					},
					matchedText: 'proj',
					replacePosition: [0, 4],
				},
			},
		},
	},
	{
		query: 'project ',
		suggestions: {
			tokens: { values: [], matchedText: '', replacePosition: [8, 8] },
			rules: {
				fieldProperty: {
					context: null,
					matchedText: '',
					replacePosition: [8, 8],
				},
				operator: {
					context: { field: 'project' },
					matchedText: '',
					replacePosition: [8, 8],
				},
			},
		},
	},
	{
		query: 'project i',
		suggestions: {
			tokens: { values: [], matchedText: 'i', replacePosition: [8, 9] },
			rules: {
				fieldProperty: {
					context: null,
					matchedText: 'i',
					replacePosition: [8, 9],
				},
				operator: {
					context: { field: 'project' },
					matchedText: 'i',
					replacePosition: [8, 9],
				},
			},
		},
	},
	{
		query: 'project <',
		suggestions: {
			tokens: { values: [], matchedText: '<', replacePosition: [8, 9] },
			rules: {
				fieldProperty: {
					context: null,
					matchedText: '<',
					replacePosition: [8, 9],
				},
				operator: {
					context: { field: 'project' },
					matchedText: '<',
					replacePosition: [8, 9],
				},
			},
		},
	},
	{
		query: 'project is ',
		suggestions: {
			tokens: { values: ['EMPTY'], matchedText: '', replacePosition: [11, 11] },
			rules: {
				operator: {
					context: {
						field: 'project',
					},
					matchedText: 'is ',
					replacePosition: [8, 11],
				},
			},
		},
	},
	{
		query: 'project = ',
		suggestions: {
			tokens: { values: ['EMPTY'], matchedText: '', replacePosition: [10, 10] },
			rules: {
				value: {
					context: { field: 'project', operator: '=' },
					matchedText: '',
					replacePosition: [10, 10],
				},
				function: {
					context: { field: 'project', operator: '=' },
					matchedText: '',
					replacePosition: [10, 10],
				},
			},
		},
	},
	{
		query: 'project = jsw',
		suggestions: {
			tokens: {
				values: ['EMPTY'],
				matchedText: 'jsw',
				replacePosition: [10, 13],
			},
			rules: {
				value: {
					context: { field: 'project', operator: '=' },
					matchedText: 'jsw',
					replacePosition: [10, 13],
				},
				function: {
					context: { field: 'project', operator: '=' },
					matchedText: 'jsw',
					replacePosition: [10, 13],
				},
			},
		},
	},
	{
		query: 'project = jsw ',
		suggestions: {
			tokens: {
				values: ['AND', 'OR', 'ORDER BY'],
				matchedText: '',
				replacePosition: [14, 14],
			},
			rules: {
				function: {
					context: { field: 'project', operator: '=' },
					matchedText: 'jsw ',
					replacePosition: [10, 14],
				},
			},
		},
	},
	{
		query: 'project = jsw a',
		suggestions: {
			tokens: {
				values: ['AND', 'OR', 'ORDER BY'],
				matchedText: 'a',
				replacePosition: [14, 15],
			},
			rules: {
				function: {
					context: { field: 'project', operator: '=' },
					matchedText: 'jsw a',
					replacePosition: [10, 15],
				},
			},
		},
	},
	{
		query: 'project = jsw o',
		suggestions: {
			tokens: {
				values: ['AND', 'OR', 'ORDER BY'],
				matchedText: 'o',
				replacePosition: [14, 15],
			},
			rules: {
				function: {
					context: { field: 'project', operator: '=' },
					matchedText: 'jsw o',
					replacePosition: [10, 15],
				},
			},
		},
	},
	{
		query: 'project = jsw order by ',
		suggestions: {
			tokens: { values: [], matchedText: '', replacePosition: [23, 23] },
			rules: {
				field: {
					context: {
						clause: ORDER_BY_CLAUSE,
					},
					matchedText: '',
					replacePosition: [23, 23],
				},
			},
		},
	},
	{
		query: 'project = jsw order by r',
		suggestions: {
			tokens: { values: [], matchedText: 'r', replacePosition: [23, 24] },
			rules: {
				field: {
					context: {
						clause: ORDER_BY_CLAUSE,
					},
					matchedText: 'r',
					replacePosition: [23, 24],
				},
			},
		},
	},
	{
		query: 'project = jsw order by rank ',
		suggestions: {
			tokens: {
				values: ['ASC', 'DESC'],
				matchedText: '',
				replacePosition: [28, 28],
			},
			rules: {
				fieldProperty: {
					context: null,
					matchedText: '',
					replacePosition: [28, 28],
				},
			},
		},
	},
	{
		query: 'project = jsw order by rank asc, ',
		suggestions: {
			tokens: { values: [], matchedText: '', replacePosition: [33, 33] },
			rules: {
				field: {
					context: {
						clause: ORDER_BY_CLAUSE,
					},
					matchedText: '',
					replacePosition: [33, 33],
				},
			},
		},
	},
	{
		query: 'project = jsw order by rank asc, ',
		// Position caret at the start of the query
		selectionStart: 0,
		selectionEnd: 0,
		suggestions: {
			tokens: {
				values: ['NOT', 'ORDER BY'],
				matchedText: '',
				replacePosition: [0, 0],
			},
			rules: {
				field: {
					context: {
						clause: WHERE_CLAUSE,
					},
					matchedText: '',
					replacePosition: [0, 0],
				},
			},
		},
	},
	{
		query: 'NOT ',
		suggestions: {
			tokens: { values: ['NOT'], matchedText: '', replacePosition: [4, 4] },
			rules: {
				field: {
					context: {
						clause: WHERE_CLAUSE,
					},
					matchedText: '',
					replacePosition: [4, 4],
				},
			},
		},
	},
	{
		query: 'project was',
		suggestions: {
			tokens: { values: [], matchedText: 'was', replacePosition: [8, 11] },
			rules: {
				fieldProperty: {
					context: null,
					matchedText: 'was',
					replacePosition: [8, 11],
				},
				operator: {
					context: {
						field: 'project',
					},
					matchedText: 'was',
					replacePosition: [8, 11],
				},
			},
		},
	},
	{
		query: 'project was ',
		suggestions: {
			tokens: { values: ['EMPTY'], matchedText: '', replacePosition: [12, 12] },
			rules: {
				operator: {
					context: { field: 'project' },
					matchedText: 'was ',
					replacePosition: [8, 12],
				},
				value: {
					context: { field: 'project', operator: 'was' },
					matchedText: '',
					replacePosition: [12, 12],
				},
				function: {
					context: { field: 'project', operator: 'was' },
					matchedText: '',
					replacePosition: [12, 12],
				},
			},
		},
	},
	{
		query: 'project was in',
		suggestions: {
			tokens: {
				values: ['EMPTY'],
				matchedText: 'in',
				replacePosition: [12, 14],
			},
			rules: {
				operator: {
					context: { field: 'project' },
					matchedText: 'was in',
					replacePosition: [8, 14],
				},
				value: {
					context: { field: 'project', operator: 'was' },
					matchedText: 'in',
					replacePosition: [12, 14],
				},
				function: {
					context: { field: 'project', operator: 'was' },
					matchedText: 'in',
					replacePosition: [12, 14],
				},
			},
		},
	},
	{
		query: 'project = was',
		suggestions: {
			tokens: {
				values: ['EMPTY'],
				matchedText: 'was',
				replacePosition: [10, 13],
			},
			rules: {
				value: {
					context: { field: 'project', operator: '=' },
					matchedText: 'was',
					replacePosition: [10, 13],
				},
				function: {
					context: { field: 'project', operator: '=' },
					matchedText: 'was',
					replacePosition: [10, 13],
				},
			},
		},
	},
	{
		query: 'project = was in',
		suggestions: {
			tokens: { values: [], matchedText: 'in', replacePosition: [14, 16] },
			rules: {},
		},
	},
	{
		query: 'project was field',
		// Position caret at the start of "field", right after the whitespace
		selectionStart: 12,
		selectionEnd: 12,
		suggestions: {
			tokens: { values: ['EMPTY'], matchedText: '', replacePosition: [12, 12] },
			rules: {
				operator: {
					context: { field: 'project' },
					matchedText: 'was ',
					replacePosition: [8, 12],
				},
				value: {
					context: { field: 'project', operator: 'was' },
					matchedText: '',
					replacePosition: [12, 12],
				},
				function: {
					context: { field: 'project', operator: 'was' },
					matchedText: '',
					replacePosition: [12, 12],
				},
			},
		},
	},
	{
		query: 'project was not',
		suggestions: {
			tokens: {
				values: ['EMPTY'],
				matchedText: 'not',
				replacePosition: [12, 15],
			},
			rules: {
				operator: {
					context: { field: 'project' },
					matchedText: 'was not',
					replacePosition: [8, 15],
				},
				value: {
					context: { field: 'project', operator: 'was' },
					matchedText: 'not',
					replacePosition: [12, 15],
				},
				function: {
					context: { field: 'project', operator: 'was' },
					matchedText: 'not',
					replacePosition: [12, 15],
				},
			},
		},
	},
	{
		query: 'project was not ',
		suggestions: {
			tokens: { values: ['EMPTY'], matchedText: '', replacePosition: [16, 16] },
			rules: {
				operator: {
					context: { field: 'project' },
					matchedText: 'was not ',
					replacePosition: [8, 16],
				},
				value: {
					context: { field: 'project', operator: 'was not' },
					matchedText: '',
					replacePosition: [16, 16],
				},
				function: {
					context: { field: 'project', operator: 'was not' },
					matchedText: '',
					replacePosition: [16, 16],
				},
			},
		},
	},
	{
		query: 'project was not in',
		suggestions: {
			tokens: {
				values: ['EMPTY'],
				matchedText: 'in',
				replacePosition: [16, 18],
			},
			rules: {
				operator: {
					context: { field: 'project' },
					matchedText: 'was not in',
					replacePosition: [8, 18],
				},
				value: {
					context: { field: 'project', operator: 'was not' },
					matchedText: 'in',
					replacePosition: [16, 18],
				},
				function: {
					context: { field: 'project', operator: 'was not' },
					matchedText: 'in',
					replacePosition: [16, 18],
				},
			},
		},
	},
	{
		query: 'prOjEct wAs NOT iN',
		suggestions: {
			tokens: {
				values: ['EMPTY'],
				matchedText: 'iN',
				replacePosition: [16, 18],
			},
			rules: {
				operator: {
					context: { field: 'prOjEct' },
					matchedText: 'wAs NOT iN',
					replacePosition: [8, 18],
				},
				value: {
					context: { field: 'prOjEct', operator: 'was not' },
					matchedText: 'iN',
					replacePosition: [16, 18],
				},
				function: {
					context: { field: 'prOjEct', operator: 'was not' },
					matchedText: 'iN',
					replacePosition: [16, 18],
				},
			},
		},
	},
	{
		query: 'project was jsw ',
		suggestions: {
			tokens: {
				values: ['AFTER', 'AND', 'BEFORE', 'BY', 'DURING', 'ON', 'OR', 'ORDER BY'],
				matchedText: '',
				replacePosition: [16, 16],
			},
			rules: {
				function: {
					context: { field: 'project', operator: 'was' },
					matchedText: 'jsw ',
					replacePosition: [12, 16],
				},
			},
		},
	},
	{
		query: 'project was jsw before ',
		suggestions: {
			tokens: { values: [], matchedText: '', replacePosition: [23, 23] },
			rules: {},
		},
	},
	{
		query: 'project was jsw after "2020/02/06" ',
		suggestions: {
			tokens: {
				values: ['AFTER', 'AND', 'BEFORE', 'BY', 'DURING', 'ON', 'OR', 'ORDER BY'],
				matchedText: '',
				replacePosition: [35, 35],
			},
			rules: {},
		},
	},
	{
		query: 'project was jsw after "2020/02/06" before ',
		suggestions: {
			tokens: { values: [], matchedText: '', replacePosition: [42, 42] },
			rules: {},
		},
	},
	{
		query: 'project changed ',
		suggestions: {
			tokens: {
				values: ['AFTER', 'AND', 'BEFORE', 'BY', 'DURING', 'FROM', 'ON', 'OR', 'ORDER BY', 'TO'],
				matchedText: '',
				replacePosition: [16, 16],
			},
			rules: {},
		},
	},
	{
		query: 'project changed from ',
		suggestions: {
			tokens: { values: [], matchedText: '', replacePosition: [21, 21] },
			rules: {},
		},
	},
	{
		query: 'project in (',
		suggestions: {
			tokens: { values: ['EMPTY'], matchedText: '', replacePosition: [12, 12] },
			rules: {
				value: {
					context: { field: 'project', operator: 'in', isList: true },
					matchedText: '',
					replacePosition: [12, 12],
				},
				list: {
					context: { field: 'project', operator: 'in', isList: true },
					matchedText: '',
					replacePosition: [12, 12],
				},
				function: {
					context: { field: 'project', operator: 'in', isList: true },
					matchedText: '',
					replacePosition: [12, 12],
				},
			},
		},
	},
	{
		query: 'project in ((',
		suggestions: {
			tokens: { values: ['EMPTY'], matchedText: '', replacePosition: [13, 13] },
			rules: {
				value: {
					context: { field: 'project', operator: 'in', isList: true },
					matchedText: '',
					replacePosition: [13, 13],
				},
				list: {
					context: { field: 'project', operator: 'in', isList: true },
					matchedText: '',
					replacePosition: [13, 13],
				},
				function: {
					context: { field: 'project', operator: 'in', isList: true },
					matchedText: '',
					replacePosition: [13, 13],
				},
			},
		},
	},
	{
		query: 'project in (()',
		suggestions: {
			tokens: {
				values: ['EMPTY'],
				matchedText: ')',
				replacePosition: [13, 14],
			},
			rules: {
				function: {
					context: {
						field: 'project',
						isList: true,
						operator: 'in',
					},
					matchedText: ')',
					replacePosition: [13, 14],
				},
				list: {
					context: {
						field: 'project',
						isList: true,
						operator: 'in',
					},
					matchedText: ')',
					replacePosition: [13, 14],
				},
				value: {
					context: {
						field: 'project',
						isList: true,
						operator: 'in',
					},
					matchedText: ')',
					replacePosition: [13, 14],
				},
			},
		},
	},
	{
		query: '(project in (jsd)',
		suggestions: {
			tokens: { values: [], matchedText: ')', replacePosition: [16, 17] },
			rules: {
				function: {
					context: {
						field: 'project',
						isList: true,
						operator: 'in',
					},
					matchedText: 'jsd)',
					replacePosition: [13, 17],
				},
			},
		},
	},
	{
		query: '(project in (jsd) ',
		suggestions: {
			tokens: {
				matchedText: '',
				replacePosition: [18, 18],
				values: ['AND', 'OR'],
			},
			rules: {},
		},
	},
	{
		query: '(project in (jsd) AND status not in ',
		suggestions: {
			tokens: {
				matchedText: '',
				replacePosition: [36, 36],
				values: [],
			},
			rules: {
				function: {
					context: {
						field: 'status',
						operator: 'not in',
					},
					matchedText: '',
					replacePosition: [36, 36],
				},
				list: {
					context: {
						field: 'status',
						operator: 'not in',
					},
					matchedText: '',
					replacePosition: [36, 36],
				},
			},
		},
	},
	{
		query: 'project in (jsw, ',
		suggestions: {
			tokens: { values: ['EMPTY'], matchedText: '', replacePosition: [17, 17] },
			rules: {
				value: {
					context: { field: 'project', operator: 'in', isList: true },
					matchedText: '',
					replacePosition: [17, 17],
				},
				list: {
					context: { field: 'project', operator: 'in', isList: true },
					matchedText: '',
					replacePosition: [17, 17],
				},
				function: {
					context: { field: 'project', operator: 'in', isList: true },
					matchedText: '',
					replacePosition: [17, 17],
				},
			},
		},
	},
	{
		// Position caret directly before opening parentheses
		query: 'project in (jsw, ',
		selectionStart: 11,
		selectionEnd: 11,
		suggestions: {
			tokens: { values: [], matchedText: '', replacePosition: [11, 11] },
			rules: {
				list: {
					context: { field: 'project', operator: 'in' },
					matchedText: '',
					replacePosition: [11, 11],
				},
				function: {
					context: { field: 'project', operator: 'in' },
					matchedText: '',
					replacePosition: [11, 11],
				},
			},
		},
	},
	{
		// Position caret directly after opening parentheses
		query: 'project in (jsw, ',
		selectionStart: 12,
		selectionEnd: 12,
		suggestions: {
			tokens: { values: ['EMPTY'], matchedText: '', replacePosition: [12, 12] },
			rules: {
				value: {
					context: { field: 'project', operator: 'in', isList: true },
					matchedText: '',
					replacePosition: [12, 12],
				},
				list: {
					context: { field: 'project', operator: 'in', isList: true },
					matchedText: '',
					replacePosition: [12, 12],
				},
				function: {
					context: { field: 'project', operator: 'in', isList: true },
					matchedText: '',
					replacePosition: [12, 12],
				},
			},
		},
	},
	{
		query: 'project in (jsw jsd',
		suggestions: {
			tokens: { values: [], matchedText: 'jsd', replacePosition: [16, 19] },
			rules: {
				function: {
					context: { field: 'project', operator: 'in', isList: true },
					matchedText: 'jsw jsd',
					replacePosition: [12, 19],
				},
			},
		},
	},
	{
		query: 'project in (jsw jsd)',
		suggestions: {
			tokens: { values: [], matchedText: ')', replacePosition: [19, 20] },
			rules: {},
		},
	},
	{
		query: 'project in (jsw jsd)',
		// Position caret before closing parenthesis
		selectionStart: 19,
		selectionEnd: 19,
		suggestions: {
			tokens: { values: [], matchedText: 'jsd', replacePosition: [16, 19] },
			rules: {
				function: {
					context: {
						field: 'project',
						isList: true,
						operator: 'in',
					},
					matchedText: 'jsw jsd',
					replacePosition: [12, 19],
				},
			},
		},
	},
	{
		query: 'project in (jsw, "j',
		suggestions: {
			tokens: {
				values: ['EMPTY'],
				matchedText: '"j',
				replacePosition: [17, 19],
			},
			rules: {
				value: {
					context: { field: 'project', operator: 'in', isList: true },
					matchedText: '"j',
					replacePosition: [17, 19],
				},
				list: {
					context: { field: 'project', operator: 'in', isList: true },
					matchedText: '"j',
					replacePosition: [17, 19],
				},
				function: {
					context: { field: 'project', operator: 'in', isList: true },
					matchedText: '"j',
					replacePosition: [17, 19],
				},
			},
		},
	},
	{
		query: 'project in ()',
		suggestions: {
			tokens: {
				values: ['EMPTY'],
				matchedText: ')',
				replacePosition: [12, 13],
			},
			rules: {
				function: {
					context: {
						field: 'project',
						isList: true,
						operator: 'in',
					},
					matchedText: ')',
					replacePosition: [12, 13],
				},
				list: {
					context: {
						field: 'project',
						isList: true,
						operator: 'in',
					},
					matchedText: ')',
					replacePosition: [12, 13],
				},
				value: {
					context: {
						field: 'project',
						isList: true,
						operator: 'in',
					},
					matchedText: ')',
					replacePosition: [12, 13],
				},
			},
		},
	},
	{
		query: 'project in (EMPTY)',
		suggestions: {
			tokens: { values: [], matchedText: ')', replacePosition: [17, 18] },
			rules: {},
		},
	},
	{
		query: 'project in (jsw, jsd, jwm)',
		suggestions: {
			tokens: { values: [], matchedText: ')', replacePosition: [25, 26] },
			rules: {
				function: {
					context: {
						field: 'project',
						isList: true,
						operator: 'in',
					},
					matchedText: 'jwm)',
					replacePosition: [22, 26],
				},
			},
		},
	},
	{
		query: 'project in (jsw, jsd) ',
		suggestions: {
			tokens: {
				values: ['AND', 'OR', 'ORDER BY'],
				matchedText: '',
				replacePosition: [22, 22],
			},
			rules: {},
		},
	},
	{
		// Position caret directly before closing parentheses
		query: 'project in (jsw, jsd) ',
		selectionStart: 20,
		selectionEnd: 20,
		suggestions: {
			tokens: {
				values: ['EMPTY'],
				matchedText: 'jsd',
				replacePosition: [17, 20],
			},
			rules: {
				value: {
					context: { field: 'project', operator: 'in', isList: true },
					matchedText: 'jsd',
					replacePosition: [17, 20],
				},
				list: {
					context: { field: 'project', operator: 'in', isList: true },
					matchedText: 'jsd',
					replacePosition: [17, 20],
				},
				function: {
					context: { field: 'project', operator: 'in', isList: true },
					matchedText: 'jsd',
					replacePosition: [17, 20],
				},
			},
		},
	},
	{
		// Position caret directly after closing parentheses
		query: 'project in (jsw, jsd) ',
		selectionStart: 21,
		selectionEnd: 21,
		suggestions: {
			tokens: { values: [], matchedText: ')', replacePosition: [20, 21] },
			rules: {
				function: {
					context: {
						field: 'project',
						isList: true,
						operator: 'in',
					},
					matchedText: 'jsd)',
					replacePosition: [17, 21],
				},
			},
		},
	},
	{
		// Position caret after comma
		query: 'project in (jsw, jsd)',
		selectionStart: 16,
		selectionEnd: 16,
		suggestions: {
			tokens: { values: ['EMPTY'], matchedText: '', replacePosition: [16, 16] },
			rules: {
				value: {
					context: { field: 'project', operator: 'in', isList: true },
					matchedText: '',
					replacePosition: [16, 16],
				},
				list: {
					context: { field: 'project', operator: 'in', isList: true },
					matchedText: '',
					replacePosition: [16, 16],
				},
				function: {
					context: { field: 'project', operator: 'in', isList: true },
					matchedText: '',
					replacePosition: [16, 16],
				},
			},
		},
	},
	{
		// Position caret after second whitespace
		query: 'project in (jsw,    jsd)',
		selectionStart: 18,
		selectionEnd: 18,
		suggestions: {
			tokens: { values: ['EMPTY'], matchedText: '', replacePosition: [18, 18] },
			rules: {
				value: {
					context: { field: 'project', operator: 'in', isList: true },
					matchedText: '',
					replacePosition: [18, 18],
				},
				list: {
					context: { field: 'project', operator: 'in', isList: true },
					matchedText: '',
					replacePosition: [18, 18],
				},
				function: {
					context: { field: 'project', operator: 'in', isList: true },
					matchedText: '',
					replacePosition: [18, 18],
				},
			},
		},
	},
	{
		query: 'project != jsw and assignee = currentUser',
		// Position caret after 'an' in 'and'
		selectionStart: 17,
		selectionEnd: 17,
		suggestions: {
			tokens: {
				values: ['AND', 'OR', 'ORDER BY'],
				matchedText: 'an',
				replacePosition: [15, 18],
			},
			rules: {
				function: {
					context: { field: 'project', operator: '!=' },
					matchedText: 'jsw an',
					replacePosition: [11, 18],
				},
			},
		},
	},

	{
		query: 'project in (jsw and assignee = currentUser',
		// Position caret after 'an' in 'and'
		selectionStart: 18,
		selectionEnd: 18,
		suggestions: {
			tokens: {
				values: [],
				matchedText: 'an',
				replacePosition: [16, 19],
			},
			rules: {
				function: {
					context: { field: 'project', operator: 'in', isList: true },
					matchedText: 'jsw an',
					replacePosition: [12, 19],
				},
			},
		},
	},

	{
		query: 'project = jsw',
		// Selecting the entire query
		selectionStart: 0,
		selectionEnd: 13,
		suggestions: {
			tokens: {
				values: ['NOT', 'ORDER BY'],
				matchedText: '',
				replacePosition: [0, 13],
			},
			rules: {
				field: {
					context: {
						clause: WHERE_CLAUSE,
					},
					matchedText: '',
					replacePosition: [0, 13],
				},
			},
		},
	},

	{
		query: 'project = jsw',
		// Selecting 'ject' in 'project'
		selectionStart: 3,
		selectionEnd: 7,
		suggestions: {
			tokens: {
				values: ['NOT', 'ORDER BY'],
				matchedText: 'pro',
				replacePosition: [0, 7],
			},
			rules: {
				field: {
					context: {
						clause: WHERE_CLAUSE,
					},
					matchedText: 'pro',
					replacePosition: [0, 7],
				},
			},
		},
	},

	{
		query: 'project = jsw',
		// Selecting everything after 'project'
		selectionStart: 7,
		selectionEnd: 13,
		suggestions: {
			tokens: {
				values: ['NOT', 'ORDER BY'],
				matchedText: 'project',
				replacePosition: [0, 13],
			},
			rules: {
				field: {
					context: {
						clause: WHERE_CLAUSE,
					},
					matchedText: 'project',
					replacePosition: [0, 13],
				},
			},
		},
	},

	{
		query: 'project changed',
		// Selecting 'ang' in 'changed'
		selectionStart: 10,
		selectionEnd: 13,
		suggestions: {
			tokens: {
				values: [],
				matchedText: 'ch',
				replacePosition: [8, 15],
			},
			rules: {
				fieldProperty: {
					context: null,
					matchedText: 'ch',
					replacePosition: [8, 15],
				},
				operator: {
					context: { field: 'project' },
					matchedText: 'ch',
					replacePosition: [8, 15],
				},
			},
		},
	},

	{
		query: 'project changed',
		// Selecting 'oject ang' from middle of query
		selectionStart: 2,
		selectionEnd: 13,
		suggestions: {
			tokens: {
				values: ['NOT', 'ORDER BY'],
				matchedText: 'pr',
				replacePosition: [0, 13],
			},
			rules: {
				field: {
					context: {
						clause: WHERE_CLAUSE,
					},
					matchedText: 'pr',
					replacePosition: [0, 13],
				},
			},
		},
	},

	{
		query: 'type in standardIssueTypes()',
		// Selecting 'standardIssueTypes'
		selectionStart: 8,
		selectionEnd: 26,
		suggestions: {
			tokens: {
				values: [],
				matchedText: '',
				replacePosition: [8, 26],
			},
			rules: {
				list: {
					context: { field: 'type', operator: 'in' },
					matchedText: '',
					replacePosition: [8, 26],
				},
				function: {
					context: { field: 'type', operator: 'in' },
					matchedText: '',
					replacePosition: [8, 26],
				},
			},
		},
	},

	{
		query: 'type in standardIssueTypes()',
		// Position caret after 'standard' in 'standardIssueTypes'
		selectionStart: 16,
		selectionEnd: 16,
		suggestions: {
			tokens: {
				values: [],
				matchedText: 'standard',
				// Selection is inside the string token so we replace the string excluding parentheses.
				// Eventually we want this to also include parentheses to replace the entire function
				replacePosition: [8, 26],
			},
			rules: {
				list: {
					context: { field: 'type', operator: 'in' },
					matchedText: 'standard',
					replacePosition: [8, 26],
				},
				function: {
					context: { field: 'type', operator: 'in' },
					matchedText: 'standard',
					replacePosition: [8, 26],
				},
			},
		},
	},

	{
		query: 'project changed from',
		// Selecting 'ro' in 'from'
		selectionStart: 17,
		selectionEnd: 19,
		suggestions: {
			tokens: {
				values: ['AFTER', 'AND', 'BEFORE', 'BY', 'DURING', 'FROM', 'ON', 'OR', 'ORDER BY', 'TO'],
				matchedText: 'f',
				replacePosition: [16, 20],
			},
			rules: {},
		},
	},

	{
		query: 'status     = open',
		// Position caret at first whitespace token in a series of whitespace tokens
		selectionStart: 7,
		selectionEnd: 7,
		suggestions: {
			tokens: {
				values: [],
				matchedText: '',
				replacePosition: [7, 7],
			},
			rules: {
				fieldProperty: {
					context: null,
					matchedText: '',
					replacePosition: [7, 7],
				},
				operator: {
					context: { field: 'status' },
					matchedText: '',
					replacePosition: [7, 7],
				},
			},
		},
	},

	{
		query: 'status     = open',
		// Selecting from the middle of a series of whitespace tokens until the end of the text
		selectionStart: 8,
		selectionEnd: 17,
		suggestions: {
			tokens: {
				values: [],
				matchedText: '',
				replacePosition: [8, 17],
			},
			rules: {
				fieldProperty: {
					context: null,
					matchedText: '',
					replacePosition: [8, 17],
				},
				operator: {
					context: { field: 'status' },
					matchedText: '',
					replacePosition: [8, 17],
				},
			},
		},
	},
	{
		query: '"',
		suggestions: {
			tokens: {
				values: ['NOT', 'ORDER BY'],
				matchedText: '"',
				replacePosition: [0, 1],
			},
			rules: {
				field: {
					context: {
						clause: WHERE_CLAUSE,
					},
					matchedText: '"',
					replacePosition: [0, 1],
				},
			},
		},
	},
	{
		query: '"stat',
		suggestions: {
			tokens: {
				values: ['NOT', 'ORDER BY'],
				matchedText: '"stat',
				replacePosition: [0, 5],
			},
			rules: {
				field: {
					context: {
						clause: WHERE_CLAUSE,
					},
					matchedText: '"stat',
					replacePosition: [0, 5],
				},
			},
		},
	},
	{
		query: '"state of ',
		suggestions: {
			tokens: {
				values: ['NOT', 'ORDER BY'],
				matchedText: '"state of ',
				replacePosition: [0, 10],
			},
			rules: {
				field: {
					context: {
						clause: WHERE_CLAUSE,
					},
					matchedText: '"state of ',
					replacePosition: [0, 10],
				},
			},
		},
	},
	{
		query: '"status"',
		suggestions: {
			tokens: {
				values: ['NOT', 'ORDER BY'],
				matchedText: '"status"',
				replacePosition: [0, 8],
			},
			rules: {
				field: {
					context: {
						clause: WHERE_CLAUSE,
					},
					matchedText: '"status"',
					replacePosition: [0, 8],
				},
			},
		},
	},
	{
		query: '"status" = "In progress" or "stat',
		suggestions: {
			tokens: {
				values: ['NOT'],
				matchedText: '"stat',
				replacePosition: [28, 33],
			},
			rules: {
				field: {
					context: {
						clause: WHERE_CLAUSE,
					},
					matchedText: '"stat',
					replacePosition: [28, 33],
				},
			},
		},
	},
	{
		query: "'",
		suggestions: {
			tokens: {
				values: ['NOT', 'ORDER BY'],
				matchedText: "'",
				replacePosition: [0, 1],
			},
			rules: {
				field: {
					context: {
						clause: WHERE_CLAUSE,
					},
					matchedText: "'",
					replacePosition: [0, 1],
				},
			},
		},
	},
	{
		query: "'stat",
		suggestions: {
			tokens: {
				values: ['NOT', 'ORDER BY'],
				matchedText: "'stat",
				replacePosition: [0, 5],
			},
			rules: {
				field: {
					context: {
						clause: WHERE_CLAUSE,
					},
					matchedText: "'stat",
					replacePosition: [0, 5],
				},
			},
		},
	},
	{
		query: "'state of ",
		suggestions: {
			tokens: {
				values: ['NOT', 'ORDER BY'],
				matchedText: "'state of ",
				replacePosition: [0, 10],
			},
			rules: {
				field: {
					context: {
						clause: WHERE_CLAUSE,
					},
					matchedText: "'state of ",
					replacePosition: [0, 10],
				},
			},
		},
	},
	{
		query: "'status'",
		suggestions: {
			tokens: {
				values: ['NOT', 'ORDER BY'],
				matchedText: "'status'",
				replacePosition: [0, 8],
			},
			rules: {
				field: {
					context: {
						clause: WHERE_CLAUSE,
					},
					matchedText: "'status'",
					replacePosition: [0, 8],
				},
			},
		},
	},
	{
		query: "'status' = 'In progress' or 'stat",
		suggestions: {
			tokens: {
				values: ['NOT'],
				matchedText: "'stat",
				replacePosition: [28, 33],
			},
			rules: {
				field: {
					context: {
						clause: WHERE_CLAUSE,
					},
					matchedText: "'stat",
					replacePosition: [28, 33],
				},
			},
		},
	},
	{
		query: "'status' = 'In progress' or",
		// Position caret at whitespace token in operand ('In |progress')
		selectionStart: 15,
		selectionEnd: 15,
		suggestions: {
			tokens: {
				values: ['EMPTY'],
				matchedText: "'In ",
				replacePosition: [11, 24],
			},
			rules: {
				value: {
					context: { field: "'status'", operator: '=' },
					matchedText: "'In ",
					replacePosition: [11, 24],
				},
				function: {
					context: { field: "'status'", operator: '=' },
					matchedText: "'In ",
					replacePosition: [11, 24],
				},
			},
		},
	},
	{
		query: 'status = open and assignee = currentUser',
		// Position caret after open
		selectionStart: 13,
		selectionEnd: 13,
		suggestions: {
			tokens: {
				values: ['EMPTY'],
				matchedText: 'open',
				replacePosition: [9, 13],
			},
			rules: {
				value: {
					context: { field: 'status', operator: '=' },
					matchedText: 'open',
					replacePosition: [9, 13],
				},
				function: {
					context: { field: 'status', operator: '=' },
					matchedText: 'open',
					replacePosition: [9, 13],
				},
			},
		},
	},
	{
		query: 'status = open and assignee = currentUser',
		// Position caret before and
		selectionStart: 14,
		selectionEnd: 14,
		suggestions: {
			tokens: {
				values: ['AND', 'OR', 'ORDER BY'],
				matchedText: '',
				replacePosition: [14, 14],
			},
			rules: {
				function: {
					context: { field: 'status', operator: '=' },
					matchedText: 'open ',
					replacePosition: [9, 14],
				},
			},
		},
	},
	{
		query: 'status = open and assignee = currentUser',
		// Position caret before assignee
		selectionStart: 18,
		selectionEnd: 18,
		suggestions: {
			tokens: {
				values: ['NOT'],
				matchedText: '',
				replacePosition: [18, 18],
			},
			rules: {
				field: {
					context: {
						clause: WHERE_CLAUSE,
					},
					matchedText: '',
					replacePosition: [18, 18],
				},
			},
		},
	},
	{
		query: 'status was not in (EMPTY) AND assignee was currentUser() ORDER BY created desc',
		// Position caret before ORDER BY
		selectionStart: 57,
		selectionEnd: 57,
		suggestions: {
			tokens: {
				values: ['AFTER', 'AND', 'BEFORE', 'BY', 'DURING', 'ON', 'OR', 'ORDER BY'],
				matchedText: '',
				replacePosition: [57, 57],
			},
			rules: {},
		},
	},
	{
		query: 'status was not in (EMPTY) AND assignee was ORDER BY created desc',
		// Position caret before ORDER BY
		selectionStart: 43,
		selectionEnd: 43,
		suggestions: {
			tokens: {
				values: ['EMPTY'],
				matchedText: '',
				replacePosition: [43, 43],
			},
			rules: {
				operator: {
					context: {
						field: 'assignee',
					},
					matchedText: 'was ',
					replacePosition: [39, 43],
				},
				function: {
					context: {
						field: 'assignee',
						operator: 'was',
					},
					matchedText: '',
					replacePosition: [43, 43],
				},
				value: {
					context: {
						field: 'assignee',
						operator: 'was',
					},
					matchedText: '',
					replacePosition: [43, 43],
				},
			},
		},
	},
	{
		query: 'status WAS NOT IN (EMPTY) AND assignee was ORDER BY created desc',
		// Position caret after 'IN' operator
		selectionStart: 17,
		selectionEnd: 17,
		suggestions: {
			tokens: {
				values: ['EMPTY'],
				matchedText: 'IN',
				replacePosition: [15, 17],
			},
			rules: {
				operator: {
					context: {
						field: 'status',
					},
					matchedText: 'WAS NOT IN',
					replacePosition: [7, 17],
				},
				function: {
					context: {
						field: 'status',
						operator: 'was not',
					},
					matchedText: 'IN',
					replacePosition: [15, 17],
				},
				value: {
					context: {
						field: 'status',
						operator: 'was not',
					},
					matchedText: 'IN',
					replacePosition: [15, 17],
				},
			},
		},
	},
	{
		query: 'status was not in (EMPTY) AND ORDER BY created desc',
		// Position caret before ORDER BY
		selectionStart: 30,
		selectionEnd: 30,
		suggestions: {
			tokens: {
				values: ['NOT'],
				matchedText: '',
				replacePosition: [30, 30],
			},
			rules: {
				field: {
					context: {
						clause: 'where',
					},
					matchedText: '',
					replacePosition: [30, 30],
				},
			},
		},
	},
	{
		query: 'ORDER BY created desc',
		// Position caret before ORDER BY
		selectionStart: 0,
		selectionEnd: 0,
		suggestions: {
			tokens: {
				values: ['NOT', 'ORDER BY'],
				matchedText: '',
				replacePosition: [0, 0],
			},
			rules: {
				field: {
					context: {
						clause: WHERE_CLAUSE,
					},
					matchedText: '',
					replacePosition: [0, 0],
				},
			},
		},
	},
	{
		query: 'project = "j ORDER BY created DESC',
		// unclosed double quote
		// careat position just after 'project = "j
		// expected to replace string "j with suggestion(s)
		selectionStart: 12,
		selectionEnd: 12,
		suggestions: {
			tokens: {
				values: ['EMPTY'],
				matchedText: '"j',
				replacePosition: [10, 12],
			},
			rules: {
				value: {
					context: { field: 'project', operator: '=' },
					matchedText: '"j',
					replacePosition: [10, 12],
				},
				function: {
					context: { field: 'project', operator: '=' },
					matchedText: '"j',
					replacePosition: [10, 12],
				},
			},
		},
	},
	{
		query: "project = 'ro ORDER BY created DESC",
		// unclosed single quote
		// careat position just after 'project = "ro
		// expected to replace string 'ro with suggestion(s)
		selectionStart: 13,
		selectionEnd: 13,
		suggestions: {
			tokens: {
				values: ['EMPTY'],
				matchedText: "'ro",
				replacePosition: [10, 13],
			},
			rules: {
				value: {
					context: { field: 'project', operator: '=' },
					matchedText: "'ro",
					replacePosition: [10, 13],
				},
				function: {
					context: { field: 'project', operator: '=' },
					matchedText: "'ro",
					replacePosition: [10, 13],
				},
			},
		},
	},
	{
		query: 'project = "j ORDER BY created ASC',
		// unclosed double quote
		// careat position just after 'project = "j
		// selection from caret position to the end of the query
		// expected to replace whole string from starting from "j to the end of the query
		selectionStart: 12,
		selectionEnd: 34,
		suggestions: {
			tokens: {
				values: ['EMPTY'],
				matchedText: '"j',
				replacePosition: [10, 34],
			},
			rules: {
				value: {
					context: { field: 'project', operator: '=' },
					matchedText: '"j',
					replacePosition: [10, 34],
				},
				function: {
					context: { field: 'project', operator: '=' },
					matchedText: '"j',
					replacePosition: [10, 34],
				},
			},
		},
	},
	{
		query: 'project = "te AND status = Done ',
		// unclosed double quote
		// caret position is after "te and the selection string is ` A` starting from the caret position
		// string to be replaced is `"te A`
		selectionStart: 13,
		selectionEnd: 15,
		suggestions: {
			tokens: {
				values: ['EMPTY'],
				matchedText: '"te',
				replacePosition: [10, 15],
			},
			rules: {
				value: {
					context: { field: 'project', operator: '=' },
					matchedText: '"te',
					replacePosition: [10, 15],
				},
				function: {
					context: { field: 'project', operator: '=' },
					matchedText: '"te',
					replacePosition: [10, 15],
				},
			},
		},
	},
	{
		query: "project = 'ro AND status = Pending ",
		// unclosed single quote
		// caret position is after 'ro and the selection string is ` A` starting from the caret position
		// string to be replaced is `'ro A`
		selectionStart: 13,
		selectionEnd: 15,
		suggestions: {
			tokens: {
				values: ['EMPTY'],
				matchedText: "'ro",
				replacePosition: [10, 15],
			},
			rules: {
				value: {
					context: { field: 'project', operator: '=' },
					matchedText: "'ro",
					replacePosition: [10, 15],
				},
				function: {
					context: { field: 'project', operator: '=' },
					matchedText: "'ro",
					replacePosition: [10, 15],
				},
			},
		},
	},
	{
		query: "project = 'dev'",
		// selected text is `dev`
		// it is expected the entire selected string will be replaced alogn with quotes with suggestion selected
		selectionStart: 11,
		selectionEnd: 14,
		suggestions: {
			tokens: {
				values: ['EMPTY'],
				matchedText: "'",
				replacePosition: [10, 15],
			},
			rules: {
				value: {
					context: { field: 'project', operator: '=' },
					matchedText: "'",
					replacePosition: [10, 15],
				},
				function: {
					context: { field: 'project', operator: '=' },
					matchedText: "'",
					replacePosition: [10, 15],
				},
			},
		},
	},
	{
		query: "project = 'rom'",
		// partial text `ro` is selected
		// it is expected that the new suggestion will replace the entire quoted string
		selectionStart: 11,
		selectionEnd: 13,
		suggestions: {
			tokens: {
				values: ['EMPTY'],
				matchedText: "'",
				replacePosition: [10, 15],
			},
			rules: {
				value: {
					context: { field: 'project', operator: '=' },
					matchedText: "'",
					replacePosition: [10, 15],
				},
				function: {
					context: { field: 'project', operator: '=' },
					matchedText: "'",
					replacePosition: [10, 15],
				},
			},
		},
	},
];

describe('Autocomplete', () => {
	checks.forEach(
		({ query, suggestions, selectionStart = query.length, selectionEnd = query.length }) => {
			it(`provides correct suggestions for "${query}"`, () => {
				const autocomplete = JQLAutocomplete.fromText(query);

				const { tokens, rules } = autocomplete.getJQLSuggestionsForCaretPosition([
					selectionStart,
					selectionEnd,
				]);

				expect(tokens).toEqual(suggestions.tokens);
				expect(rules).toEqual(suggestions.rules);
			});
		},
	);
});
