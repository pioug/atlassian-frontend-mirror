// @ts-ignore
import { ruleTester } from '@atlassian/eslint-utils';

import { linesOnly } from '../../../__tests__/utils/_strings';
import rule, { convertForm, topLevelAttributeNames } from '../../index';

ruleTester.run('use-simple-form', rule, {
	valid: [
		`
			// No AK form
			<form></form>
		`,
		`
			// Form, simple
			import Form from '@atlaskit/form';
			<Form><p>Inside</p></Form>
		`,
		`
			// Form, doesn't destructure
			import Form from '@atlaskit/form';
			<Form>
				{(arg) => (
					<form {...arg.formProps}>
						<p>inside</p>
					</form>
				)}
			</Form>
		`,
		`
			// Form, uses more than formProps
			import Form from '@atlaskit/form';
			<Form>
				{({ formProps, submitting }) => (
					<form {...formProps}>
						<p>inside</p>
					</form>
				)}
			</Form>
		`,
		`
			// Inner HTML form is not first child
			import Form from '@atlaskit/form';
			const foo = <p>more</p>;
			<Form>
				{({ formProps }) => <><form {...formProps}>{...foo}</form></>}
			</Form>
		`,
	],
	invalid: [
		{
			code: linesOnly`
				// Form
				import Form from '@atlaskit/form';
				<Form>
					{({ formProps }) => <form {...formProps}><p>inside</p></form>}
				</Form>
			`,
			errors: [
				{
					messageId: 'useSimpleForm',
					suggestions: [
						{
							desc: convertForm,
							output: linesOnly`
								// Form
								import Form from '@atlaskit/form';
								<Form>

								<><p>inside</p></></Form>
							`,
						},
					],
				},
			],
		},
		...topLevelAttributeNames.map((attrName) => ({
			code: linesOnly`
				// Form with top level attrs
				import Form from '@atlaskit/form';
				<Form>
					{({ formProps }) => <form ${attrName}="foo" {...formProps}><p>inside</p></form>}
				</Form>
			`,
			errors: [
				{
					messageId: 'useSimpleForm',
					suggestions: [
						{
							desc: convertForm,
							output: linesOnly`
								// Form with top level attrs
								import Form from '@atlaskit/form';
								<Form ${attrName}="foo">

								<><p>inside</p></></Form>
							`,
						},
					],
				},
			],
		})),
		{
			code: linesOnly`
				// Form with non-top level attrs
				import Form from '@atlaskit/form';
				<Form>
					{({ formProps }) => <form foo="bar" {...formProps}><p>inside</p></form>}
				</Form>
			`,
			errors: [
				{
					messageId: 'useSimpleForm',
					suggestions: [
						{
							desc: convertForm,
							output: linesOnly`
								// Form with non-top level attrs
								import Form from '@atlaskit/form';
								<Form formProps={{
								'foo': "bar"
								}} >

								<><p>inside</p></></Form>
							`,
						},
					],
				},
			],
		},
		{
			code: linesOnly`
				// Form with both attr types
				import Form from '@atlaskit/form';
				<Form>
					{({ formProps }) => <form name="name" foo="bar" {...formProps}><p>inside</p></form>}
				</Form>
			`,
			errors: [
				{
					messageId: 'useSimpleForm',
					suggestions: [
						{
							desc: convertForm,
							output: linesOnly`
								// Form with both attr types
								import Form from '@atlaskit/form';
								<Form name="name" formProps={{
								'foo': "bar"
								}} >

								<><p>inside</p></></Form>
							`,
						},
					],
				},
			],
		},
		{
			code: linesOnly`
				// Form
				import Form from '@atlaskit/form';
				const foo = <p>more</p>;
				<Form>
					{({ formProps }) => <form {...formProps}>{...foo}</form>}
				</Form>
			`,
			errors: [
				{
					messageId: 'useSimpleForm',
					suggestions: [
						{
							desc: convertForm,
							output: linesOnly`
								// Form
								import Form from '@atlaskit/form';
								const foo = <p>more</p>;
								<Form>

								<>{...foo}</></Form>
							`,
						},
					],
				},
			],
		},
	].flat(),
});
