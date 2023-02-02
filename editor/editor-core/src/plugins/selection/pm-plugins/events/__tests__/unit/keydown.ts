import { onKeydown } from '../../keydown';
import sampleSchema from '@atlaskit/editor-test-helpers/schema';
import {
  doc,
  p,
  expand,
  nestedExpand,
  table,
  tr,
  td,
} from '@atlaskit/editor-test-helpers/doc-builder';

describe('#onKeydown', () => {
  describe('when ctrl or meta is pressed', () => {
    it.each([{ ctrlKey: true }, { metaKey: true }])(
      'should return false',
      (opts) => {
        const fakeView: any = {};
        const event: KeyboardEvent = new KeyboardEvent('keydown', opts);
        const result = onKeydown(fakeView, event);
        expect(result).toBeFalsy();
      },
    );
  });

  describe('when cursor is before a collapsed expand and shift+arrow up pressed', () => {
    describe.each([
      doc(
        // prettier-disable
        p('Hello'),
        '{nextExpandSelection}',
        expand({
          __expanded: false,
        })(p('')),
        p('{here}'),
      ),

      // first node
      doc(
        // prettier-disable
        '{nextExpandSelection}',
        expand({
          __expanded: false,
        })(p('')),
        p('{here}'),
      ),

      // first nested expand node
      doc(
        // prettier-disable
        table()(
          tr(
            td()(
              '{nextExpandSelection}',
              nestedExpand({
                __expanded: false,
              })(p('')),
              p('{here}'),
            ),
          ),
        ),
      ),
    ])('%#', (docBuilder) => {
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

      it('should select the collpased expanded', () => {
        const selection = fakeTr.setSelection.mock.calls[0][0];

        expect(selection.$head.pos).toBe(fakeDoc.refs.nextExpandSelection);
      });
    });
  });
});
