import {
  CustomFieldResolver,
  Deserializer,
  ExtensionManifest,
  ExtensionModuleFields,
  Serializer,
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
      `No definition of fields for extension type "${manifest.type}" and key "${manifest.key}"!`,
    );
  }

  if (!manifest.modules.fields[fieldType]) {
    throw new Error(
      `No definition for field type "${fieldType}" on manifest for extension with type "${manifest.type}" and key "${manifest.key}"!`,
    );
  }

  const { type } = handlerLink;
  const handler = manifest.modules.fields[fieldType]![type];

  if (!handler) {
    throw new Error(
      `No handler of type "${type}" for extension type "${manifest.type}" and key "${manifest.key}"!`,
    );
  }

  return handler as Exclude<ExtensionModuleFields[K], undefined>[string];
}

export async function getCustomFieldResolver(
  manifest: ExtensionManifest,
  handlerLink: FieldHandlerLink,
): Promise<CustomFieldResolver | undefined> {
  const handler = await getExtensionModuleField(
    manifest,
    'custom',
    handlerLink,
  );
  return handler.resolver;
}

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
