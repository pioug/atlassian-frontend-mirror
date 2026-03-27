// It is important to get all steps in that package
// Ignored via go/ees005
// eslint-disable-next-line import/no-namespace
import * as adfCustomSteps from '@atlaskit/adf-schema/steps';
// It is important to get all steps in that package
// Ignored via go/ees005
// eslint-disable-next-line import/no-namespace
import * as atlaskKitCustomSteps from '@atlaskit/custom-steps';
import { Step } from '@atlaskit/editor-prosemirror/transform';

export const enforceCustomStepRegisters = () => {
	const tryToRegisterStep = (obj: Record<string, Step>) => {
		for (const customStep of Object.values(obj)) {
			// @ts-expect-error ProseMirror step classes expose jsonID on prototype.
			const id = customStep?.prototype?.jsonID;
			if (typeof id === 'string') {
				try {
					// Re-register if needed; ignore if already registered.
					// @ts-expect-error Step.jsonID expects a step constructor.
					Step.jsonID(id, customStep);
				} catch {
					// Step already registered.
				}
			}
		}
	};

	// @ts-expect-error Step modules export non-step symbols too.
	tryToRegisterStep(atlaskKitCustomSteps);
	// @ts-expect-error Step modules export non-step symbols too.
	tryToRegisterStep(adfCustomSteps);
};
