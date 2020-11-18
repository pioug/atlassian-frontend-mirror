import {
  CustomFieldResolver,
  Deserializer,
  ExtensionManifest,
  ExtensionModuleFields,
  Serializer,
  UserFieldContextProvider,
} from './types/extension-manifest';
import { FieldHandlerLink } from './types/field-definitions';

async function getExtensionModuleField<K extends keyof ExtensionModuleFields>(
  manifest: ExtensionManifest,
  fieldType: K,
  handlerLink: FieldHandlerLink,
) {
  if (!handlerLink.type) {
    throw new Error(`Missing type!`);
  }

  if (!manifest.modules.fields) {
    throw new Error(
      `No definition of fields for extension type "${manifest.type}" and key "${manifest.key}"`,
    );
  }

  if (!manifest.modules.fields[fieldType]) {
    throw new Error(
      `No definition for field type "${fieldType}" on manifest for extension with type "${manifest.type}" and key "${manifest.key}"`,
    );
  }

  const { type } = handlerLink;
  const handler = manifest.modules.fields[fieldType]![type];

  if (!handler) {
    throw new Error(
      `No handler of type "${type}" for extension type "${manifest.type}" and key "${manifest.key}"`,
    );
  }

  return handler as Exclude<ExtensionModuleFields[K], undefined>[string];
}

/** attempt to get the custom resolver for this field, or throw */
export async function getCustomFieldResolver(
  manifest: ExtensionManifest,
  handlerLink: FieldHandlerLink,
): Promise<CustomFieldResolver> {
  const handler = await getExtensionModuleField(
    manifest,
    'custom',
    handlerLink,
  );
  return handler.resolver;
}

/** attempt to get the serializer for this field, or throw */
export async function getFieldSerializer(
  manifest: ExtensionManifest,
  handlerLink: FieldHandlerLink,
): Promise<Serializer | undefined> {
  const handler = await getExtensionModuleField(
    manifest,
    'fieldset',
    handlerLink,
  );
  return handler.serializer;
}

/** attempt to get the deserializer for this field, or throw */
export async function getFieldDeserializer(
  manifest: ExtensionManifest,
  handlerLink: FieldHandlerLink,
): Promise<Deserializer | undefined> {
  const handler = await getExtensionModuleField(
    manifest,
    'fieldset',
    handlerLink,
  );
  return handler.deserializer;
}

/** attempt to get the user field context provider for this field, or throw */
export async function getUserFieldContextProvider(
  manifest: ExtensionManifest,
  handlerLink: FieldHandlerLink,
): Promise<UserFieldContextProvider> {
  const handler = await getExtensionModuleField(manifest, 'user', handlerLink);
  return handler.provider;
}
