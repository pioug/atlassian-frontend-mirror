import { wb, type WorkbenchExample } from '@atlassian/workbench';

import DropzoneExample from './1-dropzone';
import BrowseExample from './2-browse';
import BrowseWithChildrenExample from './3-browse-with-children';
import ClipboardExample from './4-clipboard';
import WebworkersHellExample from './5-webworkers-hell';
import BrowseFedRAMPExample from './browse-FedRAMP';

export const Dropzone: WorkbenchExample = wb(DropzoneExample);
export const Browse: WorkbenchExample = wb(BrowseExample);
export const BrowseWithChildren: WorkbenchExample = wb(BrowseWithChildrenExample);
export const Clipboard: WorkbenchExample = wb(ClipboardExample);
export const WebworkersHell: WorkbenchExample = wb(WebworkersHellExample);
export const BrowseFedRAMP: WorkbenchExample = wb(BrowseFedRAMPExample);
