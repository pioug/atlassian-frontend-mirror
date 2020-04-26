import {
  DefaultExtensionProvider,
  ExtensionManifest,
  ExtensionModule,
} from '@atlaskit/editor-common';

import {
  FieldDefinition,
  EnumField,
  CustomField,
  Fieldset,
  ExtensionModuleNode,
} from '@atlaskit/editor-common/extensions';

import {
  spaceKeyFieldResolver,
  usernameFieldResolver,
  labelFieldResolver,
  confluenceContentFieldResolver,
} from '../config-panel/confluence-fields-data-providers';

import { cqlSerializer, cqlDeserializer } from '../config-panel/cql-helpers';

import mainResponse from './browse-macros.json';
import { getIconComponent } from './IconImage';

const isNativeFieldType = (fieldType: string) => {
  return /^(enum|string|number|boolean|date)$/.test(fieldType);
};

const getMacrosManifestList = () => {
  return mainResponse.macros.map((macro: LegacyMacroManifest) =>
    transformLegacyMacrosToExtensionManifest(macro),
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

  return import('@atlaskit/icon/glyph/editor/code');
};

const buildIconObject = (macro: LegacyMacroManifest) => {
  return {
    '48': () => getIcon(macro),
  };
};

const transformLegacyMacrosToExtensionManifest = (
  macro: LegacyMacroManifest,
): ExtensionManifest => {
  const extensionKey = safeGetMacroName(macro);

  // hidden macros can still exist so they can be rendered but shouldn't appear in any menu
  const quickInsert: ExtensionModule[] = macro.hidden
    ? []
    : [
        {
          key: 'default',
          title: macro.title,
          description: macro.description,
          icon: () => getIcon(macro),
          action: {
            type: 'node',
            key: 'default',
            parameters: {},
          },
        },
      ];

  const nodes = {
    default: {
      type: 'extension',
      render: () =>
        import(
          /* webpackChunkName:"@atlaskit-internal-editor-example-macro-component" */
          './MacroComponent'
        ),
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
          parameters => parameters.macroParams,
          parameters => Promise.resolve({ macroParams: parameters }),
        );
      });
    };

    nodes.default.getFieldsDefinition = () =>
      Promise.resolve(
        macro.formDetails.parameters.map(params =>
          transformFormDetailsIntoFields(params, {
            pluginKey: macro.pluginKey,
            macroName: safeGetMacroName(macro),
          }),
        ),
      );
  }

  return {
    type: 'com.atlassian.confluence.macro.core',
    key: extensionKey,
    title: macro.title,
    description: macro.description,
    icons: buildIconObject(macro),
    modules: {
      quickInsert,
      nodes,
      fields: {
        custom: {
          spacekey: {
            resolver: spaceKeyFieldResolver,
          },
          username: {
            resolver: usernameFieldResolver,
          },
          label: {
            resolver: labelFieldResolver,
          },
          'confluence-content': {
            resolver: confluenceContentFieldResolver,
          },
        },
        fieldset: {
          cql: {
            serializer: cqlSerializer,
            deserializer: cqlDeserializer,
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

const cqlFields: FieldDefinition[] = [
  {
    type: 'string',
    name: 'text',
    label: 'Including text',
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
    name: 'created',
    label: 'Created',
    type: 'enum',
    style: 'radio',
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
      fields: cqlFields,
      type: 'fieldset',
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
      items: (params.enumValues || []).map(item => ({
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

export const getConfluenceMacrosExtensionProvider = () => {
  const manifests = getMacrosManifestList();
  return new DefaultExtensionProvider(manifests);
};
