/* eslint-disable @atlaskit/volt-strict-mode/no-re-exports -- These should be re-exported as they are an external dependency */
export type { Mappable } from 'prosemirror-transform';

export { Step } from './transform-override';
export type { MetadataStep, Metadata } from './transform-override';

export {
	AddMarkStep,
	AddNodeMarkStep,
	AttrStep,
	DocAttrStep,
	MapResult,
	Mapping,
	RemoveMarkStep,
	RemoveNodeMarkStep,
	ReplaceAroundStep,
	ReplaceStep,
	StepMap,
	StepResult,
	Transform,
	canJoin,
	canSplit,
	dropPoint,
	findWrapping,
	insertPoint,
	joinPoint,
	liftTarget,
	replaceStep,
} from 'prosemirror-transform';
