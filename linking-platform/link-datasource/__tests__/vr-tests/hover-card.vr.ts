import { snapshot } from '@af/visual-regression';

import IssueLikeTable from '../../examples/issue-like-table';

snapshot(IssueLikeTable, {
  description: 'HoverCard',
  states: [
    {
      state: 'hovered',
      selector: { byRole: 'link', options: { name: 'DONUT-11720' } },
    },
  ],
});
