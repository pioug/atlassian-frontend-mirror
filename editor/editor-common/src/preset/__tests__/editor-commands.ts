import type {
  EditorState,
  Transaction,
} from '@atlaskit/editor-prosemirror/state';

import type { NextEditorPlugin } from '../../types';
import type { EditorCommand } from '../../types/editor-command';
import { editorCommandToPMCommand } from '../editor-commands';
import { EditorPluginInjectionAPI } from '../plugin-injection-api';

describe('editor-commands', () => {
  const mockTestCommand = jest.fn();
  const mockTestCommandWithMeta = jest.fn();

  const pluginOne: NextEditorPlugin<
    'one',
    {
      commands: {
        testCommandWithMeta: (num: number) => EditorCommand;
        testCommand: EditorCommand;
      };
    }
  > = ({ api }) => {
    return {
      name: 'one',
      commands: {
        testCommandWithMeta: (num: number) => () => {
          mockTestCommandWithMeta(num);
          return null;
        },
        testCommand: () => {
          mockTestCommand();
          return null;
        },
      },
    };
  };

  const pluginTwo: NextEditorPlugin<
    'two',
    {
      dependencies: [typeof pluginOne];
    }
  > = ({ api }) => {
    // Typing should work here
    api?.one?.commands.testCommandWithMeta(42)({ tr: 0 as any });
    // @ts-expect-error notATestCommand shouldn't exist on `commands`
    api?.one?.commands.notATestCommand?.(0)({ tr: 0 as any });

    return {
      name: 'two',
      commands: {
        testCommand: (num: number) => () => {
          mockTestCommand();
          return null;
        },
      },
    };
  };

  const pluginThree: NextEditorPlugin<
    'three',
    {
      dependencies: [typeof pluginOne];
    }
  > = ({ api }) => {
    // Typing should work here
    api?.one?.commands.testCommand({ tr: 0 as any });

    return {
      name: 'three',
    };
  };

  // @ts-expect-error
  type PluginWithInvalidCommand = NextEditorPlugin<
    'three',
    // @ts-expect-error `testCommand` MUST return a EditorCommand
    {
      commands: {
        testCommand: (num: number) => void;
      };
    }
  >;

  const getEditorStateFake = jest.fn().mockReturnValue(() => {
    return {}; // Fake EditorState
  }) as any;

  const coreAPI = new EditorPluginInjectionAPI({
    getEditorState: getEditorStateFake,
    getEditorView: () => undefined,
  });

  const api = coreAPI.api() as any;

  it('should call plugin commandWithMeta', () => {
    coreAPI.onEditorPluginInitialized(pluginOne({ api, config: undefined }));
    coreAPI.onEditorPluginInitialized(pluginTwo({ api, config: undefined }));

    expect(mockTestCommandWithMeta).toHaveBeenCalledWith(42);
  });

  it('should call plugin command', () => {
    expect(mockTestCommand).not.toHaveBeenCalled();

    coreAPI.onEditorPluginInitialized(pluginOne({ api, config: undefined }));
    coreAPI.onEditorPluginInitialized(pluginThree({ api, config: undefined }));

    expect(mockTestCommand).toHaveBeenCalledTimes(1);
  });
});

describe('EditorCommand to Command', () => {
  let mockTransaction: Transaction;
  let mockDispatch: jest.Mock;

  beforeEach(() => {
    mockTransaction = jest.fn() as any;
    mockDispatch = jest.fn();
  });

  it('should convert internal command to ProseMirror command and dispatch new transaction', () => {
    const internalCommand: EditorCommand = ({ tr }) => tr;
    const pmCommand = editorCommandToPMCommand(internalCommand);

    const result = pmCommand(
      { tr: mockTransaction } as EditorState,
      mockDispatch,
    );

    expect(result).toBe(true);
    expect(mockDispatch).toHaveBeenCalledWith(mockTransaction);
  });

  it('should return false if the internal command returns null', () => {
    const internalCommand: EditorCommand = ({ tr }) => null;
    const pmCommand = editorCommandToPMCommand(internalCommand);

    const result = pmCommand(
      { tr: mockTransaction } as EditorState,
      mockDispatch,
    );

    expect(result).toBe(false);
    expect(mockDispatch).not.toHaveBeenCalled();
  });
});
