import type { ADFMark } from '../../adfMark';
import type { ADFNode } from '../../adfNode';
import type { ValidatorSpec } from './ValidatorSpec';

export type ValidatorSpecResult = Record<
	string,
	ValidatorSpecResultNode | ValidatorSpecResultMark | ValidatorSpecResultGroup
>;

export type ValidatorSpecResultNode = {
	json: ValidatorSpec;
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	node: ADFNode<any>;
};

export type ValidatorSpecResultMark = {
	json: ValidatorSpec;
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	mark: ADFMark<any>;
};

export type ValidatorSpecResultGroup = {
	json: ValidatorSpec;
};
