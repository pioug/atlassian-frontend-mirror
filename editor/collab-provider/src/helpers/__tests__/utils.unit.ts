import step from './__fixtures__/clean-step-for-empty-doc.json';
import { Step as ProseMirrorStep } from '@atlaskit/editor-prosemirror/transform';
import { getSchemaBasedOnStage } from '@atlaskit/adf-schema/schema-default';
import { getStepUGCFreeDetails, isAIProviderID } from '../utils';

describe('Utils unit tests', () => {
	it('strips UGC from a step', () => {
		const proseMirrorStep = ProseMirrorStep.fromJSON(getSchemaBasedOnStage('stage0'), step);
		expect(getStepUGCFreeDetails(proseMirrorStep)).toEqual({
			contentTypes: 'text',
			type: 'replace',
			stepSizeInBytes: 87,
		});
	});

	it('correctly returns if an id belongs to an agent', () => {
		expect(isAIProviderID('agent:test')).toBe(true);
		expect(isAIProviderID('test')).toBe(false);
		expect(isAIProviderID('test:agent')).toBe(false);
		expect(isAIProviderID('test:agent:')).toBe(false);
	});
});
