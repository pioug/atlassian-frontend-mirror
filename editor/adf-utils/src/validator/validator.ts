import { fg } from '@atlaskit/platform-feature-flags/fg';

import type { ADFEntity, ADFEntityMark } from '../types';
import type {
	AttributesSpec,
	Content,
	CreateSpecReturn,
	Err,
	ErrorCallback,
	MarkValidationResult,
	NodeValidationResult,
	SpecValidatorResult,
	Validate,
	ValidationError,
	ValidationErrorMap,
	ValidationErrorType,
	ValidationOptions,
	ValidatorContent,
	ValidatorSpec,
	ValidatorSpecAttrs,
} from '../types/validatorTypes';
import { copy } from './copy';
import { extractAllowedContent } from './extractAllowedContent';
import { isBoolean } from './isBoolean';
import { isDefined } from './isDefined';
import { isInteger } from './isInteger';
import { isNumber } from './isNumber';
import { isPlainObject } from './isPlainObject';
import { isString } from './isString';
import { makeArray } from './makeArray';
import { validatorFnMap } from './rules';
import { specs } from './specs';

// Ignored via go/ees005
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapMarksItems(spec: ValidatorSpec, fn = (x: any) => x) {
	if (spec.props && spec.props.marks) {
		// Ignored via go/ees005
		// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
		const { items, ...rest } = spec.props!.marks!;
		return {
			...spec,
			props: {
				...spec.props,
				marks: {
					...rest,
					/**
					 * `Text & MarksObject<Mark-1>` produces `items: ['mark-1']`
					 * `Text & MarksObject<Mark-1 | Mark-2>` produces `items: [['mark-1', 'mark-2']]`
					 */
					items: items.length ? (Array.isArray(items[0]) ? items.map(fn) : [fn(items)]) : [[]],
				},
			},
		};
	} else {
		return spec;
	}
}

// Ignored via go/ees005
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const partitionObject = <T extends { [key: string]: any }>(
	obj: T,
	predicate: <K extends keyof T>(key: K, value: Exclude<T[K], undefined>, obj: T) => boolean,
) =>
	Object.keys(obj).reduce<[Array<string>, Array<string>]>(
		(acc, key) => {
			const result = predicate(key, obj[key], obj);
			acc[result ? 0 : 1].push(key);
			return acc;
		},
		[[], []],
	);

/**
 * Checks if a spec is a variant spec.
 * A variant spec is an array where the first element is a string (base spec name)
 * and the second element is a ValidatorSpec object { props: { ... } }
 */
const isVariant = (spec: unknown): spec is { 0: string; 1: ValidatorSpec } =>
	typeof spec === 'object' &&
	!!spec &&
	0 in spec &&
	1 in spec &&
	typeof spec[0] === 'string' &&
	typeof spec[1] === 'object';

/**
 * Resolve one content-item name against `specs`. Variant specs are stored as tuples (arrays), so a
 * name that refers to one (e.g. `paragraph_with_no_marks`) resolves to that tuple. A plain node
 * name (e.g. `table`) has no tuple in `specs` and is returned unchanged for the matcher to handle
 * by name.
 */
const resolveContentItemName = (name: string): string | [string, ValidatorSpec] => {
	const referencedSpec = (specs as Record<string, unknown>)[name];
	return Array.isArray(referencedSpec) ? (referencedSpec as [string, ValidatorSpec]) : name;
};

/**
 * Expand the content item NAMES inside a variant tuple's override so they resolve the same way a
 * base spec's content does. A variant such as `panel_c1` is `['panel', { props: { content: { items:
 * [['paragraph_with_no_marks', ..., 'table']] } } }]`; those inner names are validator variant
 * names. Unlike a base spec's content (which `createSpec` resolves), the override names are left
 * raw, so the variant branch matches only plainly-named children (e.g. `table`) and rejects
 * variant-named ones (e.g. a normal `paragraph`). Resolve each name one level, leaving plain node
 * names untouched.
 */
const resolveVariantOverrideContentItems = (
	variantTuple: [string, ValidatorSpec],
): [string, ValidatorSpec] => {
	const [baseNodeType, variantSpec] = variantTuple;
	const content = variantSpec?.props?.content;
	if (!content || !Array.isArray(content.items)) {
		return variantTuple;
	}

	// Each entry in `content.items` is either a single name or an `$or` group (a list of
	// alternative names). Resolve the names inside each `$or` group; pass single names through.
	const resolvedItems = content.items.map((entry) =>
		Array.isArray(entry) ? entry.map(resolveContentItemName) : entry,
	) as ValidatorContent['items'];

	return [
		baseNodeType,
		{
			...variantSpec,
			props: { ...variantSpec.props, content: { ...content, items: resolvedItems } },
		},
	];
};

/**
 * Normalizes the structure of the specs in './specs'.
 * We denormalised the spec to save bundle size.
 */
export function createSpec(nodes?: Array<string>, marks?: Array<string>): CreateSpecReturn {
	const variantOverrides = getVariantSpecOverrides();
	// Ignored via go/ees005
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	return Object.keys(specs).reduce<CreateSpecReturn>((newSpecs, k) => {
		// Ignored via go/ees005
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		let spec = { ...(specs as any)[k] };

		if (isVariant(spec) && Object.values(variantOverrides).includes(k)) {
			// When the spec is a variant it will be in the form of ['base_spec_name', { props: { ... } }]
			// The actual validator spec of the variant will be the second item in the array
			spec = { ...spec[1] };
		} else if (isVariant(spec)) {
			// Their override content items are variant names, which match no child by type, so resolve
			// them one level or valid content gets wrapped as `unsupportedBlock`. For non-panel variants
			// like `mediaSingle_full` the names are already plain, so this is a no-op.
			const resolved = resolveVariantOverrideContentItems([spec[0], spec[1]] as [
				string,
				ValidatorSpec,
			]);
			spec = {
				...spec,
				1: resolved[1],
			};
		}

		if (spec.props) {
			spec.props = { ...spec.props };
			if (spec.props.content) {
				// 'tableCell_content' => { type: 'array', items: [ ... ] }
				if (isString(spec.props.content)) {
					// Ignored via go/ees005
					// eslint-disable-next-line @typescript-eslint/no-explicit-any
					spec.props.content = (specs as any)[spec.props.content];
				}

				// ['inline', 'emoji']
				if (Array.isArray(spec.props.content)) {
					/**
					 * Flatten
					 *
					 * Input:
					 * [ { type: 'array', items: [ 'tableHeader' ] }, { type: 'array', items: [ 'tableCell' ] } ]
					 *
					 * Output:
					 * { type: 'array', items: [ [ 'tableHeader' ], [ 'tableCell' ] ] }
					 */
					spec.props.content = {
						type: 'array',
						items: ((spec.props.content || []) as Array<ValidatorContent>).map((arr) => arr.items),
					};
				} else {
					spec.props.content = { ...spec.props.content };
				}

				spec.props.content.items = (spec.props.content.items as Array<string | Array<string>>)
					// ['inline'] => [['emoji', 'hr', ...]]
					// ['media'] => [['media']]
					.map((item) =>
						isString(item)
							? // Ignored via go/ees005
								// eslint-disable-next-line @typescript-eslint/no-explicit-any
								Array.isArray((specs as any)[item])
								? // Ignored via go/ees005
									// eslint-disable-next-line @typescript-eslint/no-explicit-any
									(specs as any)[item]
								: [item]
							: item,
					)
					// [['emoji', 'hr', 'inline_code']] => [['emoji', 'hr', ['text', { marks: {} }]]]
					.map((item: Array<string>) =>
						item
							.map((subItem) => {
								// Ignored via go/ees005
								// eslint-disable-next-line @typescript-eslint/no-explicit-any
								const resolved = (specs as any)[subItem];
								if (Array.isArray(resolved)) {
									// Resolve the variant tuple's own override content names so a nested match works.
									return resolveVariantOverrideContentItems(resolved as [string, ValidatorSpec]);
								}
								// Now `NoMark` produces `items: []`, should be fixed in generator
								return isString(subItem) ? subItem : ['text', subItem];
							})
							// Remove unsupported nodes & marks
							// Filter nodes
							.filter((subItem) => {
								if (nodes) {
									// Node with overrides
									// ['mediaSingle', { props: { content: { items: [ 'media', 'caption' ] } }}]
									if (Array.isArray(subItem)) {
										const isMainNodeSupported = nodes.indexOf(subItem[0]) > -1;
										// Only a variant tuple carries an override spec to read; `['text', spec]` above
										// builds the same shape, so both are covered.
										const overrideItems = isVariant(subItem)
											? subItem[1].props?.content?.items
											: undefined;
										// The node-list check below only holds when the override lists child node names. A
										// nested `$or` list (`string[][]`, as `panel_c1` has) never matches, which would
										// drop the variant entirely, so keep it and validate its children recursively.
										const overrideListsChildNodeNames =
											Array.isArray(overrideItems) &&
											overrideItems.every((item: unknown) => typeof item === 'string');
										if (isMainNodeSupported && overrideListsChildNodeNames) {
											return (overrideItems as string[]).every((item) => nodes.indexOf(item) > -1);
										}
										return isMainNodeSupported;
									}
									return nodes.indexOf(subItem) > -1;
								}
								return true;
							})
							// Filter marks
							.map((subItem) =>
								Array.isArray(subItem) && marks
									? /**
										 * TODO: Probably try something like immer, but it's 3.3kb gzipped.
										 * Not worth it just for this.
										 */
										[subItem[0], mapMarksItems(subItem[1] as ValidatorSpec)]
									: subItem,
							),
					);
			}
		}
		newSpecs[k] = spec;
		return newSpecs;
	}, {});
}

// Ignored via go/ees005
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function getOptionsForType(type: string, list?: Content): false | Record<string, any> {
	if (!list) {
		return {};
	}

	for (let i = 0, len = list.length; i < len; i++) {
		const spec = list[i];
		let name = spec;
		let options = {};
		if (Array.isArray(spec)) {
			[name, options] = spec;
		}
		if (name === type) {
			return options;
		}
	}
	return false;
}

const isValidatorSpecAttrs = (spec: unknown): spec is ValidatorSpecAttrs => {
	return !!(spec as ValidatorSpecAttrs).props;
};

/**
 * Validates attributes against the provided attribute specification.
 */
export function validateAttrs<T>(spec: AttributesSpec, value: T): boolean {
	if (!isDefined(value)) {
		return !!spec.optional;
	}

	if (isValidatorSpecAttrs(spec)) {
		// If spec has ".props" it is ValidatorSpecAttrs and need to pipe back in recursively
		const [_, invalidKeys] = partitionObject(spec.props, (key, subSpec) =>
			// Ignored via go/ees005
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			validateAttrs(subSpec, (value as any)[key]),
		);
		return invalidKeys.length === 0;
	}
	// extension_node parameters has no type
	if (!isDefined(spec.type)) {
		return !!(spec as AttributesSpec).optional;
	}

	switch (spec.type) {
		case 'boolean':
			return isBoolean(value);
		case 'number':
			return (
				isNumber(value) &&
				(isDefined(spec.minimum) ? spec.minimum <= value : true) &&
				(isDefined(spec.maximum) ? spec.maximum >= value : true)
			);
		case 'integer':
			return (
				isInteger(value) &&
				(isDefined(spec.minimum) ? spec.minimum <= value : true) &&
				(isDefined(spec.maximum) ? spec.maximum >= value : true)
			);
		case 'string':
			const validatorFnPassed = (rule: string) =>
				typeof value === 'string' && isDefined(validatorFnMap[rule]) && validatorFnMap[rule](value);
			return (
				isString(value) &&
				// Ignored via go/ees005
				// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
				(isDefined(spec.minLength) ? spec.minLength! <= value.length : true) &&
				(isDefined(spec.validatorFn) ? validatorFnPassed(spec.validatorFn) : true) &&
				// Ignored via go/ees005
				// eslint-disable-next-line require-unicode-regexp
				(spec.pattern ? new RegExp(spec.pattern).test(value) : true)
			);
		case 'object':
			return isPlainObject(value);
		case 'array':
			if (Array.isArray(value)) {
				const isTuple = !!spec.isTupleLike;
				const { minItems, maxItems } = spec;
				if (
					(minItems !== undefined && value.length < minItems) ||
					(maxItems !== undefined && value.length > maxItems)
				) {
					return false;
				}

				if (isTuple) {
					// If value has fewer items than tuple has specs - we are fine with that.
					const numberOfItemsToCheck = Math.min(spec.items.length, value.length);
					return Array(numberOfItemsToCheck)
						.fill(null)
						.every((_, i) => validateAttrs(spec.items[i], value[i]));
				} else {
					return value.every((valueItem) =>
						// We check that at least one of the specs in the list (spec.items) matches each value from
						spec.items.some((itemSpec) => validateAttrs(itemSpec, valueItem)),
					);
				}
			}
			return false;

		case 'enum':
			return isString(value) && spec.values.indexOf(value) > -1;
	}
}

const errorMessageFor = (type: string, message: string) => `${type}: ${message}.`;

const getUnsupportedOptions = (spec?: ValidatorSpec) => {
	if (spec && spec.props && spec.props.content) {
		const { allowUnsupportedBlock, allowUnsupportedInline } = spec.props.content;
		return { allowUnsupportedBlock, allowUnsupportedInline };
	}
	return {};
};

const invalidChildContent = (
	child: ADFEntity,
	errorCallback?: ErrorCallback,
	parentSpec?: ValidatorSpec,
) => {
	const message = errorMessageFor(child.type, 'invalid content');
	if (!errorCallback) {
		throw new Error(message);
	} else {
		return errorCallback(
			{ ...child },
			{
				code: 'INVALID_CONTENT',
				message,
				meta: { parentType: parentSpec?.props?.type?.values[0] },
			},
			getUnsupportedOptions(parentSpec),
		);
	}
};

const unsupportedMarkContent = (
	errorCode: ValidationError['code'],
	mark: ADFEntityMark,
	errorCallback?: ErrorCallback,
	errorMessage?: string,
) => {
	const message = errorMessage || errorMessageFor(mark.type, 'unsupported mark');
	if (!errorCallback) {
		throw new Error(message);
	} else {
		return errorCallback(
			{ ...mark },
			{
				code: errorCode,
				message,
				meta: mark,
			},
			{
				allowUnsupportedBlock: false,
				allowUnsupportedInline: false,
				isMark: true,
			},
		) as ADFEntityMark;
	}
};

const unsupportedNodeAttributesContent = (
	entity: ADFEntity,
	errorCode: ValidationError['code'],
	invalidAttributes: ADFEntity['attrs'],
	message: string,
	errorCallback?: ErrorCallback,
) => {
	if (!errorCallback) {
		throw new Error(message);
	} else {
		return errorCallback(
			{ type: entity.type } as ADFEntity,
			{
				code: errorCode,
				message,
				meta: invalidAttributes,
			},
			{
				allowUnsupportedBlock: false,
				allowUnsupportedInline: false,
				isMark: false,
				isNodeAttribute: true,
			},
		) as ADFEntityMark;
	}
};

/**
 * Returns a map of base spec names to a preferred variant spec that should be used
 * in their place during validation. Implemented as a getter function so that entries
 * can be conditionally included behind feature gates.
 *
 * WARNING: The variant spec must be a strict superset of the base spec, i.e. any content valid
 * under the base spec must also be valid under the variant.
 *
 * DEPRECATED, being removed behind `platform_editor_adf_validator_no_base_override`. Replacing a
 * base spec with a variant is unnecessary and harmful:
 *
 * - Unnecessary, because `doc`'s content list already names every `*_root_only` variant, so the
 *   candidate loop offers them exactly where they belong. `codeBlock_root_only` and
 *   `expand_root_only` are not in this map and get the same breakout-at-root behaviour from the
 *   content lists alone. Measured: a root panel with `breakout` validates whether or not the
 *   lovability flags are on.
 * - Harmful, because variants are supersets of their base (ADF stays backward compatible), so the
 *   base is the narrowest spec and is what the candidate loop falls back to when it declines a
 *   variant. Merging a variant into it removes that floor: `breakout` becomes valid on a panel at
 *   every position, which is the opposite of what `root_only` means. The merge also copies `props`
 *   without `meta`, so the laundered base spec loses the variant's `meta.stage0`.
 *
 * See `__tests__/unit/root-only-variant-override.ts`.
 */
const getVariantSpecOverrides = (): Record<string, string> => {
	if (fg('platform_editor_adf_validator_no_base_override')) {
		return {};
	}

	let overrides = {};
	if (fg('platform_editor_lovability_resize_gracefully')) {
		overrides = {
			...overrides,
			panel: 'panel_root_only',
			rule: 'rule_root_only',
		};
	}
	if (fg('platform_editor_lovability_resize_exts_gracefully')) {
		overrides = {
			...overrides,
			extension: 'extension_root_only',
			bodiedExtension: 'bodiedExtension_root_only',
			multiBodiedExtension: 'multiBodiedExtension_root_only',
		};
	}
	return overrides;
};

/**
 * Replaces base validator specs with their designated variant overrides.
 */
const applyVariantSpecOverrides = (validatorSpecs: CreateSpecReturn) => {
	Object.entries(getVariantSpecOverrides()).forEach(([base, variant]) => {
		const baseSpec = validatorSpecs[base];
		const variantOverride = validatorSpecs[variant];

		if (
			baseSpec?.props &&
			variantOverride?.props &&
			typeof baseSpec.props === 'object' &&
			typeof variantOverride.props === 'object'
		) {
			// Merge variant overrides INTO the base spec
			baseSpec.props = {
				...baseSpec.props, // keeps type, attrs, marks, etc.
				...variantOverride.props, // overrides content (and anything else the variant changes)
			};
		}
	});
};

/**
 * Copies the containers that validation writes to, keeping the caller's document read-only.
 *
 * Repairing unsupported content mutates the entity in place: `wrapUnSupportedNodeAttributes` deletes
 * keys from `attrs` and appends an `unsupportedNodeAttribute` mark to `marks`. A plain spread shares
 * both containers with the input, so those writes would escape into the caller's document and the
 * candidate-spec retry would re-validate an already-emptied `attrs`.
 *
 * Only `attrs` and `marks` need copying; nothing writes below that level.
 */
const cloneEntityForValidation = (entity: ADFEntity): ADFEntity => {
	const clone: ADFEntity = { ...entity };
	if (entity.attrs) {
		clone.attrs = { ...entity.attrs };
	}
	if (entity.marks) {
		clone.marks = entity.marks.map((mark) => ({ ...mark }));
	}
	return clone;
};

/**
 * Creates a validator function for ADF documents.
 * Validates document structure against the ADF specification.
 */
export function validator(
	nodes?: Array<string>,
	marks?: Array<string>,
	options: ValidationOptions = {},
): Validate {
	const { allowPrivateAttributes, mode = 'strict', stage0 } = options;

	// Whether specs that only exist in the stage-0 schema are declined for this caller. Resolved once
	// here to keep the gate out of the per-node path; note that a validator built at module or
	// describe scope bakes in `false`, because the jest gate resolver is installed in `beforeAll`.
	// Gate off is the pre-stage-0 behaviour: every stage-0 spec stays available to every caller.
	const rejectStage0Specs = !stage0 && fg('platform_editor_adf_validator_stage0');

	// Whether an empty `marks` array is dropped from a node that only ever takes an empty one. Resolved
	// once for the same reasons as above. Gate off keeps such a node rejected.
	const acceptEmptyMarks = fg('platform_editor_adf_validator_empty_marks');

	// Whether entities are deep-copied before validation. Read once per node and per mark before, so
	// tens of thousands of Statsig lookups plus their UFO exposure bookkeeping for a value fixed for
	// the whole validation. Resolved once for the same reasons as `rejectStage0Specs` above.
	const fixMutationBug = fg('platform_editor_fix_adf-validator_mutation_bug');

	const validatorSpecs = createSpec(nodes, marks);
	applyVariantSpecOverrides(validatorSpecs);

	// `extractAllowedContent` scans all of `validatorSpecs` for one node type's candidates, and
	// `validate` calls it per node. It depends only on `validatorSpecs` — fixed once
	// `applyVariantSpecOverrides` has run — and `entity.type`, so it caches per type. Sharing one array
	// across nodes of a type is safe: `getOptionsForType` only iterates it, and the specs inside were
	// already shared via `validatorSpecs`.
	const allowedContentByType = new Map<string, Content[]>();
	const getAllowedContent = (entity: ADFEntity): Content[] => {
		const { type } = entity;
		if (typeof type !== 'string') {
			return extractAllowedContent(validatorSpecs, entity);
		}
		let allowedContent = allowedContentByType.get(type);
		if (allowedContent === undefined) {
			allowedContent = extractAllowedContent(validatorSpecs, entity);
			allowedContentByType.set(type, allowedContent);
		}
		return allowedContent;
	};

	const validate: Validate = (entity, errorCallback, allowed, parentSpec) => {
		if (!allowed) {
			for (const allowed of getAllowedContent(entity)) {
				const validationResult = validateNode(entity, errorCallback, allowed, parentSpec);
				if (validationResult.valid) {
					return { entity: validationResult.entity, valid: validationResult.valid };
				}
			}
		}
		// If `allowed` was provided or we haven't passed yet, return the initial result
		const validationResult = validateNode(entity, errorCallback, allowed, parentSpec);
		return { entity: validationResult.entity, valid: validationResult.valid };
	};
	const validateNode = (
		entity: ADFEntity,
		errorCallback?: ErrorCallback,
		allowed?: Content,
		parentSpec?: ValidatorSpec,
		isMark: boolean = false,
	): NodeValidationResult => {
		const { type } = entity;
		const newEntity: ADFEntity = fixMutationBug ? cloneEntityForValidation(entity) : { ...entity };

		const err = <T extends ValidationErrorType>(
			code: T,
			msg: string,
			meta?: T extends keyof ValidationErrorMap ? ValidationErrorMap[T] : never,
		): NodeValidationResult => {
			const message = errorMessageFor(type, msg);
			if (errorCallback) {
				return {
					valid: false,
					entity: errorCallback(
						newEntity,
						{ code, message, meta },
						getUnsupportedOptions(parentSpec),
					),
				};
			} else {
				throw new Error(message);
			}
		};
		if (type) {
			const typeOptions = getOptionsForType(type, allowed);
			if (typeOptions === false) {
				return isMark ? { valid: false } : err('INVALID_TYPE', 'type not allowed here');
			}

			const spec = validatorSpecs[type];
			if (!spec) {
				return err('INVALID_TYPE', `${type}: No validation spec found for type!`);
			}
			// A spec carrying `meta.stage0` exists only in the stage-0 schema. It reaches here as the
			// candidate the parent offers for this entity, so declining the candidate lets the caller's
			// candidate loop fall through to the next spec, normally the base one. Reading the flag from
			// `parentSpec` would reject the entity's own children and marks instead, emptying a node that
			// matches a stage-0 variant.
			//
			// The rule is partial, and errs towards accepting: `typeOptions` carries variant
			// candidates only, so a stage-0-only base node such as `extensionFrame` reaches here with
			// `{}` and is accepted; `applyVariantSpecOverrides` copies a variant's `props` onto its base
			// without `meta`; and `withoutStage0Meta` clears the flag from variants that also carry
			// `breakout`. Also reading `validatorSpecs[type].meta` would cover the base-node case, but
			// only holds while the generator flags stage-0-only specs and nothing else.
			if (rejectStage0Specs && typeOptions.meta?.stage0) {
				return { valid: false };
			}

			const specBasedValidationResult = specBasedValidationFor(
				spec,
				typeOptions,
				entity,
				err,
				newEntity,
				type,
				errorCallback,
				isMark,
			);
			if (specBasedValidationResult.hasValidated && specBasedValidationResult.result) {
				return specBasedValidationResult.result;
			}
		} else {
			return err('INVALID_TYPE', 'ProseMirror Node/Mark should contain a `type`');
		}
		return { valid: true, entity: newEntity };
	};

	return validate;

	function marksValidationFor(
		validator: ValidatorSpec,
		entity: ADFEntity,
		errorCallback: ErrorCallback | undefined,
		newEntity: ADFEntity,
		err: Err,
	) {
		let validationResult: NodeValidationResult;
		if (validator.props && validator.props.marks) {
			const marksSet = allowedMarksFor(validator);
			const marksValidationResult = marksAfterValidation(
				entity,
				errorCallback,
				marksSet,
				validator,
			);
			validationResult = {
				valid: true,
				entity: newEntity,
				marksValidationOutput: marksValidationResult,
			};
		} else {
			validationResult = marksForEntitySpecNotSupportingMarks(
				entity,
				newEntity,
				errorCallback,
				err,
			);
		}
		return validationResult;
	}
	// Ignored via go/ees005
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	function validatorFor(spec: ValidatorSpec, typeOptions: Record<string, any>): ValidatorSpec {
		return {
			...spec,
			...typeOptions,
			// options with props can override props of spec
			...(spec.props ? { props: { ...spec.props, ...(typeOptions['props'] || {}) } } : {}),
		};
	}

	function marksAfterValidation(
		entity: ADFEntity,
		errorCallback: ErrorCallback | undefined,
		marksSet: Array<string | Array<string>>,
		validator: ValidatorSpec,
	): MarkValidationResult[] {
		return entity.marks
			? entity.marks.map((mark) => {
					const isAKnownMark = marks ? marks.indexOf(mark.type) > -1 : true;
					if (mode === 'strict' && isAKnownMark) {
						const finalResult = validateNode(mark, errorCallback, marksSet, validator, true);
						const finalMark = finalResult.entity;
						if (finalMark) {
							return { valid: true, originalMark: mark, newMark: finalMark };
						}
						// this checks for mark level attribute errors
						// and propagates error code and message
						else if (
							finalResult.marksValidationOutput &&
							finalResult.marksValidationOutput.length
						) {
							return {
								valid: false,
								originalMark: mark,
								errorCode: finalResult.marksValidationOutput[0].errorCode,
								message: finalResult.marksValidationOutput[0].message,
							};
						} else {
							return {
								valid: false,
								originalMark: mark,
								errorCode: 'INVALID_TYPE',
							};
						}
					} else {
						return {
							valid: false,
							originalMark: mark,
							errorCode: 'INVALID_CONTENT',
						};
					}
				})
			: [];
	}

	function allowedMarksFor(validator: ValidatorSpec) {
		// Ignored via go/ees005
		// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
		const { items } = validator.props!.marks!;
		const marksSet = items.length ? (Array.isArray(items[0]) ? items[0] : items) : [];
		return marksSet;
	}

	/**
	 * Whether the node declares a `marks` property that no mark type may go into, which ADF spells as
	 * `marks: { type: 'array', maxItems: 0 }` — `paragraph`, `heading`, `extension` and `codeBlock` all
	 * do. An empty array is then the property's only legal value, so it says nothing about the node and
	 * carries nothing to reject.
	 *
	 * The declaration is read off the BASE spec, not the candidate the parent offered. A variant only
	 * ever widens the mark types (`extension_with_marks` adds `dataConsumer` and `fragment`), which
	 * cannot make the empty list illegal. Reading the candidate instead would leave a root `extension`
	 * out, since `doc` offers it as `extension_with_marks`.
	 *
	 * A node with no `marks` property at all (`rule`, `panel`, `mediaGroup`) is excluded: for those,
	 * `marks` is a property ADF does not define, so an empty array is still redundant.
	 */
	function declaresEmptyMarksOnly(baseSpec: ValidatorSpec) {
		return !!baseSpec.props?.marks && allowedMarksFor(baseSpec).length === 0;
	}

	function marksForEntitySpecNotSupportingMarks(
		prevEntity: ADFEntity,
		newEntity: ADFEntity,
		errorCallback: ErrorCallback | undefined,
		err: Err,
	) {
		const errorCode = 'REDUNDANT_MARKS';
		const currentMarks = prevEntity.marks || [];
		const newMarks = currentMarks.map((mark: ADFEntityMark) => {
			const isUnsupportedNodeAttributeMark = mark.type === 'unsupportedNodeAttribute';
			if (isUnsupportedNodeAttributeMark) {
				return mark;
			}
			return unsupportedMarkContent(errorCode, mark, errorCallback);
		});
		// Attribute validation may have already put an `unsupportedNodeAttribute` mark on `newEntity`.
		// It is not in `prevEntity.marks`, so rebuilding from those alone loses the only record of the
		// unknown attribute. The check above only covers the mark being on the original entity, which
		// held while the validated entity still aliased the caller's marks array.
		const prevMarkTypes = new Set(currentMarks.map((mark: ADFEntityMark) => mark.type));
		const synthesizedMarks = fixMutationBug
			? (newEntity.marks ?? []).filter((mark) => !prevMarkTypes.has(mark.type))
			: [];
		const allMarks = newMarks.concat(synthesizedMarks);
		if (allMarks.length) {
			newEntity.marks = allMarks;
			return { valid: true, entity: newEntity };
		} else {
			return err('REDUNDANT_MARKS', 'redundant marks', {
				marks: Object.keys(currentMarks),
			});
		}
	}

	function requiredPropertyValidationFor(
		validatorSpec: ValidatorSpec,
		prevEntity: ADFEntity,
		err: Err,
	) {
		let result: NodeValidationResult = { valid: true, entity: prevEntity };
		if (validatorSpec.required) {
			if (!validatorSpec.required.every((prop: string | number) => isDefined(prevEntity[prop]))) {
				result = err('MISSING_PROPERTIES', 'required prop missing');
			}
		}
		return result;
	}

	function textPropertyValidationFor(
		validatorSpec: ValidatorSpec,
		prevEntity: ADFEntity,
		err: Err,
	) {
		let result: NodeValidationResult = { valid: true, entity: prevEntity };
		// Ignored via go/ees005
		// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
		if (validatorSpec.props!.text) {
			if (
				isDefined(prevEntity.text) &&
				// Ignored via go/ees005
				// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
				!validateAttrs(validatorSpec.props!.text, prevEntity.text)
			) {
				result = err('INVALID_TEXT', `'text' validation failed`);
			}
		}
		return result;
	}

	function contentLengthValidationFor(
		validatorSpec: ValidatorSpec,
		prevEntity: ADFEntity,
		err: Err,
	) {
		let result: NodeValidationResult = { valid: true, entity: prevEntity };
		// Ignored via go/ees005
		// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
		if (validatorSpec.props!.content && prevEntity.content) {
			// Ignored via go/ees005
			// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
			const { minItems, maxItems } = validatorSpec.props!.content;
			const length = prevEntity.content.length;
			if (isDefined(minItems) && minItems > length) {
				result = err(
					'INVALID_CONTENT_LENGTH',
					`'content' should have more than ${minItems} child`,
					{ length, requiredLength: minItems, type: 'minimum' },
				);
			} else if (isDefined(maxItems) && maxItems < length) {
				result = err(
					'INVALID_CONTENT_LENGTH',
					`'content' should have less than ${maxItems} child`,
					{ length, requiredLength: maxItems, type: 'maximum' },
				);
			}
		}
		return result;
	}

	function invalidAttributesFor(validatorSpec: ValidatorSpec, prevEntity: ADFEntity) {
		let invalidAttrs: Array<string> = [];
		// Ignored via go/ees005
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		let validatorAttrs: Record<string, any> = {};
		if (validatorSpec.props && validatorSpec.props.attrs) {
			const attrOptions = makeArray(validatorSpec.props.attrs);
			/**
			 * Attrs can be union type so try each path
			 * attrs: [{ props: { url: { type: 'string' } } }, { props: { data: {} } }],
			 * Gotcha: It will always report the last failure.
			 */
			for (let i = 0, length = attrOptions.length; i < length; ++i) {
				const attrOption = attrOptions[i];
				if (attrOption && attrOption.props) {
					[, invalidAttrs] = partitionObject(attrOption.props, (key, spec) => {
						// Ignored via go/ees005
						// eslint-disable-next-line @typescript-eslint/no-explicit-any
						const valueToValidate = (prevEntity.attrs as any)[key];
						return validateAttrs(spec, valueToValidate);
					});
				}
				// Ignored via go/ees005
				// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
				validatorAttrs = attrOption!;
				if (!invalidAttrs.length) {
					break;
				}
			}
		}

		return { invalidAttrs, validatorAttrs };
	}

	function attributesValidationFor(
		validatorSpec: ValidatorSpec,
		prevEntity: ADFEntity,
		newEntity: ADFEntity,
		isMark: boolean,
		errorCallback: ErrorCallback | undefined,
	): NodeValidationResult {
		const validatorSpecAllowsAttributes = validatorSpec.props && validatorSpec.props.attrs;
		if (prevEntity.attrs) {
			if (!validatorSpecAllowsAttributes) {
				if (isMark) {
					return handleNoAttibutesAllowedInSpecForMark(prevEntity, prevEntity.attrs);
				}
				const attrs = Object.keys(prevEntity.attrs);
				return handleUnsupportedNodeAttributes(prevEntity, newEntity, [], attrs, errorCallback);
			}

			const { hasUnsupportedAttrs, redundantAttrs, invalidAttrs } = validateAttributes(
				validatorSpec,
				prevEntity,
				prevEntity.attrs,
			);

			if (hasUnsupportedAttrs) {
				if (isMark) {
					return handleUnsupportedMarkAttributes(prevEntity, invalidAttrs, redundantAttrs);
				}
				return handleUnsupportedNodeAttributes(
					prevEntity,
					newEntity,
					invalidAttrs,
					redundantAttrs,
					errorCallback,
				);
			}
		}
		return { valid: true, entity: prevEntity };
	}

	function validateAttributes(
		validatorSpec: ValidatorSpec,
		prevEntity: ADFEntity,
		// Ignored via go/ees005
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		attributes: { [name: string]: any },
	) {
		const invalidAttributesResult = invalidAttributesFor(validatorSpec, prevEntity);
		const { invalidAttrs } = invalidAttributesResult;

		const validatorAttrs = invalidAttributesResult.validatorAttrs;

		const attrs = Object.keys(attributes).filter(
			(k) => !(allowPrivateAttributes && k.startsWith('__')),
		);

		// Ignored via go/ees005
		// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
		const redundantAttrs = attrs.filter((a) => !validatorAttrs.props![a]);
		const hasRedundantAttrs = redundantAttrs.length > 0;

		const hasUnsupportedAttrs = invalidAttrs.length || hasRedundantAttrs;

		return {
			hasUnsupportedAttrs,
			invalidAttrs,
			redundantAttrs,
		};
	}

	function handleUnsupportedNodeAttributes(
		prevEntity: ADFEntity,
		newEntity: ADFEntity,
		invalidAttrs: Array<string>,
		redundantAttrs: Array<string>,
		errorCallback: ErrorCallback | undefined,
	) {
		const attr: Array<string> = invalidAttrs.concat(redundantAttrs);

		let result: NodeValidationResult = { valid: true, entity: prevEntity };
		const message = errorMessageFor(prevEntity.type, `'attrs' validation failed`);
		const errorCode = 'UNSUPPORTED_ATTRIBUTES';
		newEntity.marks = wrapUnSupportedNodeAttributes(
			prevEntity,
			newEntity,
			attr,
			errorCode,
			message,
			errorCallback,
		);
		result = { valid: true, entity: newEntity };
		return result;
	}

	function handleUnsupportedMarkAttributes(
		prevEntity: ADFEntity,
		invalidAttrs: Array<string>,
		redundantAttrs: Array<string>,
	) {
		let errorCode: ValidationErrorType = 'INVALID_ATTRIBUTES';
		let message = errorMessageFor(prevEntity.type, `'attrs' validation failed`);
		const hasRedundantAttrs = redundantAttrs.length;
		const hasBothInvalidAndRedundantAttrs = hasRedundantAttrs && invalidAttrs.length;
		if (!hasBothInvalidAndRedundantAttrs && hasRedundantAttrs) {
			errorCode = 'REDUNDANT_ATTRIBUTES';
			message = errorMessageFor('redundant attributes found', redundantAttrs.join(', '));
		}
		const markValidationResult = {
			valid: true,
			originalMark: prevEntity,
			errorCode: errorCode,
			message: message,
		};
		return {
			valid: false,
			marksValidationOutput: [markValidationResult],
		};
	}

	function handleNoAttibutesAllowedInSpecForMark(
		prevEntity: ADFEntity,
		// Ignored via go/ees005
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		attributes: { [name: string]: any },
	) {
		const message = errorMessageFor(
			'redundant attributes found',
			Object.keys(attributes).join(', '),
		);
		const errorCode: ValidationErrorType = 'REDUNDANT_ATTRIBUTES';
		const markValidationResult = {
			valid: true,
			originalMark: prevEntity,
			errorCode: errorCode,
			message: message,
		};
		return {
			valid: false,
			marksValidationOutput: [markValidationResult],
		};
	}

	function wrapUnSupportedNodeAttributes(
		prevEntity: ADFEntity,
		newEntity: ADFEntity,
		invalidAttrs: Array<string>,
		errorCode: ValidationErrorType,
		message: string,
		errorCallback: ErrorCallback | undefined,
	) {
		const invalidValues: ADFEntity['attrs'] = {};
		// eslint-disable-next-line guard-for-in
		for (const invalidAttr in invalidAttrs) {
			invalidValues[invalidAttrs[invalidAttr]] =
				prevEntity.attrs && prevEntity.attrs[invalidAttrs[invalidAttr]];
			if (newEntity.attrs) {
				delete newEntity.attrs[invalidAttrs[invalidAttr]];
			}
		}
		const unsupportedNodeAttributeValues = unsupportedNodeAttributesContent(
			prevEntity,
			errorCode,
			invalidValues,
			message,
			errorCallback,
		);
		const finalEntity = { ...newEntity };

		if (finalEntity.marks) {
			if (!unsupportedNodeAttributeValues) {
				return finalEntity.marks;
			}

			// If there is an existing unsupported node attribute mark, overwrite it to avoid duplicate marks
			const existingMark = finalEntity.marks.find(
				(mark) => mark.type === unsupportedNodeAttributeValues.type,
			);
			if (existingMark) {
				existingMark.attrs = unsupportedNodeAttributeValues.attrs;
			} else {
				finalEntity.marks.push(unsupportedNodeAttributeValues);
			}

			return finalEntity.marks;
		} else {
			return [unsupportedNodeAttributeValues] as ADFEntityMark[];
		}
	}

	function extraPropsValidationFor(
		validatorSpec: ValidatorSpec,
		prevEntity: ADFEntity,
		err: Err,
		newEntity: ADFEntity,
		type: string,
	): NodeValidationResult {
		const result: NodeValidationResult = { valid: true, entity: prevEntity };
		const [requiredProps, redundantProps] = partitionObject(prevEntity, (k) =>
			// Ignored via go/ees005
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			isDefined((validatorSpec.props as any)[k]),
		);
		if (redundantProps.length) {
			if (mode === 'loose') {
				newEntity = { type };
				requiredProps.reduce((acc, p) => copy(prevEntity, acc, p), newEntity);
			} else {
				if (
					!(
						(redundantProps.indexOf('marks') > -1 || redundantProps.indexOf('attrs') > -1) &&
						redundantProps.length === 1
					)
				) {
					return err(
						'REDUNDANT_PROPERTIES',
						`redundant props found: ${redundantProps.join(', ')}`,
						{ props: redundantProps },
					);
				}
			}
		}
		return result;
	}

	function specBasedValidationFor(
		spec: ValidatorSpec,
		// Ignored via go/ees005
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		typeOptions: Record<string, any>,
		prevEntity: ADFEntity,
		err: Err,
		newEntity: ADFEntity,
		type: string,
		errorCallback: ErrorCallback | undefined,
		isMark: boolean,
	): SpecValidatorResult {
		const specBasedValidationResult: SpecValidatorResult = {
			hasValidated: false,
		};
		const validatorSpec: ValidatorSpec = validatorFor(spec, typeOptions);
		if (!validatorSpec) {
			return specBasedValidationResult;
		}

		// Required Props
		// For array format where `required` is an array
		const requiredPropertyValidatonResult = requiredPropertyValidationFor(
			validatorSpec,
			prevEntity,
			err,
		);
		if (!requiredPropertyValidatonResult.valid) {
			return {
				hasValidated: true,
				result: requiredPropertyValidatonResult,
			};
		}

		if (!validatorSpec.props) {
			const props = Object.keys(prevEntity);
			// If there's no validator.props then there shouldn't be any key except `type`
			if (props.length > 1) {
				return {
					hasValidated: true,
					result: err(
						'REDUNDANT_PROPERTIES',
						`redundant props found: ${Object.keys(prevEntity).join(', ')}`,
						{ props },
					),
				};
			}
			return specBasedValidationResult;
		}

		// Check text
		const textPropertyValidationResult = textPropertyValidationFor(validatorSpec, prevEntity, err);
		if (!textPropertyValidationResult.valid) {
			return {
				hasValidated: true,
				result: textPropertyValidationResult,
			};
		}
		// Content Length
		const contentLengthValidationResult = contentLengthValidationFor(
			validatorSpec,
			prevEntity,
			err,
		);
		if (!contentLengthValidationResult.valid) {
			return {
				hasValidated: true,
				result: contentLengthValidationResult,
			};
		}

		// Required Props
		// For object format based on `optional` property
		const [, missingProps] = partitionObject(validatorSpec.props, (k, v) => {
			// if the validator is an array, then check
			// if the `required` field contains the key.
			const isOptional = Array.isArray(v)
				? !validatorSpec.required?.includes(k)
				: typeof v === 'object' && v !== null && 'optional' in v
					? (v as { optional?: boolean }).optional
					: false;
			return isOptional || isDefined(prevEntity[k]);
		});

		if (missingProps.length) {
			return {
				hasValidated: true,
				result: err('MISSING_PROPERTIES', 'required prop missing', {
					props: missingProps,
				}),
			};
		}

		const attributesValidationResult = attributesValidationFor(
			validatorSpec,
			prevEntity,
			newEntity,
			isMark,
			errorCallback,
		);
		if (!attributesValidationResult.valid) {
			return {
				hasValidated: true,
				result: attributesValidationResult,
			};
		}

		if (isMark && attributesValidationResult.valid) {
			return {
				hasValidated: true,
				result: attributesValidationResult,
			};
		}

		const extraPropsValidationResult = extraPropsValidationFor(
			validatorSpec,
			prevEntity,
			err,
			newEntity,
			type,
		);

		if (!extraPropsValidationResult.valid) {
			return {
				hasValidated: true,
				result: extraPropsValidationResult,
			};
		}

		// Children
		if (validatorSpec.props.content) {
			const contentValidatorSpec = validatorSpec.props.content;
			if (prevEntity.content) {
				// Ignored via go/ees005
				// eslint-disable-next-line @typescript-eslint/no-explicit-any
				const validateChildNode = (child: ADFEntity | undefined, index: number) => {
					if (child === undefined) {
						return child;
					}
					const validateChildMarks = (
						childEntity: ADFEntity | undefined,
						marksValidationOutput: MarkValidationResult[] | undefined,
						errorCallback: ErrorCallback | undefined,
						isLastValidationSpec: boolean,
						isParentTupleLike: boolean = false,
					) => {
						let marksAreValid = true;
						if (childEntity && childEntity.marks && marksValidationOutput) {
							const validMarks = marksValidationOutput.filter((mark) => mark.valid);
							// Ignored via go/ees005
							// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
							const finalMarks = marksValidationOutput!
								.map((mr) => {
									if (mr.valid) {
										return mr.newMark;
									} else {
										if (
											validMarks.length ||
											isLastValidationSpec ||
											isParentTupleLike ||
											mr.errorCode === 'INVALID_TYPE' ||
											mr.errorCode === 'INVALID_CONTENT' ||
											mr.errorCode === 'REDUNDANT_ATTRIBUTES' ||
											mr.errorCode === 'INVALID_ATTRIBUTES'
										) {
											return unsupportedMarkContent(
												// Ignored via go/ees005
												// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
												mr.errorCode!,
												mr.originalMark,
												errorCallback,
												mr.message,
											);
										}
										return;
									}
								})
								.filter(Boolean) as ADFEntityMark[];
							// `marksValidationOutput` is derived from the ORIGINAL marks, so it omits marks
							// synthesized during validation. The `unsupportedNodeAttribute` mark is one of those
							// and is the only record of an unknown attribute, so rebuilding from the output alone
							// destroys it. This survived by accident before entities were deep-cloned.
							const validatedMarkTypes = new Set(
								marksValidationOutput.map((markResult) => markResult.originalMark?.type),
							);
							const synthesizedMarks = fixMutationBug
								? childEntity.marks.filter((mark) => !validatedMarkTypes.has(mark.type))
								: [];
							const allMarks = finalMarks.concat(synthesizedMarks);
							if (allMarks.length) {
								childEntity.marks = allMarks;
							} else {
								delete childEntity.marks;
								marksAreValid = false;
							}
						}
						return { valid: marksAreValid, entity: childEntity };
					};
					const hasMultipleCombinationOfContentAllowed = !!contentValidatorSpec.isTupleLike;
					if (hasMultipleCombinationOfContentAllowed) {
						const { entity: newChildEntity, marksValidationOutput } = validateNode(
							child,
							errorCallback,
							makeArray(
								contentValidatorSpec.items[index] ||
									contentValidatorSpec.items[contentValidatorSpec.items.length - 1],
							),
							validatorSpec,
						);
						const { entity } = validateChildMarks(
							newChildEntity,
							marksValidationOutput,
							errorCallback,
							false,
							true,
						);
						return entity;
					}

					// Only go inside valid branch
					const allowedSpecsForEntity = contentValidatorSpec.items.filter((item) =>
						Array.isArray(item)
							? item.some(
									// [p, hr, ...] or [p, [text, {}], ...]
									(spec) => (Array.isArray(spec) ? spec[0] : spec) === child.type,
								)
							: true,
					);

					if (allowedSpecsForEntity.length) {
						if (allowedSpecsForEntity.length > 1) {
							throw new Error('Consider using Tuple instead!');
						}

						const maybeArray = makeArray(allowedSpecsForEntity[0]);
						const allowedSpecsForChild = maybeArray.filter(
							(item) => (Array.isArray(item) ? item[0] : item) === child.type,
						);

						if (allowedSpecsForChild.length === 0) {
							return invalidChildContent(child, errorCallback, validatorSpec);
						}

						/**
						 * When there's multiple possible branches try all of them.
						 * If all of them fails, throw the first one.
						 * e.g.- [['text', { marks: ['a'] }], ['text', { marks: ['b'] }]]
						 */
						let firstError;
						let firstChild;
						for (let i = 0, len = allowedSpecsForChild.length; i < len; i++) {
							try {
								const allowedValueForCurrentSpec = [allowedSpecsForChild[i]];
								const {
									valid,
									entity: newChildEntity,
									marksValidationOutput,
								} = validateNode(child, errorCallback, allowedValueForCurrentSpec, validatorSpec);
								if (valid) {
									const isLastValidationSpec = i === allowedSpecsForChild.length - 1;
									const { valid: marksAreValid, entity } = validateChildMarks(
										newChildEntity,
										marksValidationOutput,
										errorCallback,
										isLastValidationSpec,
									);
									const unsupportedMarks =
										(entity &&
											entity.marks &&
											entity.marks.filter((mark) => mark.type === 'unsupportedMark')) ||
										[];
									if (marksAreValid && !unsupportedMarks.length) {
										return entity;
									} else {
										firstChild = firstChild || newChildEntity;
									}
								} else {
									firstChild = firstChild || newChildEntity;
								}
							} catch (error) {
								firstError = firstError || error;
							}
						}
						if (!errorCallback) {
							throw firstError;
						} else {
							return firstChild;
						}
					} else {
						return invalidChildContent(child, errorCallback, validatorSpec);
					}
				};
				newEntity.content = prevEntity.content
					.map(validateChildNode)
					.filter(Boolean) as Array<ADFEntity>;
			} else if (!contentValidatorSpec.optional) {
				return {
					hasValidated: true,
					result: err('MISSING_PROPERTIES', 'missing `content` prop'),
				};
			}
		}

		// Marks
		if (prevEntity.marks) {
			// An empty array on a node that only ever takes an empty array is dropped rather than
			// validated. Mark validation has nothing to reject in it, so it reports the node valid with an
			// empty `marksValidationOutput`, which reads to the parent's `validateChildMarks` as every
			// mark on the child having been rejected, and the candidate spec gets declined.
			if (acceptEmptyMarks && prevEntity.marks.length === 0 && declaresEmptyMarksOnly(spec)) {
				delete newEntity.marks;
				return specBasedValidationResult;
			}
			return {
				hasValidated: true,
				result: marksValidationFor(validatorSpec, prevEntity, errorCallback, newEntity, err),
			};
		}
		return specBasedValidationResult;
	}
}
