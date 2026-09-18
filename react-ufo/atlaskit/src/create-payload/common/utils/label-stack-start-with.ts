import type { LabelStack } from '../../../interaction-context';
import { stringifyLabelStackFully } from './stringify-label-stack-fully';

export function labelStackStartWith(labelStack: LabelStack, startWith: LabelStack): boolean {
	return stringifyLabelStackFully(labelStack).startsWith(stringifyLabelStackFully(startWith));
}
