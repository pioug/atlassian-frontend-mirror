import { type ADFEntity } from '@atlaskit/adf-utils/types';
import type { ProductInformation } from '../types';
import type { Step as ProseMirrorStep } from '@atlaskit/editor-prosemirror/transform';
import { scrubAdf } from '@atlaskit/adf-utils/scrub';
import type {
	BatchAttrsStepPM,
	InlineCommentAddNodeMarkStepPM,
	InlineCommentStepPM,
	NodeJson,
	OverrideDocumentStepPM,
	ReplaceAroundStepPM,
	ReplaceStepPM,
	SetAttrsStepPM,
	StepJson,
	StepMetadata,
} from '@atlaskit/editor-common/collab';
import { type JSONDocNode } from '@atlaskit/editor-json-transformer';
import type { Node as ProseMirrorNode } from '@atlaskit/editor-prosemirror/model';

export const createLogger =
	(prefix: string, color: string = 'blue') =>
	// Ignored via go/ees005
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	(msg: string, data: any = null) => {
		// Ignored via go/ees005
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		if ((window as any).COLLAB_PROVIDER_LOGGER) {
			// eslint-disable-next-line no-console
			console.log(`%cCollab-${prefix}: ${msg}`, `color: ${color}; font-weight: bold`, data);
		}
	};

export function sleep(ms: number) {
	return new Promise((resolve) => {
		setTimeout(resolve, ms);
	});
}

export const isAIProviderID = (id: string): boolean =>
	typeof id === 'string' && id.startsWith('agent:');

export const getProduct = (productInfo?: ProductInformation): string =>
	productInfo?.product ?? 'unknown';

export const getSubProduct = (productInfo?: ProductInformation): string =>
	productInfo?.subProduct ?? (!!productInfo?.product ? 'none' : 'unknown');

interface Step {
	stepType: string;
	userId?: string;
	from?: number;
	to?: number;
	// Ignored via go/ees005
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	[key: string]: any;
	gapFrom?: number;
	gapTo?: number;
	insert?: number;
}

export type UGCFreeStepDetails = {
	type: string;
	contentTypes: string;
	stepSizeInBytes?: number;
};

// Get as step info which is known not to contain user generated content.
export const getStepUGCFreeDetails = (step: ProseMirrorStep): UGCFreeStepDetails => {
	let stepJson: Step | null;
	try {
		stepJson = step.toJSON() as Step;
	} catch (e) {
		return {
			type: 'unknown',
			contentTypes: '',
			stepSizeInBytes: Buffer.byteLength(JSON.stringify(step)),
		};
	}

	let contentTypes: string = '';
	if (stepJson.slice?.content && Array.isArray(stepJson.slice?.content)) {
		contentTypes = stepJson.slice.content
			// Ignored via go/ees005
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			.map((c: any) => {
				return c?.type || 'unknown';
			})
			.join(', ');
	}
	return {
		type: stepJson.stepType || 'unknown',
		contentTypes,
		stepSizeInBytes: Buffer.byteLength(JSON.stringify(step)),
	};
};

const stepWithNextDocument = (stepJson: StepJson): stepJson is OverrideDocumentStepPM => {
	return stepJson.stepType === 'override-document' && 'nextDocument' in stepJson;
};

const stepWithMark = (stepJson: StepJson): stepJson is InlineCommentStepPM => {
	return stepJson.stepType === 'addMark' || stepJson.stepType === 'addNodeMark';
};

const stepWithAttrs = (stepJson: StepJson): stepJson is SetAttrsStepPM => {
	return stepJson.stepType === 'setAttrs' && 'attrs' in stepJson;
};

const stepWithBatchAttrs = (
	stepJson: StepJson | BatchAttrsStepPM,
): stepJson is BatchAttrsStepPM => {
	return stepJson.stepType === 'batchAttrs' && 'data' in stepJson;
};

const stepWithFromTo = (stepJson: StepJson): stepJson is ReplaceStepPM | ReplaceAroundStepPM => {
	return (
		'from' in stepJson &&
		typeof stepJson.from === 'number' &&
		'to' in stepJson &&
		typeof stepJson.to === 'number'
	);
};

const stepWithGapFromTo = (stepJson: StepJson): stepJson is ReplaceAroundStepPM => {
	return (
		'gapFrom' in stepJson &&
		typeof stepJson.gapFrom === 'number' &&
		'gapTo' in stepJson &&
		typeof stepJson.gapTo === 'number'
	);
};

const stepWithInsert = (stepJson: StepJson): stepJson is ReplaceAroundStepPM => {
	return 'insert' in stepJson && typeof stepJson.insert === 'number';
};

const stepWithPos = (
	stepJson: StepJson,
): stepJson is SetAttrsStepPM | InlineCommentAddNodeMarkStepPM => {
	return 'pos' in stepJson && typeof stepJson.pos === 'number';
};

const stepWithSlice = (stepJson: StepJson): stepJson is ReplaceAroundStepPM | ReplaceStepPM => {
	return 'slice' in stepJson && Array.isArray(stepJson.slice?.content);
};

// Get as step info which is known not to contain user generated content.
export const getStepTypes = (stepJson: StepJson) => {
	let contentTypes: string | null = null;

	if (stepWithSlice(stepJson)) {
		contentTypes = stepJson.slice.content
			.map((c) => {
				return c?.type || 'unknown';
			})
			.join(', ');
	}
	return {
		type: stepJson.stepType || 'unknown',
		contentTypes,
	};
};

export const getStepsAdfWithObfuscation = (stepJson: StepJson): ADFEntity[] | null => {
	const stepContentAsAdf: ADFEntity[] | null = stepToAdf(stepJson);
	if (!stepContentAsAdf) {
		return null;
	}

	const scrubbedSteps = stepContentAsAdf
		.map((adf) => scrubAdf(adf))
		.filter((adf): adf is ADFEntity => !!adf);

	return scrubbedSteps;
};

export const getDocAdfWithObfuscation = (doc: ProseMirrorNode): ADFEntity | null => {
	const docJson = doc.toJSON() as JSONDocNode;

	const scrubbedDoc = scrubAdf(docJson);
	if (!scrubbedDoc) {
		return null;
	}

	return scrubbedDoc;
};

export const getStepPositions = (stepJson: StepJson) => {
	return {
		...(stepWithFromTo(stepJson) && { from: stepJson.from, to: stepJson.to }),
		...(stepWithGapFromTo(stepJson) && { gapFrom: stepJson.gapFrom, gapTo: stepJson.gapTo }),
		...(stepWithInsert(stepJson) && { insert: stepJson.insert }),
		...(stepWithPos(stepJson) && { pos: stepJson.pos }),
	};
};

/**
 * Returns the metadata for Step
 * @description metadata is applied by transform overrides [here](https://bitbucket.org/atlassian/adf-schema/src/e13bbece84ede8f245067dc53dd7ce694f427eda/packages/editor-prosemirror/src/transform-override.ts#lines-12)
 */
const getStepMetadata = (stepJson: StepJson): StepMetadata['metadata'] | undefined => {
	return stepJson.metadata;
};

export const getObfuscatedSteps = (steps: StepJson[], endIndex: number | undefined = undefined) => {
	return steps.slice(0, endIndex).map((step) => {
		return {
			stepType: getStepTypes(step),
			stepContent: getStepsAdfWithObfuscation(step),
			stepPositions: getStepPositions(step),
			stepMetadata: getStepMetadata(step),
		};
	});
};

const stepToAdf = (step: StepJson): ADFEntity[] | null => {
	if (stepWithSlice(step)) {
		return [
			{
				type: 'doc',
				content: step.slice.content.filter((el): el is NodeJson => el !== null),
			},
		];
	} else if (stepWithNextDocument(step)) {
		return [
			{
				type: 'doc',
				content: step.nextDocument.content,
			},
		];
	} else if (stepWithMark(step) && step.mark) {
		return [
			{
				type: 'doc',
				marks: [
					{
						type: step.mark.type || 'unknown',
						attrs: step.mark.attrs,
					},
				],
			},
		];
	} else if (stepWithAttrs(step)) {
		return [
			{
				type: 'doc',
				attrs: step.attrs,
			},
		];
	} else if (stepWithBatchAttrs(step)) {
		return step.data.map((stepData) => {
			return {
				type: 'doc',
				attrs: stepData.attrs,
			};
		});
	}
	return [];
};
