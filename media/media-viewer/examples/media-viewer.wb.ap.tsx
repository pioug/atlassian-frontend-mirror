import { wb, type WorkbenchExample } from '@atlassian/workbench';

import BasicExampleSource from './0-basic-example';
import SingleFilePreviewsExample from './0-single-file-previews';
import MultiFilePreviewsExample from './1-multi-file-previews';
import LayerStackingExample from './2-layer-stacking';
import VrMockedViewerExample from './5-vr-mocked-viewer';
import SidebarExample from './6-sidebar';
import VrEmptyFileExample from './7-vr-empty-file';
import VrArchiveSideBarExample from './8-vr-archive-side-bar';
import VrPasswordProtectedPdfExample from './11-vr-password-protected-pdf';
import MultiFilePreviewsWithMediaClientToggleExample from './12-multi-file-previews-with-media-client-toggle';
import SvgExample from './13-svg';
import CustomViewerExample from './15-custom-viewer';

export const BasicExample: WorkbenchExample<typeof BasicExampleSource> = wb(BasicExampleSource);
export const SingleFilePreviews: WorkbenchExample<typeof SingleFilePreviewsExample> =
	wb(SingleFilePreviewsExample);
export const MultiFilePreviews: WorkbenchExample<typeof MultiFilePreviewsExample> =
	wb(MultiFilePreviewsExample);
export const VrPasswordProtectedPdf: WorkbenchExample<typeof VrPasswordProtectedPdfExample> = wb(
	VrPasswordProtectedPdfExample,
);
export const MultiFilePreviewsWithMediaClientToggle: WorkbenchExample<
	typeof MultiFilePreviewsWithMediaClientToggleExample
> = wb(MultiFilePreviewsWithMediaClientToggleExample);
export const Svg: WorkbenchExample<typeof SvgExample> = wb(SvgExample);
export const CustomViewer: WorkbenchExample<typeof CustomViewerExample> = wb(CustomViewerExample);
export const LayerStacking: WorkbenchExample<typeof LayerStackingExample> =
	wb(LayerStackingExample);
export const VrMockedViewer: WorkbenchExample<typeof VrMockedViewerExample> =
	wb(VrMockedViewerExample);
export const Sidebar: WorkbenchExample<typeof SidebarExample> = wb(SidebarExample);
export const VrEmptyFile: WorkbenchExample<typeof VrEmptyFileExample> = wb(VrEmptyFileExample);
export const VrArchiveSideBar: WorkbenchExample<typeof VrArchiveSideBarExample> =
	wb(VrArchiveSideBarExample);
