// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import {
  bodiedExtension,
  doc,
  expand,
  nestedExpand,
  p,
  table,
  td,
  tr,
} from '@atlaskit/editor-test-helpers/doc-builder';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import sampleSchema from '@atlaskit/editor-test-helpers/schema';

import { onKeydown } from '../../keydown';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies

describe('#onKeydown', () => {
  describe('when ctrl or meta is pressed', () => {
    it.each([{ ctrlKey: true }, { metaKey: true }])(
      'should return false',
      opts => {
        const fakeView: any = {};
        const event: KeyboardEvent = new KeyboardEvent('keydown', opts);
        const result = onKeydown(fakeView, event);
        expect(result).toBeFalsy();
      },
    );
  });

  const cases = [
    doc(
      p('Hello'),
      '{nextSelection}',
      expand({
        __expanded: false,
      })(p('')),
      p('{here}'),
    ),

    // first node
    doc(
      '{nextSelection}',
      expand({
        __expanded: false,
      })(p('')),
      p('{here}'),
    ),

    // first nested expand node
    doc(
      table()(
        tr(
          td()(
            '{nextSelection}',
            nestedExpand({
              __expanded: false,
            })(p('')),
            p('{here}'),
          ),
        ),
      ),
    ),

    doc(
      p('Hello'),
      '{nextSelection}',
      bodiedExtension({
        extensionType: 'com.atlassian.confluence.macro.core',
        extensionKey: 'bodied-eh',
        parameters: {
          macroParams: {},
          macroMetadata: {
            placeholder: [
              {
                data: {
                  url: '',
                },
                type: 'icon',
              },
            ],
          },
        },
        layout: 'default',
      })(p('')),
      p('{here}'),
    ),

    // first node
    doc(
      '{nextSelection}',
      bodiedExtension({
        extensionType: 'com.atlassian.confluence.macro.core',
        extensionKey: 'bodied-eh',
        parameters: {
          macroParams: {},
          macroMetadata: {
            placeholder: [
              {
                data: {
                  url: '',
                },
                type: 'icon',
              },
            ],
          },
        },
        layout: 'default',
      })(p('')),
      p('{here}'),
    ),
  ];

  describe('when cursor is before a collapsed expand and shift+arrow up pressed', () => {
    describe.each(cases)('%#', docBuilder => {
      const fakeDoc = docBuilder(sampleSchema);
      const $anchor = fakeDoc.resolve(fakeDoc.refs.here);
      const $head = fakeDoc.resolve(fakeDoc.refs.here);

      const fakeTr = {
        setSelection: jest.fn(),
      };
      const fakeDispatch = jest.fn();
      const fakeView: any = {
        state: {
          doc: fakeDoc,
          tr: fakeTr,
          selection: {
            $anchor,
            $head,
          },
        },
        dispatch: fakeDispatch,
      };
      const event: KeyboardEvent = new KeyboardEvent('keydown', {
        shiftKey: true,
        key: 'ArrowUp',
      });
      jest.spyOn(event, 'preventDefault');

      const result = onKeydown(fakeView, event);

      it('should return true', () => {
        expect(result).toBeTruthy();
      });

      it('should prevent the event default', () => {
        expect(event.preventDefault).toHaveBeenCalled();
      });

      it('should call dispatch', () => {
        expect(fakeView.dispatch).toHaveBeenCalled();
      });

      it('should call setSelection', () => {
        expect(fakeTr.setSelection).toHaveBeenCalled();
      });

      it('should select the node', () => {
        const selection = fakeTr.setSelection.mock.calls[0][0];

        expect(selection.$head.pos).toBe(fakeDoc.refs.nextSelection);
      });
    });
  });
});
