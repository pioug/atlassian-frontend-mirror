import { wb, type WorkbenchExample } from '@atlassian/workbench';

import BasicExample from '../0-basic';
import ResizingBoxExample from '../1-resizing-box';
import OnResizeExample from '../2-on-resize';
import ScrollingExample from '../3-scrolling';
import OnResizeWidthObserverExample from '../4-on-resize-width-observer';
import ResizingBoxWidthObserverExample from '../5-resizing-box-width-observer';

export const Basic: WorkbenchExample<typeof BasicExample> = wb(BasicExample);

export const ResizingBox: WorkbenchExample<typeof ResizingBoxExample> = wb(ResizingBoxExample);
export const OnResize: WorkbenchExample<typeof OnResizeExample> = wb(OnResizeExample);
export const Scrolling: WorkbenchExample<typeof ScrollingExample> = wb(ScrollingExample);
export const OnResizeWidthObserver: WorkbenchExample<typeof OnResizeWidthObserverExample> = wb(
	OnResizeWidthObserverExample,
);
export const ResizingBoxWidthObserver: WorkbenchExample<typeof ResizingBoxWidthObserverExample> =
	wb(ResizingBoxWidthObserverExample);
