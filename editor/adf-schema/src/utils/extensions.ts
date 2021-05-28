import { ExtensionAttributes, Layout } from '../schema/nodes/types/extensions';

export const isValidLayout = (name: string | null): name is Layout => {
  return !!name && ['default', 'wide', 'full-width'].includes(name);
};

export const getExtensionAttrs = (
  dom: HTMLElement,
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
    localId: dom.getAttribute('data-local-id') || undefined,
  };

  if (!isInline) {
    const rawLayout = dom.getAttribute('data-layout');
    attrs.layout = isValidLayout(rawLayout) ? rawLayout : 'default';
  }

  return attrs;
};
