import React from 'react';
import createAnalyticsEventMock from '@atlaskit/editor-test-helpers/create-analytics-event-mock';
import { createEditorFactory } from '@atlaskit/editor-test-helpers/create-editor';
import { mountWithIntl } from '@atlaskit/editor-test-helpers/enzyme';
import { doc, p, DocBuilder } from '@atlaskit/editor-test-helpers/doc-builder';
import { pluginKey } from '../../../pm-plugins/main';
import { ListState } from '../../../types';
import { messages } from '../../../messages';
import ToolbarButton from '../../../../../ui/ToolbarButton';
import DropdownMenu from '../../../../../ui/DropdownMenu';
import ToolbarLists, {
  Props as ToolbarListsProps,
} from '../../../ui/ToolbarLists';
import { UIAnalyticsEvent } from '@atlaskit/analytics-next';
import { ReactWrapper } from 'enzyme';

function clickToolbarOption(toolbarOption: ReactWrapper, title: string) {
  toolbarOption
    .find(ToolbarButton)
    .filterWhere((toolbarButton) =>
      toolbarButton.find('Memo(Icon)').prop('label')!.includes(title),
    )
    .find('button')
    .simulate('click');
}

describe('ToolbarLists', () => {
  const createEditor = createEditorFactory<ListState>();
  let toolBarListsWrapper: ReactWrapper;
  let createAnalyticsEvent: jest.MockInstance<UIAnalyticsEvent, any>;

  afterEach(() => {
    if (toolBarListsWrapper) {
      if (toolBarListsWrapper.length > 0) {
        toolBarListsWrapper.unmount();
      }
      toolBarListsWrapper.detach();
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
    props: { doc?: DocBuilder } & Partial<ToolbarListsProps> = {},
  ) => {
    const { doc: setupDoc, ...toolbarProps } = props;
    const editorWrapper = editor(setupDoc || doc(p('text')));
    const toolBarListsWrapper = mountWithIntl(
      <ToolbarLists editorView={editorWrapper.editorView} {...toolbarProps} />,
    );
    return {
      ...editorWrapper,
      toolbarLists: toolBarListsWrapper,
    };
  };

  it('should render disabled ToolbarButtons if disabled property is true', () => {
    const { toolbarLists } = setup({ disabled: true });

    toolbarLists.find(ToolbarButton).forEach((node) => {
      expect(node.prop('disabled')).toBe(true);
    });
  });

  it('should have a dropdown if option isSmall = true', () => {
    const { toolbarLists } = setup({ isSmall: true });

    expect(toolbarLists.find(DropdownMenu).length).toEqual(1);
  });

  describe('analytics', () => {
    let toolbarLists: ReactWrapper<any, any, any>;

    beforeEach(() => {
      ({ toolbarLists } = setup());
    });

    it('should dispatch analytics event when bulleted list button is clicked', () => {
      clickToolbarOption(toolbarLists, messages.unorderedList.defaultMessage);

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
      clickToolbarOption(toolbarLists, messages.orderedList.defaultMessage);

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
