import type { BatchAttrsStep, SetAttrsStep } from '@atlaskit/adf-schema/steps';
import type { NextEditorPlugin } from '@atlaskit/editor-common/types';
import type { Node as PMNode } from '@atlaskit/editor-prosemirror/model';
import type { AttrStep, Step } from '@atlaskit/editor-prosemirror/transform';

export type BatchStepsAction = (props: {
	steps: Array<AttrStep | SetAttrsStep> | Array<Step>;
	doc: PMNode;
}) => BatchAttrsStep;

export type BatchAttributeUpdatesPlugin = NextEditorPlugin<
	'batchAttributeUpdates',
	{
		actions: {
			batchSteps: BatchStepsAction;
		};
	}
>;
