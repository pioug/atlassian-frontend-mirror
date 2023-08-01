import { ReplaceStep, StepMap } from '@atlaskit/editor-prosemirror/transform';

import { doc, p } from '@atlaskit/editor-test-helpers/doc-builder';
import { defaultSchema } from '@atlaskit/editor-test-helpers/schema';

import { LinkMetaStep } from '../../link-meta-step';
import { Slice } from '@atlaskit/editor-prosemirror/model';

describe('LinkMetaStep', () => {
  it('should expose a `getMetadata` method which returns the stored metadata', () => {
    const metadata = {
      action: 'some-action',
      sourceEvent: 'some-event',
    };

    const step = new LinkMetaStep(0, metadata);

    expect(step.getMetadata()).toStrictEqual(metadata);
  });

  it('should not include `sourceEvent` when inverted', () => {
    const step = new LinkMetaStep(0, {
      action: 'some-action',
      sourceEvent: 'some-event',
    });

    expect(step.getMetadata()).toEqual({
      action: 'some-action',
      sourceEvent: 'some-event',
    });

    const inverted = step.invert();

    expect(inverted.getMetadata()).toEqual({
      action: 'some-action',
    });
  });

  it.each([0, 5, 10])(
    'should return stepmap with correct ranges based on the position argument %p and with sizes of 0',
    (pos) => {
      expect(new LinkMetaStep(pos, {}).getMap()).toStrictEqual(
        new StepMap([pos, 0, 0]),
      );
    },
  );

  it('should succesfully make no change to the document', () => {
    const document = doc(p('Some content'))(defaultSchema);
    const step = new LinkMetaStep(0, {});
    const result = step.apply(document);

    expect(result.failed).toBeFalsy();
    expect(document).toStrictEqual(result.doc);
  });

  it('should serialize and de-serialize into a no-op replace step to avoid affecting collab editting', () => {
    const step = new LinkMetaStep(0, {});

    expect(LinkMetaStep.fromJSON(defaultSchema, step.toJSON())).toStrictEqual(
      new ReplaceStep(0, 0, Slice.empty),
    );
  });
});
