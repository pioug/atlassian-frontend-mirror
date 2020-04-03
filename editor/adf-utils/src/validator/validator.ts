import * as specs from './specs';
import { ADFEntity } from '../types';

export type Content = Array<string | [string, object] | Array<string>>;

type ArrayForceContentValidationAttributesSpec = {
  type: 'array';
  items: Array<Array<string>>;
  optional?: boolean;
  forceContentValidation: boolean;
};

type AttributesSpec =
  | ArrayForceContentValidationAttributesSpec
  | { type: 'number'; optional?: boolean; minimum: number; maximum: number }
  | { type: 'integer'; optional?: boolean; minimum: number; maximum: number }
  | { type: 'boolean'; optional?: boolean }
  | { type: 'string'; optional?: boolean; minLength?: number; pattern?: RegExp }
  | { type: 'enum'; values: Array<string>; optional?: boolean }
  | { type: 'object'; optional?: boolean }
  | { type: 'array'; items: Array<AttributesSpec>; optional?: boolean };

interface ValidatorSpec {
  props?: {
    attrs?: { props: { [key: string]: AttributesSpec }; optional?: boolean };
    content?: {
      type: 'array';
      items: Array<Array<string>>;
      minItems?: number;
      optional?: boolean;
      allowUnsupportedBlock: boolean;
      allowUnsupportedInline: boolean;
    };
    text?: AttributesSpec;
    marks?: {
      type: 'array';
      items: Array<Array<string>>;
      maxItems?: number;
      optional?: boolean;
    };
  };
  minItems?: number;
  required?: Array<string>;
}

const isDefined = <T>(x: T): x is NonNullable<T> => x != null;

const isNumber = (x: any): x is number =>
  typeof x === 'number' && !isNaN(x) && isFinite(x);

const isInteger = (x: any): x is number =>
  typeof x === 'number' && isFinite(x) && Math.floor(x) === x;

const isBoolean = (x: any): x is boolean =>
  x === true || x === false || toString.call(x) === '[object Boolean]';

// This is a kludge, might replace with something like _.isString in future
const isString = (s: any): s is string =>
  typeof s === 'string' || s instanceof String;

const isPlainObject = (x: any) =>
  typeof x === 'object' && x !== null && !Array.isArray(x);

const copy = <
  T extends Record<string | number, any> = Record<string | number, any>
>(
  source: Record<string | number, any>,
  dest: T,
  key: string | number,
) => {
  (dest as Record<string | number, any>)[key] = source[key];
  return dest;
};

// Helpers
const makeArray = <T>(maybeArray: T | Array<T>) =>
  Array.isArray(maybeArray) ? maybeArray : [maybeArray];

function isForceContentValidationSpec(
  x: AttributesSpec,
): x is ArrayForceContentValidationAttributesSpec {
  return isDefined((x as any).forceContentValidation);
}

function mapMarksItems(spec: ValidatorSpec, fn = (x: any) => x) {
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
        items: items.length
          ? Array.isArray(items[0])
            ? items.map(fn)
            : [fn(items)]
          : [[]],
      },
    },
  };
}

const partitionObject = <T extends { [key: string]: any }>(
  obj: T,
  predicate: <K extends keyof T>(
    key: K,
    value: Exclude<T[K], undefined>,
    obj: T,
  ) => boolean,
) =>
  Object.keys(obj).reduce<[Array<string>, Array<string>]>(
    (acc, key) => {
      acc[predicate(key, obj[key], obj) ? 0 : 1].push(key);
      return acc;
    },
    [[], []],
  );

// TODO: no-implicit-any
function createSpec(nodes?: Array<string>, marks?: Array<string>) {
  return Object.keys(specs).reduce<Record<string, any>>((newSpecs, k) => {
    const spec = { ...(specs as any)[k] };
    if (spec.props) {
      spec.props = { ...spec.props };
      if (isString(spec.props.content)) {
        spec.props.content = (specs as any)[spec.props.content];
      }
      if (spec.props.content) {
        if (!spec.props.content.items) {
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
            items: ((spec.props.content || []) as Array<{
              items: Array<Array<string>>;
            }>).map(arr => arr.items),
          };
        } else {
          spec.props.content = { ...spec.props.content };
        }

        spec.props.content.items = (spec.props.content.items as Array<
          string | Array<string>
        >)
          // ['inline'] => [['emoji', 'hr', ...]]
          // ['media'] => [['media']]
          .map(item =>
            isString(item)
              ? Array.isArray((specs as any)[item])
                ? (specs as any)[item]
                : [item]
              : item,
          )
          // [['emoji', 'hr', 'inline_code']] => [['emoji', 'hr', ['text', { marks: {} }]]]
          .map((item: Array<string>) =>
            item
              .map(subItem =>
                Array.isArray((specs as any)[subItem])
                  ? (specs as any)[subItem]
                  : isString(subItem)
                  ? subItem
                  : // Now `NoMark` produces `items: []`, should be fixed in generator
                    ['text', subItem],
              )
              // Remove unsupported nodes & marks
              // Filter nodes
              .filter(subItem =>
                // When Mark or `nodes` is undefined don't filter
                !nodes
                  ? true
                  : nodes.indexOf(
                      Array.isArray(subItem) ? subItem[0] : subItem,
                    ) > -1,
              )
              // Filter marks
              .map(subItem =>
                Array.isArray(subItem) && marks
                  ? /**
                     * TODO: Probably try something like immer, but it's 3.3kb gzipped.
                     * Not worth it just for this.
                     */
                    [subItem[0], mapMarksItems(subItem[1])]
                  : subItem,
              ),
          );
      }
    }

    newSpecs[k] = spec;
    return newSpecs;
  }, {});
}

function getOptionsForType(
  type: string,
  list?: Content,
): false | Record<string, any> {
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

export function validateAttrs<T>(spec: AttributesSpec, value: T): boolean {
  // extension_node parameters has no type
  if (!isDefined(spec.type)) {
    return !!spec.optional;
  }
  if (!isDefined(value)) {
    return !!spec.optional;
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
      return (
        isString(value) &&
        (isDefined(spec.minLength) ? spec.minLength! <= value.length : true) &&
        (spec.pattern ? new RegExp(spec.pattern).test(value) : true)
      );
    case 'object':
      return isPlainObject(value);
    case 'array':
      if (!isForceContentValidationSpec(spec)) {
        const types = spec.items;
        const lastTypeIndex = types.length - 1;
        if (Array.isArray(value)) {
          // We are doing this to support tuple which can be defined as [number, string]
          // NOTE: Not validating tuples strictly
          return value.every((x, i) =>
            validateAttrs(types[Math.min(i, lastTypeIndex)], x),
          );
        }
      }
      return false;

    case 'enum':
      return isString(value) && spec.values.indexOf(value) > -1;
  }

  return false;
}

const getUnsupportedOptions = (spec?: ValidatorSpec) => {
  if (spec && spec.props && spec.props.content) {
    const {
      allowUnsupportedBlock,
      allowUnsupportedInline,
    } = spec.props.content;
    return { allowUnsupportedBlock, allowUnsupportedInline };
  }
  return {};
};

const invalidChildContent = (
  child: ADFEntity,
  errorCallback?: ErrorCallback,
  parentSpec?: ValidatorSpec,
) => {
  const message = `${child.type}: invalid content.`;
  if (!errorCallback) {
    throw new Error(message);
  } else {
    return errorCallback(
      { ...child },
      {
        code: 'INVALID_CONTENT',
        message,
      },
      getUnsupportedOptions(parentSpec),
    );
  }
};

// NOTE: Don't add huge data inside metadata. Also, don't add `any`.
// We are sending it over analytics, so also be aware of GDPR.
interface ValidationErrorMap {
  MISSING_PROPERTIES: { props: Array<string> };
  REDUNDANT_PROPERTIES: { props: Array<string> };
  REDUNDANT_ATTRIBUTES: { attrs: Array<string> };
  REDUNDANT_MARKS: { marks: Array<string> };
  INVALID_TYPE: never;
  INVALID_TEXT: never;
  INVALID_CONTENT: never;
  INVALID_CONTENT_LENGTH: { length: number };
  INVALID_ATTRIBUTES: { attrs: Array<string> };
  DEPRECATED: never;
}

export type ValidationErrorType = keyof ValidationErrorMap;

export interface ValidationError {
  code: ValidationErrorType;
  message: string;
  meta?: object;
}

export type ErrorCallback = (
  entity: ADFEntity,
  error: ValidationError,
  options: {
    allowUnsupportedBlock?: boolean;
    allowUnsupportedInline?: boolean;
  },
) => ADFEntity | undefined;

// `loose` - ignore and filter extra props or attributes
export type ValidationMode = 'strict' | 'loose';

export interface ValidationOptions {
  mode?: ValidationMode;
  // Allow attributes starting with `__` without validation
  allowPrivateAttributes?: boolean;
}

export interface Output {
  valid: boolean;
  entity?: ADFEntity;
}

export function validator(
  nodes?: Array<string>,
  marks?: Array<string>,
  options?: ValidationOptions,
) {
  const validatorSpecs = createSpec(nodes, marks);
  const { mode = 'strict', allowPrivateAttributes = false } = options || {};

  const validate = (
    entity: ADFEntity,
    errorCallback?: ErrorCallback,
    allowed?: Content,
    parentSpec?: ValidatorSpec,
  ): Output => {
    const { type } = entity;
    let newEntity: ADFEntity = { ...entity };

    const err = <T extends ValidationErrorType>(
      code: T,
      msg: string,
      meta?: T extends keyof ValidationErrorMap ? ValidationErrorMap[T] : never,
    ): Output => {
      const message = `${type}: ${msg}.`;
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
        return err('INVALID_TYPE', 'type not allowed here');
      }

      const spec = validatorSpecs[type];
      if (!spec) {
        return err(
          'INVALID_TYPE',
          `${type}: No validation spec found for type!`,
        );
      }

      const validator: ValidatorSpec = {
        ...spec,
        ...typeOptions,
        // options with props can override props of spec
        ...(spec.props
          ? { props: { ...spec.props, ...(typeOptions['props'] || {}) } }
          : {}),
      };

      if (validator) {
        // Required Props
        // For array format where `required` is an array
        if (validator.required) {
          if (!validator.required.every(prop => isDefined(entity[prop]))) {
            return err('MISSING_PROPERTIES', 'required prop missing');
          }
        }

        if (validator.props) {
          // Check text
          if (validator.props.text) {
            if (
              isDefined(entity.text) &&
              !validateAttrs(validator.props.text, entity.text)
            ) {
              return err('INVALID_TEXT', `'text' validation failed`);
            }
          }

          // Content Length
          if (
            validator.props.content &&
            isDefined(validator.props.content.minItems) &&
            entity.content
          ) {
            const length = entity.content.length;
            if (validator.props.content.minItems! > length) {
              const { minItems } = validator.props.content;
              return err(
                'INVALID_CONTENT_LENGTH',
                `'content' should have more than ${minItems} child`,
                { length },
              );
            }
          }

          // Required Props
          // For object format based on `optional` property
          const [, missingProps] = partitionObject(
            validator.props,
            (k, v) => v.optional || !!entity[k],
          );

          if (missingProps.length) {
            return err('MISSING_PROPERTIES', 'required prop missing', {
              props: missingProps,
            });
          }

          // Attributes
          let validatorAttrs: Record<string, any> = {};

          // Attributes Validation
          if (validator.props.attrs && entity.attrs) {
            const attrOptions = makeArray(validator.props.attrs);
            let invalidAttrs: Array<string> = [];

            /**
             * Attrs can be union type so try each path
             * attrs: [{ props: { url: { type: 'string' } } }, { props: { data: {} } }],
             * Gotcha: It will always report the last failure.
             */
            for (let i = 0, length = attrOptions.length; i < length; ++i) {
              const attrOption = attrOptions[i];

              [, invalidAttrs] = partitionObject(attrOption.props, (k, v) => {
                // We need to validate the content from that kind of
                // array against the nodes and marks. @see ED-6325
                if (
                  isForceContentValidationSpec(v) &&
                  v.forceContentValidation
                ) {
                  const items = (entity.attrs as any)[k] || [];
                  const newItems: Array<ADFEntity> = [];
                  const specItemsAllowed = v.items;
                  const entitySet = specItemsAllowed.reduce((xs, x) =>
                    xs.concat(x),
                  );

                  for (let i = 0; i < items.length; i++) {
                    const validateResult = validate(
                      items[i],
                      errorCallback,
                      entitySet,
                      validator,
                    );

                    if (!validateResult.valid && validateResult.entity) {
                      newItems.push(validateResult.entity);
                    }
                  }

                  newEntity.attrs = { ...newEntity.attrs };
                  newEntity.attrs![k] = newItems;

                  return true;
                } else {
                  return validateAttrs(v, (entity.attrs as any)[k]);
                }
              });

              if (!invalidAttrs.length) {
                validatorAttrs = attrOption;
                break;
              }
            }

            if (invalidAttrs.length) {
              return err('INVALID_ATTRIBUTES', `'attrs' validation failed`, {
                attrs: invalidAttrs,
              });
            }
          }

          // Extra Props
          const [requiredProps, redundantProps] = partitionObject(entity, k =>
            isDefined((validator.props as any)[k]),
          );
          if (redundantProps.length) {
            if (mode === 'loose') {
              newEntity = { type };
              requiredProps.reduce((acc, p) => copy(entity, acc, p), newEntity);
            } else {
              return err(
                'REDUNDANT_PROPERTIES',
                `redundant props found: ${redundantProps.join(', ')}`,
                { props: redundantProps },
              );
            }
          }

          // Extra Attributes
          if (entity.attrs) {
            const attrs = Object.keys(entity.attrs).filter(
              k => !(allowPrivateAttributes && k.startsWith('__')),
            );
            if (
              !validatorAttrs ||
              !attrs.every(a => !!validatorAttrs.props[a])
            ) {
              if (mode === 'loose') {
                newEntity.attrs = {};
                attrs
                  .filter(a => !!validatorAttrs.props![a])
                  .reduce(
                    (acc, p) => copy(entity.attrs || {}, acc, p),
                    newEntity.attrs,
                  );
              } else {
                const redundantAttrs = attrs.filter(
                  a => !validatorAttrs.props![a],
                );
                return err(
                  'REDUNDANT_ATTRIBUTES',
                  `redundant attributes found: ${redundantAttrs.join(', ')}`,
                  { attrs: redundantAttrs },
                );
              }
            }
          }

          // Children
          if (validator.props.content) {
            if (entity.content) {
              newEntity.content = entity.content
                .map((child, index) => {
                  // Only go inside valid branch
                  const validSets = validator.props!.content!.items.filter(
                    set =>
                      /**
                       * Manually treat listItem content as Tuple,
                       * hopefully tsc has new AST for Tuple in v3.0
                       */
                      type === 'listItem'
                        ? true
                        : set.some(
                            // [p, hr, ...] or [p, [text, {}], ...]
                            spec =>
                              (Array.isArray(spec) ? spec[0] : spec) ===
                              child.type,
                          ),
                  );

                  if (validSets.length) {
                    /**
                     * In case of multiple valid branches, we are treating them as Tuple.
                     * Thought this assumption is incorrect but it works for us since we don't
                     * have any valid alternative branches.
                     */
                    const setIndex =
                      validSets.length > 1
                        ? Math.min(index, validSets.length - 1)
                        : 0;
                    const set = validSets[setIndex].filter(
                      item =>
                        (Array.isArray(item) ? item[0] : item) === child.type,
                    );

                    if (set.length === 0) {
                      return invalidChildContent(
                        child,
                        errorCallback,
                        validator,
                      );
                    }

                    /**
                     * When there's multiple possible branches try all of them.
                     * If all of them fails, throw the first one.
                     * e.g.- [['text', { marks: ['a'] }], ['text', { marks: ['b'] }]]
                     */
                    let firstError;
                    let firstChild;
                    for (let i = 0, len = set.length; i < len; i++) {
                      try {
                        const { valid, entity: newChildEntity } = validate(
                          child,
                          errorCallback,
                          [set[i]],
                          validator,
                        );
                        if (valid) {
                          return newChildEntity;
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
                    return invalidChildContent(child, errorCallback, validator);
                  }
                })
                .filter(Boolean) as Array<ADFEntity>;
            } else if (!validator.props.content.optional) {
              return err('MISSING_PROPERTIES', 'missing `content` prop');
            }
          }

          // Marks
          if (entity.marks) {
            if (validator.props.marks) {
              const { items } = validator.props!.marks!;
              const marksSet = items.length
                ? Array.isArray(items[0])
                  ? items[0]
                  : items
                : [];
              const newMarks = entity.marks
                .filter(mark =>
                  mode === 'strict' && marks
                    ? marks.indexOf(mark.type) > -1
                    : true,
                )
                .map(
                  mark =>
                    validate(mark, errorCallback, marksSet, validator).entity,
                )
                .filter(Boolean) as ADFEntity[];
              if (newMarks.length) {
                newEntity.marks = newMarks;
              } else {
                delete newEntity.marks;
                return { valid: false, entity: newEntity };
              }
            } else {
              return err('REDUNDANT_MARKS', 'redundant marks', {
                marks: Object.keys(entity.marks),
              });
            }
          }
        } else {
          const props = Object.keys(entity);
          // If there's no validator.props then there shouldn't be any key except `type`
          if (props.length > 1) {
            return err(
              'REDUNDANT_PROPERTIES',
              `redundant props found: ${Object.keys(entity).join(', ')}`,
              { props },
            );
          }
        }
      }
    } else {
      return err(
        'INVALID_TYPE',
        'ProseMirror Node/Mark should contain a `type`',
      );
    }
    return { valid: true, entity: newEntity };
  };

  return validate;
}
