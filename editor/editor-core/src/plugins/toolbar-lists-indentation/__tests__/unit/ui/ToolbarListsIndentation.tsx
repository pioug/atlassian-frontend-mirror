import React from 'react';
import createAnalyticsEventMock from '@atlaskit/editor-test-helpers/create-analytics-event-mock';
import {
  createProsemirrorEditorFactory,
  LightEditorPlugin,
  Preset,
} from '@atlaskit/editor-test-helpers/create-prosemirror-editor';
import { mountWithIntl } from '@atlaskit/editor-test-helpers/enzyme';
import {
  doc,
  p,
  DocBuilder,
  indentation,
} from '@atlaskit/editor-test-helpers/doc-builder';
import { pluginKey } from '../../../../list/pm-plugins/main';
import { messages as listMessages } from '../../../../list/messages';
import { messages as indentationMessages } from '../../../../indentation/messages';
import ToolbarButton from '../../../../../ui/ToolbarButton';
import DropdownMenu from '../../../../../ui/DropdownMenu';
import basePlugin from '../../../../base';
import analyticsPlugin from '../../../../analytics';
import toolbarListsIndentationPlugin from '../../../';
import indentationPlugin from '../../../../indentation';
import blockTypePlugin from '../../../../block-type';
import listPlugin from '../../../../list';
import textFormattingPlugin from '../../../../text-formatting';
import ToolbarListsIndentation, {
  Props as ToolbarListsIndentationProps,
} from '../../../ui';
import { CreateUIAnalyticsEvent } from '@atlaskit/analytics-next';
import { ReactWrapper } from 'enzyme';

function clickToolbarOption(toolbarOption: ReactWrapper, title: string) {
  toolbarOption
    .find(ToolbarButton)
    .filterWhere((toolbarButton) =>
      toolbarButton.prop('aria-label')!.includes(title),
    )
    .find('button')
    .simulate('click');
}

describe('ToolbarListsIndentation', () => {
  const createEditor = createProsemirrorEditorFactory();
  let ToolbarListsIndentationWrapper: ReactWrapper;
  let createAnalyticsEvent: CreateUIAnalyticsEvent;

  afterEach(() => {
    if (ToolbarListsIndentationWrapper) {
      if (ToolbarListsIndentationWrapper.length > 0) {
        ToolbarListsIndentationWrapper.unmount();
      }
      ToolbarListsIndentationWrapper.detach();
    }
  });

  const editor = ({ doc }: { doc: DocBuilder }) => {
    createAnalyticsEvent = createAnalyticsEventMock();
    return createEditor({
      doc,
      preset: new Preset<LightEditorPlugin>()
        .add(basePlugin)
        .add([analyticsPlugin, { createAnalyticsEvent }])
        .add(textFormattingPlugin)
        .add(listPlugin)
        .add(blockTypePlugin)
        .add([
          toolbarListsIndentationPlugin,
          {
            showIndentationButtons: true,
            allowHeadingAndParagraphIndentation: true,
          },
        ])
        .add(indentationPlugin),
      pluginKey,
    });
  };

  const setup = (
    props: { doc?: DocBuilder } & Partial<ToolbarListsIndentationProps> = {},
  ) => {
    const { doc: setupDoc, ...toolbarProps } = props;
    const editorWrapper = editor({ doc: setupDoc || doc(p('text')) });
    const ToolbarListsIndentationWrapper = mountWithIntl(
      <ToolbarListsIndentation
        editorView={editorWrapper.editorView}
        {...toolbarProps}
      />,
    );
    return {
      ...editorWrapper,
      ToolbarListsIndentation: ToolbarListsIndentationWrapper,
    };
  };

  it('should render disabled ToolbarButtons if disabled property is true', () => {
    const { ToolbarListsIndentation } = setup({ disabled: true });

    ToolbarListsIndentation.find(ToolbarButton).forEach((node) => {
      expect(node.prop('disabled')).toBe(true);
    });
  });

  it('should not render indentation buttons if showIndentationButtons is false', () => {
    const { ToolbarListsIndentation } = setup({
      showIndentationButtons: false,
    });

    expect(ToolbarListsIndentation.find(ToolbarButton).length).toEqual(2);
  });

  it('should render indentation buttons if showIndentationButtons is true', () => {
    const { ToolbarListsIndentation } = setup({ showIndentationButtons: true });

    expect(ToolbarListsIndentation.find(ToolbarButton).length).toEqual(4);
  });

  it('should have a dropdown if option isSmall = true', () => {
    const { ToolbarListsIndentation } = setup({ isSmall: true });

    expect(ToolbarListsIndentation.find(DropdownMenu).length).toEqual(1);
  });

  describe('list analytics', () => {
    let ToolbarListsIndentation: ReactWrapper<any, any, any>;

    beforeEach(() => {
      ({ ToolbarListsIndentation } = setup());
    });

    it('should dispatch analytics event when bulleted list button is clicked', () => {
      clickToolbarOption(
        ToolbarListsIndentation,
        listMessages.unorderedList.defaultMessage,
      );

      expect(createAnalyticsEvent).toHaveBeenCalledWith({
        action: 'inserted',
        actionSubject: 'list',
        eventType: 'track',
        actionSubjectId: 'bulletedList',
        attributes: expect.objectContaining({
          inputMethod: 'toolbar',
        }),
      });
    });

    it('should dispatch analytics event when numbered list button is clicked', () => {
      clickToolbarOption(
        ToolbarListsIndentation,
        listMessages.orderedList.defaultMessage,
      );

      expect(createAnalyticsEvent).toHaveBeenCalledWith({
        action: 'inserted',
        actionSubject: 'list',
        eventType: 'track',
        actionSubjectId: 'numberedList',
        attributes: expect.objectContaining({
          inputMethod: 'toolbar',
        }),
      });
    });
  });

  describe('indentation buttons analytics', () => {
    it('should dispatch analytics event when indent button is clicked', () => {
      const { ToolbarListsIndentation } = setup({
        showIndentationButtons: true,
        indentDisabled: false,
        doc: doc(p('{<>}hello world')),
      });

      clickToolbarOption(
        ToolbarListsIndentation,
        indentationMessages.indent.defaultMessage,
      );

      expect(createAnalyticsEvent).toHaveBeenCalledWith({
        action: 'formatted',
        actionSubject: 'text',
        actionSubjectId: 'indentation',
        eventType: 'track',
        attributes: expect.objectContaining({
          inputMethod: 'toolbar',
          direction: 'indent',
        }),
      });
    });

    it('should dispatch analytics event when outdent button is clicked', () => {
      const { ToolbarListsIndentation } = setup({
        showIndentationButtons: true,
        outdentDisabled: false,
        doc: doc(indentation({ level: 1 })(p('{<>}hello world'))),
      });

      clickToolbarOption(
        ToolbarListsIndentation,
        indentationMessages.outdent.defaultMessage,
      );

      expect(createAnalyticsEvent).toHaveBeenCalledWith({
        action: 'formatted',
        actionSubject: 'text',
        actionSubjectId: 'indentation',
        eventType: 'track',
        attributes: expect.objectContaining({
          inputMethod: 'toolbar',
          direction: 'outdent',
        }),
      });
    });
  });
});
