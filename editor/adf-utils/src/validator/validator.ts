import * as specs from './specs';
import { ADFEntity, ADFEntityMark } from '../types';
import {
  copy,
  isBoolean,
  isDefined,
  isInteger,
  isNumber,
  isPlainObject,
  isString,
  makeArray,
} from './utils';

import {
  NodeValidationResult,
  ValidatorSpec,
  AttributesSpec,
  ValidationErrorMap,
  ValidationError,
  ErrorCallback,
  ValidationOptions,
  Content,
  ValidationErrorType,
  ValidatorContent,
  MarkValidationResult,
  SpecValidatorResult,
  Err,
  Validate,
} from '../types/validatorTypes';

function mapMarksItems(spec: ValidatorSpec, fn = (x: any) => x) {
  if (spec.props && spec.props.marks) {
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
  } else {
    return spec;
  }
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

/**
 * Normalizes the structure of files imported form './specs'.
 * We denormalised the spec to save bundle size.
 */
function createSpec(nodes?: Array<string>, marks?: Array<string>) {
  return Object.keys(specs).reduce<Record<string, any>>((newSpecs, k) => {
    const spec = { ...(specs as any)[k] };
    if (spec.props) {
      spec.props = { ...spec.props };
      if (spec.props.content) {
        // 'tableCell_content' => { type: 'array', items: [ ... ] }
        if (isString(spec.props.content)) {
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
            items: ((spec.props.content || []) as Array<ValidatorContent>).map(
              (arr) => arr.items,
            ),
          };
        } else {
          spec.props.content = { ...spec.props.content };
        }

        spec.props.content.items = (spec.props.content.items as Array<
          string | Array<string>
        >)
          // ['inline'] => [['emoji', 'hr', ...]]
          // ['media'] => [['media']]
          .map((item) =>
            isString(item)
              ? Array.isArray((specs as any)[item])
                ? (specs as any)[item]
                : [item]
              : item,
          )
          // [['emoji', 'hr', 'inline_code']] => [['emoji', 'hr', ['text', { marks: {} }]]]
          .map((item: Array<string>) =>
            item
              .map((subItem) =>
                Array.isArray((specs as any)[subItem])
                  ? (specs as any)[subItem]
                  : isString(subItem)
                  ? subItem
                  : // Now `NoMark` produces `items: []`, should be fixed in generator
                    ['text', subItem],
              )
              // Remove unsupported nodes & marks
              // Filter nodes
              .filter((subItem) => {
                if (nodes) {
                  // Node with overrides
                  // ['mediaSingle', { props: { content: { items: [ 'media', 'caption' ] } }}]
                  if (Array.isArray(subItem)) {
                    const isMainNodeSupported = nodes.indexOf(subItem[0]) > -1;
                    if (
                      isMainNodeSupported &&
                      subItem[1]?.props?.content?.items
                    ) {
                      return subItem[1].props.content.items.every(
                        (item: string) => nodes.indexOf(item) > -1,
                      );
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
      const types = spec.items;
      const lastTypeIndex = types.length - 1;
      if (Array.isArray(value)) {
        // We are doing this to support tuple which can be defined as [number, string]
        // NOTE: Not validating tuples strictly
        return value.every((x, i) =>
          validateAttrs(types[Math.min(i, lastTypeIndex)], x),
        );
      }
      return false;

    case 'enum':
      return isString(value) && spec.values.indexOf(value) > -1;
  }

  return false;
}

const errorMessageFor = (type: string, message: string) =>
  `${type}: ${message}.`;

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
  const message = errorMessageFor(child.type, 'invalid content');
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

const unsupportedMarkContent = (
  errorCode: ValidationError['code'],
  mark: ADFEntityMark,
  errorCallback?: ErrorCallback,
  errorMessage?: string,
) => {
  const message =
    errorMessage || errorMessageFor(mark.type, 'unsupported mark');
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

export function validator(
  nodes?: Array<string>,
  marks?: Array<string>,
  options?: ValidationOptions,
) {
  const validatorSpecs = createSpec(nodes, marks);
  const { mode = 'strict', allowPrivateAttributes = false } = options || {};

  const validate: Validate = (entity, errorCallback, allowed, parentSpec) => {
    const validationResult = validateNode(
      entity,
      errorCallback,
      allowed,
      parentSpec,
    );
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
    let newEntity: ADFEntity = { ...entity };

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
        return isMark
          ? { valid: false }
          : err('INVALID_TYPE', 'type not allowed here');
      }

      const spec = validatorSpecs[type];
      if (!spec) {
        return err(
          'INVALID_TYPE',
          `${type}: No validation spec found for type!`,
        );
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
      if (
        specBasedValidationResult.hasValidated &&
        specBasedValidationResult.result
      ) {
        return specBasedValidationResult.result;
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
  function validatorFor(
    spec: ValidatorSpec,
    typeOptions: Record<string, any>,
  ): ValidatorSpec {
    return {
      ...spec,
      ...typeOptions,
      // options with props can override props of spec
      ...(spec.props
        ? { props: { ...spec.props, ...(typeOptions['props'] || {}) } }
        : {}),
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
            const finalResult = validateNode(
              mark,
              errorCallback,
              marksSet,
              validator,
              true,
            );
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
    const { items } = validator.props!.marks!;
    const marksSet = items.length
      ? Array.isArray(items[0])
        ? items[0]
        : items
      : [];
    return marksSet;
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
      const isUnsupportedNodeAttributeMark =
        mark.type === 'unsupportedNodeAttribute';
      if (isUnsupportedNodeAttributeMark) {
        return mark;
      }
      return unsupportedMarkContent(errorCode, mark, errorCallback);
    });
    if (newMarks.length) {
      newEntity.marks = newMarks;
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
      if (
        !validatorSpec.required.every((prop: string | number) =>
          isDefined(prevEntity[prop]),
        )
      ) {
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
    if (validatorSpec.props!.text) {
      if (
        isDefined(prevEntity.text) &&
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
    if (validatorSpec.props!.content && prevEntity.content) {
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

  function invalidAttributesFor(
    validatorSpec: ValidatorSpec,
    prevEntity: ADFEntity,
  ) {
    let invalidAttrs: Array<string> = [];
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
          [, invalidAttrs] = partitionObject(attrOption.props, (k, v) => {
            return validateAttrs(v, (prevEntity.attrs as any)[k]);
          });
        }
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
    const validatorSpecAllowsAttributes =
      validatorSpec.props && validatorSpec.props.attrs;
    if (prevEntity.attrs) {
      if (!validatorSpecAllowsAttributes) {
        if (isMark) {
          return handleNoAttibutesAllowedInSpecForMark(
            prevEntity,
            prevEntity.attrs,
          );
        }
        const attrs = Object.keys(prevEntity.attrs);
        return handleUnsupportedNodeAttributes(
          prevEntity,
          newEntity,
          [],
          attrs,
          errorCallback,
        );
      }

      const {
        hasUnsupportedAttrs,
        redundantAttrs,
        invalidAttrs,
      } = validateAttributes(validatorSpec, prevEntity, prevEntity.attrs);

      if (hasUnsupportedAttrs) {
        if (isMark) {
          return handleUnsupportedMarkAttributes(
            prevEntity,
            invalidAttrs,
            redundantAttrs,
          );
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
    attributes: { [name: string]: any },
  ) {
    const invalidAttributesResult = invalidAttributesFor(
      validatorSpec,
      prevEntity,
    );
    const { invalidAttrs } = invalidAttributesResult;

    const validatorAttrs = invalidAttributesResult.validatorAttrs;

    const attrs = Object.keys(attributes).filter(
      (k) => !(allowPrivateAttributes && k.startsWith('__')),
    );

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
    const message = errorMessageFor(
      prevEntity.type,
      `'attrs' validation failed`,
    );
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
    const hasBothInvalidAndRedundantAttrs =
      hasRedundantAttrs && invalidAttrs.length;
    if (!hasBothInvalidAndRedundantAttrs && hasRedundantAttrs) {
      errorCode = 'REDUNDANT_ATTRIBUTES';
      message = errorMessageFor(
        'redundant attributes found',
        redundantAttrs.join(', '),
      );
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
    let invalidValues: ADFEntity['attrs'] = {};
    for (let invalidAttr in invalidAttrs) {
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
      unsupportedNodeAttributeValues &&
        finalEntity.marks.push(unsupportedNodeAttributeValues);
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
    let result: NodeValidationResult = { valid: true, entity: prevEntity };
    const [requiredProps, redundantProps] = partitionObject(prevEntity, (k) =>
      isDefined((validatorSpec.props as any)[k]),
    );
    if (redundantProps.length) {
      if (mode === 'loose') {
        newEntity = { type };
        requiredProps.reduce((acc, p) => copy(prevEntity, acc, p), newEntity);
      } else {
        if (
          !(
            (redundantProps.indexOf('marks') > -1 ||
              redundantProps.indexOf('attrs') > -1) &&
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
    typeOptions: Record<string, any>,
    prevEntity: ADFEntity,
    err: Err,
    newEntity: ADFEntity,
    type: string,
    errorCallback: ErrorCallback | undefined,
    isMark: boolean,
  ): SpecValidatorResult {
    let specBasedValidationResult: SpecValidatorResult = {
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
    const textPropertyValidationResult = textPropertyValidationFor(
      validatorSpec,
      prevEntity,
      err,
    );
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
    const [, missingProps] = partitionObject(
      validatorSpec.props,
      (k, v) => v.optional || isDefined(prevEntity[k]),
    );

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
        const validateChildNode = (
          child: ADFEntity | undefined,
          index: any,
        ) => {
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
              const validMarks = marksValidationOutput.filter(
                (mark) => mark.valid,
              );
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
              if (finalMarks.length) {
                childEntity.marks = finalMarks;
              } else {
                delete childEntity.marks;
                marksAreValid = false;
              }
            }
            return { valid: marksAreValid, entity: childEntity };
          };
          const hasMultipleCombinationOfContentAllowed = !!contentValidatorSpec.isTupleLike;
          if (hasMultipleCombinationOfContentAllowed) {
            const {
              entity: newChildEntity,
              marksValidationOutput,
            } = validateNode(
              child,
              errorCallback,
              makeArray(
                contentValidatorSpec.items[index] ||
                  contentValidatorSpec.items[
                    contentValidatorSpec.items.length - 1
                  ],
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
          const allowedSpecsForEntity = contentValidatorSpec.items.filter(
            (item) =>
              Array.isArray(item)
                ? item.some(
                    // [p, hr, ...] or [p, [text, {}], ...]
                    (spec) =>
                      (Array.isArray(spec) ? spec[0] : spec) === child.type,
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
                } = validateNode(
                  child,
                  errorCallback,
                  allowedValueForCurrentSpec,
                  validatorSpec,
                );
                if (valid) {
                  const isLastValidationSpec =
                    i === allowedSpecsForChild.length - 1;
                  const { valid: marksAreValid, entity } = validateChildMarks(
                    newChildEntity,
                    marksValidationOutput,
                    errorCallback,
                    isLastValidationSpec,
                  );
                  const unsupportedMarks =
                    (entity &&
                      entity.marks &&
                      entity.marks.filter(
                        (mark) => mark.type === 'unsupportedMark',
                      )) ||
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
      return {
        hasValidated: true,
        result: marksValidationFor(
          validatorSpec,
          prevEntity,
          errorCallback,
          newEntity,
          err,
        ),
      };
    }
    return specBasedValidationResult;
  }
}
