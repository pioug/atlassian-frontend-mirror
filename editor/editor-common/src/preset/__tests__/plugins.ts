import type { EditorState } from '@atlaskit/editor-prosemirror/state';

import type { NextEditorPlugin } from '../../types';

describe('NextEditorPlugin: types', () => {
  describe('actions', () => {
    type DogActions = {
      bark: () => 'wof' | 'au';
    };

    describe('when an action interface is given to the metadata', () => {
      it('should not complain when actions implemented properly', () => {
        const PluginDog: NextEditorPlugin<
          'dog',
          { actions: DogActions }
        > = () => ({
          name: 'dog',

          actions: {
            bark: () => 'wof',
          },
        });

        expect(PluginDog).not.toBeNull();
      });

      it('should complain when actions is implemented wrongly', () => {
        const PluginDog: NextEditorPlugin<
          'dog',
          {
            actions: DogActions;
          }
        > = () => ({
          name: 'dog',

          actions: {
            // @ts-expect-error
            bark: () => 'miau',
          },
        });

        expect(PluginDog).not.toBeNull();
      });
    });

    describe('when a plugin is using a dependency action', () => {
      it('should not complain when accessing the right action', () => {
        const PluginDog: NextEditorPlugin<
          'dog',
          { actions: DogActions }
        > = () => ({
          name: 'dog',

          actions: {
            bark: () => 'wof',
          },
        });

        const PluginSomething: NextEditorPlugin<
          'something',
          { dependencies: [typeof PluginDog] }
        > = ({ api }) => {
          api?.dog.actions.bark();
          return {
            name: 'something',
          };
        };

        expect(PluginDog).not.toBeNull();
        expect(PluginSomething).not.toBeNull();
      });
    });
  });

  describe('self injection', () => {
    describe('when a plugin have actions', () => {
      it('should be able to access it own api by', () => {
        const PluginDog: NextEditorPlugin<
          'dog',
          { actions: { lol: () => string } }
        > = ({ api }) => {
          if (api) {
            // Should work
            const result = api.dog.actions.lol();

            result.trim();
          }

          return {
            name: 'dog',
            actions: {
              lol: () => {
                return 'lol hello';
              },
            },
          };
        };

        expect(PluginDog).not.toBeNull();
      });
    });

    describe('when a plugin have a sharedState', () => {
      it('should be able to access it own api by', () => {
        const PluginDog: NextEditorPlugin<
          'dog',
          { sharedState: 'hello darkness' }
        > = ({ api }) => {
          if (api) {
            // Should work
            const result = api.dog.sharedState.currentState();
            result?.trim();
          }

          return {
            name: 'dog',
            getSharedState(editorState) {
              return 'hello darkness';
            },
          };
        };

        expect(PluginDog).not.toBeNull();
      });
    });
  });

  describe('validate types', () => {
    type IsAny<T> = 0 extends 1 & T ? true : false;

    describe('from actions', () => {
      type IsEqual<A, B> = A extends B ? true : false;

      it('should set the plugin action types from the metadata', () => {
        type Actions = {
          some: () => true;
        };
        type PluginActions = ReturnType<
          NextEditorPlugin<'one', { actions: Actions }>
        >['actions'];

        const isValid: IsEqual<Actions, PluginActions> = true;

        expect(isValid).toBeTruthy();
      });
    });

    describe('from getSharedState', () => {
      type IsEditorState<T> = IsAny<T> extends true
        ? false
        : T extends EditorState
        ? true
        : false;
      type PluginOneType = NextEditorPlugin<'one', { sharedState: number }>;

      it('should set the editorState type as EditorState', () => {
        let isEditorState = true;
        const fakePlugin: ReturnType<PluginOneType> = {
          name: 'one',
          getSharedState(editorState) {
            // this should not throw a ts error
            isEditorState = true as IsEditorState<typeof editorState>;

            return 12;
          },
        };

        expect(fakePlugin).toBeDefined();
        expect(isEditorState).toBeTruthy();
      });

      it('should set return type to the same one declared on the metadata (number) and undefined ', () => {
        type GetSharedState = ReturnType<PluginOneType>['getSharedState'];

        type AssertGetSharedState = [ReturnType<GetSharedState>] extends [
          number | undefined,
        ]
          ? true
          : false;

        const isNumberAndUndefined: AssertGetSharedState = true;

        expect(isNumberAndUndefined).toBeTruthy();
      });
    });
  });
});
