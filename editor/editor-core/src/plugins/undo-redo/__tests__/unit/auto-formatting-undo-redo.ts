import {
  blockquote,
  code_block,
  doc,
  em,
  p,
  code,
  a as link,
  strong,
  ol,
  ul,
  li,
  h2,
  hr,
  strike,
  emoji,
  taskList,
  taskItem,
  decisionList,
  decisionItem,
  DocBuilder,
  BuilderContent,
  layoutSection,
  layoutColumn,
  alignment,
} from '@atlaskit/editor-test-helpers/doc-builder';
import { uuid } from '@atlaskit/adf-schema';
import { ProviderFactory } from '@atlaskit/editor-common/provider-factory';
import sendKeyToPm from '@atlaskit/editor-test-helpers/send-key-to-pm';
import { insertText } from '@atlaskit/editor-test-helpers/transactions';
import {
  createProsemirrorEditorFactory,
  LightEditorPlugin,
  Preset,
} from '@atlaskit/editor-test-helpers/create-prosemirror-editor';
import { getMockTaskDecisionResource } from '@atlaskit/util-data-test/task-decision-story-data';
import { getTestEmojiResource } from '@atlaskit/util-data-test/get-test-emoji-resource';
import blockTypePlugin from '../../../block-type';
import typeAheadPlugin from '../../../type-ahead';
import codeBlockPlugin from '../../../code-block';
import hyperlinkPlugin from '../../../hyperlink';
import tasksAndDecisionsPlugin from '../../../tasks-and-decisions';
import listPlugin from '../../../list';
import textFormattingPlugin from '../../../text-formatting';
import emojiPlugin from '../../../emoji';
import basePlugin from '../../../base';
import layoutPlugin from '../../../layout';
import rulePlugin from '../../../rule';
import featureFlagsPlugin from '../../../feature-flags-context';
import alignmentPlugin from '../../../alignment';

const emojiProvider = getTestEmojiResource();
const providerFactory = ProviderFactory.create({
  emojiProvider,
  taskDecisionProvider: Promise.resolve(getMockTaskDecisionResource()),
});

describe('plugins/undo-redo/autoformatting: undo & redo', () => {
  const createEditor = createProsemirrorEditorFactory();
  const editor = (doc: DocBuilder) => {
    const editorTemp = createEditor({
      featureFlags: {
        useUnpredictableInputRule: false,
      },
      doc,
      preset: new Preset<LightEditorPlugin>()
        .add([
          emojiPlugin,
          { useInlineWrapper: false, allowZeroWidthSpaceAfter: true },
        ])
        .add([
          featureFlagsPlugin,
          { newInsertionBehaviour: true, useUnpredictableInputRule: false },
        ])
        .add(typeAheadPlugin)
        .add(blockTypePlugin)
        .add(codeBlockPlugin)
        .add(tasksAndDecisionsPlugin)
        .add(textFormattingPlugin)
        .add(basePlugin)
        .add(hyperlinkPlugin)
        .add(layoutPlugin)
        .add(rulePlugin)
        .add(listPlugin)
        .add(alignmentPlugin),
      providerFactory,
    });
    const undo = () => sendKeyToPm(editorTemp.editorView, 'Ctrl-z');
    const redo = () => sendKeyToPm(editorTemp.editorView, 'Ctrl-y');

    const insert = (text: string) =>
      insertText(editorTemp.editorView, text, editorTemp.sel);

    const validateCurrentDocument = (doc: DocBuilder) => {
      expect(editorTemp.editorView.state).toEqualDocumentAndSelection(doc);
    };

    return { ...editorTemp, undo, redo, insert, validateCurrentDocument };
  };

  const smileyEmoji = emoji({
    id: '1f603',
    shortName: ':smiley:',
    text: '😃',
  });

  const thumbsupEmoji = emoji({
    id: '1f44d',
    shortName: ':thumbsup:',
    text: '👍',
  });

  beforeEach(() => {
    uuid.setStatic('local-uuid');
    editor(doc(p('')));
  });

  afterEach(() => {
    uuid.setStatic(false);
  });

  type NakedUndoFlow = {
    initialDocument: BuilderContent | BuilderContent[];
    text: string; // String to complete auto-format
    expectedDocument: {
      afterAutoformatting: BuilderContent | BuilderContent[];
      afterFirstUndo: BuilderContent | BuilderContent[];
      afterSecondUndo: BuilderContent | BuilderContent[];
    };
  };

  type UndoFlow = {
    initialDocument: DocBuilder;
    text: string; // String to complete auto-format
    expectedDocument: {
      afterAutoformatting: DocBuilder;
      afterFirstUndo: DocBuilder;
      afterSecondUndo: DocBuilder;
    };
  };

  type FlowCases = {
    asFirstDocumentNode: UndoFlow;
    middleOfDocumentNode?: UndoFlow;
    insideOfBlockNode?: UndoFlow;
    insideOfBlockNodeAndMiddleOfParagraph?: UndoFlow;
  };

  const createUndoFlowInsideDocument = (some: NakedUndoFlow): UndoFlow => {
    const {
      initialDocument,
      expectedDocument: {
        afterAutoformatting,
        afterFirstUndo,
        afterSecondUndo,
      },
    } = some;
    return {
      initialDocument: Array.isArray(initialDocument)
        ? doc(...initialDocument)
        : doc(initialDocument),
      text: some.text,
      expectedDocument: {
        afterAutoformatting: Array.isArray(afterAutoformatting)
          ? doc(...afterAutoformatting)
          : doc(afterAutoformatting),
        afterFirstUndo: Array.isArray(afterFirstUndo)
          ? doc(...afterFirstUndo)
          : doc(afterFirstUndo),
        afterSecondUndo: Array.isArray(afterSecondUndo)
          ? doc(...afterSecondUndo)
          : doc(afterSecondUndo),
      },
    };
  };

  const createUndoFlowInsideLayout = (nakedFlow: NakedUndoFlow): UndoFlow => {
    const makeLayout = (lol: BuilderContent | BuilderContent[]) => {
      return layoutSection(
        Array.isArray(lol)
          ? layoutColumn({ width: 50 })(...lol)
          : layoutColumn({ width: 50 })(lol),
        layoutColumn({ width: 50 })(p('lol')),
      );
    };

    return createUndoFlowInsideDocument({
      initialDocument: makeLayout(nakedFlow.initialDocument),
      text: nakedFlow.text,
      expectedDocument: {
        afterAutoformatting: makeLayout(
          nakedFlow.expectedDocument.afterAutoformatting,
        ),
        afterFirstUndo: makeLayout(nakedFlow.expectedDocument.afterFirstUndo),
        afterSecondUndo: makeLayout(nakedFlow.expectedDocument.afterSecondUndo),
      },
    });
  };

  type TestCase = [string, FlowCases];
  const case00: TestCase = [
    'code-blocks',
    {
      asFirstDocumentNode: createUndoFlowInsideDocument({
        initialDocument: p('``{<>}'),
        text: '`',
        expectedDocument: {
          afterAutoformatting: code_block({})(),
          afterFirstUndo: p('```'),
          afterSecondUndo: p('``'),
        },
      }),

      middleOfDocumentNode: createUndoFlowInsideDocument({
        initialDocument: p('Hello world ``{<>}'),
        text: '`',
        expectedDocument: {
          afterAutoformatting: [p('Hello world '), code_block({})()],
          afterFirstUndo: p('Hello world ```'),
          afterSecondUndo: p('Hello world ``'),
        },
      }),

      insideOfBlockNode: createUndoFlowInsideLayout({
        initialDocument: p('``{<>}'),
        text: '`',
        expectedDocument: {
          afterAutoformatting: code_block({})(),
          afterFirstUndo: p('```'),
          afterSecondUndo: p('``'),
        },
      }),

      insideOfBlockNodeAndMiddleOfParagraph: createUndoFlowInsideLayout({
        initialDocument: p('Hello world ``{<>}'),
        text: '`',
        expectedDocument: {
          afterAutoformatting: [p('Hello world '), code_block({})()],
          afterFirstUndo: p('Hello world ```'),
          afterSecondUndo: p('Hello world ``'),
        },
      }),
    },
  ];

  const case01: TestCase = [
    'action',
    {
      asFirstDocumentNode: createUndoFlowInsideDocument({
        initialDocument: p('[]{<>}'),
        text: ' ',
        expectedDocument: {
          afterAutoformatting: taskList({ localId: 'local-uuid' })(
            taskItem({ localId: 'local-uuid' })(),
          ),
          afterFirstUndo: p('[] '),
          afterSecondUndo: p('[]'),
        },
      }),

      insideOfBlockNode: createUndoFlowInsideLayout({
        initialDocument: p('[]{<>}'),
        text: ' ',
        expectedDocument: {
          afterAutoformatting: taskList({ localId: 'local-uuid' })(
            taskItem({ localId: 'local-uuid' })(),
          ),
          afterFirstUndo: p('[] '),
          afterSecondUndo: p('[]'),
        },
      }),
    },
  ];

  const case02: TestCase = [
    'quote',
    {
      asFirstDocumentNode: createUndoFlowInsideDocument({
        initialDocument: p('>{<>}'),
        text: ' ',
        expectedDocument: {
          afterAutoformatting: blockquote(p('')),
          afterFirstUndo: p('> '),
          afterSecondUndo: p('>'),
        },
      }),

      insideOfBlockNode: createUndoFlowInsideLayout({
        initialDocument: p('>{<>}'),
        text: ' ',
        expectedDocument: {
          afterAutoformatting: blockquote(p('')),
          afterFirstUndo: p('> '),
          afterSecondUndo: p('>'),
        },
      }),
    },
  ];

  const case03: TestCase = [
    'inline-code',
    {
      asFirstDocumentNode: createUndoFlowInsideDocument({
        initialDocument: p('`a{<>}'),
        text: '`',
        expectedDocument: {
          afterAutoformatting: p(code('a')),
          afterFirstUndo: p('`a`'),
          afterSecondUndo: p('`a'),
        },
      }),

      middleOfDocumentNode: createUndoFlowInsideDocument({
        initialDocument: p('Hello `a{<>}'),
        text: '`',
        expectedDocument: {
          afterAutoformatting: p('Hello ', code('a')),
          afterFirstUndo: p('Hello `a`'),
          afterSecondUndo: p('Hello `a'),
        },
      }),

      insideOfBlockNodeAndMiddleOfParagraph: createUndoFlowInsideLayout({
        initialDocument: p('Hello `a{<>}'),
        text: '`',
        expectedDocument: {
          afterAutoformatting: p('Hello ', code('a')),
          afterFirstUndo: p('Hello `a`'),
          afterSecondUndo: p('Hello `a'),
        },
      }),

      insideOfBlockNode: createUndoFlowInsideLayout({
        initialDocument: p('`a{<>}'),
        text: '`',
        expectedDocument: {
          afterAutoformatting: p(code('a')),
          afterFirstUndo: p('`a`'),
          afterSecondUndo: p('`a'),
        },
      }),
    },
  ];

  const case04: TestCase = [
    'italic',
    {
      asFirstDocumentNode: createUndoFlowInsideDocument({
        initialDocument: p('*a{<>}'),
        text: '*',
        expectedDocument: {
          afterAutoformatting: p(em('a')),
          afterFirstUndo: p('*a*'),
          afterSecondUndo: p('*a'),
        },
      }),

      middleOfDocumentNode: createUndoFlowInsideDocument({
        initialDocument: p('Hello *a{<>}'),
        text: '*',
        expectedDocument: {
          afterAutoformatting: p('Hello ', em('a')),
          afterFirstUndo: p('Hello *a*'),
          afterSecondUndo: p('Hello *a'),
        },
      }),

      insideOfBlockNode: createUndoFlowInsideLayout({
        initialDocument: p('*a{<>}'),
        text: '*',
        expectedDocument: {
          afterAutoformatting: p(em('a')),
          afterFirstUndo: p('*a*'),
          afterSecondUndo: p('*a'),
        },
      }),

      insideOfBlockNodeAndMiddleOfParagraph: createUndoFlowInsideLayout({
        initialDocument: p('Hello *a{<>}'),
        text: '*',
        expectedDocument: {
          afterAutoformatting: p('Hello ', em('a')),
          afterFirstUndo: p('Hello *a*'),
          afterSecondUndo: p('Hello *a'),
        },
      }),
    },
  ];

  const case05: TestCase = [
    'bold',
    {
      asFirstDocumentNode: createUndoFlowInsideDocument({
        initialDocument: p('**a*{<>}'),
        text: '*',
        expectedDocument: {
          afterAutoformatting: p(strong('a')),
          afterFirstUndo: p('**a**'),
          afterSecondUndo: p('**a*'),
        },
      }),

      middleOfDocumentNode: createUndoFlowInsideDocument({
        initialDocument: p('Hello **a*{<>}'),
        text: '*',
        expectedDocument: {
          afterAutoformatting: p('Hello ', strong('a')),
          afterFirstUndo: p('Hello **a**'),
          afterSecondUndo: p('Hello **a*'),
        },
      }),

      insideOfBlockNode: createUndoFlowInsideLayout({
        initialDocument: p('**a*{<>}'),
        text: '*',
        expectedDocument: {
          afterAutoformatting: p(strong('a')),
          afterFirstUndo: p('**a**'),
          afterSecondUndo: p('**a*'),
        },
      }),

      insideOfBlockNodeAndMiddleOfParagraph: createUndoFlowInsideLayout({
        initialDocument: p('Hello **a*{<>}'),
        text: '*',
        expectedDocument: {
          afterAutoformatting: p('Hello ', strong('a')),
          afterFirstUndo: p('Hello **a**'),
          afterSecondUndo: p('Hello **a*'),
        },
      }),
    },
  ];

  const case06: TestCase = [
    'strikethrough',
    {
      asFirstDocumentNode: createUndoFlowInsideDocument({
        initialDocument: p('~~a~{<>}'),
        text: '~',
        expectedDocument: {
          afterAutoformatting: p(strike('a')),
          afterFirstUndo: p('~~a~~'),
          afterSecondUndo: p('~~a~'),
        },
      }),

      middleOfDocumentNode: createUndoFlowInsideDocument({
        initialDocument: p('Hello ~~a~{<>}'),
        text: '~',
        expectedDocument: {
          afterAutoformatting: p('Hello ', strike('a')),
          afterFirstUndo: p('Hello ~~a~~'),
          afterSecondUndo: p('Hello ~~a~'),
        },
      }),

      insideOfBlockNode: createUndoFlowInsideLayout({
        initialDocument: p('~~a~{<>}'),
        text: '~',
        expectedDocument: {
          afterAutoformatting: p(strike('a')),
          afterFirstUndo: p('~~a~~'),
          afterSecondUndo: p('~~a~'),
        },
      }),

      insideOfBlockNodeAndMiddleOfParagraph: createUndoFlowInsideLayout({
        initialDocument: p('Hello ~~a~{<>}'),
        text: '~',
        expectedDocument: {
          afterAutoformatting: p('Hello ', strike('a')),
          afterFirstUndo: p('Hello ~~a~~'),
          afterSecondUndo: p('Hello ~~a~'),
        },
      }),
    },
  ];

  const case07: TestCase = [
    'decision',
    {
      asFirstDocumentNode: createUndoFlowInsideDocument({
        initialDocument: p('<>{<>}'),
        text: ' ',
        expectedDocument: {
          afterAutoformatting: decisionList({ localId: 'local-uuid' })(
            decisionItem({ localId: 'local-uuid' })(),
          ),
          afterFirstUndo: p('<> '),
          afterSecondUndo: p('<>'),
        },
      }),

      insideOfBlockNode: createUndoFlowInsideLayout({
        initialDocument: p('<>{<>}'),
        text: ' ',
        expectedDocument: {
          afterAutoformatting: decisionList({ localId: 'local-uuid' })(
            decisionItem({ localId: 'local-uuid' })(),
          ),
          afterFirstUndo: p('<> '),
          afterSecondUndo: p('<>'),
        },
      }),
    },
  ];

  const case08: TestCase = [
    'numbered list',
    {
      asFirstDocumentNode: createUndoFlowInsideDocument({
        initialDocument: p('1.{<>}'),
        text: ' ',
        expectedDocument: {
          afterAutoformatting: ol(li(p(''))),
          afterFirstUndo: p('1. '),
          afterSecondUndo: p('1.'),
        },
      }),

      middleOfDocumentNode: createUndoFlowInsideDocument({
        initialDocument: [p('Hello '), p('1.{<>}')],
        text: ' ',
        expectedDocument: {
          afterAutoformatting: [p('Hello '), ol(li(p('')))],
          afterFirstUndo: [p('Hello '), p('1. ')],
          afterSecondUndo: [p('Hello '), p('1.')],
        },
      }),

      insideOfBlockNode: createUndoFlowInsideLayout({
        initialDocument: p('1.{<>}'),
        text: ' ',
        expectedDocument: {
          afterAutoformatting: ol(li(p(''))),
          afterFirstUndo: p('1. '),
          afterSecondUndo: p('1.'),
        },
      }),

      insideOfBlockNodeAndMiddleOfParagraph: createUndoFlowInsideLayout({
        initialDocument: [p('Hello '), p('1.{<>}')],
        text: ' ',
        expectedDocument: {
          afterAutoformatting: [p('Hello '), ol(li(p('')))],
          afterFirstUndo: [p('Hello '), p('1. ')],
          afterSecondUndo: [p('Hello '), p('1.')],
        },
      }),
    },
  ];

  const case09: TestCase = [
    'bullet-list',
    {
      asFirstDocumentNode: createUndoFlowInsideDocument({
        initialDocument: p('-{<>}'),
        text: ' ',
        expectedDocument: {
          afterAutoformatting: ul(li(p(''))),
          afterFirstUndo: p('- '),
          afterSecondUndo: p('-'),
        },
      }),

      middleOfDocumentNode: createUndoFlowInsideDocument({
        initialDocument: [p('Hello '), p('-{<>}')],
        text: ' ',
        expectedDocument: {
          afterAutoformatting: [p('Hello '), ul(li(p('')))],
          afterFirstUndo: [p('Hello '), p('- ')],
          afterSecondUndo: [p('Hello '), p('-')],
        },
      }),

      insideOfBlockNode: createUndoFlowInsideLayout({
        initialDocument: p('-{<>}'),
        text: ' ',
        expectedDocument: {
          afterAutoformatting: ul(li(p(''))),
          afterFirstUndo: p('- '),
          afterSecondUndo: p('-'),
        },
      }),

      insideOfBlockNodeAndMiddleOfParagraph: createUndoFlowInsideLayout({
        initialDocument: [p('Hello '), p('-{<>}')],
        text: ' ',
        expectedDocument: {
          afterAutoformatting: [p('Hello '), ul(li(p('')))],
          afterFirstUndo: [p('Hello '), p('- ')],
          afterSecondUndo: [p('Hello '), p('-')],
        },
      }),
    },
  ];

  const case10: TestCase = [
    'linktext url',
    {
      asFirstDocumentNode: createUndoFlowInsideDocument({
        initialDocument: p('[atlassian](www.atlassian.com{<>}'),
        text: ')',
        expectedDocument: {
          afterAutoformatting: p(
            link({ href: 'http://www.atlassian.com' })('atlassian'),
          ),
          afterFirstUndo: p('[atlassian](www.atlassian.com)'),
          afterSecondUndo: p('[atlassian](www.atlassian.com'),
        },
      }),

      middleOfDocumentNode: createUndoFlowInsideDocument({
        initialDocument: p('Hello [atlassian](www.atlassian.com{<>}'),
        text: ')',
        expectedDocument: {
          afterAutoformatting: p(
            'Hello ',
            link({ href: 'http://www.atlassian.com' })('atlassian'),
          ),
          afterFirstUndo: p('Hello [atlassian](www.atlassian.com)'),
          afterSecondUndo: p('Hello [atlassian](www.atlassian.com'),
        },
      }),

      insideOfBlockNode: createUndoFlowInsideLayout({
        initialDocument: p('[atlassian](www.atlassian.com{<>}'),
        text: ')',
        expectedDocument: {
          afterAutoformatting: p(
            link({ href: 'http://www.atlassian.com' })('atlassian'),
          ),
          afterFirstUndo: p('[atlassian](www.atlassian.com)'),
          afterSecondUndo: p('[atlassian](www.atlassian.com'),
        },
      }),

      insideOfBlockNodeAndMiddleOfParagraph: createUndoFlowInsideLayout({
        initialDocument: p('Hello [atlassian](www.atlassian.com{<>}'),
        text: ')',
        expectedDocument: {
          afterAutoformatting: p(
            'Hello ',
            link({ href: 'http://www.atlassian.com' })('atlassian'),
          ),
          afterFirstUndo: p('Hello [atlassian](www.atlassian.com)'),
          afterSecondUndo: p('Hello [atlassian](www.atlassian.com'),
        },
      }),
    },
  ];

  const case11: TestCase = [
    'emoji (y)',
    {
      asFirstDocumentNode: createUndoFlowInsideDocument({
        initialDocument: p('(y{<>}'),
        text: ')',
        expectedDocument: {
          afterAutoformatting: p(thumbsupEmoji()),
          afterFirstUndo: p('(y)'),
          afterSecondUndo: p('(y'),
        },
      }),

      middleOfDocumentNode: createUndoFlowInsideDocument({
        initialDocument: p('Hello (y{<>}'),
        text: ')',
        expectedDocument: {
          afterAutoformatting: p('Hello ', thumbsupEmoji()),
          afterFirstUndo: p('Hello (y)'),
          afterSecondUndo: p('Hello (y'),
        },
      }),

      insideOfBlockNode: createUndoFlowInsideLayout({
        initialDocument: p('(y{<>}'),
        text: ')',
        expectedDocument: {
          afterAutoformatting: p(thumbsupEmoji()),
          afterFirstUndo: p('(y)'),
          afterSecondUndo: p('(y'),
        },
      }),

      insideOfBlockNodeAndMiddleOfParagraph: createUndoFlowInsideLayout({
        initialDocument: p('Hello (y{<>}'),
        text: ')',
        expectedDocument: {
          afterAutoformatting: p('Hello ', thumbsupEmoji()),
          afterFirstUndo: p('Hello (y)'),
          afterSecondUndo: p('Hello (y'),
        },
      }),
    },
  ];

  const case12: TestCase = [
    'emoji :D',
    {
      asFirstDocumentNode: createUndoFlowInsideDocument({
        initialDocument: p(':{<>}'),
        text: 'D ',
        expectedDocument: {
          afterAutoformatting: p(smileyEmoji(), ' '),
          afterFirstUndo: p(':D '),
          afterSecondUndo: p(':D'),
        },
      }),

      middleOfDocumentNode: createUndoFlowInsideDocument({
        initialDocument: p('Hello :{<>}'),
        text: 'D ',
        expectedDocument: {
          afterAutoformatting: p('Hello ', smileyEmoji(), ' '),
          afterFirstUndo: p('Hello :D '),
          afterSecondUndo: p('Hello :D'),
        },
      }),

      insideOfBlockNode: createUndoFlowInsideLayout({
        initialDocument: p(':{<>}'),
        text: 'D ',
        expectedDocument: {
          afterAutoformatting: p(smileyEmoji(), ' '),
          afterFirstUndo: p(':D '),
          afterSecondUndo: p(':D'),
        },
      }),

      insideOfBlockNodeAndMiddleOfParagraph: createUndoFlowInsideLayout({
        initialDocument: p('Hello :{<>}'),
        text: 'D ',
        expectedDocument: {
          afterAutoformatting: p('Hello ', smileyEmoji(), ' '),
          afterFirstUndo: p('Hello :D '),
          afterSecondUndo: p('Hello :D'),
        },
      }),
    },
  ];

  const case13: TestCase = [
    'Heading',
    {
      asFirstDocumentNode: createUndoFlowInsideDocument({
        initialDocument: p('##{<>}'),
        text: ' ',
        expectedDocument: {
          afterAutoformatting: h2(''),
          afterFirstUndo: p('## '),
          afterSecondUndo: p('##'),
        },
      }),

      middleOfDocumentNode: createUndoFlowInsideDocument({
        initialDocument: (p('Hello '), p('##{<>}')),
        text: ' ',
        expectedDocument: {
          afterAutoformatting: (p('Hello '), h2('')),
          afterFirstUndo: (p('Hello '), p('## ')),
          afterSecondUndo: (p('Hello '), p('##')),
        },
      }),

      insideOfBlockNode: createUndoFlowInsideLayout({
        initialDocument: p('##{<>}'),
        text: ' ',
        expectedDocument: {
          afterAutoformatting: h2(''),
          afterFirstUndo: p('## '),
          afterSecondUndo: p('##'),
        },
      }),

      insideOfBlockNodeAndMiddleOfParagraph: createUndoFlowInsideLayout({
        initialDocument: (p('Hello '), p('##{<>}')),
        text: ' ',
        expectedDocument: {
          afterAutoformatting: (p('Hello '), h2('')),
          afterFirstUndo: (p('Hello '), p('## ')),
          afterSecondUndo: (p('Hello '), p('##')),
        },
      }),
    },
  ];

  const case14: TestCase = [
    'Arrows -> →',
    {
      asFirstDocumentNode: createUndoFlowInsideDocument({
        initialDocument: p('->{<>}'),
        text: ' ',
        expectedDocument: {
          afterAutoformatting: p('→ '),
          afterFirstUndo: p('-> '),
          afterSecondUndo: p('->'),
        },
      }),

      middleOfDocumentNode: createUndoFlowInsideDocument({
        initialDocument: p('Hello ->{<>}'),
        text: ' ',
        expectedDocument: {
          afterAutoformatting: p('Hello → '),
          afterFirstUndo: p('Hello -> '),
          afterSecondUndo: p('Hello ->'),
        },
      }),

      insideOfBlockNode: createUndoFlowInsideLayout({
        initialDocument: p('->{<>}'),
        text: ' ',
        expectedDocument: {
          afterAutoformatting: p('→ '),
          afterFirstUndo: p('-> '),
          afterSecondUndo: p('->'),
        },
      }),

      insideOfBlockNodeAndMiddleOfParagraph: createUndoFlowInsideLayout({
        initialDocument: p('Hello ->{<>}'),
        text: ' ',
        expectedDocument: {
          afterAutoformatting: p('Hello → '),
          afterFirstUndo: p('Hello -> '),
          afterSecondUndo: p('Hello ->'),
        },
      }),
    },
  ];

  const case15: TestCase = [
    'Text Capitalisation of Product',
    {
      asFirstDocumentNode: createUndoFlowInsideDocument({
        initialDocument: p('JIRA{<>}'),
        text: ' ',
        expectedDocument: {
          afterAutoformatting: p('Jira '),
          afterFirstUndo: p('JIRA '),
          afterSecondUndo: p('JIRA'),
        },
      }),

      middleOfDocumentNode: createUndoFlowInsideDocument({
        initialDocument: p('Hello JIRA{<>}'),
        text: ' ',
        expectedDocument: {
          afterAutoformatting: p('Hello Jira '),
          afterFirstUndo: p('Hello JIRA '),
          afterSecondUndo: p('Hello JIRA'),
        },
      }),

      insideOfBlockNode: createUndoFlowInsideLayout({
        initialDocument: p('JIRA{<>}'),
        text: ' ',
        expectedDocument: {
          afterAutoformatting: p('Jira '),
          afterFirstUndo: p('JIRA '),
          afterSecondUndo: p('JIRA'),
        },
      }),

      insideOfBlockNodeAndMiddleOfParagraph: createUndoFlowInsideLayout({
        initialDocument: p('Hello JIRA{<>}'),
        text: ' ',
        expectedDocument: {
          afterAutoformatting: p('Hello Jira '),
          afterFirstUndo: p('Hello JIRA '),
          afterSecondUndo: p('Hello JIRA'),
        },
      }),
    },
  ];

  const case16: TestCase = [
    'underscore in a word',
    {
      asFirstDocumentNode: createUndoFlowInsideDocument({
        initialDocument: p('_some{<>}text'),
        text: '_',
        expectedDocument: {
          afterAutoformatting: p(em('some'), 'text'),
          afterFirstUndo: p('_some_text'),
          afterSecondUndo: p('_sometext'),
        },
      }),

      middleOfDocumentNode: createUndoFlowInsideDocument({
        initialDocument: p('Hello _some{<>}text'),
        text: '_',
        expectedDocument: {
          afterAutoformatting: p('Hello ', em('some'), 'text'),
          afterFirstUndo: p('Hello ', '_some_text'),
          afterSecondUndo: p('Hello _sometext'),
        },
      }),

      insideOfBlockNode: createUndoFlowInsideLayout({
        initialDocument: p('_some{<>}text'),
        text: '_',
        expectedDocument: {
          afterAutoformatting: p(em('some'), 'text'),
          afterFirstUndo: p('_some_text'),
          afterSecondUndo: p('_sometext'),
        },
      }),

      insideOfBlockNodeAndMiddleOfParagraph: createUndoFlowInsideLayout({
        initialDocument: p('Hello _some{<>}text'),
        text: '_',
        expectedDocument: {
          afterAutoformatting: p('Hello ', em('some'), 'text'),
          afterFirstUndo: p('Hello ', '_some_text'),
          afterSecondUndo: p('Hello ', '_sometext'),
        },
      }),
    },
  ];

  const case17: TestCase = [
    'Text Capitalisation of Product from lowercase',
    {
      asFirstDocumentNode: createUndoFlowInsideDocument({
        initialDocument: p('jira{<>}'),
        text: ' ',
        expectedDocument: {
          afterAutoformatting: p('Jira '),
          afterFirstUndo: p('jira '),
          afterSecondUndo: p('jira'),
        },
      }),

      middleOfDocumentNode: createUndoFlowInsideDocument({
        initialDocument: p('Hello jira{<>}'),
        text: ' ',
        expectedDocument: {
          afterAutoformatting: p('Hello Jira '),
          afterFirstUndo: p('Hello jira '),
          afterSecondUndo: p('Hello jira'),
        },
      }),

      insideOfBlockNode: createUndoFlowInsideLayout({
        initialDocument: p('jira{<>}'),
        text: ' ',
        expectedDocument: {
          afterAutoformatting: p('Jira '),
          afterFirstUndo: p('jira '),
          afterSecondUndo: p('jira'),
        },
      }),

      insideOfBlockNodeAndMiddleOfParagraph: createUndoFlowInsideLayout({
        initialDocument: p('Hello jira{<>}'),
        text: ' ',
        expectedDocument: {
          afterAutoformatting: p('Hello Jira '),
          afterFirstUndo: p('Hello jira '),
          afterSecondUndo: p('Hello jira'),
        },
      }),
    },
  ];

  const case18: TestCase = [
    'horizontal divider',
    {
      asFirstDocumentNode: createUndoFlowInsideDocument({
        initialDocument: p('--{<>}'),
        text: '-',
        expectedDocument: {
          afterAutoformatting: hr(),
          afterFirstUndo: p('---'),
          afterSecondUndo: p('--'),
        },
      }),

      insideOfBlockNode: createUndoFlowInsideLayout({
        initialDocument: p('--{<>}'),
        text: '-',
        expectedDocument: {
          afterAutoformatting: hr(),
          afterFirstUndo: p('---'),
          afterSecondUndo: p('--'),
        },
      }),
    },
  ];

  const case19: TestCase = [
    'normal link url',
    {
      asFirstDocumentNode: createUndoFlowInsideDocument({
        initialDocument: p('gnu.org{<>}'),
        text: ' ',
        expectedDocument: {
          afterAutoformatting: p(
            link({ href: 'http://gnu.org' })('gnu.org'),
            ' ',
          ),
          afterFirstUndo: p('gnu.org '),
          afterSecondUndo: p('gnu.org'),
        },
      }),

      middleOfDocumentNode: createUndoFlowInsideDocument({
        initialDocument: p('Hello gnu.org{<>}'),
        text: ' ',
        expectedDocument: {
          afterAutoformatting: p(
            'Hello ',
            link({ href: 'http://gnu.org' })('gnu.org'),
            ' ',
          ),
          afterFirstUndo: p('Hello gnu.org '),
          afterSecondUndo: p('Hello gnu.org'),
        },
      }),

      insideOfBlockNode: createUndoFlowInsideLayout({
        initialDocument: p('gnu.org{<>}'),
        text: ' ',
        expectedDocument: {
          afterAutoformatting: p(
            link({ href: 'http://gnu.org' })('gnu.org'),
            ' ',
          ),
          afterFirstUndo: p('gnu.org '),
          afterSecondUndo: p('gnu.org'),
        },
      }),

      insideOfBlockNodeAndMiddleOfParagraph: createUndoFlowInsideLayout({
        initialDocument: p('Hello gnu.org{<>}'),
        text: ' ',
        expectedDocument: {
          afterAutoformatting: p(
            'Hello ',
            link({ href: 'http://gnu.org' })('gnu.org'),
            ' ',
          ),
          afterFirstUndo: p('Hello gnu.org '),
          afterSecondUndo: p('Hello gnu.org'),
        },
      }),
    },
  ];

  const case20: TestCase = [
    'center align list',
    {
      asFirstDocumentNode: createUndoFlowInsideDocument({
        initialDocument: alignment({ align: 'center' })(p('*{<>}')),
        text: ' ',
        expectedDocument: {
          afterAutoformatting: ul(li(p(''))),
          afterFirstUndo: alignment({ align: 'center' })(p('* {<>}')),
          afterSecondUndo: alignment({ align: 'center' })(p('*{<>}')),
        },
      }),

      insideOfBlockNode: createUndoFlowInsideLayout({
        initialDocument: alignment({ align: 'center' })(p('*{<>}')),
        text: ' ',
        expectedDocument: {
          afterAutoformatting: ul(li(p(''))),
          afterFirstUndo: alignment({ align: 'center' })(p('* {<>}')),
          afterSecondUndo: alignment({ align: 'center' })(p('*{<>}')),
        },
      }),
    },
  ];

  describe.each<TestCase>([
    case00,
    case01,
    case02,
    case03,
    case04,
    case05,
    case06,
    case07,
    case08,
    case09,
    case10,
    case11,
    case12,
    case13,
    case14,
    case15,
    case16,
    case17,
    case18,
    case19,
    case20,
  ])(
    '[case%#] test auto formatting undo/redo flow for %s',
    (scenario, testCaseData) => {
      const {
        asFirstDocumentNode,
        insideOfBlockNode,
        middleOfDocumentNode,
        insideOfBlockNodeAndMiddleOfParagraph,
      } = testCaseData;

      describe.each<[string, UndoFlow | undefined]>([
        [
          `when the ${scenario} is the first node in the document`,
          asFirstDocumentNode,
        ],
        [`when the ${scenario} is inside of block node`, insideOfBlockNode],
        [
          `when the ${scenario} is in the middle of a paragraph`,
          middleOfDocumentNode,
        ],
        [
          `when the ${scenario} is inside of block node and middle of a paragraph`,
          insideOfBlockNodeAndMiddleOfParagraph,
        ],
      ])(`%s`, (_innerScenario, nodeDocument) => {
        if (!nodeDocument) {
          return;
        }
        const { initialDocument, text, expectedDocument } = nodeDocument;
        describe(`when ${scenario} is inserted`, () => {
          it('should apply the autoformatting', () => {
            const { insert, validateCurrentDocument } = editor(initialDocument);
            insert(text);

            validateCurrentDocument(expectedDocument.afterAutoformatting);
          });
        });

        describe(`after ${scenario} auto formatting was applied`, () => {
          describe('when undo is called', () => {
            it(`should restore the document with the ${scenario} as plain text [match first undo]`, () => {
              const { validateCurrentDocument, insert, undo } = editor(
                initialDocument,
              );

              insert(text);
              undo();

              validateCurrentDocument(expectedDocument.afterFirstUndo);
            });

            describe('when redo is called', () => {
              it(`should add the ${scenario} autoformatting back [match autoformat]`, () => {
                const { validateCurrentDocument, insert, undo, redo } = editor(
                  initialDocument,
                );
                insert(text);
                undo();
                redo();
                validateCurrentDocument(expectedDocument.afterAutoformatting);
              });
            });

            describe('when undo is called one more time', () => {
              it(`should revert the document to its original format (before the ${scenario} was applied.[match second undo])`, () => {
                const { validateCurrentDocument, insert, undo } = editor(
                  initialDocument,
                );
                insert(text);
                undo();
                undo();
                validateCurrentDocument(expectedDocument.afterSecondUndo);
              });

              describe('when redo is called after double undo', () => {
                it(`should revert the document to the ${scenario} as plain text [match first undo]`, () => {
                  const {
                    validateCurrentDocument,
                    insert,
                    undo,
                    redo,
                  } = editor(initialDocument);
                  insert(text);
                  undo();
                  undo();
                  redo();
                  validateCurrentDocument(expectedDocument.afterFirstUndo);
                });
              });
            });
          });
        });
      });
    },
  );
});
