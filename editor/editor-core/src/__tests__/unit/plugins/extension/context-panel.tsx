import { ADNode } from '@atlaskit/editor-common/validator';
import {
  bodiedExtension,
  extension,
  inlineExtension,
  p as paragraph,
  BuilderContent,
} from '@atlaskit/editor-test-helpers/doc-builder';

import { pluginKey } from '../../../../plugins/extension/plugin-key';
import { flushPromises } from '../../../__helpers/utils';
import { setupConfigPanel } from '../../_setup-config-panel';

// there are many warnings due to hooks usage and async code that will be solved with the next react update.
// this function will keep then silent so we can still read the tests.
const silenceActErrors = () => {
  let consoleError: jest.SpyInstance;

  beforeAll(() => {
    consoleError = jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterAll(() => {
    consoleError.mockRestore();
  });
};

describe('extension context panel', () => {
  const findExtension = (content: ADNode): ADNode => {
    const isExtension = [
      'bodiedExtension',
      'extension',
      'inlineExtension',
    ].includes(content.type);
    if (isExtension) {
      return content;
    }

    return findExtension(content.content![0]);
  };

  it('should not call emit on every document change', async () => {
    const content = [
      '{<node>}',
      extension({
        extensionType: 'fake.confluence',
        extensionKey: 'expand',
        parameters: {
          macroParams: {
            title: 'click to see something cool',
            content: 'something cool',
          },
        },
      })(),
    ];
    const { editorView, emitMock } = await setupConfigPanel({ content });

    emitMock.mockClear();

    editorView.dispatch(editorView.state.tr.insertText('hello'));
    editorView.dispatch(editorView.state.tr.insertText(' world'));
    editorView.dispatch(editorView.state.tr.insertText('!'));

    expect(
      emitMock.mock.calls.filter(
        ([e, _]: [string, any]) => e === 'contextPanelPluginKey$',
      ).length,
    ).toEqual(1);
  });

  it('should allow an extension with no parameters to be updated', async () => {
    const content = [
      '{<node>}',
      extension({
        extensionType: 'fake.confluence',
        extensionKey: 'expand',
      })(),
    ];
    const { props, dispatchMock } = await setupConfigPanel({ content });

    props.onChange({
      title: 'changed',
      content: 'not that cool',
    });

    await flushPromises();

    const lastDispatchedTr = dispatchMock.mock.calls.pop();

    expect(
      findExtension(lastDispatchedTr![0].doc.toJSON().content[0]).attrs
        .parameters,
    ).toEqual({
      macroParams: {
        title: 'changed',
        content: 'not that cool',
      },
    });
  });

  it('should not close the config panel after save if autosave is on', async () => {
    const content = [
      '{<node>}',
      extension({
        extensionType: 'fake.confluence',
        extensionKey: 'expand',
      })(),
    ];
    const { props, editorView } = await setupConfigPanel({ content });

    props.onChange({
      title: 'changed',
      content: 'not that cool',
    });

    await flushPromises();
    const pluginState = pluginKey.getState(editorView.state);
    expect(pluginState.showContextPanel).toBeTruthy();
  });

  it('should close the config panel after save if autosave is off', async () => {
    const content = [
      '{<node>}',
      extension({
        extensionType: 'fake.confluence',
        extensionKey: 'expand',
      })(),
    ];
    const { props, editorView } = await setupConfigPanel({
      content,
      autoSave: false,
    });

    props.onChange({
      title: 'changed',
      content: 'not that cool',
    });

    await flushPromises();
    const pluginState = pluginKey.getState(editorView.state);
    expect(pluginState.showContextPanel).toBeFalsy();
  });

  const testSaving = (type: string, content: BuilderContent[]) => {
    describe(`Saving ${type}`, () => {
      silenceActErrors();

      it('should unwrap parameters when injecting into the component', async () => {
        const { props } = await setupConfigPanel({ content });

        expect(props.parameters).toEqual({
          title: 'click to see something cool',
          content: 'something cool',
        });
      });

      it('should wrap parameters back when saving and not scroll into view', async () => {
        const { props, dispatchMock } = await setupConfigPanel({ content });

        props.onChange({
          title: 'changed',
          content: 'not that cool',
        });

        await flushPromises();

        const lastDispatchedTr = dispatchMock.mock.calls.pop();

        expect(
          findExtension(lastDispatchedTr![0].doc.toJSON().content[0]).attrs
            .parameters,
        ).toEqual({
          macroParams: {
            title: 'changed',
            content: 'not that cool',
          },
        });

        expect((lastDispatchedTr as any).scrolledIntoView).toBeFalsy();
      });

      it('should preserve selection', async () => {
        const { props, editorView } = await setupConfigPanel({ content });
        const { selection: prevSelection } = editorView.state;

        props.onChange({
          title: 'changed',
          content: 'not that cool',
        });
        await flushPromises();

        const { selection } = editorView.state;
        expect(selection.constructor.name).toEqual(
          prevSelection.constructor.name,
        );
        expect(selection.from).toEqual(prevSelection.from);
        expect(selection.to).toEqual(prevSelection.to);
      });

      it("shouldn't update the document if parameters are the same", async () => {
        const { props, dispatchMock } = await setupConfigPanel({ content });

        dispatchMock.mockClear();
        props.onChange({
          title: props.parameters!.title,
          content: props.parameters!.content,
        });
        await flushPromises();

        expect(dispatchMock).not.toHaveBeenCalled();
      });
    });
  };

  testSaving('inlineExtension', [
    paragraph(
      '{<node>}',
      inlineExtension({
        extensionType: 'fake.confluence',
        extensionKey: 'expand',
        parameters: {
          macroParams: {
            title: 'click to see something cool',
            content: 'something cool',
          },
        },
      })(),
      ' text',
    ),
  ]);

  testSaving('extension', [
    '{<node>}',
    extension({
      extensionType: 'fake.confluence',
      extensionKey: 'expand',
      parameters: {
        macroParams: {
          title: 'click to see something cool',
          content: 'something cool',
        },
      },
    })(),
  ]);

  testSaving('bodiedExtension', [
    '{<node>}',
    bodiedExtension({
      extensionType: 'fake.confluence',
      extensionKey: 'expand',
      parameters: {
        macroParams: {
          title: 'click to see something cool',
          content: 'something cool',
        },
      },
    })(paragraph('text')),
  ]);

  testSaving('bodiedExtension with cursor inside', [
    bodiedExtension({
      extensionType: 'fake.confluence',
      extensionKey: 'expand',
      parameters: {
        macroParams: {
          title: 'click to see something cool',
          content: 'something cool',
        },
      },
    })(paragraph('te{<>}xt')),
  ]);
});
