import React from 'react';
import { md, code, Props } from '@atlaskit/docs';

export default md`
  ## Why?

  Working with ADF might be tricky at times, especially extracting data or manipulating existing documents.
  This package provides a set of utilities to traverse, modify and create ADF documents.

  ## Traverse

  **@atlaskit/adf-utils/traverse** provides methods to extract and manipulate data inside
  an ADF document.

  ${(
    <Props
      heading={'Traverse#traverse'}
      props={{
        kind: 'program',
        classes: [
          {
            kind: 'generic',
            name: {
              kind: 'id',
              name: 'Traverse API',
              type: null,
            },
            value: {
              kind: 'object',
              members: [
                {
                  key: {
                    kind: 'id',
                    name: 'traverse',
                  },
                  kind: 'property',
                  optional: true,
                  value: {
                    kind: 'generic',
                    value: {
                      kind: 'function',
                      returnType: {
                        kind: 'generic',
                        value: {
                          kind: 'id',
                          name: 'ADFEntity',
                        },
                      },
                      parameters: [
                        {
                          kind: 'param',
                          type: null,
                          value: {
                            kind: 'generic',
                            value: {
                              kind: 'id',
                              name: 'ADFEntity',
                            },
                          },
                        },
                        {
                          kind: 'param',
                          type: null,
                          value: {
                            kind: 'object',
                            members: [
                              {
                                key: {
                                  kind: 'id',
                                  name: 'node_type',
                                },
                                kind: 'property',
                                optional: true,
                                value: {
                                  kind: 'function',
                                  returnType: {
                                    kind: 'generic',
                                    value: {
                                      kind: 'id',
                                      name: 'ADFEntity | false | undefined',
                                    },
                                  },
                                  parameters: [
                                    {
                                      kind: 'param',
                                      type: null,
                                      value: {
                                        kind: 'generic',
                                        value: {
                                          kind: 'id',
                                          name: 'ADFEntity',
                                        },
                                      },
                                    },
                                    {
                                      kind: 'param',
                                      type: null,
                                      value: {
                                        kind: 'generic',
                                        value: {
                                          kind: 'id',
                                          name: 'ParentRef',
                                        },
                                      },
                                    },
                                  ],
                                },
                              },
                            ],
                          },
                        },
                      ],
                    },
                  },
                  leadingComments: [
                    {
                      type: 'commentBlock',
                      value:
                        'An implementation of the [visitor pattern](https://en.wikipedia.org/wiki/Visitor_pattern) for traversing ADF documents.',
                    },
                  ],
                },
              ],
            },
          },
        ],
      }}
    />
  )}

  ### Example:

  ${code`
  import { traverse } from '@atlaskit/adf-utils/traverse.es'; // .es for ES2015

  const doc = {/* some ADF doc */};

  traverse(doc, {
    // emoji visitor, matches all nodes with type === 'emoji'
    emoji: (node, parent) => {
      // do something with the node
    },

    mention: (node, parent) => {
      // do something with mention
    },

    taskList: (node, parent) => {
      // do something with taskList
    }
  })
  `}

  ${(
    <Props
      heading={'Traverse#map'}
      props={{
        kind: 'program',
        classes: [
          {
            kind: 'generic',
            name: {
              kind: 'id',
              name: 'Traverse#map',
              type: null,
            },
            value: {
              kind: 'object',
              members: [
                {
                  key: {
                    kind: 'id',
                    name: 'map',
                  },
                  kind: 'property',
                  optional: true,
                  value: {
                    kind: 'generic',
                    value: {
                      kind: 'function',
                      returnType: {
                        kind: 'generic',
                        value: {
                          kind: 'id',
                          name: 'Array<any>',
                        },
                      },
                      parameters: [
                        {
                          kind: 'param',
                          type: null,
                          value: {
                            kind: 'generic',
                            value: {
                              kind: 'id',
                              name: 'ADFEntity',
                            },
                          },
                        },
                        {
                          kind: 'param',
                          type: null,
                          value: {
                            kind: 'function',
                            returnType: {
                              kind: 'generic',
                              value: {
                                kind: 'id',
                                name: 'any',
                              },
                            },
                            parameters: [
                              {
                                kind: 'param',
                                type: null,
                                value: {
                                  kind: 'generic',
                                  value: {
                                    kind: 'id',
                                    name: 'ADFEntity',
                                  },
                                },
                              },
                            ],
                          },
                        },
                      ],
                    },
                  },
                  leadingComments: [
                    {
                      type: 'commentBlock',
                      value:
                        "[Array like](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/map) method to map over ADF nodes. Non-destructive – meaning that ADF can't be changed from the callback.",
                    },
                  ],
                },
              ],
            },
          },
        ],
      }}
    />
  )}

  ### Example:

  ${code`
  import { map } from '@atlaskit/adf-utils/traverse.es'; // .es for ES2015

  const doc = {/* some ADF doc */};

  const allNodeTypesFromTheDoc = map(doc, node => node.type);
  `}

  ${(
    <Props
      heading={'Traverse#filter'}
      props={{
        kind: 'program',
        classes: [
          {
            kind: 'generic',
            name: {
              kind: 'id',
              name: 'Traverse#filter',
              type: null,
            },
            value: {
              kind: 'object',
              members: [
                {
                  key: {
                    kind: 'id',
                    name: 'filter',
                  },
                  kind: 'property',
                  optional: true,
                  value: {
                    kind: 'generic',
                    value: {
                      kind: 'function',
                      returnType: {
                        kind: 'generic',
                        value: {
                          kind: 'id',
                          name: 'Array<ADFEntity>',
                        },
                      },
                      parameters: [
                        {
                          kind: 'param',
                          type: null,
                          value: {
                            kind: 'generic',
                            value: {
                              kind: 'id',
                              name: 'ADFEntity',
                            },
                          },
                        },
                        {
                          kind: 'param',
                          type: null,
                          value: {
                            kind: 'function',
                            returnType: {
                              kind: 'generic',
                              value: {
                                kind: 'id',
                                name: 'boolean',
                              },
                            },
                            parameters: [
                              {
                                kind: 'param',
                                type: null,
                                value: {
                                  kind: 'generic',
                                  value: {
                                    kind: 'id',
                                    name: 'ADFEntity',
                                  },
                                },
                              },
                            ],
                          },
                        },
                      ],
                    },
                  },
                  leadingComments: [
                    {
                      type: 'commentBlock',
                      value:
                        "[Array like](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/filter) method to filter out nodes that don't match a predicate. Non-destructive – meaning that ADF can't be changed from the callback.",
                    },
                  ],
                },
              ],
            },
          },
        ],
      }}
    />
  )}

  ### Example:

  ${code`
  import { filter } from '@atlaskit/adf-utils/traverse.es'; // .es for ES2015

  const doc = {/* some ADF doc */};

  const links = filter(
    doc,
    node =>
      (node.marks || []).some(mark => mark.type === 'link')
  );
  `}

  ${(
    <Props
      heading={'Traverse#reduce'}
      props={{
        kind: 'program',
        classes: [
          {
            kind: 'generic',
            name: {
              kind: 'id',
              name: 'Traverse#reduce',
              type: null,
            },
            value: {
              kind: 'object',
              members: [
                {
                  key: {
                    kind: 'id',
                    name: 'reduce',
                  },
                  kind: 'property',
                  optional: true,
                  value: {
                    kind: 'generic',
                    value: {
                      kind: 'function',
                      returnType: {
                        kind: 'generic',
                        value: {
                          kind: 'id',
                          name: 'accumulator',
                        },
                      },
                      parameters: [
                        {
                          kind: 'param',
                          type: null,
                          value: {
                            kind: 'generic',
                            value: {
                              kind: 'id',
                              name: 'ADFEntity',
                            },
                          },
                        },
                        {
                          kind: 'param',
                          type: null,
                          value: {
                            kind: 'function',
                            returnType: {
                              kind: 'generic',
                              value: {
                                kind: 'id',
                                name: 'accumulator',
                              },
                            },
                            parameters: [
                              {
                                kind: 'param',
                                type: null,
                                value: {
                                  kind: 'generic',
                                  value: {
                                    kind: 'id',
                                    name: 'accumulator',
                                  },
                                },
                              },
                              {
                                kind: 'param',
                                type: null,
                                value: {
                                  kind: 'generic',
                                  value: {
                                    kind: 'id',
                                    name: 'ADFEntity',
                                  },
                                },
                              },
                            ],
                          },
                        },
                        {
                          kind: 'param',
                          type: null,
                          value: {
                            kind: 'generic',
                            value: {
                              kind: 'id',
                              name: 'initial',
                            },
                          },
                        },
                      ],
                    },
                  },
                  leadingComments: [
                    {
                      type: 'commentBlock',
                      value:
                        "[Array like](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/reduce) redcue method – applies a function against an accumulator and each node in the ADF (from left to right) to reduce it to a single value. Non-destructive – meaning that ADF can't be changed from the callback.",
                    },
                  ],
                },
              ],
            },
          },
        ],
      }}
    />
  )}

  ### Example:

  ${code`
  import { reduce } from '@atlaskit/adf-utils/traverse.es'; // .es for ES2015

  const doc = {/* some ADF doc */};

  const emojiString = reduce(
    doc,
    (acc, node) =>
      node.type === 'emoji'
        ? (acc += '| ' + node.attrs.text + ' – '  + node.attrs.shortName)
        : acc,
    '',
  );
  // Example output: | 😀 – :grinning:| 🤦‍♂️ – :man_facepalming:| 🇷🇺 – :flag_ru:
  `}

  ## Builders

  Builders are the set of composable functions that help with creating ADF documents.

  > **@atlaskit/adf-utils** provides builders for all nodes and marks listed in [Atlassian Document Format](https://developer.atlassian.com/cloud/jira/platform/apis/document/structure/)
  specification.

  ### Usage:

  ${code`
  import { doc, p, emoji } from '@atlaskit/adf-utils/builders.es'; // .es for ES2015

  const adfDoc = doc(
    p('My favourite emoji is ', emoji({ text: '🤦‍♂️', shortName: ':man_facepalming:' }), '. What is yours?'),
  );

  /**
   * Produces following output:
   *
   * {
   *   "type": "doc",
   *   "version": 1,
   *   "content": [
   *     {
   *       "type": "paragraph",
   *       "content": [
   *         {
   *           "type": "text",
   *           "text": "My favourite emoji is "
   *         },
   *         {
   *           "type": "emoji",
   *           "attrs": {
   *             "text": "🤦‍♂️",
   *             "shortName": ":man_facepalming:"
   *           }
   *         },
   *         {
   *           "type": "text",
   *           "text": ". What is yours?"
   *         }
   *       ]
   *     }
   *   ]
   * }
   */
  `}

  #### Aliases

  There are aliases for some of the nodes and marks that match html tag names:

  ##### Nodes:

  * paragraph -> p
  * bulletList -> ul
  * orderedList -> ol
  * listItem -> li
  * tableCell -> td
  * tableHeader -> th
  * tableRow -> tr
  * hardBreak -> br
  * rule -> hr

  ##### Marks:

  * link -> a
  * strong -> b
  * underline -> u
`;
