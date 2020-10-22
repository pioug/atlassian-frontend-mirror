import React from 'react';
import DropList from '@atlaskit/droplist';
import Item from '@atlaskit/item';
import createAnalyticsEventMock from '@atlaskit/editor-test-helpers/create-analytics-event-mock';
import createEditorFactory from '@atlaskit/editor-test-helpers/create-editor';
import { mountWithIntl } from '@atlaskit/editor-test-helpers/enzyme';
import {
  doc,
  p,
  strike,
  code,
  em,
  subsup,
  code_block as codeBlock,
  underline,
} from '@atlaskit/editor-test-helpers/schema-builder';
import { InjectedIntlProps } from 'react-intl';

import { ReactWrapper } from 'enzyme';
import {
  pluginKey,
  TextFormattingState,
} from '../../../../../plugins/text-formatting/pm-plugins/main';
import { pluginKey as clearFormattingPluginKey } from '../../../../../plugins/text-formatting/pm-plugins/clear-formatting';
import ToolbarAdvancedTextFormatting, {
  Props as ToolbarProps,
} from '../../../../../plugins/text-formatting/ui/ToolbarAdvancedTextFormatting';
import { toolbarMessages } from '../../../../../plugins/text-formatting/ui/ToolbarAdvancedTextFormatting/toolbar-messages';
import ToolbarButton from '../../../../../ui/ToolbarButton';
import DropdownMenuWrapper from '../../../../../ui/DropdownMenu';
import { UIAnalyticsEvent } from '@atlaskit/analytics-next';
import { EditorView } from 'prosemirror-view';
import { pluginKey as widthPluginKey } from '../../../../../plugins/width';
import { VIEWPORT_SIZES } from '@atlaskit/editor-shared-styles';

describe('@atlaskit/editor-core/ui/ToolbarAdvancedTextFormatting', () => {
  const createEditor = createEditorFactory();
  let createAnalyticsEvent: jest.MockInstance<UIAnalyticsEvent, any>;

  const editor = (doc: any) => {
    createAnalyticsEvent = createAnalyticsEventMock();
    return createEditor({
      doc,
      pluginKey: pluginKey,
      editorProps: {
        allowAnalyticsGASV3: true,
        allowPanel: true,
      },
      createAnalyticsEvent: createAnalyticsEvent as any,
    });
  };

  let widthPluginGetStateMock: jest.SpyInstance;
  beforeEach(() => {
    widthPluginGetStateMock = jest
      .spyOn(widthPluginKey, 'getState')
      .mockReturnValue({
        width: VIEWPORT_SIZES.laptopMDPI.width,
      });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should render disabled ToolbarButton if both pluginStateTextFormatting and pluginStateClearFormatting are undefined', () => {
    const { editorView } = editor(doc(p('text')));
    const toolbarOption = mountWithIntl(
      <ToolbarAdvancedTextFormatting editorView={editorView} />,
    );
    expect(toolbarOption.find(ToolbarButton).prop('disabled')).toBe(true);
    toolbarOption.unmount();
  });

  it('should have spacing of toolbar button set to none if isReducedSpacing=true', () => {
    const { editorView } = editor(doc(p('text')));
    const toolbarOption = mountWithIntl(
      <ToolbarAdvancedTextFormatting
        editorView={editorView}
        isReducedSpacing={true}
      />,
    );
    expect(toolbarOption.find(ToolbarButton).prop('spacing')).toEqual('none');
    toolbarOption.unmount();
  });

  it('should have spacing of toolbar button set to default if isReducedSpacing=false', () => {
    const { editorView } = editor(doc(p('text')));
    const toolbarOption = mountWithIntl(
      <ToolbarAdvancedTextFormatting editorView={editorView} />,
    );
    expect(toolbarOption.find(ToolbarButton).prop('spacing')).toEqual(
      'default',
    );
    toolbarOption.unmount();
  });

  it('should have only 6 child elements if both pluginStateTextFormatting and pluginStateClearFormatting are defined', () => {
    const { editorView, pluginState } = editor(doc(p('text')));
    const clearFormattingState = clearFormattingPluginKey.getState(
      editorView.state,
    );
    const toolbarOption = mountWithIntl(
      <ToolbarAdvancedTextFormatting
        textFormattingState={pluginState}
        clearFormattingState={clearFormattingState}
        editorView={editorView}
      />,
    );
    toolbarOption.find('button').simulate('click');
    expect(toolbarOption.find(DropList).find(Item).length).toEqual(6);
    toolbarOption.unmount();
  });

  it('should have 6 items for mobile view', () => {
    const { editorView, pluginState } = editor(doc(p('text')));
    const clearFormattingState = clearFormattingPluginKey.getState(
      editorView.state,
    );
    widthPluginGetStateMock.mockReturnValue({
      width: VIEWPORT_SIZES.mobileM.width - 1,
    });
    const toolbarOption = mountWithIntl(
      <ToolbarAdvancedTextFormatting
        textFormattingState={pluginState}
        clearFormattingState={clearFormattingState}
        editorView={editorView}
      />,
    );
    toolbarOption.find('button').simulate('click');
    const items = toolbarOption.find(DropList).find(Item);
    expect(items.length).toEqual(6);
    toolbarOption.unmount();
  });

  it('should return only 5 items if only pluginStateTextFormatting is defined', () => {
    const { editorView, pluginState } = editor(doc(p('text')));
    const toolbarOption = mountWithIntl(
      <ToolbarAdvancedTextFormatting
        textFormattingState={pluginState}
        editorView={editorView}
      />,
    );
    toolbarOption.find('button').simulate('click');
    expect(toolbarOption.find(DropList).find(Item).length).toEqual(5);
    toolbarOption.unmount();
  });

  it('should return only 1 items if only pluginStateClearFormatting is defined', () => {
    const { editorView } = editor(doc(p('text')));
    const clearFormattingState = clearFormattingPluginKey.getState(
      editorView.state,
    );
    const toolbarOption = mountWithIntl(
      <ToolbarAdvancedTextFormatting
        clearFormattingState={clearFormattingState}
        editorView={editorView}
      />,
    );
    toolbarOption.find('button').simulate('click');
    expect(toolbarOption.find(DropList).find(Item).length).toEqual(1);
    toolbarOption.unmount();
  });

  it('should render disabled toolbar button when all marks and strikethrough and clearformatting are disabled', () => {
    const { editorView, pluginState: textFormattingState } = editor(
      doc(p('text')),
    );
    const clearFormattingState = clearFormattingPluginKey.getState(
      editorView.state,
    );
    if (textFormattingState) {
      textFormattingState.strikeDisabled = true;
      textFormattingState.codeDisabled = true;
      textFormattingState.underlineDisabled = true;
      textFormattingState.subscriptDisabled = true;
      textFormattingState.superscriptDisabled = true;
    }
    if (clearFormattingState) {
      clearFormattingState.formattingIsPresent = false;
    }
    const toolbarOption = mountWithIntl(
      <ToolbarAdvancedTextFormatting
        textFormattingState={textFormattingState}
        clearFormattingState={clearFormattingState}
        editorView={editorView}
      />,
    );
    expect(toolbarOption.find('button').prop('disabled')).toBe(true);
    toolbarOption.unmount();
  });

  it('should add code mark when clicked', () => {
    const { editorView, pluginState } = editor(doc(p('{<}text{>}')));
    const toolbarOption = mountWithIntl(
      <ToolbarAdvancedTextFormatting
        textFormattingState={pluginState}
        editorView={editorView}
      />,
    );
    toolbarOption.find('button').simulate('click');
    const codeButton = toolbarOption
      .find(Item)
      .filterWhere(
        n => n.text().indexOf(toolbarMessages.code.defaultMessage) > -1,
      );
    codeButton.simulate('click');
    expect(editorView.state.doc).toEqualDocument(doc(p(code('text'))));
    toolbarOption.unmount();
  });

  it('should add strikemark when strikethrough option is clicked', () => {
    const { editorView, pluginState: textFormattingState } = editor(
      doc(p('{<}text{>}')),
    );
    const clearFormattingState = clearFormattingPluginKey.getState(
      editorView.state,
    );
    const toolbarOption = mountWithIntl(
      <ToolbarAdvancedTextFormatting
        textFormattingState={textFormattingState}
        clearFormattingState={clearFormattingState}
        editorView={editorView}
      />,
    );
    toolbarOption.find('button').simulate('click');
    const strikeButton = toolbarOption
      .find(Item)
      .filterWhere(
        n => n.text().indexOf(toolbarMessages.strike.defaultMessage) > -1,
      );
    strikeButton.simulate('click');
    expect(editorView.state.doc).toEqualDocument(doc(p(strike('text'))));
    toolbarOption.unmount();
  });

  it('should not have Strikethrough option if strikeHidden is true', () => {
    const { editorView, pluginState: textFormattingPluginState } = editor(
      doc(p('text')),
    );
    const clearFormattingState = clearFormattingPluginKey.getState(
      editorView.state,
    );
    const toolbarOption = mountWithIntl(
      <ToolbarAdvancedTextFormatting
        textFormattingState={{
          ...textFormattingPluginState,
          strikeHidden: true,
        }}
        clearFormattingState={clearFormattingState}
        editorView={editorView}
      />,
    );
    toolbarOption.find('button').simulate('click');
    const strikeButton = toolbarOption.findWhere(
      wrapper =>
        wrapper.is('span') &&
        wrapper.text().indexOf(toolbarMessages.strike.defaultMessage) > -1,
    );
    expect(strikeButton.length).toEqual(0);
    toolbarOption.unmount();
  });

  it('should clear formatting when clearFormatting option is clicked', () => {
    const { editorView } = editor(doc(p(em('{<}text{>}'))));
    const toolbarOption = mountWithIntl(
      <ToolbarAdvancedTextFormatting
        clearFormattingState={{ formattingIsPresent: true }}
        editorView={editorView}
      />,
    );
    toolbarOption.find('button').simulate('click');
    const clearFormattingButton = toolbarOption
      .find(Item)
      .filterWhere(
        n =>
          n.text().indexOf(toolbarMessages.clearFormatting.defaultMessage) > -1,
      );
    clearFormattingButton.simulate('click');
    expect(editorView.state.doc).toEqualDocument(doc(p('text')));
    toolbarOption.unmount();
  });

  it('should render disabled ToolbarButton if isDisabled property is true', () => {
    const { editorView, pluginState: textFormattingPluginState } = editor(
      doc(p('text')),
    );
    const clearFormattingState = clearFormattingPluginKey.getState(
      editorView.state,
    );
    const toolbarOption = mountWithIntl(
      <ToolbarAdvancedTextFormatting
        textFormattingState={textFormattingPluginState}
        clearFormattingState={clearFormattingState}
        editorView={editorView}
        isDisabled
      />,
    );
    expect(toolbarOption.find(ToolbarButton).prop('disabled')).toBe(true);
    toolbarOption.unmount();
  });

  it('should render disabled ToolbarButton if all marks and strikethrough and clearformatting are disabled', () => {
    const { editorView, pluginState: textFormattingPluginState } = editor(
      doc(p('text')),
    );
    const clearFormattingState = clearFormattingPluginKey.getState(
      editorView.state,
    );
    if (textFormattingPluginState) {
      textFormattingPluginState.strikeDisabled = true;
      textFormattingPluginState.codeDisabled = true;
      textFormattingPluginState.underlineDisabled = true;
      textFormattingPluginState.subscriptDisabled = true;
      textFormattingPluginState.superscriptDisabled = true;
    }
    if (clearFormattingState) {
      clearFormattingState.formattingIsPresent = false;
    }
    const toolbarOption = mountWithIntl(
      <ToolbarAdvancedTextFormatting
        textFormattingState={textFormattingPluginState}
        clearFormattingState={clearFormattingState}
        editorView={editorView}
      />,
    );
    expect(toolbarOption.find('button').prop('disabled')).toBe(true);
    toolbarOption.unmount();
  });

  it('should be selected inside strike', () => {
    const { editorView, pluginState: textFormattingPluginState } = editor(
      doc(p(strike('text'))),
    );
    const clearFormattingState = clearFormattingPluginKey.getState(
      editorView.state,
    );
    const toolbarOption = mountWithIntl(
      <ToolbarAdvancedTextFormatting
        textFormattingState={textFormattingPluginState}
        clearFormattingState={clearFormattingState}
        editorView={editorView}
      />,
    );
    const toolbarButton = toolbarOption.find(ToolbarButton);
    expect(toolbarButton.prop('selected')).toBe(true);
    toolbarOption.unmount();
  });

  /**
   * Helper function to get the react element (not the DOM element) of menu items within the advanced text formatting menu.
   */
  function getMenuItem(
    toolbarOption: ReactWrapper<ToolbarProps & InjectedIntlProps>,
    itemKey: string,
  ) {
    return toolbarOption
      .find(DropdownMenuWrapper)
      .prop('items')[0]
      .items.filter(i => i.key === itemKey)[0];
  }

  describe('menu options inside code block', () => {
    let toolbarOption: ReactWrapper<ToolbarProps & InjectedIntlProps>;

    beforeEach(() => {
      const { editorView, pluginState } = editor(
        doc(codeBlock({ language: 'js' })('Hello {<>}world')),
      );
      const clearFormattingState = clearFormattingPluginKey.getState(
        editorView.state,
      );
      toolbarOption = mountWithIntl(
        <ToolbarAdvancedTextFormatting
          textFormattingState={pluginState}
          clearFormattingState={clearFormattingState}
          editorView={editorView}
        />,
      );
      toolbarOption.find('button').simulate('click');
    });

    afterEach(() => {
      toolbarOption.unmount();
    });

    it('should have clear formatting available for a code block', () => {
      const clearFormattingButton = getMenuItem(
        toolbarOption,
        'clearFormatting',
      );
      expect(clearFormattingButton.isDisabled).toBe(false);
    });

    it('should have other menu items disabled in a code block', () => {
      const strikeButton = getMenuItem(toolbarOption, 'strike');
      expect(strikeButton.isDisabled).toBe(true);
    });
  });

  it('should only have selected menu options for the current selection', () => {
    const { editorView, pluginState } = editor(
      doc(p(strike(underline('{<}Formatted {>}text')))),
    );
    const toolbarOption = mountWithIntl<ToolbarProps, {}>(
      <ToolbarAdvancedTextFormatting
        textFormattingState={pluginState}
        editorView={editorView}
      />,
    );
    toolbarOption.find('button').simulate('click');

    const strikeButton = getMenuItem(toolbarOption, 'strike');
    const underlineButton = getMenuItem(toolbarOption, 'underline');
    const codeButton = getMenuItem(toolbarOption, 'code');

    expect(strikeButton.isActive).toBe(true);
    expect(underlineButton.isActive).toBe(true);
    expect(codeButton.isActive).toBe(false);

    toolbarOption.unmount();
  });

  /**
   * Helper to simulate a click in toolbar option
   * @param type Type of the button in the toolbar
   */
  function clickToolbarOption(
    type: keyof typeof toolbarMessages,
    toolbarOption: ReactWrapper,
  ) {
    toolbarOption.find('button').simulate('click');

    toolbarOption
      .find(Item)
      .filterWhere(
        n => n.text().indexOf(toolbarMessages[type].defaultMessage) > -1,
      )
      .simulate('click');
  }

  describe('Toolbar Button', () => {
    let toolbarOption: ReactWrapper;
    let editorView: EditorView;
    let pluginState: TextFormattingState;

    beforeEach(() => {
      ({ editorView, pluginState } = editor(doc(p('{<}text{>}'))));

      toolbarOption = mountWithIntl(
        <ToolbarAdvancedTextFormatting
          textFormattingState={pluginState}
          clearFormattingState={{ formattingIsPresent: true }}
          editorView={editorView}
        />,
      );
    });

    afterEach(() => {
      toolbarOption.unmount();
    });

    [
      {
        type: 'underline',
        expectedDocument: doc(p(underline('text'))),
      },
      {
        type: 'strike',
        expectedDocument: doc(p(strike('text'))),
      },
      {
        type: 'code',
        expectedDocument: doc(p(code('text'))),
      },
      {
        type: 'subscript',
        expectedDocument: doc(p(subsup({ type: 'sub' })('text'))),
      },
      {
        type: 'superscript',
        expectedDocument: doc(p(subsup({ type: 'sup' })('text'))),
      },
    ].forEach(({ type, expectedDocument }) => {
      describe(`Toolbar ${type}`, () => {
        it('should apply the right format', () => {
          clickToolbarOption(
            type as keyof typeof toolbarMessages,
            toolbarOption,
          );

          expect(editorView.state.doc).toEqualDocument(expectedDocument);
        });

        it(`should create analytics V3 events`, async () => {
          const expectedPayload = {
            action: 'formatted',
            actionSubject: 'text',
            actionSubjectId: type,
            eventType: 'track',
            attributes: expect.objectContaining({
              inputMethod: 'toolbar',
            }),
          };

          clickToolbarOption(
            type as keyof typeof toolbarMessages,
            toolbarOption,
          );
          expect(createAnalyticsEvent).toHaveBeenCalledWith(expectedPayload);
        });
      });
    });
  });
});
