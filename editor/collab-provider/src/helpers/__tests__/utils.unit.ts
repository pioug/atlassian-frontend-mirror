import step from './__fixtures__/clean-step-for-empty-doc.json';
import { Step as ProseMirrorStep } from '@atlaskit/editor-prosemirror/transform';
import { getSchemaBasedOnStage } from '@atlaskit/adf-schema/schema-default';
import { getStepUGCFreeDetails } from '../utils';

describe('Utils unit tests', () => {
  it('strips UGC from a step', () => {
    const proseMirrorStep = ProseMirrorStep.fromJSON(
      getSchemaBasedOnStage('stage0'),
      step,
    );
    expect(getStepUGCFreeDetails(proseMirrorStep)).toEqual({
      contentTypes: 'text',
      type: 'replace',
      stepSizeInBytes: 87,
    });
  });
});
