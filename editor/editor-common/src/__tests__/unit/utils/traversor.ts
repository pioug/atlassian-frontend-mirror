import * as sinon from 'sinon';

import ADFTraversor from '../../../utils/traversor';

describe('@atlaskit/editor-common traversor utils', () => {
  const doc = {
    type: 'doc',
    version: 1,
    content: [
      {
        type: 'paragraph',
        content: [
          {
            type: 'text',
            text: 'some text',
          },
        ],
      },
    ],
  };
  describe('ADFTraversor', () => {
    it('should trigger the callback if it has a subscriber for a node', () => {
      const traversor = new ADFTraversor(doc);
      const stub = sinon.stub();
      traversor.subscribe('text', stub);
      traversor.exec();
      expect(stub.calledOnce).toEqual(true);
    });

    it('should not trigger the callback for non existing node', () => {
      const traversor = new ADFTraversor(doc);
      const stub = sinon.stub();
      traversor.subscribe('panel', stub);
      traversor.exec();
      expect(stub.called).toEqual(false);
    });
  });
});
