import { snapshot } from '@af/visual-regression';
import { MultiBodiedExtensionRenderer,
	MultiBodiedExtensionRendererFullPage,
	MultiBodiedExtensionRendererFullPageFullWidth,
	MultiBodiedExtensionRendererFullPageWideMode
 } from './multi-bodied-extension.fixture';

snapshot(MultiBodiedExtensionRenderer, {
	drawsOutsideBounds: true,
});

snapshot(MultiBodiedExtensionRendererFullPage, {
	drawsOutsideBounds: true,
});

snapshot(MultiBodiedExtensionRendererFullPageWideMode, {
	drawsOutsideBounds: true,
});

snapshot(MultiBodiedExtensionRendererFullPageFullWidth, {
	drawsOutsideBounds: true,
});
