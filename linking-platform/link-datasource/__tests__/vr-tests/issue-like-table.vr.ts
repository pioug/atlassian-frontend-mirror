import { snapshot } from '@af/visual-regression';

import IssueLikeTable from '../../examples/issue-like-table';
import IssueLikeTableReadonly from '../../examples/vr/issue-like-table-readonly';

snapshot(IssueLikeTable, {
  description: 'Issue Like Table',
  drawsOutsideBounds: true,
});

snapshot(IssueLikeTableReadonly, {
  description: 'Readonly Issue Like Table',
  drawsOutsideBounds: true,
});
