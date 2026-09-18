import { wb, type WorkbenchExample } from '@atlassian/workbench';

import Xpc3pNotWrappedExample from './xpc-3p-not-wrapped';
import XpcAllSurfacesExample from './xpc-all-surfaces';
import XpcAlreadyWrappedExample from './xpc-already-wrapped';
import XpcBlock1pExample from './xpc-block-1p';
import XpcEmbed1pExample from './xpc-embed-1p';
import XpcHoverCard1pExample from './xpc-hover-card-1p';
import XpcInline1pExample from './xpc-inline-1p';
import XpcNoProductNotWrappedExample from './xpc-no-product-not-wrapped';

export const Xpc3pNotWrapped: WorkbenchExample = wb(Xpc3pNotWrappedExample);
export const XpcAllSurfaces: WorkbenchExample = wb(XpcAllSurfacesExample);
export const XpcAlreadyWrapped: WorkbenchExample = wb(XpcAlreadyWrappedExample);
export const XpcBlock1p: WorkbenchExample = wb(XpcBlock1pExample);
export const XpcEmbed1p: WorkbenchExample = wb(XpcEmbed1pExample);
export const XpcHoverCard1p: WorkbenchExample = wb(XpcHoverCard1pExample);
export const XpcInline1p: WorkbenchExample = wb(XpcInline1pExample);
export const XpcNoProductNotWrapped: WorkbenchExample = wb(XpcNoProductNotWrappedExample);
