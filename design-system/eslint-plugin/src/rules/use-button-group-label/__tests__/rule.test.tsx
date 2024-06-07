import { tester } from '../../__tests__/utils/_tester';
import rule from '../index';

tester.run('ensure-design-token-usage', rule, {
	valid: [
		`
    import {ButtonGroup} from '@atlaskit/button';
    <>
      <ButtonGroup label="ButtonGroup accessible name">
        Children
      </ButtonGroup>
    </>

  `,
		`
    import ButtonGroup from '@atlaskit/button/button-group';
    <>
      <ButtonGroup label="ButtonGroup accessible name">
        Children
      </ButtonGroup>
    </>

  `,
		`
    import {ButtonGroup} from '@atlaskit/button';
    <>
      <h2 id="button-group-title">ButtonGroup title content</h2>
      <ButtonGroup titleId="button-group-title">
        Children
      </ButtonGroup>
    </>
  `,
		`
    import ButtonGroup from '@atlaskit/button/button-group';
    <>
      <h2 id="button-group-title">ButtonGroup title content</h2>
      <ButtonGroup titleId="button-group-title">
        Children
      </ButtonGroup>
    </>
  `,
		`
    import {ButtonGroup as AkButtonGroup} from '@atlaskit/button';
    <>
      <AkButtonGroup label="ButtonGroup accessible name">
        Children
      </AkButtonGroup>
    </>
  `,
		`
    import AkButtonGroup from '@atlaskit/button/button-group';
    <>
      <AkButtonGroup label="ButtonGroup accessible name">
        Children
      </AkButtonGroup>
    </>
  `,
		`
    import {ButtonGroup as AwesomeButtonGroup} from '@atlaskit/button';
    <>
      <h2 id="button-group-title">ButtonGroup title content</h2>
      <AwesomeButtonGroup titleId="button-group-title">
        Children
      </AwesomeButtonGroup>
    </>
  `,
		`
    import AwesomeButtonGroup from '@atlaskit/button/button-group';
    <>
      <h2 id="button-group-title">ButtonGroup title content</h2>
      <AwesomeButtonGroup titleId="button-group-title">
        Children
      </AwesomeButtonGroup>
    </>
  `,
	],
	invalid: [
		{
			code: `
        import {ButtonGroup} from '@atlaskit/button';
        <ButtonGroup>
          children
        </ButtonGroup>
      `,
			errors: [
				{
					messageId: 'missingLabelProp',
				},
			],
		},
		{
			code: `
        import ButtonGroup from '@atlaskit/button/button-group';
        <ButtonGroup>
          children
        </ButtonGroup>
      `,
			errors: [
				{
					messageId: 'missingLabelProp',
				},
			],
		},
		{
			code: `
        import {ButtonGroup} from '@atlaskit/button';
        <ButtonGroup label="">
          Children
        </ButtonGroup>
      `,
			errors: [
				{
					messageId: 'labelPropShouldHaveContents',
				},
			],
		},
		{
			code: `
        import ButtonGroup from '@atlaskit/button/button-group';
        <ButtonGroup label="">
          Children
        </ButtonGroup>
      `,
			errors: [
				{
					messageId: 'labelPropShouldHaveContents',
				},
			],
		},
		{
			code: `
        import {ButtonGroup} from '@atlaskit/button';
        <ButtonGroup titleId="">
          Children
        </ButtonGroup>
      `,
			errors: [
				{
					messageId: 'titleIdShouldHaveValue',
				},
			],
		},
		{
			code: `
        import ButtonGroup from '@atlaskit/button/button-group';
        <ButtonGroup titleId="">
          Children
        </ButtonGroup>
      `,
			errors: [
				{
					messageId: 'titleIdShouldHaveValue',
				},
			],
		},
		{
			code: `
        import {ButtonGroup} from '@atlaskit/button';
        <ButtonGroup titleId="" label="">
          Children
        </ButtonGroup>
      `,
			errors: [
				{
					messageId: 'noBothPropsUsage',
				},
			],
		},
		{
			code: `
        import ButtonGroup from '@atlaskit/button/button-group';
        <ButtonGroup titleId="" label="">
          Children
        </ButtonGroup>
      `,
			errors: [
				{
					messageId: 'noBothPropsUsage',
				},
			],
		},
		{
			code: `
        import {ButtonGroup as AkButtonGroup} from '@atlaskit/button';
        <AkButtonGroup>
          Children
        </AkButtonGroup>
      `,
			errors: [
				{
					messageId: 'missingLabelProp',
				},
			],
		},
		{
			code: `
        import AkButtonGroup from '@atlaskit/button/button-group';
        <AkButtonGroup>
          Children
        </AkButtonGroup>
      `,
			errors: [
				{
					messageId: 'missingLabelProp',
				},
			],
		},
		{
			code: `
        import {ButtonGroup as AkButtonGroup} from '@atlaskit/button';
        <AkButtonGroup label="">
          Children
        </AkButtonGroup>
      `,
			errors: [
				{
					messageId: 'labelPropShouldHaveContents',
				},
			],
		},
		{
			code: `
        import AkButtonGroup from '@atlaskit/button/button-group';
        <AkButtonGroup label="">
          Children
        </AkButtonGroup>
      `,
			errors: [
				{
					messageId: 'labelPropShouldHaveContents',
				},
			],
		},
		{
			code: `
        import {ButtonGroup as AkButtonGroup} from '@atlaskit/button';
        <AkButtonGroup titleId="">
          Children
        </AkButtonGroup>
      `,
			errors: [
				{
					messageId: 'titleIdShouldHaveValue',
				},
			],
		},
		{
			code: `
        import AkButtonGroup from '@atlaskit/button/button-group';
        <AkButtonGroup titleId="">
          Children
        </AkButtonGroup>
      `,
			errors: [
				{
					messageId: 'titleIdShouldHaveValue',
				},
			],
		},
		{
			code: `
        import {ButtonGroup as AkButtonGroup} from '@atlaskit/button';
        <>
          <h2 id="button-group-title">ButtonGroup title content</h2>
          <AkButtonGroup titleId="button-group-title" label="ButtonGroup title content">
            Children
          </AkButtonGroup>
        </>
      `,
			errors: [
				{
					messageId: 'noBothPropsUsage',
				},
			],
		},
		{
			code: `
        import AkButtonGroup from '@atlaskit/button/button-group';
        <>
          <h2 id="button-group-title">ButtonGroup title content</h2>
          <AkButtonGroup titleId="button-group-title" label="ButtonGroup title content">
            Children
          </AkButtonGroup>
        </>
      `,
			errors: [
				{
					messageId: 'noBothPropsUsage',
				},
			],
		},
	],
});
