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

it.todo('ED-15748: Test is not working on safari anymore');
runEscapeKeydownSuite({
  adf,
  openMenu: clickOnDate,
  // ED-15748: see https://automate.browserstack.com/dashboard/v2/builds/a42442563c76a3e177dd7242fda3ee105d27c679
  skip: ['*'],
});
