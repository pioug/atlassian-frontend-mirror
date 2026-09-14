import type { BatchAttrsStep } from '@atlaskit/adf-schema/steps/batch-attrs-step';
import type { SetAttrsStep } from '@atlaskit/adf-schema/steps/set-attrs';
import type { NextEditorPlugin } from '@atlaskit/editor-common/types';
import type { Node as PMNode } from '@atlaskit/editor-prosemirror/model';
import type { Step } from '@atlaskit/editor-prosemirror/transform-override';
import type { AttrStep } from '@atlaskit/editor-prosemirror/transform';

export type BatchStepsAction = (props: {
	doc: PMNode;
	steps: Array<AttrStep | SetAttrsStep> | Array<Step>;
}) => BatchAttrsStep;

export type BatchAttributeUpdatesPlugin = NextEditorPlugin<
	'batchAttributeUpdates',
	{
		actions: {
			batchSteps: BatchStepsAction;
		};
	}
>;
