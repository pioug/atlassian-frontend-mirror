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

export const BasicExample: WorkbenchExample = wb(BasicExampleSource);
export const SingleFilePreviews: WorkbenchExample = wb(SingleFilePreviewsExample);
export const MultiFilePreviews: WorkbenchExample = wb(MultiFilePreviewsExample);
export const VrPasswordProtectedPdf: WorkbenchExample = wb(VrPasswordProtectedPdfExample);
export const MultiFilePreviewsWithMediaClientToggle: WorkbenchExample = wb(
	MultiFilePreviewsWithMediaClientToggleExample,
);
export const Svg: WorkbenchExample = wb(SvgExample);
export const CustomViewer: WorkbenchExample = wb(CustomViewerExample);
export const LayerStacking: WorkbenchExample = wb(LayerStackingExample);
export const VrMockedViewer: WorkbenchExample = wb(VrMockedViewerExample);
export const Sidebar: WorkbenchExample = wb(SidebarExample);
export const VrEmptyFile: WorkbenchExample = wb(VrEmptyFileExample);
export const VrArchiveSideBar: WorkbenchExample = wb(VrArchiveSideBarExample);
