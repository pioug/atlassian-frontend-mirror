import React from 'react';
import { mount } from 'enzyme';
import { IntlProvider } from 'react-intl';
import { doc, p, DocBuilder } from '@atlaskit/editor-test-helpers/doc-builder';
import { createProsemirrorEditorFactory } from '@atlaskit/editor-test-helpers/create-prosemirror-editor';

import { flushPromises } from '../../../../__tests__/__helpers/utils';
import { LightEditorPlugin } from '../../../../create-editor/get-plugins';
import { Command } from '../../../../types/command';
import { Preset } from '../../../../labs/next/presets/preset';
import { pluginKey as toolbarDataPluginKey } from '../../pm-plugins/toolbar-data/plugin-key';
import { FloatingToolbarPluginData } from '../../pm-plugins/toolbar-data/types';
import * as commands from '../../pm-plugins/toolbar-data/commands';
import { ConfirmationModal } from '../../ui/ConfirmationModal';
import floatingToolbarPlugin from '../../index';
import Toolbar from '../../ui/Toolbar';
import { FloatingToolbarItem } from '../../types';
import floatingToolbarMessages from '../../ui/messages';

const emptyDoc = doc(p(''));

describe('toolbar-data', () => {
  const createEditorFactory = createProsemirrorEditorFactory();
  const createEditor = (doc: DocBuilder) => {
    return createEditorFactory({
      doc,
      preset: new Preset<LightEditorPlugin>().add(floatingToolbarPlugin),
    });
  };

  describe('commands', () => {
    it('showConfirmDialog should update plugin state', () => {
      const { editorView } = createEditor(emptyDoc);
      let pluginState: FloatingToolbarPluginData;
      const { showConfirmDialog } = commands;

      showConfirmDialog(0)(editorView.state, editorView.dispatch);
      pluginState = toolbarDataPluginKey.getState(editorView.state);
      expect(pluginState.confirmDialogForItem).toEqual(0);

      showConfirmDialog(3)(editorView.state, editorView.dispatch);
      pluginState = toolbarDataPluginKey.getState(editorView.state);
      expect(pluginState.confirmDialogForItem).toEqual(3);
    });

    it('hideConfirmDialog should update plugin state', () => {
      const { editorView } = createEditor(emptyDoc);
      let pluginState: FloatingToolbarPluginData;
      const { showConfirmDialog, hideConfirmDialog } = commands;

      showConfirmDialog(3)(editorView.state, editorView.dispatch);
      pluginState = toolbarDataPluginKey.getState(editorView.state);
      expect(pluginState.confirmDialogForItem).toEqual(3);

      hideConfirmDialog()(editorView.state, editorView.dispatch);
      pluginState = toolbarDataPluginKey.getState(editorView.state);
      expect(pluginState.confirmDialogForItem).toBeUndefined();
    });
  });
});

describe('<Toolbar />', () => {
  const createEditorFactory = createProsemirrorEditorFactory();
  const createEditor = (doc: DocBuilder) => {
    return createEditorFactory({
      doc,
      preset: new Preset<LightEditorPlugin>().add(floatingToolbarPlugin),
    });
  };
  const { editorView } = createEditor(emptyDoc);
  const node = editorView.state.doc.firstChild;

  const dispatchCommand = jest.fn();
  const onClickCommand = jest.fn(() => {
    return true;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('<Button />', () => {
    it('should dispatch onClick when no confirmDialog is defined', async () => {
      expect(node).toBeTruthy();

      const items: FloatingToolbarItem<Command>[] = [
        { type: 'separator' },
        { type: 'separator' },
        {
          type: 'button',
          title: 'This has no confirm dialog',
          onClick: onClickCommand,
        },
      ];

      const wrapper = mount(
        <Toolbar
          node={node!}
          items={items}
          dispatchCommand={dispatchCommand}
        />,
      );

      await flushPromises();
      wrapper.update();

      expect(onClickCommand).toBeCalledTimes(0);
      expect(
        wrapper.find('button[aria-label="This has no confirm dialog"]').length,
      ).toEqual(1);
      wrapper
        .find('button[aria-label="This has no confirm dialog"]')
        .simulate('click');
      expect(dispatchCommand).toBeCalledTimes(1);
      expect(dispatchCommand).toBeCalledWith(onClickCommand);
    });

    it('should dispatch showConfirmDialog with correct button index when confirmDialog is defined', async () => {
      expect(node).toBeTruthy();

      const showConfirmDialog = jest.spyOn(commands, 'showConfirmDialog');

      const items: FloatingToolbarItem<Command>[] = [
        { type: 'separator' },
        { type: 'separator' },
        {
          type: 'button',
          title: 'This has a confirm dialog',
          onClick: onClickCommand,
          confirmDialog: {
            message: 'Hear ye hear ye!',
          },
        },
      ];

      const wrapper = mount(
        <Toolbar
          node={node!}
          items={items}
          dispatchCommand={dispatchCommand}
        />,
      );

      await flushPromises();
      wrapper.update();

      expect(onClickCommand).not.toBeCalled();
      expect(showConfirmDialog).not.toBeCalled();
      expect(
        wrapper.find('button[aria-label="This has a confirm dialog"]').length,
      ).toEqual(1);
      wrapper
        .find('button[aria-label="This has a confirm dialog"]')
        .simulate('click');
      expect(dispatchCommand).toBeCalledTimes(1);
      expect(onClickCommand).not.toBeCalled();
      expect(showConfirmDialog).toBeCalled();
      expect(showConfirmDialog).toBeCalledWith(2); // button is third item in items[]

      showConfirmDialog.mockRestore();
    });
  });
});

describe('<ConfirmationModal />', () => {
  const onConfirm = jest.fn();
  const onClose = jest.fn();
  const testId = 'ak-floating-toolbar-confirmation-modal';

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should not show modal if options is undefined', () => {
    const wrapper = mount(
      <IntlProvider locale="en">
        <ConfirmationModal
          onConfirm={onConfirm}
          onClose={onClose}
          testId={testId}
        />
      </IntlProvider>,
    );

    expect(wrapper.find(`section[data-testid="${testId}"]`).length).toEqual(0);
  });

  it('should show with default labels if not specified', () => {
    const wrapper = mount(
      <IntlProvider locale="en">
        <ConfirmationModal
          options={{ message: 'This is the message.' }}
          onConfirm={onConfirm}
          onClose={onClose}
          testId={testId}
        />
      </IntlProvider>,
    );

    expect(wrapper.find(`section[data-testid="${testId}"]`).length).toEqual(1);
    expect(
      wrapper.find(`span[data-testid="${testId}--title-text"]`).text(),
    ).toEqual(
      floatingToolbarMessages.confirmModalDefaultHeading.defaultMessage,
    );
    expect(wrapper.find(`div[data-testid="${testId}--body"]`).text()).toEqual(
      'This is the message.',
    );

    expect(
      wrapper.find(`button[data-testid="${testId}-confirm-button"]`).text(),
    ).toEqual(floatingToolbarMessages.confirmModalOK.defaultMessage);
    expect(
      wrapper.find(`button[data-testid="${testId}-cancel-button"]`).text(),
    ).toEqual(floatingToolbarMessages.confirmModalCancel.defaultMessage);
  });

  it('should show custom labels if specified', () => {
    const wrapper = mount(
      <IntlProvider locale="en">
        <ConfirmationModal
          options={{
            message: 'This is the message.',
            title: 'Oh hello there!',
            okButtonLabel: 'Yeah',
            cancelButtonLabel: 'Nah',
          }}
          onConfirm={onConfirm}
          onClose={onClose}
          testId={testId}
        />
      </IntlProvider>,
    );

    expect(wrapper.find(`section[data-testid="${testId}"]`).length).toEqual(1);
    expect(
      wrapper.find(`span[data-testid="${testId}--title-text"]`).text(),
    ).toEqual('Oh hello there!');
    expect(wrapper.find(`div[data-testid="${testId}--body"]`).text()).toEqual(
      'This is the message.',
    );

    expect(
      wrapper.find(`button[data-testid="${testId}-confirm-button"]`).text(),
    ).toEqual('Yeah');
    expect(
      wrapper.find(`button[data-testid="${testId}-cancel-button"]`).text(),
    ).toEqual('Nah');
  });

  it('should trigger onConfirm when OK button clicked', () => {
    const wrapper = mount(
      <IntlProvider locale="en">
        <ConfirmationModal
          options={{ message: 'This is the message.' }}
          onConfirm={onConfirm}
          onClose={onClose}
          testId={testId}
        />
      </IntlProvider>,
    );

    expect(onConfirm).toBeCalledTimes(0);
    expect(onClose).toBeCalledTimes(0);
    wrapper
      .find(`button[data-testid="${testId}-confirm-button"]`)
      .simulate('click');
    expect(onConfirm).toBeCalledTimes(1);
    expect(onClose).toBeCalledTimes(0);
  });

  it('should trigger onClose when cancel button clicked', () => {
    const wrapper = mount(
      <IntlProvider locale="en">
        <ConfirmationModal
          options={{ message: 'This is the message.' }}
          onConfirm={onConfirm}
          onClose={onClose}
          testId={testId}
        />
      </IntlProvider>,
    );

    expect(onConfirm).toBeCalledTimes(0);
    expect(onClose).toBeCalledTimes(0);
    wrapper
      .find(`button[data-testid="${testId}-cancel-button"]`)
      .simulate('click');
    expect(onConfirm).toBeCalledTimes(0);
    expect(onClose).toBeCalledTimes(1);
  });

  it('should trigger onClose when modal closed by clicking background', () => {
    const wrapper = mount(
      <IntlProvider locale="en">
        <ConfirmationModal
          options={{ message: 'This is the message.' }}
          onConfirm={onConfirm}
          onClose={onClose}
          testId={testId}
        />
      </IntlProvider>,
    );

    expect(wrapper.find(`section[data-testid="${testId}"]`).length).toEqual(1);

    expect(onConfirm).toBeCalledTimes(0);
    expect(onClose).toBeCalledTimes(0);

    wrapper
      .find('div[data-focus-lock-disabled]')
      .find('div[role="presentation"]')
      .simulate('click');

    expect(onConfirm).toBeCalledTimes(0);
    expect(onClose).toBeCalledTimes(1);
  });
});
