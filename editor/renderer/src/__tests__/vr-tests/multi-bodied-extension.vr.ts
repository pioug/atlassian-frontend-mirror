import { snapshot } from '@af/visual-regression';
import { MultiBodiedExtensionRenderer } from './multi-bodied-extension.fixture';

snapshot(MultiBodiedExtensionRenderer, {
  featureFlags: { 'platform.editor.multi-bodied-extension_0rygg': true },
});
