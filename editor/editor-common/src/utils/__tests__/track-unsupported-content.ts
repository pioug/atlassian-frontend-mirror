import { Node as PMNode } from 'prosemirror-model';

import { createSchema } from '@atlaskit/adf-schema';

import {
  ACTION,
  ACTION_SUBJECT,
  ACTION_SUBJECT_ID,
} from '../../utils/analytics';
import {
  findAndTrackUnsupportedContentNodes,
  fireUnsupportedEvent,
  trackUnsupportedContentTooltipDisplayedFor,
} from '../track-unsupported-content';

let dispatchAnalyticsEventMock: any;

const nodesConfig = [
  'doc',
  'paragraph',
  'text',
  'table',
  'tableRow',
  'tableCell',
  'unsupportedBlock',
  'unsupportedInline',
  'date',
  'inlineCard',
  'expand',
  'bodiedExtension',
];
const marksConfig = [
  'em',
  'strong',
  'strike',
  'alignment',
  'indentation',
  'unsupportedMark',
  'unsupportedNodeAttribute',
];
const schema = createSchema({ nodes: nodesConfig, marks: marksConfig });

describe('findAndTrackUnsupportedContentNodes', () => {
  beforeEach(() => {
    dispatchAnalyticsEventMock = jest.fn();
  });

  afterEach(() => {
    dispatchAnalyticsEventMock.mockRestore();
  });

  it('should fire analytics event for unsupportedBlock content', () => {
    const entity = {
      version: 1,
      type: 'doc',
      content: [
        {
          type: 'unsupportedBlock',
          attrs: {
            originalValue: {
              type: 'NewlayoutSection',
              content: [
                {
                  type: 'layoutColumn',
                  attrs: {
                    width: 50,
                  },
                  content: [
                    {
                      type: 'paragraph',
                      content: [],
                    },
                  ],
                },
                {
                  type: 'layoutColumn',
                  attrs: {
                    width: 50,
                  },
                  content: [
                    {
                      type: 'paragraph',
                      content: [],
                    },
                  ],
                },
              ],
              marks: [
                {
                  type: 'breakout',
                  attrs: {
                    mode: 'wide',
                  },
                },
              ],
            },
          },
        },
      ],
    };
    const doc = PMNode.fromJSON(schema, entity);
    findAndTrackUnsupportedContentNodes(
      doc,
      schema,
      dispatchAnalyticsEventMock,
    );
    expect(dispatchAnalyticsEventMock).toBeCalledWith(
      expect.objectContaining({
        action: 'unsupportedContentEncountered',
        actionSubject: 'document',
        actionSubjectId: 'unsupportedBlock',
        attributes: {
          unsupportedNode: {
            type: 'NewlayoutSection',
            parentType: 'doc',
            ancestry: 'doc',
            marks: [
              {
                type: 'breakout',
                attrs: {
                  mode: 'wide',
                },
              },
            ],
            attrs: {},
          },
        },
        eventType: 'track',
      }),
    );
  });

  it('should fire analytics event for unsupportedInline content', () => {
    const entity = {
      version: 1,
      type: 'doc',
      content: [
        {
          type: 'paragraph',
          content: [
            {
              type: 'unsupportedInline',
              attrs: {
                originalValue: {
                  type: 'SomeInline',
                  marks: [
                    {
                      type: 'strong',
                    },
                  ],
                },
              },
            },
          ],
        },
      ],
    };

    const doc = PMNode.fromJSON(schema, entity);
    findAndTrackUnsupportedContentNodes(
      doc,
      schema,
      dispatchAnalyticsEventMock,
    );
    expect(dispatchAnalyticsEventMock).toBeCalledWith(
      expect.objectContaining({
        action: 'unsupportedContentEncountered',
        actionSubject: 'document',
        actionSubjectId: 'unsupportedInline',
        attributes: {
          unsupportedNode: {
            type: 'SomeInline',
            parentType: 'paragraph',
            ancestry: 'doc paragraph',
            marks: [
              {
                type: 'strong',
              },
            ],
            attrs: {},
          },
        },
        eventType: 'track',
      }),
    );
  });

  it(`should fire analytics events for unsupportedBlock and
      unsupportedInline content in the complex nested hirerachy `, () => {
    const entity = {
      version: 1,
      type: 'doc',
      content: [
        {
          type: 'table',
          attrs: {
            isNumberColumnEnabled: false,
            layout: 'default',
          },
          content: [
            {
              type: 'tableRow',
              content: [
                {
                  type: 'tableCell',
                  attrs: {},
                  content: [
                    {
                      type: 'paragraph',
                      content: [
                        {
                          type: 'unsupportedInline',
                          attrs: {
                            originalValue: {
                              type: 'NewInlineNode',
                              attrs: {
                                text: 'DONE',
                                color: 'neutral',
                                localId: 'c9d486ea-eb4e-4bdd-a911-e739879af4d0',
                                style: '',
                              },
                            },
                          },
                        },
                        {
                          type: 'text',
                          text: ' ',
                        },
                      ],
                    },
                  ],
                },
                {
                  type: 'tableCell',
                  attrs: {},
                  content: [
                    {
                      type: 'unsupportedBlock',
                      attrs: {
                        originalValue: {
                          type: 'NewBlockNode',
                          content: [],
                        },
                      },
                    },
                  ],
                },
                {
                  type: 'tableCell',
                  attrs: {},
                  content: [
                    {
                      type: 'paragraph',
                      content: [],
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
    };

    const doc = PMNode.fromJSON(schema, entity);
    findAndTrackUnsupportedContentNodes(
      doc,
      schema,
      dispatchAnalyticsEventMock,
    );
    expect(dispatchAnalyticsEventMock).toHaveBeenCalledTimes(2);
    expect(dispatchAnalyticsEventMock).toHaveBeenNthCalledWith(
      1,
      expect.objectContaining({
        action: 'unsupportedContentEncountered',
        actionSubject: 'document',
        actionSubjectId: 'unsupportedInline',
        attributes: {
          unsupportedNode: {
            type: 'NewInlineNode',
            parentType: 'paragraph',
            ancestry: 'doc table tableRow tableCell paragraph',
            marks: [],
            attrs: {
              text: '',
              color: 'neutral',
              localId: 'c9d486ea-eb4e-4bdd-a911-e739879af4d0',
              style: '',
            },
          },
        },
        eventType: 'track',
      }),
    );
    expect(dispatchAnalyticsEventMock).toHaveBeenNthCalledWith(
      2,
      expect.objectContaining({
        action: 'unsupportedContentEncountered',
        actionSubject: 'document',
        actionSubjectId: 'unsupportedBlock',
        attributes: {
          unsupportedNode: {
            type: 'NewBlockNode',
            parentType: 'tableCell',
            ancestry: 'doc table tableRow tableCell',
            marks: [],
            attrs: {},
          },
        },
        eventType: 'track',
      }),
    );
  });

  it(`should fire analytics event for unsupportedMark when there is unknown mark`, () => {
    const entity = {
      version: 1,
      type: 'doc',
      content: [
        {
          type: 'paragraph',
          content: [
            {
              type: 'text',
              text: 'Some Text',
              marks: [
                {
                  type: 'unsupportedMark',
                  attrs: {
                    originalValue: {
                      type: 'unknown',
                    },
                  },
                },
              ],
            },
          ],
        },
      ],
    };

    const doc = PMNode.fromJSON(schema, entity);
    findAndTrackUnsupportedContentNodes(
      doc,
      schema,
      dispatchAnalyticsEventMock,
    );
    expect(dispatchAnalyticsEventMock).toBeCalledWith(
      expect.objectContaining({
        action: 'unsupportedContentEncountered',
        actionSubject: 'document',
        actionSubjectId: 'unsupportedMark',
        attributes: {
          unsupportedNode: {
            type: 'unknown',
            parentType: 'paragraph',
            ancestry: 'doc paragraph',
            marks: [],
            attrs: {},
          },
        },
        eventType: 'track',
      }),
    );
  });

  it(`should fire analytics event for unsupportedMark for a mark
       with redundant attributes`, () => {
    const entity = {
      version: 1,
      type: 'doc',
      content: [
        {
          type: 'paragraph',
          content: [
            {
              type: 'text',
              text: 'Some Text',
              marks: [
                {
                  type: 'unsupportedMark',
                  attrs: {
                    originalValue: {
                      type: 'strong',
                      attrs: {
                        type: 'test',
                      },
                    },
                  },
                },
              ],
            },
          ],
        },
      ],
    };

    const doc = PMNode.fromJSON(schema, entity);
    findAndTrackUnsupportedContentNodes(
      doc,
      schema,
      dispatchAnalyticsEventMock,
    );
    expect(dispatchAnalyticsEventMock).toBeCalledWith(
      expect.objectContaining({
        action: 'unsupportedContentEncountered',
        actionSubject: 'document',
        actionSubjectId: 'unsupportedMark',
        attributes: {
          unsupportedNode: {
            type: 'strong',
            parentType: 'paragraph',
            ancestry: 'doc paragraph',
            marks: [],
            attrs: {
              type: 'test',
            },
          },
        },
        eventType: 'track',
      }),
    );
  });

  it(`should fire analytics event for unsupportedMark for a mark
       with invalid attributes`, () => {
    const entity = {
      version: 1,
      type: 'doc',
      content: [
        {
          type: 'paragraph',
          content: [
            {
              type: 'text',
              text: 'Some Text',
            },
          ],
          marks: [
            {
              type: 'unsupportedMark',
              attrs: {
                originalValue: {
                  type: 'alignment',
                  attrs: {
                    align: 'someAlignment',
                  },
                },
              },
            },
          ],
        },
      ],
    };

    const doc = PMNode.fromJSON(schema, entity);
    findAndTrackUnsupportedContentNodes(
      doc,
      schema,
      dispatchAnalyticsEventMock,
    );
    expect(dispatchAnalyticsEventMock).toBeCalledWith(
      expect.objectContaining({
        action: 'unsupportedContentEncountered',
        actionSubject: 'document',
        actionSubjectId: 'unsupportedMark',
        attributes: {
          unsupportedNode: {
            type: 'alignment',
            parentType: 'doc',
            ancestry: 'doc',
            marks: [],
            attrs: {
              align: 'someAlignment',
            },
          },
        },
        eventType: 'track',
      }),
    );
  });

  it(`should fire analytics event for unsupportedMarks when there are
     unknown mark, mark with invalid attributes & mark with redundant attributes`, () => {
    const entity = {
      version: 1,
      type: 'doc',
      content: [
        {
          type: 'paragraph',
          content: [
            {
              type: 'text',
              text: 'Some Text',
              marks: [
                {
                  type: 'unsupportedMark',
                  attrs: {
                    originalValue: {
                      type: 'unknown',
                    },
                  },
                },
                {
                  type: 'unsupportedMark',
                  attrs: {
                    originalValue: {
                      type: 'strong',
                      attrs: {
                        type: 'superStrong',
                      },
                    },
                  },
                },
              ],
            },
          ],
          marks: [
            {
              type: 'unsupportedMark',
              attrs: {
                originalValue: {
                  type: 'alignment',
                  attrs: {
                    align: 'someAlignment',
                  },
                },
              },
            },
          ],
        },
      ],
    };

    const doc = PMNode.fromJSON(schema, entity);
    findAndTrackUnsupportedContentNodes(
      doc,
      schema,
      dispatchAnalyticsEventMock,
    );
    expect(dispatchAnalyticsEventMock).toHaveBeenCalledTimes(3);
    expect(dispatchAnalyticsEventMock).toHaveBeenNthCalledWith(
      1,
      expect.objectContaining({
        action: 'unsupportedContentEncountered',
        actionSubject: 'document',
        actionSubjectId: 'unsupportedMark',
        attributes: {
          unsupportedNode: {
            type: 'alignment',
            parentType: 'doc',
            ancestry: 'doc',
            marks: [],
            attrs: {
              align: 'someAlignment',
            },
          },
        },
        eventType: 'track',
      }),
    );
    expect(dispatchAnalyticsEventMock).toHaveBeenNthCalledWith(
      2,
      expect.objectContaining({
        action: 'unsupportedContentEncountered',
        actionSubject: 'document',
        actionSubjectId: 'unsupportedMark',
        attributes: {
          unsupportedNode: {
            type: 'unknown',
            parentType: 'paragraph',
            ancestry: 'doc paragraph',
            marks: [],
            attrs: {},
          },
        },
        eventType: 'track',
      }),
    );
    expect(dispatchAnalyticsEventMock).toHaveBeenNthCalledWith(
      3,
      expect.objectContaining({
        action: 'unsupportedContentEncountered',
        actionSubject: 'document',
        actionSubjectId: 'unsupportedMark',
        attributes: {
          unsupportedNode: {
            type: 'strong',
            parentType: 'paragraph',
            ancestry: 'doc paragraph',
            marks: [],
            attrs: {
              type: 'superStrong',
            },
          },
        },
        eventType: 'track',
      }),
    );
  });

  it(`should not fire analytics event when a known and valid mark
      type is applied to a node.`, () => {
    const entity = {
      version: 1,
      type: 'doc',
      content: [
        {
          type: 'paragraph',
          content: [
            {
              type: 'text',
              text: 'Some Text',
            },
          ],
          marks: [
            {
              type: 'indentation',
              attrs: {
                level: 2,
              },
            },
          ],
        },
      ],
    };

    const doc = PMNode.fromJSON(schema, entity);
    findAndTrackUnsupportedContentNodes(
      doc,
      schema,
      dispatchAnalyticsEventMock,
    );
    expect(dispatchAnalyticsEventMock).not.toHaveBeenCalled();
  });

  it(`should fire analytics for unsupportedNodeAttribute mark when a invalid
       attribute is applied to a node.`, () => {
    const entity = {
      version: 1,
      type: 'doc',
      content: [
        {
          type: 'paragraph',
          content: [
            {
              type: 'inlineCard',
              marks: [
                {
                  type: 'unsupportedNodeAttribute',
                  attrs: {
                    type: { nodeType: 'inlineCard' },
                    unsupported: {
                      url: 1,
                    },
                  },
                },
              ],
            },
          ],
        },
      ],
    };
    const doc = PMNode.fromJSON(schema, entity);
    findAndTrackUnsupportedContentNodes(
      doc,
      schema,
      dispatchAnalyticsEventMock,
    );
    expect(dispatchAnalyticsEventMock).toHaveBeenCalledTimes(1);
    expect(dispatchAnalyticsEventMock).toHaveBeenNthCalledWith(
      1,
      expect.objectContaining({
        action: 'unsupportedContentEncountered',
        actionSubject: 'document',
        actionSubjectId: 'unsupportedNodeAttribute',
        attributes: {
          unsupportedNode: {
            type: 'inlineCard',
            parentType: 'paragraph',
            ancestry: 'doc paragraph',
            marks: [],
            attrs: {
              url: '',
            },
          },
        },
        eventType: 'track',
      }),
    );
  });

  it(`should fire analytics event for unsupportedInline and event payload should not
       contain sensitive info from mark attributes which are not whitelisted`, () => {
    const entity = {
      version: 1,
      type: 'doc',
      content: [
        {
          type: 'paragraph',
          content: [
            {
              type: 'unsupportedInline',
              attrs: {
                originalValue: {
                  type: 'newText',
                  marks: [
                    {
                      type: 'link',
                      attrs: {
                        href:
                          'https://product-fabric.atlassian.net/browse/FAB-997',
                      },
                    },
                  ],
                },
              },
            },
          ],
        },
      ],
    };
    const doc = PMNode.fromJSON(schema, entity);
    findAndTrackUnsupportedContentNodes(
      doc,
      schema,
      dispatchAnalyticsEventMock,
    );
    expect(dispatchAnalyticsEventMock).toHaveBeenCalledTimes(1);
    expect(dispatchAnalyticsEventMock).toHaveBeenNthCalledWith(
      1,
      expect.objectContaining({
        action: 'unsupportedContentEncountered',
        actionSubject: 'document',
        actionSubjectId: 'unsupportedInline',
        attributes: {
          unsupportedNode: {
            type: 'newText',
            parentType: 'paragraph',
            ancestry: 'doc paragraph',
            marks: [
              {
                type: 'link',
                attrs: {
                  href: '',
                },
              },
            ],
            attrs: {},
          },
        },
        eventType: 'track',
      }),
    );
  });

  it(`should fire analytics event for unsupportedBlock and event payload should not
       contain sensitive info from non whitelisted attribute keys.`, () => {
    const entity = {
      version: 1,
      type: 'doc',
      content: [
        {
          type: 'unsupportedBlock',
          attrs: {
            originalValue: {
              type: 'unknownBodiedExtension',
              attrs: {
                extensionType: 'com.atlassian.confluence.macro.core',
                extensionKey: 'expand',
                parameters: {
                  macroMetadata: {
                    macroId: {
                      value: 1598252695991,
                    },
                    schemaVersion: {
                      value: '2',
                    },
                    placeholder: [
                      {
                        data: {
                          url:
                            '//pug.jira-dev.com/wiki/plugins/servlet/confluence/placeholder/macro?definition=e2V4cGFuZH0&locale=en_GB&version=2',
                        },
                        type: 'image',
                      },
                    ],
                  },
                },
                layout: 'default',
              },
              content: [
                {
                  type: 'heading',
                  attrs: {
                    level: 5,
                  },
                  content: [
                    {
                      type: 'text',
                      text: 'Heading',
                    },
                  ],
                },
                {
                  type: 'paragraph',
                  content: [
                    {
                      type: 'text',
                      text: 'Foo',
                      marks: [
                        {
                          type: 'underline',
                        },
                      ],
                    },
                  ],
                },
              ],
            },
          },
        },
      ],
    };
    const doc = PMNode.fromJSON(schema, entity);
    findAndTrackUnsupportedContentNodes(
      doc,
      schema,
      dispatchAnalyticsEventMock,
    );
    expect(dispatchAnalyticsEventMock).toHaveBeenCalledTimes(1);
    expect(dispatchAnalyticsEventMock).toHaveBeenNthCalledWith(
      1,
      expect.objectContaining({
        action: 'unsupportedContentEncountered',
        actionSubject: 'document',
        actionSubjectId: 'unsupportedBlock',
        attributes: {
          unsupportedNode: {
            type: 'unknownBodiedExtension',
            parentType: 'doc',
            ancestry: 'doc',
            marks: [],
            attrs: {
              extensionType: 'com.atlassian.confluence.macro.core',
              extensionKey: 'expand',
              parameters: '',
              layout: 'default',
            },
          },
        },
        eventType: 'track',
      }),
    );
  });

  it(`should fire analytics event for unsupportedInline and event payload should not
       contain sensitive info from non whitelisted attribute keys.`, () => {
    const entity = {
      version: 1,
      type: 'doc',
      content: [
        {
          type: 'paragraph',
          content: [
            {
              type: 'unsupportedInline',
              attrs: {
                originalValue: {
                  type: 'newEmoji',
                  attrs: {
                    shortName: ':heart_eyes:',
                    id: '1f60d',
                    text: 'Sensitive Info',
                  },
                },
              },
            },
          ],
        },
      ],
    };
    const doc = PMNode.fromJSON(schema, entity);
    findAndTrackUnsupportedContentNodes(
      doc,
      schema,
      dispatchAnalyticsEventMock,
    );
    expect(dispatchAnalyticsEventMock).toHaveBeenCalledTimes(1);
    expect(dispatchAnalyticsEventMock).toHaveBeenNthCalledWith(
      1,
      expect.objectContaining({
        action: 'unsupportedContentEncountered',
        actionSubject: 'document',
        actionSubjectId: 'unsupportedInline',
        attributes: {
          unsupportedNode: {
            type: 'newEmoji',
            parentType: 'paragraph',
            ancestry: 'doc paragraph',
            marks: [],
            attrs: {
              shortName: ':heart_eyes:',
              id: '',
              text: '',
            },
          },
        },
        eventType: 'track',
      }),
    );
  });

  it(`should fire analytics event for unsupportedMark and event payload should not
       contain sensitive info from non whitelisted attribute keys.`, () => {
    const entity = {
      version: 1,
      type: 'doc',
      content: [
        {
          type: 'paragraph',
          content: [
            {
              type: 'text',
              text: 'test',
              marks: [
                {
                  type: 'unsupportedMark',
                  attrs: {
                    originalValue: {
                      type: 'link',
                      attrs: {
                        href:
                          'https://product-fabric.atlassian.net/browse/FAB-983',
                        redundantAttribute: 'redundantAttributeValue',
                      },
                    },
                  },
                },
              ],
            },
          ],
        },
      ],
    };
    const doc = PMNode.fromJSON(schema, entity);
    findAndTrackUnsupportedContentNodes(
      doc,
      schema,
      dispatchAnalyticsEventMock,
    );
    expect(dispatchAnalyticsEventMock).toHaveBeenCalledTimes(1);
    expect(dispatchAnalyticsEventMock).toHaveBeenNthCalledWith(
      1,
      expect.objectContaining({
        action: 'unsupportedContentEncountered',
        actionSubject: 'document',
        actionSubjectId: 'unsupportedMark',
        attributes: {
          unsupportedNode: {
            type: 'link',
            parentType: 'paragraph',
            ancestry: 'doc paragraph',
            marks: [],
            attrs: {
              href: '',
              redundantAttribute: '',
            },
          },
        },
        eventType: 'track',
      }),
    );
  });

  it(`should fire analytics event for unsupportedNodeAttribute Mark and event payload should not
       contain sensitive info from non whitelisted attribute keys.`, () => {
    const entity = {
      version: 1,
      type: 'doc',
      content: [
        {
          type: 'expand',
          attrs: {},
          marks: [
            {
              type: 'unsupportedNodeAttribute',
              attrs: {
                type: { nodeType: 'expand' },
                unsupported: {
                  newtitle: 'Sensitive Title',
                },
              },
            },
          ],
          content: [
            {
              type: 'paragraph',
              content: [],
            },
          ],
        },
      ],
    };
    const doc = PMNode.fromJSON(schema, entity);
    findAndTrackUnsupportedContentNodes(
      doc,
      schema,
      dispatchAnalyticsEventMock,
    );
    expect(dispatchAnalyticsEventMock).toHaveBeenCalledTimes(1);
    expect(dispatchAnalyticsEventMock).toHaveBeenNthCalledWith(
      1,
      expect.objectContaining({
        action: 'unsupportedContentEncountered',
        actionSubject: 'document',
        actionSubjectId: 'unsupportedNodeAttribute',
        attributes: {
          unsupportedNode: {
            type: 'expand',
            parentType: 'doc',
            ancestry: 'doc',
            marks: [],
            attrs: {
              newtitle: '',
            },
          },
        },
        eventType: 'track',
      }),
    );
  });

  it(`should fire analytics event with the unsupportedNodeAttribute
  with value as 'null' explicilty with 'null' string`, () => {
    const entity = {
      type: 'doc',
      version: 1,
      content: [
        {
          type: 'bodiedExtension',
          attrs: {
            layout: 'full-width',
            extensionType: 'com.atlassian.confluence.macro.core',
            extensionKey: 'excerpt',
            parameters: {
              macroParams: {
                'atlassian-macro-output-type': {
                  value: 'INLINE',
                },
              },
              macroMetadata: {
                macroId: {
                  value: 'd8d1d015-64d9-48b1-a980-0f44de736e84',
                },
                schemaVersion: {
                  value: '1',
                },
                title: 'Excerpt',
              },
            },
          },
          content: [
            {
              type: 'paragraph',
              content: [
                {
                  type: 'inlineCard',
                  attrs: {
                    __confluenceMetadata: {
                      spaceKey: 'DEV',
                      isRenamedTitle: true,
                      postingDay: '2020/05/21',
                      linkType: 'blogpost',
                      contentTitle: 'Changes to the Java Tech Stack (May 2020)',
                      versionAtSave: '2',
                    },
                    url: 'https://hello.atlassian.net/wiki',
                  },
                  marks: [
                    {
                      type: 'unsupportedNodeAttribute',
                      attrs: {
                        type: { nodeType: 'inlineCard' },
                        unsupported: {
                          data: null,
                        },
                      },
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
    };
    const doc = PMNode.fromJSON(schema, entity);
    findAndTrackUnsupportedContentNodes(
      doc,
      schema,
      dispatchAnalyticsEventMock,
    );
    expect(dispatchAnalyticsEventMock).toHaveBeenCalledTimes(1);
    expect(dispatchAnalyticsEventMock).toHaveBeenNthCalledWith(
      1,
      expect.objectContaining({
        action: 'unsupportedContentEncountered',
        actionSubject: 'document',
        actionSubjectId: 'unsupportedNodeAttribute',
        attributes: {
          unsupportedNode: {
            type: 'inlineCard',
            parentType: 'paragraph',
            ancestry: 'doc bodiedExtension paragraph',
            marks: [],
            attrs: {
              data: 'null',
            },
          },
        },
        eventType: 'track',
      }),
    );
  });
});

describe('Track unsupported contents', () => {
  beforeEach(() => {
    dispatchAnalyticsEventMock = jest.fn();
  });

  afterEach(() => {
    dispatchAnalyticsEventMock.mockRestore();
  });

  it('should fire unsupported event for marks', () => {
    const unsupportedMarks = [
      {
        type: 'indentation',
        attrs: {
          level: 2,
        },
      },
    ];
    const unsupportedNode = {
      type: 'new-type',
      ancestry: '',
      parentType: '',
      marks: unsupportedMarks,
      attrs: {},
    };
    fireUnsupportedEvent(
      dispatchAnalyticsEventMock,
      ACTION_SUBJECT_ID.UNSUPPORTED_MARK,
      unsupportedNode,
    );
    expect(dispatchAnalyticsEventMock).toBeCalledWith(
      expect.objectContaining({
        action: 'unsupportedContentEncountered',
        actionSubject: 'document',
        actionSubjectId: 'unsupportedMark',
        attributes: {
          unsupportedNode: {
            type: 'new-type',
            parentType: '',
            ancestry: '',
            marks: unsupportedMarks,
            attrs: {},
          },
        },
        eventType: 'track',
      }),
    );
  });

  it('should fire unsupproted event for inline node', () => {
    const unsupportedNode = {
      type: 'new-type',
      ancestry: '',
      parentType: '',
      marks: [],
      attrs: {},
    };
    fireUnsupportedEvent(
      dispatchAnalyticsEventMock,
      ACTION_SUBJECT_ID.UNSUPPORTED_INLINE,
      unsupportedNode,
    );
    expect(dispatchAnalyticsEventMock).toBeCalledWith(
      expect.objectContaining({
        action: 'unsupportedContentEncountered',
        actionSubject: 'document',
        actionSubjectId: 'unsupportedInline',
        attributes: {
          unsupportedNode: {
            type: 'new-type',
            parentType: '',
            ancestry: '',
            marks: [],
            attrs: {},
          },
        },
        eventType: 'track',
      }),
    );
  });

  it('should fire unsupproted event for block node', () => {
    const unsupportedNode = {
      type: 'new-block-type',
      ancestry: '',
      parentType: '',
      marks: [],
      attrs: {},
    };
    fireUnsupportedEvent(
      dispatchAnalyticsEventMock,
      ACTION_SUBJECT_ID.UNSUPPORTED_BLOCK,
      unsupportedNode,
    );
    expect(dispatchAnalyticsEventMock).toBeCalledWith(
      expect.objectContaining({
        action: 'unsupportedContentEncountered',
        actionSubject: 'document',
        actionSubjectId: 'unsupportedBlock',
        attributes: {
          unsupportedNode: {
            type: 'new-block-type',
            parentType: '',
            ancestry: '',
            marks: [],
            attrs: {},
          },
        },
        eventType: 'track',
      }),
    );
  });

  it(`should fire analytics for unsupportedNodeAttribute mark when redundant
       attributes are applied to a node.`, () => {
    const entity = {
      version: 1,
      type: 'doc',
      content: [
        {
          type: 'paragraph',
          content: [
            {
              type: 'date',
              marks: [
                {
                  type: 'unsupportedNodeAttribute',
                  attrs: {
                    type: { nodeType: 'date' },
                    unsupported: {
                      timestamp: '1596672000000',
                      someNewProperty: 'newPropertyValue',
                    },
                  },
                },
              ],
            },
          ],
        },
      ],
    };
    const doc = PMNode.fromJSON(schema, entity);
    findAndTrackUnsupportedContentNodes(
      doc,
      schema,
      dispatchAnalyticsEventMock,
    );
    expect(dispatchAnalyticsEventMock).toHaveBeenCalledTimes(1);
    expect(dispatchAnalyticsEventMock).toHaveBeenNthCalledWith(
      1,
      expect.objectContaining({
        action: 'unsupportedContentEncountered',
        actionSubject: 'document',
        actionSubjectId: 'unsupportedNodeAttribute',
        attributes: {
          unsupportedNode: {
            type: 'date',
            parentType: 'paragraph',
            ancestry: 'doc paragraph',
            marks: [],
            attrs: {
              timestamp: '1596672000000',
              someNewProperty: '',
            },
          },
        },
        eventType: 'track',
      }),
    );
  });

  it(`should fire analytics event for unsupportedMarks, unsupportedNodeAttributes, unsupportedBlock
      and unsupportedInline content where there is mixed unupported nodes involved`, () => {
    const entity = {
      version: 1,
      type: 'doc',
      content: [
        {
          type: 'paragraph',
          content: [
            {
              type: 'date',
              marks: [
                {
                  type: 'unsupportedMark',
                  attrs: {
                    originalValue: {
                      type: 'unknown',
                    },
                  },
                },
                {
                  type: 'unsupportedNodeAttribute',
                  attrs: {
                    type: { nodeType: 'date' },
                    unsupported: {
                      timestamp: '1596672000000',
                      someNewProperty: 'newPropertyValue',
                    },
                  },
                },
              ],
            },
          ],
          marks: [
            {
              type: 'unsupportedMark',
              attrs: {
                originalValue: {
                  type: 'alignment',
                  attrs: {
                    align: 'someAlignment',
                  },
                },
              },
            },
          ],
        },
        {
          type: 'paragraph',
          content: [
            {
              type: 'unsupportedInline',
              attrs: {
                originalValue: {
                  type: 'someNewInlineType',
                  attrs: {
                    type: 'strong',
                  },
                },
              },
            },
          ],
        },
        {
          type: 'unsupportedBlock',
          attrs: {
            originalValue: {
              type: 'newBlockType',
              marks: [
                {
                  type: 'alignment',
                  attrs: {
                    align: 'center',
                  },
                },
                {
                  type: 'indentation',
                  attrs: {
                    level: 2,
                  },
                },
              ],
            },
          },
        },
      ],
    };

    const doc = PMNode.fromJSON(schema, entity);
    findAndTrackUnsupportedContentNodes(
      doc,
      schema,
      dispatchAnalyticsEventMock,
    );
    expect(dispatchAnalyticsEventMock).toHaveBeenCalledTimes(5);
    expect(dispatchAnalyticsEventMock).toHaveBeenNthCalledWith(
      1,
      expect.objectContaining({
        action: 'unsupportedContentEncountered',
        actionSubject: 'document',
        actionSubjectId: 'unsupportedMark',
        attributes: {
          unsupportedNode: {
            type: 'alignment',
            parentType: 'doc',
            ancestry: 'doc',
            marks: [],
            attrs: {
              align: 'someAlignment',
            },
          },
        },
        eventType: 'track',
      }),
    );
    expect(dispatchAnalyticsEventMock).toHaveBeenNthCalledWith(
      2,
      expect.objectContaining({
        action: 'unsupportedContentEncountered',
        actionSubject: 'document',
        actionSubjectId: 'unsupportedMark',
        attributes: {
          unsupportedNode: {
            type: 'unknown',
            parentType: 'paragraph',
            ancestry: 'doc paragraph',
            marks: [],
            attrs: {},
          },
        },
        eventType: 'track',
      }),
    );
    expect(dispatchAnalyticsEventMock).toHaveBeenNthCalledWith(
      3,
      expect.objectContaining({
        action: 'unsupportedContentEncountered',
        actionSubject: 'document',
        actionSubjectId: 'unsupportedNodeAttribute',
        attributes: {
          unsupportedNode: {
            type: 'date',
            parentType: 'paragraph',
            ancestry: 'doc paragraph',
            marks: [],
            attrs: {
              timestamp: '1596672000000',
              someNewProperty: '',
            },
          },
        },
        eventType: 'track',
      }),
    );
    expect(dispatchAnalyticsEventMock).toHaveBeenNthCalledWith(
      4,
      expect.objectContaining({
        action: 'unsupportedContentEncountered',
        actionSubject: 'document',
        actionSubjectId: 'unsupportedInline',
        attributes: {
          unsupportedNode: {
            type: 'someNewInlineType',
            parentType: 'paragraph',
            ancestry: 'doc paragraph',
            marks: [],
            attrs: {
              type: 'strong',
            },
          },
        },
        eventType: 'track',
      }),
    );
    expect(dispatchAnalyticsEventMock).toHaveBeenNthCalledWith(
      5,
      expect.objectContaining({
        action: 'unsupportedContentEncountered',
        actionSubject: 'document',
        actionSubjectId: 'unsupportedBlock',
        attributes: {
          unsupportedNode: {
            type: 'newBlockType',
            parentType: 'doc',
            ancestry: 'doc',
            marks: [
              {
                type: 'alignment',
                attrs: {
                  align: 'center',
                },
              },
              {
                type: 'indentation',
                attrs: {
                  level: 2,
                },
              },
            ],
            attrs: {},
          },
        },
        eventType: 'track',
      }),
    );
  });
});

describe('track unsupported content tooltip', () => {
  let dispatchAnalticsEventForTooltip: jest.Mock<any, any>;
  beforeEach(() => {
    dispatchAnalticsEventForTooltip = jest.fn();
  });
  afterEach(() => {
    dispatchAnalticsEventForTooltip.mockRestore();
  });

  it('should dispatch the ui analytics event for tooltip displayed on unsupportedBlock', () => {
    trackUnsupportedContentTooltipDisplayedFor(
      dispatchAnalticsEventForTooltip,
      ACTION_SUBJECT_ID.ON_UNSUPPORTED_BLOCK,
    );
    expect(dispatchAnalticsEventForTooltip).toHaveBeenCalledTimes(1);
    expect(dispatchAnalticsEventForTooltip).toHaveBeenCalledWith(
      expect.objectContaining({
        action: ACTION.UNSUPPORTED_TOOLTIP_VIEWED,
        actionSubject: ACTION_SUBJECT.TOOLTIP,
        actionSubjectId: ACTION_SUBJECT_ID.ON_UNSUPPORTED_BLOCK,
        eventType: 'ui',
        attributes: {
          unsupportedNodeType: undefined,
        },
      }),
    );
  });

  it(`should dispatch the ui analytics event for tooltip displayed on unsupportedBlock with
    unsupportedNodeType attribute when original node type is passed`, () => {
    trackUnsupportedContentTooltipDisplayedFor(
      dispatchAnalticsEventForTooltip,
      ACTION_SUBJECT_ID.ON_UNSUPPORTED_BLOCK,
      'someUnsupportedBlock',
    );
    expect(dispatchAnalticsEventForTooltip).toHaveBeenCalledTimes(1);
    expect(dispatchAnalticsEventForTooltip).toHaveBeenCalledWith(
      expect.objectContaining({
        action: ACTION.UNSUPPORTED_TOOLTIP_VIEWED,
        actionSubject: ACTION_SUBJECT.TOOLTIP,
        actionSubjectId: ACTION_SUBJECT_ID.ON_UNSUPPORTED_BLOCK,
        eventType: 'ui',
        attributes: {
          unsupportedNodeType: 'someUnsupportedBlock',
        },
      }),
    );
  });

  it('should dispatch the ui analytics event for tooltip displayed on unsupportedInline', () => {
    trackUnsupportedContentTooltipDisplayedFor(
      dispatchAnalticsEventForTooltip,
      ACTION_SUBJECT_ID.ON_UNSUPPORTED_INLINE,
    );
    expect(dispatchAnalticsEventForTooltip).toHaveBeenCalledTimes(1);
    expect(dispatchAnalticsEventForTooltip).toHaveBeenCalledWith(
      expect.objectContaining({
        action: ACTION.UNSUPPORTED_TOOLTIP_VIEWED,
        actionSubject: ACTION_SUBJECT.TOOLTIP,
        actionSubjectId: ACTION_SUBJECT_ID.ON_UNSUPPORTED_INLINE,
        eventType: 'ui',
        attributes: {
          unsupportedNodeType: undefined,
        },
      }),
    );
  });

  it(`should dispatch the ui analytics event for tooltip displayed on unsupportedInline with
    unsupportedNodeType attribute when original node type is passed`, () => {
    trackUnsupportedContentTooltipDisplayedFor(
      dispatchAnalticsEventForTooltip,
      ACTION_SUBJECT_ID.ON_UNSUPPORTED_INLINE,
      'someUnsupportedInline',
    );
    expect(dispatchAnalticsEventForTooltip).toHaveBeenCalledTimes(1);
    expect(dispatchAnalticsEventForTooltip).toHaveBeenCalledWith(
      expect.objectContaining({
        action: ACTION.UNSUPPORTED_TOOLTIP_VIEWED,
        actionSubject: ACTION_SUBJECT.TOOLTIP,
        actionSubjectId: ACTION_SUBJECT_ID.ON_UNSUPPORTED_INLINE,
        eventType: 'ui',
        attributes: {
          unsupportedNodeType: 'someUnsupportedInline',
        },
      }),
    );
  });
});
