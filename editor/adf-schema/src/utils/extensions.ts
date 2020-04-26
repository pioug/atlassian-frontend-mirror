import { ExtensionAttributes, Layout } from '../schema/nodes/types/extensions';
import { uuid } from './uuid';

export const isValidLayout = (name: string | null): name is Layout => {
  return !!name && ['default', 'wide', 'full-width'].includes(name);
};

export const getExtensionAttrs = (
  dom: HTMLElement,
  allowLocalId: boolean,
  isInline: boolean = false,
): ExtensionAttributes | false => {
  const extensionType = dom.getAttribute('data-extension-type');
  const extensionKey = dom.getAttribute('data-extension-key');

  if (!extensionType || !extensionKey) {
    return false;
  }

  const attrs: ExtensionAttributes = {
    extensionType,
    extensionKey,
    text: dom.getAttribute('data-text') || undefined,
    parameters: JSON.parse(dom.getAttribute('data-parameters') || '{}'),
  };

  if (!isInline) {
    const rawLayout = dom.getAttribute('data-layout');
    attrs.layout = isValidLayout(rawLayout) ? rawLayout : 'default';
  }

  if (allowLocalId) {
    attrs.localId = uuid.generate();
  }

  return attrs;
};
