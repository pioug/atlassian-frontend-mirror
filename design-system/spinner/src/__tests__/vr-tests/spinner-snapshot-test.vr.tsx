// eslint-disable-next-line import/no-extraneous-dependencies
import { snapshot } from '@af/visual-regression';

import VrBasic from '../../../examples/vr-basic';
import VrSizes from '../../../examples/vr-sizes';
import VrTableCellAlignment from '../../../examples/vr-table-cell-alignment';
import VrTextAlignment from '../../../examples/vr-text-alignment';

snapshot(VrBasic);
snapshot(VrSizes);
snapshot(VrTextAlignment);
snapshot(VrTableCellAlignment);
