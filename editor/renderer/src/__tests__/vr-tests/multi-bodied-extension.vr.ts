import { snapshot } from '@af/visual-regression';
import { MultiBodiedExtensionRenderer } from './multi-bodied-extension.fixture';
import {
	MultiBodiedExtensionExtRenderer,
	MultiBodiedExtensionExtRendererFullPage,
	MultiBodiedExtensionExtRendererFullPageFullWidth,
	MultiBodiedExtensionExtRendererFullPageWideMode,
} from './multi-bodied-extension-ext.fixture';

snapshot(MultiBodiedExtensionRenderer, {
	drawsOutsideBounds: true,
});

snapshot(MultiBodiedExtensionExtRenderer, {
	drawsOutsideBounds: true,
});

snapshot(MultiBodiedExtensionExtRendererFullPage, {
	drawsOutsideBounds: true,
});

snapshot(MultiBodiedExtensionExtRendererFullPageWideMode, {
	drawsOutsideBounds: true,
});

snapshot(MultiBodiedExtensionExtRendererFullPageFullWidth, {
	drawsOutsideBounds: true,
});
