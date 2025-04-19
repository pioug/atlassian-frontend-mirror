import { snapshot } from '@af/visual-regression';
import { MultiBodiedExtensionRenderer } from './multi-bodied-extension.fixture';
import { MultiBodiedExtensionExtRenderer } from './multi-bodied-extension-ext.fixture';

snapshot(MultiBodiedExtensionRenderer, {
	drawsOutsideBounds: true,
});

snapshot(MultiBodiedExtensionExtRenderer, {
	drawsOutsideBounds: true,
});
