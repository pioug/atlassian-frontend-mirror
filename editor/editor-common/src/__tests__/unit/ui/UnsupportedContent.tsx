import React from 'react';

import type { ReactWrapper } from 'enzyme';
import type { IntlShape, WrappedComponentProps } from 'react-intl-next';
import { IntlProvider } from 'react-intl-next';

import { UIAnalyticsEvent } from '@atlaskit/analytics-next';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import { createEditorFactory } from '@atlaskit/editor-test-helpers/create-editor';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import {
  doc,
  p,
  unsupportedBlock,
  unsupportedInline,
} from '@atlaskit/editor-test-helpers/doc-builder';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import { mountWithIntl } from '@atlaskit/editor-test-helpers/enzyme';
import Tooltip from '@atlaskit/tooltip';

import { ACTION_SUBJECT_ID } from '../../../analytics';
import type { DocBuilder } from '../../../types';
import * as Hooks from '../../../ui/unsupported-content-helper';
import UnsupportedBlockNode from '../../../ui/UnsupportedBlock';
import UnsupportedInlineNode from '../../../ui/UnsupportedInline';
import { trackUnsupportedContentTooltipDisplayedFor } from '../../../utils/track-unsupported-content';

jest.mock('../../../utils/track-unsupported-content', () => {
  return {
    trackUnsupportedContentTooltipDisplayedFor: jest.fn(),
    trackUnsupportedContentTooltipHiddenFor: jest.fn(),
  };
});

const unsupportedBlockNodeSelector = '[className$="-UnsupportedBlockNode"]';
const unsupportedInlineNodeSelector = '[className$="-UnsupportedInlineNode"]';

describe('Unsupported Content', () => {
  describe('Block Node', () => {
    let wrapper: ReactWrapper<any & WrappedComponentProps, any, any>;
    const createEditor = createEditorFactory();

    afterEach(() => {
      wrapper.unmount();
    });

    const editor = (doc: DocBuilder) => {
      return createEditor({
        doc,
      });
    };

    it('should return a node of type div', () => {
      wrapper = mountWithIntl(<UnsupportedBlockNode />);

      expect(
        wrapper.find(unsupportedBlockNodeSelector).getDOMNode().tagName,
      ).toEqual('DIV');
    });

    it('should show correct message when hover on tooltip', () => {
      wrapper = mountWithIntl(<UnsupportedBlockNode />);
      expect(wrapper.find(Tooltip).exists()).toBeTruthy();
      expect(wrapper.find(Tooltip).props().content).toEqual(
        'Content is not available in this editor, this will be preserved when you edit and save',
      );
    });

    it('should node contains tooltip with strategy prop as absolute', () => {
      wrapper = mountWithIntl(<UnsupportedBlockNode />);
      expect(wrapper.find(Tooltip)).toHaveLength(1);
      expect(wrapper.find(Tooltip).props().strategy).toEqual('absolute');
    });

    it('should return Unsupported content when no node is provided', () => {
      wrapper = mountWithIntl(<UnsupportedBlockNode />);
      expect(
        wrapper.find(unsupportedBlockNodeSelector).getDOMNode().firstChild!
          .textContent,
      ).toEqual('This editor does not support displaying this content');
    });

    it(
      'should have text content as string "Unsupported content"' +
        ' when language non-english locale provided',
      () => {
        const node = doc(
          unsupportedBlock({
            originalValue: {
              attrs: {},
              type: 'FooBarNode',
            },
          })(),
        );

        const messages = {
          'fabric.editor.unsupportedContent':
            'This editor does not support displaying this content',
        };

        const { editorView: view } = editor(node);

        wrapper = mountWithIntl(
          <IntlProvider locale="de" messages={messages}>
            <UnsupportedBlockNode
              node={view.state.doc.nodeAt(view.state.selection.$from.pos)!}
            />
          </IntlProvider>,
        );

        expect(wrapper.text()).toEqual(
          'This editor does not support displaying this content',
        );
      },
    );

    it(
      'should have text content as string "Unsupported Status"' +
        ' when language english locale provided',
      () => {
        const node = doc(
          unsupportedBlock({
            originalValue: {
              attrs: {},
              type: 'FooBarNode',
            },
          })(),
        );

        const { editorView: view } = editor(node);

        wrapper = mountWithIntl(
          <IntlProvider locale="en">
            <UnsupportedBlockNode
              node={view.state.doc.nodeAt(view.state.selection.$from.pos)!}
            />
          </IntlProvider>,
        );

        expect(wrapper.text()).toEqual(
          'This editor does not support displaying this content: FooBarNode',
        );
      },
    );

    it('should have text content as actual value of text when unsupported node has a text property', () => {
      const node = doc(
        unsupportedBlock({
          originalValue: {
            attrs: {},
            type: 'SomeNode',
            text: 'I am some node',
          },
        })(),
      );
      const { editorView: view } = editor(node);

      wrapper = mountWithIntl(
        <UnsupportedBlockNode
          node={view.state.doc.nodeAt(view.state.selection.$from.pos)!}
        />,
      );

      expect(wrapper.text()).toEqual('I am some node');
    });

    it(`should have text content as actual value of text when unsupported node
      has an attr as text property`, () => {
      const node = doc(
        unsupportedBlock({
          originalValue: {
            attrs: { text: 'I am some node' },
            type: 'SomeNode',
          },
        })(),
      );
      const { editorView: view } = editor(node);

      wrapper = mountWithIntl(
        <UnsupportedBlockNode
          node={view.state.doc.nodeAt(view.state.selection.$from.pos)!}
        />,
      );

      expect(wrapper.text()).toEqual('I am some node');
    });

    it(`should have text content as "Unsupported <content type>" when unsupported node
          has a empty attr text property and a type`, () => {
      const node = doc(
        unsupportedBlock({
          originalValue: {
            attrs: { text: '' },
            type: 'SomeNode',
          },
        })(),
      );
      const { editorView: view } = editor(node);

      wrapper = mountWithIntl(
        <UnsupportedBlockNode
          node={view.state.doc.nodeAt(view.state.selection.$from.pos)!}
        />,
      );

      expect(wrapper.text()).toEqual(
        'This editor does not support displaying this content: SomeNode',
      );
    });

    it(`should have text content as "Unsupported content" when unsupported node
      has a empty attr text property and no type`, () => {
      const node = doc(
        unsupportedBlock({
          originalValue: {
            attrs: { text: '' },
          },
        })(),
      );
      const { editorView: view } = editor(node);

      wrapper = mountWithIntl(
        <UnsupportedBlockNode
          node={view.state.doc.nodeAt(view.state.selection.$from.pos)!}
        />,
      );

      expect(wrapper.text()).toEqual(
        'This editor does not support displaying this content',
      );
    });

    it(`should have text content as "Unsupported content" when unsupported node
      has a no attr or text property or type`, () => {
      const node = doc(
        unsupportedBlock({
          originalValue: {
            attrs: { text: '' },
          },
        })(),
      );
      const { editorView: view } = editor(node);

      wrapper = mountWithIntl(
        <UnsupportedBlockNode
          node={view.state.doc.nodeAt(view.state.selection.$from.pos)!}
        />,
      );

      expect(wrapper.text()).toEqual(
        'This editor does not support displaying this content',
      );
    });

    describe('content lozenge', () => {
      const createEditor = createEditorFactory();
      const editor = (doc: DocBuilder) => {
        return createEditor({
          doc,
        });
      };
      let formatUnsupportedContentSpy: jest.SpyInstance<
        string,
        [
          object,
          string,
          (import('@atlaskit/editor-prosemirror/model').Node | undefined)?,
          IntlShape?,
        ]
      >;
      beforeEach(() => {
        formatUnsupportedContentSpy = jest.spyOn(
          Hooks,
          'getUnsupportedContent',
        );
      });

      afterEach(() => {
        formatUnsupportedContentSpy.mockRestore();
      });

      it('should render the text value as returned by the formatUnsupportedContent hook', () => {
        formatUnsupportedContentSpy.mockReturnValue('Some text');
        const node = doc(
          '{<>}',
          unsupportedBlock({
            originalValue: {
              attrs: {},
              type: 'FooBarNode',
            },
          })(),
        );
        const { editorView: view, refs } = editor(node);

        wrapper = mountWithIntl(
          <UnsupportedBlockNode node={view.state.doc.nodeAt(refs['<>'])!} />,
        );
        expect(wrapper.text()).toEqual('Some text');
      });
    });

    describe('tooltip analytics', () => {
      const setUp = (dispatchEvent?: () => void) => {
        const node = doc(
          unsupportedBlock({
            originalValue: {
              attrs: { text: '' },
              type: 'SomeNode',
            },
          })(),
        );
        const { editorView: view } = editor(node);

        wrapper = mountWithIntl(
          <UnsupportedBlockNode
            node={view.state.doc.nodeAt(view.state.selection.$from.pos)!}
            dispatchAnalyticsEvent={dispatchEvent}
          />,
        );
      };

      afterEach(() => {
        jest.clearAllMocks();
      });

      it(`should invoke the method trackUnsupportedContentTooltipDisplayedFor
            when the tooltip is displayed and dispatchAnalyticsEvent is passed as prop`, async () => {
        const dispatchAnalyticsEvent = jest.fn();
        setUp(dispatchAnalyticsEvent);
        const onShow = wrapper.find(Tooltip).prop('onShow');
        onShow && onShow(new UIAnalyticsEvent({ payload: { foo: 'bar' } }));

        expect(trackUnsupportedContentTooltipDisplayedFor).toHaveBeenCalledWith(
          dispatchAnalyticsEvent,
          ACTION_SUBJECT_ID.ON_UNSUPPORTED_BLOCK,
          'SomeNode',
        );
      });

      it(`should not invoke the method trackUnsupportedContentTooltipDisplayedFor
          when the tooltip is displayed and  dispatchAnalyticsEvent is not passed as prop `, async () => {
        setUp();
        const onShow = wrapper.find(Tooltip).prop('onShow');
        onShow && onShow(new UIAnalyticsEvent({ payload: { foo: 'bar' } }));

        expect(
          trackUnsupportedContentTooltipDisplayedFor,
        ).toHaveBeenCalledTimes(0);
      });
    });
  });
  describe('Inline Node', () => {
    let wrapper: ReactWrapper<any & WrappedComponentProps, any, any>;
    const createEditor = createEditorFactory();

    afterEach(() => {
      wrapper.unmount();
    });

    const editor = (doc: DocBuilder) => {
      return createEditor({
        doc,
      });
    };

    it('should return a node of type span', () => {
      wrapper = mountWithIntl(<UnsupportedInlineNode />);
      expect(
        wrapper.find(unsupportedInlineNodeSelector).getDOMNode().tagName,
      ).toEqual('SPAN');
    });

    it('should show correct message when hover on tooltip', () => {
      wrapper = mountWithIntl(<UnsupportedInlineNode />);
      expect(wrapper.find(Tooltip).exists()).toBeTruthy();
      expect(wrapper.find(Tooltip).props().content).toEqual(
        'Content is not available in this editor, this will be preserved when you edit and save',
      );
    });

    it('should node contains tooltip with strategy prop as absolute', () => {
      wrapper = mountWithIntl(<UnsupportedInlineNode />);
      expect(wrapper.find(Tooltip)).toHaveLength(1);
      expect(wrapper.find(Tooltip).props().strategy).toEqual('absolute');
    });

    it('should return Unsupported content when no node is provided', () => {
      wrapper = mountWithIntl(<UnsupportedInlineNode />);
      expect(
        wrapper.find(unsupportedInlineNodeSelector).getDOMNode().firstChild!
          .textContent,
      ).toEqual('Unsupported content');
    });

    it(
      'should have text content as string "Unsupported content"' +
        ' when language non-english locale provided',
      () => {
        const node = doc(
          p(
            '{<>}',
            unsupportedInline({
              originalValue: {
                attrs: { url: 'https://atlassian.net' },
                type: 'FooBarNode',
              },
            })(),
          ),
        );

        const messages = {
          'fabric.editor.unsupportedContent': 'Unsupported content',
        };

        const { editorView: view, refs } = editor(node);

        wrapper = mountWithIntl(
          <IntlProvider locale="de" messages={messages}>
            <UnsupportedInlineNode node={view.state.doc.nodeAt(refs['<>'])!} />
          </IntlProvider>,
        );

        expect(wrapper.text()).toEqual('Unsupported content');
      },
    );

    it(
      'should have text content as string "Unsupported Status"' +
        ' when language english locale provided',
      () => {
        const node = doc(
          p(
            '{<>}',
            unsupportedInline({
              originalValue: {
                attrs: { url: 'https://atlassian.net' },
                type: 'FooBarNode',
              },
            })(),
          ),
        );

        const { editorView: view, refs } = editor(node);

        wrapper = mountWithIntl(
          <IntlProvider locale="en">
            <UnsupportedInlineNode node={view.state.doc.nodeAt(refs['<>'])!} />
          </IntlProvider>,
        );

        expect(wrapper.text()).toEqual('Unsupported FooBarNode');
      },
    );

    it('should have text content as actual value of text when unsupported node has a text property', () => {
      const node = doc(
        p(
          '{<>}',
          unsupportedInline({
            originalValue: {
              attrs: {},
              type: 'SomeNode',
              text: 'I am some node',
            },
          })(),
        ),
      );

      const { editorView: view, refs } = editor(node);

      wrapper = mountWithIntl(
        <UnsupportedInlineNode node={view.state.doc.nodeAt(refs['<>'])!} />,
      );

      expect(wrapper.text()).toEqual('I am some node');
    });

    it(`should have text content as actual value of text when unsupported node
      has an attr as text property`, () => {
      const node = doc(
        p(
          '{<>}',
          unsupportedInline({
            originalValue: {
              attrs: { text: 'I am some node' },
              type: 'SomeNode',
            },
          })(),
        ),
      );

      const { editorView: view, refs } = editor(node);

      wrapper = mountWithIntl(
        <UnsupportedInlineNode node={view.state.doc.nodeAt(refs['<>'])!} />,
      );

      expect(wrapper.text()).toEqual('I am some node');
    });

    it(`should have text content as "Unsupported <content type>" when unsupported node
          has a empty attr text property and a type`, () => {
      const node = doc(
        p(
          '{<>}',
          unsupportedInline({
            originalValue: {
              attrs: { text: '' },
              type: 'SomeNode',
            },
          })(),
        ),
      );

      const { editorView: view, refs } = editor(node);

      wrapper = mountWithIntl(
        <UnsupportedInlineNode node={view.state.doc.nodeAt(refs['<>'])!} />,
      );

      expect(wrapper.text()).toEqual('Unsupported SomeNode');
    });

    it(`should have text content as "Unsupported content" when unsupported node
      has a empty attr text property and no type`, () => {
      const node = doc(
        p(
          '{<>}',
          unsupportedInline({
            originalValue: {
              attrs: { text: '' },
            },
          })(),
        ),
      );
      const { editorView: view, refs } = editor(node);

      wrapper = mountWithIntl(
        <UnsupportedInlineNode node={view.state.doc.nodeAt(refs['<>'])!} />,
      );

      expect(wrapper.text()).toEqual('Unsupported content');
    });

    it(`should have text content as "Unsupported content" when unsupported node
      has a no attr or text property or type`, () => {
      const node = doc(
        p(
          '{<>}',
          unsupportedInline({
            originalValue: {
              attrs: { text: '' },
            },
          })(),
        ),
      );

      const { editorView: view, refs } = editor(node);

      wrapper = mountWithIntl(
        <UnsupportedInlineNode node={view.state.doc.nodeAt(refs['<>'])!} />,
      );

      expect(wrapper.text()).toEqual('Unsupported content');
    });

    describe('content lozenge', () => {
      const createEditor = createEditorFactory();
      const editor = (doc: DocBuilder) => {
        return createEditor({
          doc,
        });
      };
      let formatUnsupportedContentSpy: jest.SpyInstance<
        string,
        [
          object,
          string,
          (import('@atlaskit/editor-prosemirror/model').Node | undefined)?,
          IntlShape?,
        ]
      >;
      beforeEach(() => {
        formatUnsupportedContentSpy = jest.spyOn(
          Hooks,
          'getUnsupportedContent',
        );
      });

      afterEach(() => {
        formatUnsupportedContentSpy.mockRestore();
      });

      it('should render the text value as returned by the formatUnsupportedContent hook', () => {
        formatUnsupportedContentSpy.mockReturnValue('Some text');
        const node = doc(
          p(
            '{<>}',
            unsupportedInline({
              originalValue: {
                attrs: { url: 'https://atlassian.net' },
                type: 'FooBarNode',
              },
            })(),
          ),
        );
        const { editorView: view, refs } = editor(node);
        wrapper = mountWithIntl(
          <UnsupportedInlineNode node={view.state.doc.nodeAt(refs['<>'])!} />,
        );
        expect(wrapper.text()).toEqual(`Some text`);
      });
    });
    describe('tooltip analytics', () => {
      const setUp = (dispatchEvent?: () => void) => {
        const node = doc(
          p(
            '{<>}',
            unsupportedInline({
              originalValue: {
                attrs: { url: 'https://atlassian.net' },
                type: 'SomeNode',
              },
            })(),
          ),
        );
        const { editorView: view, refs } = editor(node);
        wrapper = mountWithIntl(
          <UnsupportedInlineNode
            node={view.state.doc.nodeAt(refs['<>'])!}
            dispatchAnalyticsEvent={dispatchEvent}
          />,
        );
      };

      afterEach(() => {
        jest.clearAllMocks();
      });

      it(`should invoke the method trackUnsupportedContentTooltipDisplayedFor
            when the tooltip is displayed and dispatchAnalyticsEvent is passed as prop`, async () => {
        const dispatchAnalyticsEvent = jest.fn();
        setUp(dispatchAnalyticsEvent);

        const onShow = wrapper.find(Tooltip).prop('onShow');
        onShow && onShow(new UIAnalyticsEvent({ payload: { foo: 'bar' } }));

        expect(trackUnsupportedContentTooltipDisplayedFor).toHaveBeenCalledWith(
          dispatchAnalyticsEvent,
          ACTION_SUBJECT_ID.ON_UNSUPPORTED_INLINE,
          'SomeNode',
        );
      });

      it(`should not invoke the method trackUnsupportedContentTooltipDisplayedFor
          when the tooltip is displayed and  dispatchAnalyticsEvent is not passed as prop `, async () => {
        setUp();
        const onShow = wrapper.find(Tooltip).prop('onShow');
        onShow && onShow(new UIAnalyticsEvent({ payload: { foo: 'bar' } }));

        expect(
          trackUnsupportedContentTooltipDisplayedFor,
        ).toHaveBeenCalledTimes(0);
      });
    });
  });
});
