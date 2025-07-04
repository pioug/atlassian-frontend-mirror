import step from './__fixtures__/clean-step-for-empty-doc.json';
import { Step as ProseMirrorStep, ReplaceStep } from '@atlaskit/editor-prosemirror/transform';
import { getSchemaBasedOnStage } from '@atlaskit/adf-schema/schema-default';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import { doc, p } from '@atlaskit/editor-test-helpers/doc-builder';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import { createEditorState } from '@atlaskit/editor-test-helpers/create-editor-state';
import { getStepUGCFreeDetails, isAIProviderID, logObfuscatedSteps } from '../utils';

import { collab as collabPlugin, sendableSteps } from '@atlaskit/prosemirror-collab';
import { type SafePlugin } from '@atlaskit/editor-common/src/safe-plugin';

jest.mock<typeof import('@atlaskit/prosemirror-collab')>('@atlaskit/prosemirror-collab', () => {
	const originPC = jest.requireActual<typeof import('@atlaskit/prosemirror-collab')>(
		'@atlaskit/prosemirror-collab',
	);
	return {
		...originPC,
		sendableSteps: jest.fn(),
	};
});

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

	it('returns obfuscated steps', async () => {
		const newState = createEditorState(
			doc(p('Hello New World')),
			collabPlugin({ clientID: 3771180701 }) as SafePlugin<unknown>,
		);
		const oldState = createEditorState(
			doc(p('Hello Old World')),
			collabPlugin({ clientID: 3771180701 }) as SafePlugin<unknown>,
		);

		(sendableSteps as jest.Mock)
			.mockReturnValueOnce({
				steps: [new ReplaceStep(1, 1, oldState.doc.slice(1, oldState.doc.content.size))],
			})
			.mockReturnValueOnce({
				steps: [new ReplaceStep(1, 1, newState.doc.slice(1, newState.doc.content.size))],
			});
		const assert = await logObfuscatedSteps(oldState, newState);

		expect(assert).toHaveProperty('stepsFromOldState');
		expect(assert).toHaveProperty('stepsFromNewState');
		expect(assert).toMatchInlineSnapshot(`
		{
		  "stepsFromNewState": "[{"stepType":{"type":"replace","contentTypes":"paragraph"},"stepContent":[{"type":"doc","content":[{"type":"paragraph","content":[{"type":"text","text":"Lorem Ips Umdol"}],"attrs":{"localId":null}}]}],"stepPositions":{"from":1,"to":1}}]",
		  "stepsFromOldState": "[{"stepType":{"type":"replace","contentTypes":"paragraph"},"stepContent":[{"type":"doc","content":[{"type":"paragraph","content":[{"type":"text","text":"Lorem Ips Umdol"}],"attrs":{"localId":null}}]}],"stepPositions":{"from":1,"to":1}}]",
		}
	`);
	});
});
