import { tester } from '../../__tests__/utils/_tester';
import rule from '../index';

tester.run('use-popup-label', rule, {
  valid: [
    `
    import Popup from '@atlaskit/popup';

    <Popup>
      Children
    </Popup>
  `,
    `
  import AkPopup from '@atlaskit/popup';

  <AkPopup>
    Children
  </AkPopup>
  `,
    `
  import AkPopup from '@atlaskit/popup';

  <AkPopup role="dialog" label="AkPopup accessible name">
    Children
  </AkPopup>
  `,
    `
  import Popup from '@atlaskit/popup';

  <Popup role="dialog" label="Popup accessible name">
    Children
  </Popup>
  `,
    `
  import Popup from '@atlaskit/popup';

  const label = "Popup accessible label";

  <Popup role="dialog" label={label}>
    Children
  </Popup>
  `,
    `
  import Popup from '@atlaskit/popup';

  <Popup role="dialog" titleId="testId">
    Children
  </Popup>
  `,
    `
  import Popup from '@atlaskit/popup';

  const titleId = "popup-label-test-id";

  <Popup role="dialog" titleId={titleId}>
    Children
  </Popup>
`,
  ],
  invalid: [
    {
      code: `
      import Popup from '@atlaskit/popup';

      <Popup role="dialog">
        Children
      </Popup>
      `,
      errors: [
        {
          messageId: 'missingLabelProp',
        },
      ],
    },
    {
      code: `
      import Popup from '@atlaskit/popup';

      <Popup role="dialog" label="">
        Children
      </Popup>
      `,
      errors: [
        {
          messageId: 'labelPropShouldHaveContents',
        },
      ],
    },
    {
      code: `
      import Popup from '@atlaskit/popup';

      <Popup role="dialog" titleId="">
        Children
      </Popup>
      `,
      errors: [
        {
          messageId: 'titleIdShouldHaveValue',
        },
      ],
    },
    {
      code: `
      import Popup from '@atlaskit/popup';

      <Popup role="dialog" titleId="testId" label="Popup accessible name">
        Children
      </Popup>
      `,
      errors: [
        {
          messageId: 'noBothPropsUsage',
        },
      ],
    },
    {
      code: `
      import AkPopup from '@atlaskit/popup';

      <AkPopup role="dialog">
        Children
      </AkPopup>
      `,
      errors: [
        {
          messageId: 'missingLabelProp',
        },
      ],
    },
    {
      code: `
      import AkPopup from '@atlaskit/popup';

      <AkPopup role="dialog" label="">
        Children
      </AkPopup>
      `,
      errors: [
        {
          messageId: 'labelPropShouldHaveContents',
        },
      ],
    },
    {
      code: `
      import AkPopup from '@atlaskit/popup';

      <AkPopup role="dialog" titleId="">
        Children
      </AkPopup>
      `,
      errors: [
        {
          messageId: 'titleIdShouldHaveValue',
        },
      ],
    },
    {
      code: `
      import AkPopup from '@atlaskit/popup';

      <AkPopup role="dialog" titleId="testId" label="AkPopup accessible name">
        Children
      </AkPopup>
      `,
      errors: [
        {
          messageId: 'noBothPropsUsage',
        },
      ],
    },
  ],
});
