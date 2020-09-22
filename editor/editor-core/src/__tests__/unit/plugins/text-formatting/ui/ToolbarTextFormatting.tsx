import React from 'react';
import AkButton from '@atlaskit/button/standard-button';
import { ReactWrapper } from 'enzyme';
import createEditorFactory from '@atlaskit/editor-test-helpers/create-editor';
import { mountWithIntl } from '@atlaskit/editor-test-helpers/enzyme';
import { doc, p } from '@atlaskit/editor-test-helpers/schema-builder';
import ToolbarButton from '../../../../../ui/ToolbarButton';
import {
  TextFormattingState,
  pluginKey,
} from '../../../../../plugins/text-formatting/pm-plugins/main';
import ToolbarTextFormatting from '../../../../../plugins/text-formatting/ui/ToolbarTextFormatting';
import {
  CreateUIAnalyticsEvent,
  UIAnalyticsEvent,
} from '@atlaskit/analytics-next';
import {
  AnalyticsEventPayload,
  ACTION_SUBJECT_ID,
  ACTION,
  ACTION_SUBJECT,
  EVENT_TYPE,
  INPUT_METHOD,
} from '../../../../../plugins/analytics';

describe('ToolbarTextFormatting', () => {
  const createEditor = createEditorFactory<TextFormattingState>();
  let createAnalyticsEvent: CreateUIAnalyticsEvent;
  const editor = (doc: any) => {
    createAnalyticsEvent = jest.fn(() => ({ fire() {} } as UIAnalyticsEvent));
    return createEditor({
      doc,
      editorProps: {
        allowAnalyticsGASV3: true,
      },
      createAnalyticsEvent,
      pluginKey: pluginKey,
    });
  };

  it('should render disabled ToolbarButtons if disabled property is true', () => {
    const { editorView, pluginState } = editor(doc(p('text')));
    const toolbarTextColor = mountWithIntl(
      <ToolbarTextFormatting
        disabled={true}
        textFormattingState={pluginState}
        editorView={editorView}
      />,
    );

    toolbarTextColor.find(ToolbarButton).forEach(node => {
      expect(node.prop('disabled')).toBe(true);
    });
    toolbarTextColor.unmount();
  });

  describe('analytics', () => {
    let toolbarOption: ReactWrapper;

    function clickItalicButton(wrapper: ReactWrapper): void {
      wrapper.find(AkButton).at(1).simulate('click');
    }

    function clickBoldButton(wrapper: ReactWrapper): void {
      wrapper.find(AkButton).first().simulate('click');
    }

    beforeEach(() => {
      const { editorView, pluginState } = editor(doc(p('text')));
      toolbarOption = mountWithIntl(
        <ToolbarTextFormatting
          textFormattingState={pluginState}
          editorView={editorView}
        />,
      );
    });

    afterEach(() => {
      toolbarOption.unmount();
    });

    it('should trigger fireAnalyticsEvent when bold button is clicked', () => {
      const expectedPayload: AnalyticsEventPayload = {
        action: ACTION.FORMATTED,
        actionSubject: ACTION_SUBJECT.TEXT,
        actionSubjectId: ACTION_SUBJECT_ID.FORMAT_STRONG,
        eventType: EVENT_TYPE.TRACK,
        attributes: expect.objectContaining({
          inputMethod: INPUT_METHOD.TOOLBAR,
        }),
      };

      clickBoldButton(toolbarOption);

      expect(createAnalyticsEvent).toHaveBeenCalledWith(expectedPayload);
    });

    it('should trigger fireAnalyticsEvent when italic button is clicked', () => {
      const expectedPayload: AnalyticsEventPayload = {
        action: ACTION.FORMATTED,
        actionSubject: ACTION_SUBJECT.TEXT,
        actionSubjectId: ACTION_SUBJECT_ID.FORMAT_ITALIC,
        eventType: EVENT_TYPE.TRACK,
        attributes: expect.objectContaining({
          inputMethod: INPUT_METHOD.TOOLBAR,
        }),
      };

      clickItalicButton(toolbarOption);

      expect(createAnalyticsEvent).toHaveBeenCalledWith(expectedPayload);
    });
  });
});
