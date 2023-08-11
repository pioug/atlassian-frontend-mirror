import { EditorState, Transaction } from '@atlaskit/editor-prosemirror/state';

import { NextEditorPlugin } from '../../types';
import { PluginCommand } from '../../types/plugin-command';
import { pluginCommandToPMCommand } from '../plugin-commands';
import { EditorPluginInjectionAPI } from '../plugin-injection-api';

describe('plugin-commands', () => {
  const mockTestCommand = jest.fn();
  const mockTestCommandWithMeta = jest.fn();

  const pluginOne: NextEditorPlugin<
    'one',
    {
      commands: {
        testCommandWithMeta: (num: number) => PluginCommand;
        testCommand: PluginCommand;
      };
    }
  > = (_, api) => {
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
  > = (_, api) => {
    // Typing should work here
    api?.dependencies.one.commands.testCommandWithMeta(42)({ tr: 0 as any });
    // @ts-expect-error notATestCommand shouldn't exist on `commands`
    api?.dependencies.one.commands.notATestCommand?.(0)({ tr: 0 as any });

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
  > = (_, api) => {
    // Typing should work here
    api?.dependencies.one.commands.testCommand({ tr: 0 as any });

    return {
      name: 'three',
    };
  };

  // @ts-expect-error
  type PluginWithInvalidCommand = NextEditorPlugin<
    'three',
    // @ts-expect-error `testCommand` MUST return a PluginCommand
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

  it('should call plugin commandWithMeta', () => {
    coreAPI.onEditorPluginInitialized(pluginOne(undefined, coreAPI.api()));
    coreAPI.onEditorPluginInitialized(pluginTwo(undefined, coreAPI.api()));

    expect(mockTestCommandWithMeta).toHaveBeenCalledWith(42);
  });

  it('should call plugin command', () => {
    expect(mockTestCommand).not.toHaveBeenCalled();

    coreAPI.onEditorPluginInitialized(pluginOne(undefined, coreAPI.api()));
    coreAPI.onEditorPluginInitialized(pluginThree(undefined, coreAPI.api()));

    expect(mockTestCommand).toHaveBeenCalledTimes(1);
  });
});

describe('PluginCommand to Command', () => {
  let mockTransaction: Transaction;
  let mockDispatch: jest.Mock;

  beforeEach(() => {
    mockTransaction = jest.fn() as any;
    mockDispatch = jest.fn();
  });

  it('should convert internal command to ProseMirror command and dispatch new transaction', () => {
    const internalCommand: PluginCommand = ({ tr }) => tr;
    const pmCommand = pluginCommandToPMCommand(internalCommand);

    const result = pmCommand(
      { tr: mockTransaction } as EditorState,
      mockDispatch,
    );

    expect(result).toBe(true);
    expect(mockDispatch).toHaveBeenCalledWith(mockTransaction);
  });

  it('should return false if the internal command returns null', () => {
    const internalCommand: PluginCommand = ({ tr }) => null;
    const pmCommand = pluginCommandToPMCommand(internalCommand);

    const result = pmCommand(
      { tr: mockTransaction } as EditorState,
      mockDispatch,
    );

    expect(result).toBe(false);
    expect(mockDispatch).not.toHaveBeenCalled();
  });
});
