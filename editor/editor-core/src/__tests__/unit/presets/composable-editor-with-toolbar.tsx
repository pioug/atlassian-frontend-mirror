import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { EditorPresetBuilder } from '@atlaskit/editor-common/preset';
import { useSharedPluginState } from '@atlaskit/editor-common/hooks';
import { usePreset } from '../../../use-preset';
import { ComposableEditor } from '../../../composable-editor';
import { createDefaultPreset } from '../../../labs-next';
import { EditorContext } from '../../..';
import type {
  PublicPluginAPI,
  NextEditorPlugin,
  EditorCommand,
} from '@atlaskit/editor-common/types';
import Button from '@atlaskit/button';
import { PluginKey } from '@atlaskit/editor-prosemirror/state';
import { SafePlugin } from '@atlaskit/editor-common/safe-plugin';

describe('composable editor with toolbar', () => {
  it('should be able to execute commands from outside the composable editor', () => {
    const { container, getByText } = render(
      <EditorContext>
        <TestEditor />
      </EditorContext>,
    );

    const toolbarButton = getByText('Click me!');
    fireEvent.click(toolbarButton);
    const editorElement = container.getElementsByClassName(
      'ak-editor-content-area',
    );
    expect(editorElement[0].textContent).toBe('bark');
  });

  it('should not be an unknown boy as the state should always update', () => {
    const { getByTestId } = render(
      <EditorContext>
        <TestEditor />
      </EditorContext>,
    );

    const status = getByTestId('dog-status');
    expect(status.textContent).toBe('Good boy');
  });

  it('should be able to execute commands and it uses the correct editor', () => {
    const { container, getAllByText } = render(
      <div>
        <EditorContext>
          <TestEditor />
        </EditorContext>
        <EditorContext>
          <TestEditor />
        </EditorContext>
      </div>,
    );

    const toolbarButtons = getAllByText('Click me!');
    fireEvent.click(toolbarButtons[1]);
    fireEvent.click(toolbarButtons[1]);
    const editorElement = container.getElementsByClassName(
      'ak-editor-content-area',
    );
    // We don't modify the first editor so it shouldn't have been modified
    expect(editorElement[0].textContent).toBe('');

    // We bark twice on the second editor
    expect(editorElement[1].textContent).toBe('barkbark');
  });

  it('should be able to read + update state', () => {
    const { getAllByText, getAllByTestId } = render(
      <div>
        <EditorContext>
          <TestEditor />
        </EditorContext>
        <EditorContext>
          <TestEditor />
        </EditorContext>
      </div>,
    );

    const toolbarButtons = getAllByText('Click me!');
    const statuses = getAllByTestId('dog-status');
    // Both dogs should be a good boy
    expect(statuses[0].textContent).toBe('Good boy');
    expect(statuses[1].textContent).toBe('Good boy');

    fireEvent.click(toolbarButtons[1]);
    // The second dog barks and should be a bad boy now
    expect(statuses[0].textContent).toBe('Good boy');
    expect(statuses[1].textContent).toBe('Bad boy');
  });
});

const dogPluginKey = new PluginKey('dog');

const dogPlugin: NextEditorPlugin<
  'dog',
  {
    commands: { bark: EditorCommand };
    sharedState: { hasBarked: boolean } | undefined;
  }
> = ({ api }) => {
  return {
    name: 'dog',

    commands: {
      bark: ({ tr }) => {
        tr.insertText('bark');
        tr.setMeta(dogPluginKey, true);
        return tr;
      },
    },

    getSharedState(editorState) {
      if (!editorState) {
        return undefined;
      }
      return dogPluginKey.getState(editorState);
    },

    pmPlugins() {
      return [
        {
          name: 'dogPlugin',
          plugin: () =>
            new SafePlugin({
              key: dogPluginKey,
              state: {
                init() {
                  return { hasBarked: false };
                },
                apply(tr, currentState) {
                  const meta = tr.getMeta(dogPluginKey);
                  if (meta) {
                    return {
                      hasBarked: true,
                    };
                  }
                  return currentState;
                },
              },
            }),
        },
      ];
    },
  };
};

function Toolbar({
  editorApi,
}: {
  editorApi: PublicPluginAPI<[typeof dogPlugin]> | undefined;
}) {
  const { dogState } = useSharedPluginState(editorApi, ['dog']);
  return (
    <div>
      <p data-testid="dog-status">
        {dogState
          ? dogState?.hasBarked
            ? 'Bad boy'
            : 'Good boy'
          : 'Unknown boy'}
      </p>
      <Button
        onClick={() => {
          const command = editorApi?.dog.commands.bark;
          editorApi?.core.actions.execute(command);
        }}
      >
        Click me!
      </Button>
    </div>
  );
}

function TestEditor() {
  const { preset, editorApi } = usePreset(() => {
    return createDefaultPreset({ featureFlags: {}, paste: {} }).add(dogPlugin);
  }, []);

  return (
    <div>
      <Toolbar editorApi={editorApi} />
      <ComposableEditor appearance="chromeless" preset={preset} />
    </div>
  );
}

/**
 * Sanity checks
 */
// @ts-ignore
function TestEditor2() {
  const { preset, editorApi } = usePreset(() => {
    return new EditorPresetBuilder();
  }, []);

  return (
    <div>
      {/* @ts-expect-error hyperlink plugin doesn't exist here */}
      <Toolbar editorApi={editorApi} />
      <ComposableEditor appearance="chromeless" preset={preset} />
    </div>
  );
}

const catPlugin: NextEditorPlugin<'cat'> = () => {
  return {
    name: 'cat',
  };
};

// @ts-ignore
function TestEditor3() {
  const { preset, editorApi } = usePreset(() => {
    return new EditorPresetBuilder().add(catPlugin);
  }, []);

  return (
    <div>
      {/* @ts-expect-error hyperlink plugin doesn't exist here */}
      <Toolbar editorApi={editorApi} />
      <ComposableEditor appearance="chromeless" preset={preset} />
    </div>
  );
}
