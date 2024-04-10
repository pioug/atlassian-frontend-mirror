import { generateRendererComponent } from '../__helpers/rendererComponents';
import { nextStepDoc, initialDoc } from '../__fixtures__/ai-telepointer';

export const TelepointerRendererStepOne = generateRendererComponent({
  document: initialDoc,
  appearance: 'full-width',
  addTelepointer: true,
});

export const TelepointerRendererStepTwo = generateRendererComponent({
  document: nextStepDoc,
  appearance: 'full-width',
  addTelepointer: true,
});
