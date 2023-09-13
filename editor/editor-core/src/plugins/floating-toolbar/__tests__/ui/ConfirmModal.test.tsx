import React from 'react';
import { mount } from 'enzyme';
import { mountWithIntl } from '../../../../__tests__/__helpers/enzyme';
import { IntlProvider } from 'react-intl-next';
import type { DocBuilder } from '@atlaskit/editor-common/types';
import { doc, p } from '@atlaskit/editor-test-helpers/doc-builder';
import { createProsemirrorEditorFactory } from '@atlaskit/editor-test-helpers/create-prosemirror-editor';

import { flushPromises } from '@atlaskit/editor-test-helpers/e2e-helpers';
import type {
  Command,
  FloatingToolbarItem,
} from '@atlaskit/editor-common/types';
import { pluginKey as toolbarDataPluginKey } from '../../pm-plugins/toolbar-data/plugin-key';
import type { FloatingToolbarPluginData } from '@atlaskit/editor-plugin-floating-toolbar';
import * as commands from '../../pm-plugins/toolbar-data/commands';
import { ConfirmationModal } from '../../ui/ConfirmationModal';
import floatingToolbarPlugin from '../../index';
import Toolbar from '../../ui/Toolbar';
import floatingToolbarMessages from '../../ui/messages';
import { EditorPresetBuilder } from '@atlaskit/editor-common/preset';
import { featureFlagsPlugin } from '@atlaskit/editor-plugin-feature-flags';
import { decorationsPlugin } from '@atlaskit/editor-plugin-decorations';
import { editorDisabledPlugin } from '@atlaskit/editor-plugin-editor-disabled';

const emptyDoc = doc(p(''));

describe('toolbar-data', () => {
  const createEditorFactory = createProsemirrorEditorFactory();
  const createEditor = (doc: DocBuilder) => {
    return createEditorFactory({
      doc,
      preset: new EditorPresetBuilder()
        .add([featureFlagsPlugin, {}])
        .add(decorationsPlugin)
        .add(editorDisabledPlugin)
        .add(floatingToolbarPlugin),
    });
  };

  describe('commands', () => {
    it('showConfirmDialog should update plugin state', () => {
      const { editorView } = createEditor(emptyDoc);
      let pluginState: FloatingToolbarPluginData;
      const { showConfirmDialog } = commands;

      showConfirmDialog(0)(editorView.state, editorView.dispatch);
      pluginState = toolbarDataPluginKey.getState(editorView.state)!;
      expect(pluginState.confirmDialogForItem).toEqual(0);

      showConfirmDialog(3)(editorView.state, editorView.dispatch);
      pluginState = toolbarDataPluginKey.getState(editorView.state)!;
      expect(pluginState.confirmDialogForItem).toEqual(3);
    });

    it('hideConfirmDialog should update plugin state', () => {
      const { editorView } = createEditor(emptyDoc);
      let pluginState: FloatingToolbarPluginData;
      const { showConfirmDialog, hideConfirmDialog } = commands;

      showConfirmDialog(3)(editorView.state, editorView.dispatch);
      pluginState = toolbarDataPluginKey.getState(editorView.state)!;
      expect(pluginState.confirmDialogForItem).toEqual(3);

      hideConfirmDialog()(editorView.state, editorView.dispatch);
      pluginState = toolbarDataPluginKey.getState(editorView.state)!;
      expect(pluginState.confirmDialogForItem).toBeUndefined();
    });
  });
});

describe('<Toolbar />', () => {
  const createEditorFactory = createProsemirrorEditorFactory();
  const createEditor = (doc: DocBuilder) => {
    return createEditorFactory({
      doc,
      preset: new EditorPresetBuilder()
        .add([featureFlagsPlugin, {}])
        .add(decorationsPlugin)
        .add(editorDisabledPlugin)
        .add(floatingToolbarPlugin),
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

      const wrapper = mountWithIntl(
        <Toolbar
          node={node!}
          items={items}
          dispatchCommand={dispatchCommand}
          featureFlags={{}}
          api={undefined}
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
            onConfirm: jest.fn(),
          },
        },
      ];

      const wrapper = mountWithIntl(
        <Toolbar
          node={node!}
          items={items}
          dispatchCommand={dispatchCommand}
          featureFlags={{}}
          api={undefined}
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
          options={{
            message: 'This is the message.',
            onConfirm,
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
            onConfirm,
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
          options={{
            message: 'This is the message.',
            onConfirm,
          }}
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
    expect(onClose).toBeCalledTimes(1); // onClose is called on modal close (after onConfirm)
  });

  it('should trigger onClose when cancel button clicked', () => {
    const wrapper = mount(
      <IntlProvider locale="en">
        <ConfirmationModal
          options={{
            message: 'This is the message.',
            onConfirm: jest.fn(),
          }}
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
          options={{
            message: 'This is the message.',
            onConfirm,
          }}
          onConfirm={onConfirm}
          onClose={onClose}
          testId={testId}
        />
      </IntlProvider>,
    );

    expect(wrapper.find(`section[data-testid="${testId}"]`).length).toEqual(1);

    expect(onConfirm).toBeCalledTimes(0);
    expect(onClose).toBeCalledTimes(0);

    /**
     * Changes to <Blanket /> require that the `mousedown` event is fired in order to prevent accidental
     * clicks triggering the `onBlanketClicked` prop to fire.
     *
     * We are checking the element underneath the mouse on the `mousedown` event, and comparing it to
     * the element underneath the mouse on the `click` event. If these two elements do no match, then
     * `onBlanketClicked` will not fire. By only simulating the `click` event, this check will always fail.
     *
     * This test is now more representative of the order of events that actually fire in a real world environment:
     * mousedown -> mouseup -> click
     */
    wrapper
      .find('div[data-focus-lock-disabled]')
      .find('div[role="presentation"]')
      .simulate('mouseDown')
      .simulate('click');

    expect(onConfirm).toBeCalledTimes(0);
    expect(onClose).toBeCalledTimes(1);
  });

  describe('with CheckboxModal', () => {
    type ConfirmDialogChildInfo = {
      id: string;
      name: string | null;
      amount: number;
    };

    it('should render CheckboxModal with checkbox', () => {
      const nodes: ConfirmDialogChildInfo[] = [
        { id: '1', name: 'ext 1', amount: 3 },
      ];
      const wrapper = mount(
        <IntlProvider locale="en">
          <ConfirmationModal
            options={{
              message: 'This is the message.',
              isReferentialityDialog: true,
              getChildrenInfo: () => nodes,
              onConfirm,
            }}
            onConfirm={onConfirm}
            onClose={onClose}
            testId={testId}
          />
        </IntlProvider>,
      );

      expect(wrapper.find(`input[type="checkbox"]`).length).toEqual(1);
      expect(wrapper.find(`li`).first().text()).toContain(
        '3 connected elements',
      );
    });

    it('should render CheckboxModal with checkbox - singular check', () => {
      const nodes: ConfirmDialogChildInfo[] = [
        { id: '1', name: 'ext 1', amount: 1 },
      ];
      const wrapper = mount(
        <IntlProvider locale="en">
          <ConfirmationModal
            options={{
              message: 'This is the message.',
              isReferentialityDialog: true,
              getChildrenInfo: () => nodes,
              onConfirm,
            }}
            onConfirm={onConfirm}
            onClose={onClose}
            testId={testId}
          />
        </IntlProvider>,
      );

      expect(wrapper.find(`input[type="checkbox"]`).length).toEqual(1);
      expect(wrapper.find(`li`).first().text()).toMatch(/.*\(.*element\)$/);
    });

    it('should render CheckboxModal with checkbox - zero check', () => {
      const nodes: ConfirmDialogChildInfo[] = [
        { id: '1', name: 'ext 1', amount: 0 },
      ];
      const wrapper = mount(
        <IntlProvider locale="en">
          <ConfirmationModal
            options={{
              message: 'This is the message.',
              isReferentialityDialog: true,
              getChildrenInfo: () => nodes,
              onConfirm,
            }}
            onConfirm={onConfirm}
            onClose={onClose}
            testId={testId}
          />
        </IntlProvider>,
      );

      expect(wrapper.find('input[type="checkbox"]').length).toEqual(1);
      expect(wrapper.find('li').first().text()).not.toMatch(/.*\d*\selement/);
    });

    it("hide list if any child doesn't had a name", () => {
      const nodes: ConfirmDialogChildInfo[] = [];
      const wrapper = mount(
        <IntlProvider locale="en">
          <ConfirmationModal
            options={{
              message: 'This is the message.',
              isReferentialityDialog: true,
              getChildrenInfo: () => nodes,
              onConfirm,
            }}
            onConfirm={onConfirm}
            onClose={onClose}
            testId={testId}
          />
        </IntlProvider>,
      );

      expect(wrapper.find('input[type="checkbox"]').length).toEqual(1);
      expect(wrapper.find('li').length).toEqual(0);
    });

    it('show list if all children had a name', () => {
      const nodes: ConfirmDialogChildInfo[] = [
        { id: '1', name: 'ext 1', amount: 0 },
        { id: '2', name: 'ext 2', amount: 3 },
      ];
      const wrapper = mount(
        <IntlProvider locale="en">
          <ConfirmationModal
            options={{
              message: 'This is the message.',
              isReferentialityDialog: true,
              getChildrenInfo: () => nodes,
              onConfirm,
            }}
            onConfirm={onConfirm}
            onClose={onClose}
            testId={testId}
          />
        </IntlProvider>,
      );

      expect(wrapper.find('input[type="checkbox"]').length).toEqual(1);
      expect(wrapper.find('li').length).toEqual(2);
    });
  });
});
