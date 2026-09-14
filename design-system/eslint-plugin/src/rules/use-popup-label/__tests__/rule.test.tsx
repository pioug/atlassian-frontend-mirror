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
  import { Popup } from '@atlaskit/popup/popup';

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
		`
  import { PopupTrigger } from '@atlassian/entry-points/popup-trigger';

  <PopupTrigger>
    Children
  </PopupTrigger>
  `,
		`
  import { PopupTrigger as AkPopupTrigger } from '@atlassian/entry-points/popup-trigger';

  <AkPopupTrigger>
    Children
  </AkPopupTrigger>
  `,
		`
  import { PopupTrigger } from '@atlassian/entry-points/popup-trigger';

  <PopupTrigger role="dialog" label="PopupTrigger accessible name">
    Children
  </PopupTrigger>
  `,
		`
  import { PopupTrigger as AkPopupTrigger } from '@atlassian/entry-points/popup-trigger';

  <AkPopupTrigger role="dialog" label="AkPopupTrigger accessible name">
    Children
  </AkPopupTrigger>
  `,
		`
  import { PopupTrigger } from '@atlassian/entry-points/popup-trigger';

  const label = "PopupTrigger accessible label";

  <PopupTrigger role="dialog" label={label}>
    Children
  </PopupTrigger>
  `,
		`
  import { PopupTrigger } from '@atlassian/entry-points/popup-trigger';

  <PopupTrigger role="dialog" titleId="testId">
    Children
  </PopupTrigger>
  `,
		`
  import { PopupTrigger } from '@atlassian/entry-points/popup-trigger';

  const titleId = "popup-label-test-id";

  <PopupTrigger role="dialog" titleId={titleId}>
    Children
  </PopupTrigger>
  `,
	],
	invalid: [
		{
			code: `
      import { Popup } from '@atlaskit/popup/popup';

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
		{
			code: `
      import { PopupTrigger } from '@atlassian/entry-points/popup-trigger';

      <PopupTrigger role="dialog">
        Children
      </PopupTrigger>
      `,
			errors: [
				{
					messageId: 'missingLabelProp',
				},
			],
		},
		{
			code: `
      import { PopupTrigger as AkPopupTrigger } from '@atlassian/entry-points/popup-trigger';

      <AkPopupTrigger role="dialog">
        Children
      </AkPopupTrigger>
      `,
			errors: [
				{
					messageId: 'missingLabelProp',
				},
			],
		},
		{
			code: `
      import { PopupTrigger } from '@atlassian/entry-points/popup-trigger';

      <PopupTrigger role="dialog" label="">
        Children
      </PopupTrigger>
      `,
			errors: [
				{
					messageId: 'labelPropShouldHaveContents',
				},
			],
		},
		{
			code: `
      import { PopupTrigger } from '@atlassian/entry-points/popup-trigger';

      <PopupTrigger role="dialog" titleId="">
        Children
      </PopupTrigger>
      `,
			errors: [
				{
					messageId: 'titleIdShouldHaveValue',
				},
			],
		},
		{
			code: `
      import { PopupTrigger } from '@atlassian/entry-points/popup-trigger';

      <PopupTrigger role="dialog" titleId="testId" label="PopupTrigger accessible name">
        Children
      </PopupTrigger>
      `,
			errors: [
				{
					messageId: 'noBothPropsUsage',
				},
			],
		},
	],
});
