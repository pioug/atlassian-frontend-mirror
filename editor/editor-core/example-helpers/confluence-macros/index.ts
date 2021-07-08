import {
  DefaultExtensionProvider,
  ExtensionManifest,
  ExtensionModule,
  FieldDefinition,
  EnumField,
  CustomField,
  Fieldset,
  ExtensionModuleNode,
  ExtensionModuleAction,
  NestedFieldDefinition,
  Parameters,
} from '@atlaskit/editor-common/extensions';

import { mockFieldResolver } from '../config-panel/confluence-fields-data-providers';

import { cqlSerializer, cqlDeserializer } from '../config-panel/cql-helpers';
import { setSmartUserPickerEnv } from '@atlaskit/user-picker';

import { getIconComponent } from './IconImage';
import EditorActions from '../../src/actions';
import { editSelectedExtension } from '../../src/extensions';

const isNativeFieldType = (fieldType: string) => {
  return /^(enum|string|number|boolean|date)$/.test(fieldType);
};

const getMacrosManifestList = async (editorActions?: EditorActions) => {
  const response = await fetch('./editor-data/browse-macros.json');
  const data = await response.json();

  return data.macros.map((macro: LegacyMacroManifest) =>
    transformLegacyMacrosToExtensionManifest(macro, editorActions),
  );
};

type ButtonConfig = { action: null; label: string; key: string };

type LegacyMacroManifest = {
  aliases: string[];
  buttons: ButtonConfig[];
  hidden: boolean;
  anyParameterRequired?: boolean;
  icon: {
    width: number;
    location: string;
    height: number;
    relative: boolean;
  };
  description: string;
  pluginKey: string;
  autoconvertData: any;
  title: string;
  bodyDeprecated: boolean;
  alternateId: null;
  macroName: string;
  gadgetUrl?: null;
  categories: string[];
  defaultLayout: null;
  alwaysShowConfig?: boolean;
  formDetails: {
    macroName: string;
    documentationUrl: string | null;
    schemaVersion: number;
    freeform: boolean;
    notationHelp: any;
    excludedSchemaMigrationPoints: never[];
    showDefaultParamInPlaceholder: boolean;
    documentationLink: any;
    body: {
      bodyType: string;
      hidden: boolean;
      description: string;
      outputType: string;
      label: string;
    };
    parameters: LegacyParameter[];
  };
};

type LegacyParameter = {
  aliases: string[];
  hidden: boolean;
  defaultValue: string | null;
  displayName: string;
  multiple: boolean;
  description: string;
  pluginKey: string;
  type: { name: string };
  required: false;
  macroName: string;
  name: string;
  options: { includeDatePath: string; derived: string };
  enumValues: null;
};

const safeGetMacroName = (macro: LegacyMacroManifest) =>
  macro.alternateId || macro.macroName;

const getIcon = (macro: LegacyMacroManifest) => {
  if (macro.icon && macro.icon.location) {
    return Promise.resolve(() => getIconComponent(macro.icon.location));
  }

  return import(
    /* webpackChunkName: "@atlaskit-internal_editor-icon-code" */ '@atlaskit/icon/glyph/editor/code'
  ).then((mod) => mod.default);
};

const buildIconObject = (macro: LegacyMacroManifest) => {
  return {
    '48': () => getIcon(macro),
  };
};

const extensionType = 'com.atlassian.confluence.macro.core';

const getExtensionBodyType = (macro: LegacyMacroManifest) => {
  const { bodyType, outputType } = macro.formDetails.body;

  if (bodyType !== 'NONE') {
    return 'bodiedExtension';
  }

  if (outputType === 'INLINE') {
    return 'inlineExtension';
  }

  return 'extension';
};

const transformLegacyMacrosToExtensionManifest = (
  macro: LegacyMacroManifest,
  editorActions?: EditorActions,
): ExtensionManifest => {
  const extensionKey = safeGetMacroName(macro);

  const hasAnyMissingParameterRequired = macro.formDetails.parameters.some(
    (param) => param.required && param.defaultValue === null,
  );

  const defaultParameters = macro.formDetails.parameters
    .filter((param) => param.defaultValue)
    .reduce<Parameters>((curr, next) => {
      if (next.defaultValue !== null) {
        curr[next.name] = next.defaultValue;
      }

      return curr;
    }, {});

  const actionForMacrosWithRequiredParams = async () => {
    const node = await Promise.resolve({
      type: getExtensionBodyType(macro),
      attrs: {
        extensionType,
        extensionKey,
        parameters: {
          macroParams: defaultParameters,
        },
        text: `Fallback text for ${extensionKey}...`,
      },
    });

    if (!editorActions) {
      throw new Error(
        `editorActions not found, this quick insert action won't work. Tip: the 'extensionProviders' prop can also take a function where 'editorActions' is the first argument`,
      );
    }

    editorActions.replaceSelection(node, true);
    editSelectedExtension(editorActions);
  };

  const asyncAction = () =>
    Promise.resolve({
      type: getExtensionBodyType(macro),
      attrs: {
        extensionType,
        extensionKey,
        text: 'Hello inlineExtension!',
        parameters: {
          macroParams: defaultParameters,
        },
      },
    });

  const genericAction = {
    type: 'node' as const,
    key: 'default',
    parameters: {
      macroParams: defaultParameters,
    },
  };

  let action: ExtensionModuleAction = genericAction;

  if (
    hasAnyMissingParameterRequired ||
    macro.anyParameterRequired ||
    macro.alwaysShowConfig
  ) {
    action = actionForMacrosWithRequiredParams;
  }

  if (macro.alternateId === 'gadget-c49820865b7a9ce52c5d4fd43cf5709a') {
    action = asyncAction;
  }

  const featuredList = [
    'viewxls',
    'pagetree',
    'livesearch',
    'data-driven-roadmap',
    'macro',
  ];

  // hidden macros can still exist so they can be rendered but shouldn't appear in any menu
  const quickInsert: ExtensionModule[] = macro.hidden
    ? []
    : [
        {
          key: 'default',
          title: macro.title,
          description: macro.description,
          featured: featuredList.includes(macro.macroName),
          keywords: [...macro.aliases, macro.macroName],
          categories: macro.categories || [],
          icon: () => getIcon(macro),
          action,
        },
      ];

  const nodes = {
    default: {
      type: getExtensionBodyType(macro),
      render: () =>
        import(
          /* webpackChunkName: "@atlaskit-internal_editor-example-macro-component" */
          './MacroComponent'
        ).then((mod) => mod.default),
    } as ExtensionModuleNode,
  };

  const getVisibleParameters = (macro: LegacyMacroManifest) =>
    (macro.formDetails &&
      (macro.formDetails.parameters || []).filter(
        (parameter: LegacyParameter) => !parameter.hidden,
      )) ||
    [];

  // The existence of the update method defines the visibility of the edit button.
  // We only create the update method if the node has at least 1 visible parameter
  if (getVisibleParameters(macro).length > 0) {
    nodes.default.update = (data, actions) => {
      // The adf parameters for macros look like:
      // {
      //    macroParams: {
      //        q: 1,
      //        search: 'my keyword'
      //    },
      //    macroMetadata: {
      //      title: 'my extension',
      //      icon: 'path/to/the/icon.png'
      //    }
      // }
      // The only editable bit is what is inside the `macroParams`. This method unwraps the params and pass it to
      // the context panel for editing, and then wraps it back after saving.
      return new Promise(() => {
        actions!.editInContextPanel(
          (parameters) => parameters.macroParams,
          (parameters) => Promise.resolve({ macroParams: parameters }),
        );
      });
    };

    nodes.default.getFieldsDefinition = () =>
      new Promise((resolve) => {
        setTimeout(
          () =>
            resolve(
              macro.formDetails.parameters.map((params) =>
                transformFormDetailsIntoFields(params, {
                  pluginKey: macro.pluginKey,
                  macroName: safeGetMacroName(macro),
                }),
              ),
            ),
          2000,
        );
      });
  }

  return {
    type: extensionType,
    key: extensionKey,
    title: macro.title,
    description: macro.description,
    summary:
      macro.macroName === 'toc-zone' ? 'summary for toc zone' : undefined,
    icons: buildIconObject(macro),
    documentationUrl: macro.formDetails.documentationUrl || undefined,
    modules: {
      quickInsert,
      autoConvert: {
        url: [
          (text) => {
            if (text.startsWith(`http://${extensionKey}-convert`)) {
              return {
                type: 'extension',
                attrs: {
                  extensionType,
                  extensionKey,
                  parameters: {
                    macroParams: {
                      url: text,
                    },
                  },
                  layout: 'default',
                },
              };
            }
          },
        ],
      },
      nodes,
      fields: {
        custom: {
          'mock-resolver': {
            resolver: mockFieldResolver,
          },
        },
        fieldset: {
          cql: {
            serializer: cqlSerializer,
            deserializer: cqlDeserializer,
          },
        },
        user: {
          'user-jdog-provider': {
            provider: async () => {
              // WARNING: this is required by the SmartUserPicker for testing environments
              setSmartUserPickerEnv('local');

              return {
                siteId: '49d8b9d6-ee7d-4931-a0ca-7fcae7d1c3b5',
                principalId: 'Context',
                fieldId: 'storybook',
                productKey: 'jira',
              };
            },
          },
        },
      },
    },
  };
};

type MacroData = {
  pluginKey: string;
  macroName: string;
};

/**
 * Confluence returns a namespace inside description and label when the field is empty.
 * To map it to the new extension api, we need to remove it or replace it depending on the case.
 *
 * The original code can be found at https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence/browse/confluence-plugins/confluence-editor-plugins/confluence-macro-browser/src/main/resources/js/macro-browser-editor.js#441
 * @param value
 * @param fallback
 * @param params
 * @param macroData
 * @param fieldType
 */
const safeGetBodyValue = (
  value: string,
  fallback: string,
  params: LegacyParameter,
  macroData: MacroData,
  fieldType: 'label' | 'desc',
) => {
  const { pluginKey, macroName } = macroData;
  if (
    value === [pluginKey, macroName, 'param', params.name, fieldType].join('.')
  ) {
    return fallback;
  }

  return value;
};

const getBaseAttributes = (params: LegacyParameter, macroData: MacroData) => {
  const { displayName, name, description } = params;

  return {
    label: safeGetBodyValue(displayName, name, params, macroData, 'label'),
    name: params.name || 'defaultParameterValue',
    defaultValue: params.defaultValue as any,
    description: safeGetBodyValue(description, '', params, macroData, 'desc'),
    isMultiple: params.multiple,
    isRequired: params.required,
    isHidden: params.hidden,
  };
};

const cqlFields: NestedFieldDefinition[] = [
  {
    type: 'string',
    name: 'text',
    label: 'Including text',
    isRequired: true,
    allowDuplicates: true,
  },
  {
    type: 'custom',
    name: 'label',
    label: 'Label',
    isMultiple: true,
    options: {
      resolver: {
        type: 'label',
      },
    },
  },
  {
    type: 'custom',
    name: 'contributor',
    label: 'Contributor',
    isMultiple: true,
    options: {
      resolver: {
        type: 'username',
      },
    },
  },
  {
    type: 'custom',
    name: 'creator',
    label: 'Creator',
    isMultiple: true,
    options: {
      resolver: {
        type: 'username',
      },
    },
  },
  {
    type: 'custom',
    name: 'mentioning',
    label: 'Mentioning',
    isMultiple: true,
    options: {
      resolver: {
        type: 'username',
      },
    },
  },
  {
    type: 'custom',
    name: 'with parent',
    label: 'With parent',
    options: {
      resolver: {
        type: 'confluence-content',
      },
    },
  },
  {
    type: 'custom',
    name: 'with ancestor',
    label: 'With ancestor',
    isMultiple: true,
    options: {
      resolver: {
        type: 'confluence-content',
      },
    },
  },
  {
    type: 'custom',
    name: 'in space',
    label: 'In space',
    isMultiple: true,
    options: {
      resolver: {
        type: 'spacekey',
      },
    },
  },
  {
    type: 'enum',
    name: 'created',
    label: 'Created',
    style: 'radio',
    isRequired: true,
    defaultValue: 'any date',
    items: [
      {
        label: 'Any date',
        value: 'any date',
      },
      {
        label: 'Last 24 hours',
        value: 'last 24 hours',
      },
      {
        label: 'Last week',
        value: 'last week',
      },
      {
        label: 'Last month',
        value: 'last month',
      },
      {
        label: 'Last year',
        value: 'last year',
      },
    ],
  },
];

const transformFormDetailsIntoFields = (
  params: LegacyParameter,
  macroData: MacroData,
): FieldDefinition => {
  const fieldType = transformFieldType(params.type.name);
  const baseAttributes = getBaseAttributes(params, macroData);

  if (fieldType === 'custom') {
    const customField: CustomField = {
      ...baseAttributes,
      type: 'custom',
      options: {
        resolver: {
          type: params.type.name,
        },
      },
    };

    return customField;
  }

  if (params.type.name === 'cql') {
    const cqlField: Fieldset = {
      label: safeGetBodyValue(
        params.displayName,
        params.name,
        params,
        macroData,
        'label',
      ),
      name: params.name || 'defaultParameterValue',
      type: 'fieldset',
      fields: cqlFields,
      options: {
        isDynamic: true,
        transformer: {
          type: params.type.name,
        },
      },
    };

    return cqlField;
  }

  if (fieldType === 'enum') {
    const enumField: EnumField = {
      ...baseAttributes,
      type: 'enum',
      style: 'select',
      items: (params.enumValues || []).map((item) => ({
        label: item,
        value: item,
      })),
    };

    return enumField;
  }

  const field: Exclude<FieldDefinition, CustomField> = {
    ...baseAttributes,
    type: transformFieldType(params.type.name) as any,
  };

  return field;
};

enum MappedFieldTypes {
  int = 'number',
  percentage = 'string',
  url = 'string',
  cql = 'dynamic-fieldset',
}

const isMappedField = (
  fieldType: string,
): fieldType is keyof typeof MappedFieldTypes => fieldType in MappedFieldTypes;

const transformFieldType = (
  fieldType: keyof typeof MappedFieldTypes | string,
) => {
  if (isMappedField(fieldType)) {
    return MappedFieldTypes[fieldType];
  }

  if (isNativeFieldType(fieldType)) {
    return fieldType;
  }

  return 'custom';
};

export const getConfluenceMacrosExtensionProvider = async (
  editorActions?: EditorActions,
) => {
  const manifests = await getMacrosManifestList(editorActions);
  return new DefaultExtensionProvider(manifests);
};
