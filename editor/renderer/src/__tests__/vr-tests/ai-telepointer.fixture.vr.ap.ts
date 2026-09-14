import { generateRendererComponent } from '../__helpers/rendererComponents.vr.ap';
import { nextStepDoc, initialDoc } from '../__fixtures__/ai-telepointer';
import type { ComponentType } from 'react';

export const TelepointerRendererStepOne: ComponentType<any> = generateRendererComponent({
	document: initialDoc,
	appearance: 'full-width',
	addTelepointer: true,
});

export const TelepointerRendererStepTwo: ComponentType<any> = generateRendererComponent({
	document: nextStepDoc,
	appearance: 'full-width',
	addTelepointer: true,
});
