import React from 'react';
import createAnalyticsEventMock from '@atlaskit/editor-test-helpers/create-analytics-event-mock';
import { createEditorFactory } from '@atlaskit/editor-test-helpers/create-editor';
import { mountWithIntl } from '@atlaskit/editor-test-helpers/enzyme';
import { doc, p, DocBuilder } from '@atlaskit/editor-test-helpers/doc-builder';
import { pluginKey } from '../../../../list/pm-plugins/main';
import { ListState } from '../../../../list/types';
import { messages } from '../../../../list/messages';
import ToolbarButton from '../../../../../ui/ToolbarButton';
import DropdownMenu from '../../../../../ui/DropdownMenu';
import ToolbarListsIndentation, {
  Props as ToolbarListsIndentationProps,
} from '../../../ui';
import { UIAnalyticsEvent } from '@atlaskit/analytics-next';
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
  const createEditor = createEditorFactory<ListState>();
  let ToolbarListsIndentationWrapper: ReactWrapper;
  let createAnalyticsEvent: jest.MockInstance<UIAnalyticsEvent, any>;

  afterEach(() => {
    if (ToolbarListsIndentationWrapper) {
      if (ToolbarListsIndentationWrapper.length > 0) {
        ToolbarListsIndentationWrapper.unmount();
      }
      ToolbarListsIndentationWrapper.detach();
    }
  });

  const editor = (doc: DocBuilder) => {
    createAnalyticsEvent = createAnalyticsEventMock();
    return createEditor({
      doc,
      editorProps: {
        allowAnalyticsGASV3: true,
        allowTasksAndDecisions: true,
      },
      pluginKey,
      createAnalyticsEvent: createAnalyticsEvent as any,
    });
  };

  const setup = (
    props: { doc?: DocBuilder } & Partial<ToolbarListsIndentationProps> = {},
  ) => {
    const { doc: setupDoc, ...toolbarProps } = props;
    const editorWrapper = editor(setupDoc || doc(p('text')));
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

  describe('analytics', () => {
    let ToolbarListsIndentation: ReactWrapper<any, any, any>;

    beforeEach(() => {
      ({ ToolbarListsIndentation } = setup());
    });

    it('should dispatch analytics event when bulleted list button is clicked', () => {
      clickToolbarOption(
        ToolbarListsIndentation,
        messages.unorderedList.defaultMessage,
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
        messages.orderedList.defaultMessage,
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
});
