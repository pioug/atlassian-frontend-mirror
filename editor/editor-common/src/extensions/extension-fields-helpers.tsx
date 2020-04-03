import {
  FieldResolver,
  Serializer,
  Deserializer,
  ExtensionManifest,
  ExtensionModuleFieldTypeCustom,
  ExtensionModuleFieldTypeFieldset,
} from './types/extension-manifest';

import { FieldHandlerLink } from './types/field-definitions';

const assertFieldHandlerLink = (handlerLink: FieldHandlerLink) => {
  if (!handlerLink.type) {
    throw new Error(`Missing type!`);
  }
};

const assertManifestFieldTypes = (
  manifest: ExtensionManifest,
  fieldType: 'custom' | 'fieldset',
) => {
  if (!manifest.modules.fields) {
    throw new Error(
      `No definition of fields for extension type "${manifest.type}" and key "${manifest.key}"!`,
    );
  }

  if (!manifest.modules.fields[fieldType]) {
    throw new Error(
      `No definition for field type "${fieldType}" on manifest for extension with type "${manifest.type}" and key "${manifest.key}"!`,
    );
  }
};

async function getExtensionModuleField<T>(
  manifest: ExtensionManifest,
  fieldType: 'custom' | 'fieldset',
  handlerLink: FieldHandlerLink,
): Promise<T> {
  assertFieldHandlerLink(handlerLink);
  assertManifestFieldTypes(manifest, fieldType);

  const { type } = handlerLink;
  const handler = manifest.modules.fields![fieldType]![type];

  if (!handler) {
    throw new Error(
      `No handler of type "${type}" for extension type "${manifest.type}" and key "${manifest.key}"!`,
    );
  }

  return handler as T;
}

export async function getFieldResolver(
  manifest: ExtensionManifest,
  handlerLink: FieldHandlerLink,
): Promise<FieldResolver | undefined> {
  const customFieldHandler = await getExtensionModuleField<
    ExtensionModuleFieldTypeCustom
  >(manifest, 'custom', handlerLink);
  return customFieldHandler.resolver;
}

export async function getFieldSerializer(
  manifest: ExtensionManifest,
  handlerLink: FieldHandlerLink,
): Promise<Serializer | undefined> {
  const fieldsetHandler = await getExtensionModuleField<
    ExtensionModuleFieldTypeFieldset
  >(manifest, 'fieldset', handlerLink);
  return fieldsetHandler.serializer;
}

export async function getFieldDeserializer(
  manifest: ExtensionManifest,
  handlerLink: FieldHandlerLink,
): Promise<Deserializer | undefined> {
  const fieldsetHandler = await getExtensionModuleField<
    ExtensionModuleFieldTypeFieldset
  >(manifest, 'fieldset', handlerLink);
  return fieldsetHandler.deserializer;
}
