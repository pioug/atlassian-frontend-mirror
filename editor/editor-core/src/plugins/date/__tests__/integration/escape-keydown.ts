import { clickOnDate } from '@atlaskit/editor-test-helpers/page-objects/date';
import { runEscapeKeydownSuite } from '@atlaskit/editor-test-helpers/integration/escape-keydown';

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

// TODO: https://product-fabric.atlassian.net/browse/ED-16966
runEscapeKeydownSuite({
  adf,
  openMenu: clickOnDate,
  skip: ['*'],
});
