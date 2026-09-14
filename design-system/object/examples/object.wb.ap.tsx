import { wb, type WorkbenchExample } from '@atlassian/workbench';

import ObjectTileVrExample from './object-tile.vr.ap';
import ObjectVrExample from './object.vr.ap';

const ObjectTileVr: WorkbenchExample = wb(ObjectTileVrExample);

export default ObjectTileVr;
export const ObjectVr: WorkbenchExample = wb(ObjectVrExample);
