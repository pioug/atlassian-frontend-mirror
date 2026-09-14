import type { ADFEntity, ADFEntityMark } from '@atlaskit/adf-utils/types';
import { validator } from '@atlaskit/adf-utils/validator';
import type { ErrorCallback, ValidationError } from '@atlaskit/adf-utils/validatorTypes';

import { describeExpectations, findPropIssues } from './describe-expectations';

export type AdfPath = Array<string | number>;

/**
 * `INVALID_PROPERTY_VALUE` is ours, not the validator's: see `findPropIssues`.
 */
export type LocatedErrorCode = ValidationError['code'] | 'INVALID_PROPERTY_VALUE';

export type LocatedError = {
	code: LocatedErrorCode;
	/** The entity as the validator saw it, when it gave us one. */
	entity?: ADFEntity;
	/** What the schema would have accepted here, taken from the validator specs. */
	expectations: string[];
	message: string;
	meta?: object;
	/** Path of the offending value inside the ADF, e.g. `['content', 0, 'attrs', 'level']`. */
	path: AdfPath;
	/** Dot-joined `path`, used to match against rendered JSON lines. */
	pathKey: string;
	target: 'attribute' | 'mark' | 'node' | 'property';
};

export type ValidateAdfOptions = {
	allowPrivateAttributes?: boolean;
	stage0?: boolean;
};

export type ValidateAdfResult = {
	errors: LocatedError[];
	valid: boolean;
};

const MARKER_TYPE = '__adfValidationMarker';

type Marker = {
	__entity: ADFEntity;
	__error: ValidationError;
	__isAttribute: boolean;
	__isMark: boolean;
	type: string;
};

/**
 * Markers are recognised by this key rather than by `type`, because the mark ones have to borrow the
 * validator's own repair types (see `errorCallback`) and a document may legitimately contain those.
 */
const isMarker = (value: unknown): value is Marker =>
	typeof value === 'object' && value !== null && '__error' in (value as Marker);

/** Report the innermost real error, should the validator ever nest one marker inside another. */
const innermost = (marker: Marker): Marker =>
	isMarker(marker.__entity) ? innermost(marker.__entity) : marker;

export const pathToKey = (path: AdfPath): string => path.join('.');

/**
 * Human readable version of a path, e.g. `doc › content[0] › attrs.level`.
 */
export const pathToLabel = (path: AdfPath): string => {
	if (path.length === 0) {
		return 'doc';
	}
	const parts: string[] = ['doc'];
	for (const step of path) {
		if (typeof step === 'number') {
			parts[parts.length - 1] += `[${step}]`;
		} else {
			parts.push(step);
		}
	}
	return parts.join(' › ');
};

/**
 * The validator has no notion of position: `ErrorCallback` only ever receives a copy of the
 * offending entity. What it does give us is a rebuilt document where every rejected value has been
 * replaced by whatever the callback returned, and only the winning validation attempt survives in
 * it. So we return a marker carrying the error, then walk the rebuilt tree next to the original to
 * recover the path of every marker that made it into the output.
 */
export const validateAdf = (
	doc: unknown,
	{ allowPrivateAttributes = false, stage0 = false }: ValidateAdfOptions = {},
): ValidateAdfResult => {
	// The validator mutates the entities it is handed (deleting unsupported attrs, rewriting marks),
	// so it never sees the object we render.
	const input = JSON.parse(JSON.stringify(doc)) as ADFEntity;

	const validate = validator(undefined, undefined, { allowPrivateAttributes, stage0 });

	const errorCallback: ErrorCallback = (entity, error, options) => {
		// The validator appends its attribute repair mark straight into the caller's `marks` array,
		// and that mark is one of our markers. When it validates the same node again it hands the
		// marker back here as an unsupported mark, so pass it through untouched: wrapping a marker in
		// a marker would report a mark that is not in the document at all.
		if (isMarker(entity)) {
			return entity as unknown as ADFEntity;
		}
		// The type matters: the validator declines a candidate spec when the repair added an
		// `unsupportedMark` (validator.ts:1431) and dedupes attribute repairs by the
		// `unsupportedNodeAttribute` type (validator.ts:815, :1113). A marker with a type of its own
		// looks like a successful repair, so the validator stops trying the remaining candidates — that
		// is what made an `alignment` mark on a paragraph report as unsupported, since the plain
		// paragraph branch is tried before the one that allows it.
		const type = options.isMark
			? 'unsupportedMark'
			: options.isNodeAttribute
				? 'unsupportedNodeAttribute'
				: MARKER_TYPE;

		return {
			type,
			__entity: entity,
			__error: error,
			__isAttribute: Boolean(options.isNodeAttribute),
			__isMark: Boolean(options.isMark),
		} as unknown as ADFEntity;
	};

	let output: ADFEntity | undefined;
	let valid = false;
	try {
		const result = validate(input, errorCallback);
		output = result.entity;
		valid = result.valid;
	} catch (error) {
		return {
			valid: false,
			errors: [
				{
					code: 'INVALID_TYPE',
					message: error instanceof Error ? error.message : String(error),
					expectations: [],
					path: [],
					pathKey: '',
					target: 'node',
				},
			],
		};
	}

	const errors: LocatedError[] = [];
	collectErrors(output, doc, [], errors);

	// The validator can reject a node without handing it to the callback, e.g. when it declines a
	// stage-0 spec, leaving nothing to locate.
	if (!valid && errors.length === 0) {
		errors.push({
			code: 'INVALID_TYPE',
			message: 'Rejected by the validator without a reportable entity.',
			expectations: [],
			path: [],
			pathKey: '',
			target: 'node',
		});
	}

	return { valid: valid && errors.length === 0, errors: dropVaguerAttributeErrors(errors) };
};

/**
 * The validator retries a node against every candidate spec and mutates as it goes, so the same
 * attribute failure can be reported twice: once naming the attribute, once only naming `attrs`.
 */
const dropVaguerAttributeErrors = (errors: LocatedError[]): LocatedError[] =>
	errors.filter((error) => {
		if (error.target !== 'attribute' || error.path[error.path.length - 1] !== 'attrs') {
			return true;
		}
		return !errors.some(
			(other) =>
				other !== error &&
				other.code === error.code &&
				other.message === error.message &&
				other.pathKey.startsWith(`${error.pathKey}.`),
		);
	});

const addError = (
	errors: LocatedError[],
	wrapper: Marker,
	path: AdfPath,
	target: LocatedError['target'],
	context: { attrName?: string; nodeType?: string; parentType?: string } = {},
) => {
	const marker = innermost(wrapper);
	const { code, message, meta } = marker.__error;
	// Nothing about our own bookkeeping belongs in the report.
	if (message.includes(MARKER_TYPE)) {
		return;
	}
	const pathKey = pathToKey(path);
	const isDuplicate = errors.some(
		(existing) =>
			existing.pathKey === pathKey && existing.code === code && existing.message === message,
	);
	if (isDuplicate) {
		return;
	}
	errors.push({
		code,
		message,
		meta,
		path,
		pathKey,
		entity: marker.__entity,
		target,
		expectations: describeExpectations({
			code,
			meta,
			target,
			entityType: marker.__entity?.type,
			attrName: context.attrName,
			nodeType: context.nodeType,
			parentType: context.parentType,
		}),
	});
};

const collectErrors = (
	output: unknown,
	source: unknown,
	path: AdfPath,
	errors: LocatedError[],
	parentType?: string,
): void => {
	if (isMarker(output)) {
		addError(errors, output, path, 'node', { parentType });
		return;
	}
	if (typeof output !== 'object' || output === null) {
		return;
	}

	const outputNode = output as ADFEntity;
	const sourceNode = (typeof source === 'object' && source !== null ? source : {}) as ADFEntity;

	collectMarkErrors(outputNode, sourceNode, path, errors, parentType);
	collectPropErrors(outputNode, sourceNode, path, errors);
	collectContentErrors(outputNode, sourceNode, path, errors);
};

/**
 * Props the validator checks for presence but never for value, `doc.version` being the one in the
 * current specs.
 */
const collectPropErrors = (
	outputNode: ADFEntity,
	sourceNode: ADFEntity,
	path: AdfPath,
	errors: LocatedError[],
): void => {
	const nodeType = sourceNode.type ?? outputNode.type;
	for (const issue of findPropIssues(nodeType, sourceNode)) {
		errors.push({
			code: 'INVALID_PROPERTY_VALUE',
			message: `${nodeType}: '${issue.prop}' value is not allowed.`,
			meta: { [issue.prop]: sourceNode[issue.prop] },
			path: [...path, issue.prop],
			pathKey: pathToKey([...path, issue.prop]),
			target: 'property',
			expectations: [
				...issue.expectations,
				'reported by this example: the adf-utils validator does not check this prop',
			],
		});
	}
};

/**
 * Mark failures and unknown-attribute failures both surface as marks on the rebuilt node.
 */
const collectMarkErrors = (
	outputNode: ADFEntity,
	sourceNode: ADFEntity,
	path: AdfPath,
	errors: LocatedError[],
	parentType?: string,
): void => {
	const nodeType = sourceNode.type ?? outputNode.type;
	for (const outputMark of outputNode.marks ?? []) {
		if (!isMarker(outputMark)) {
			continue;
		}
		const mark = innermost(outputMark);
		if (mark.__isAttribute) {
			// `meta` is the offending `{ [attrName]: value }` map.
			const attrNames = Object.keys(mark.__error.meta ?? {});
			if (attrNames.length === 0) {
				addError(errors, mark, [...path, 'attrs'], 'attribute', { nodeType, parentType });
			}
			for (const attrName of attrNames) {
				const attrExists =
					typeof sourceNode.attrs === 'object' &&
					sourceNode.attrs !== null &&
					attrName in sourceNode.attrs;
				addError(
					errors,
					mark,
					attrExists ? [...path, 'attrs', attrName] : [...path, 'attrs'],
					'attribute',
					{ attrName, nodeType, parentType },
				);
			}
			continue;
		}
		const sourceIndex = (sourceNode.marks ?? []).findIndex(
			(sourceMark: ADFEntityMark | undefined) => sourceMark?.type === mark.__entity?.type,
		);
		addError(
			errors,
			mark,
			sourceIndex === -1 ? [...path, 'marks'] : [...path, 'marks', sourceIndex],
			'mark',
			{ nodeType, parentType },
		);
	}
};

/**
 * Children keep their order in the rebuilt document, but a child can be dropped entirely (a
 * stage-0 node rejected for a stage-1 caller, for instance), so resync on node type rather than
 * trusting the index.
 */
const collectContentErrors = (
	outputNode: ADFEntity,
	sourceNode: ADFEntity,
	path: AdfPath,
	errors: LocatedError[],
): void => {
	const outputContent = outputNode.content;
	const sourceContent = sourceNode.content;
	if (!Array.isArray(outputContent) || !Array.isArray(sourceContent)) {
		return;
	}

	let cursor = 0;
	for (const outputChild of outputContent) {
		const childType = isMarker(outputChild)
			? innermost(outputChild).__entity?.type
			: (outputChild as ADFEntity | undefined)?.type;

		let matched = cursor;
		while (matched < sourceContent.length && sourceContent[matched]?.type !== childType) {
			matched++;
		}
		if (matched >= sourceContent.length) {
			matched = Math.min(cursor, Math.max(sourceContent.length - 1, 0));
		}
		cursor = matched + 1;

		collectErrors(
			outputChild,
			sourceContent[matched],
			[...path, 'content', matched],
			errors,
			sourceNode.type ?? outputNode.type,
		);
	}
};
