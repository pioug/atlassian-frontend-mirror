import { wb, type WorkbenchExample } from '@atlassian/workbench';

import BasicExample from './0-basic';
import ResizingBoxExample from './1-resizing-box';
import OnResizeExample from './2-on-resize';
import ScrollingExample from './3-scrolling';
import OnResizeWidthObserverExample from './4-on-resize-width-observer';
import ResizingBoxWidthObserverExample from './5-resizing-box-width-observer';

const Basic: WorkbenchExample = wb(BasicExample);

export default Basic;
export const ResizingBox: WorkbenchExample = wb(ResizingBoxExample);
export const OnResize: WorkbenchExample = wb(OnResizeExample);
export const Scrolling: WorkbenchExample = wb(ScrollingExample);
export const OnResizeWidthObserver: WorkbenchExample = wb(OnResizeWidthObserverExample);
export const ResizingBoxWidthObserver: WorkbenchExample = wb(ResizingBoxWidthObserverExample);
