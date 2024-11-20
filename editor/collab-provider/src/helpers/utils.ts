import type { ProductInformation } from '../types';
import type { Step as ProseMirrorStep } from '@atlaskit/editor-prosemirror/transform';

export const createLogger =
	(prefix: string, color: string = 'blue') =>
	(msg: string, data: any = null) => {
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
