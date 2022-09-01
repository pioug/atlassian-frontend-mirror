import { clickOnDate } from '../../../../__tests__/__helpers/page-objects/_date';
import { runEscapeKeydownSuite } from '../../../../__tests__/integration/escape-keydown/__helpers';

const adf = {
  version: 1,
  type: 'doc',
  content: [
    {
      type: 'paragraph',
      content: [
        {
          type: 'date',
          attrs: {
            timestamp: '1658102400000',
          },
        },
        {
          type: 'text',
          text: '  ',
        },
      ],
    },
    {
      type: 'paragraph',
      content: [],
    },
  ],
};

runEscapeKeydownSuite({
  adf,
  openMenu: clickOnDate,
});
