jest.autoMockOff();

import transformer from '../migrate-data-testid-to-testid-prop';

const defineInlineTest = require('jscodeshift/dist/testUtils').defineInlineTest;

// Test: No transformation when no @atlaskit/form import
defineInlineTest(
	{ default: transformer, parser: 'tsx' },
	{},
	`import React from 'react';

const MyComponent = () => (
	<form data-testid="should-not-change">
		<input type="text" />
	</form>
);`,
	`import React from 'react';

const MyComponent = () => (
	<form data-testid="should-not-change">
		<input type="text" />
	</form>
);`,
	'should not transform if @atlaskit/form import is not present',
);

// Test: Basic transformation with default import as Form
defineInlineTest(
	{ default: transformer, parser: 'tsx' },
	{},
	`import Form from '@atlaskit/form';

const MyComponent = () => (
	<Form onSubmit={handleSubmit}>
		{({ formProps }) => (
			<form {...formProps} data-testid="my-form">
				<input type="text" />
			</form>
		)}
	</Form>
);`,
	`import Form from '@atlaskit/form';

const MyComponent = () => (
	<Form onSubmit={handleSubmit} testId="my-form">
		{({ formProps }) => (
			<form {...formProps}>
				<input type="text" />
			</form>
		)}
	</Form>
);`,
	'should migrate string literal data-testid to testId prop with Form import',
);

// Test: Basic transformation with renamed default import
defineInlineTest(
	{ default: transformer, parser: 'tsx' },
	{},
	`import AkForm from '@atlaskit/form';

const MyComponent = () => (
	<AkForm onSubmit={handleSubmit}>
		{({ formProps }) => (
			<form {...formProps} data-testid="my-form">
				<input type="text" />
			</form>
		)}
	</AkForm>
);`,
	`import AkForm from '@atlaskit/form';

const MyComponent = () => (
	<AkForm onSubmit={handleSubmit} testId="my-form">
		{({ formProps }) => (
			<form {...formProps}>
				<input type="text" />
			</form>
		)}
	</AkForm>
);`,
	'should migrate with renamed default import (AkForm)',
);

// Test: Expression data-testid with variable
defineInlineTest(
	{ default: transformer, parser: 'tsx' },
	{},
	`import Form from '@atlaskit/form';

const testId = 'dynamic-form';
const MyComponent = () => (
	<Form onSubmit={handleSubmit}>
		{({ formProps }) => (
			<form {...formProps} data-testid={testId}>
				<input type="text" />
			</form>
		)}
	</Form>
);`,
	`import Form from '@atlaskit/form';

const testId = 'dynamic-form';
const MyComponent = () => (
	<Form onSubmit={handleSubmit} testId={testId}>
		{({ formProps }) => (
			<form {...formProps}>
				<input type="text" />
			</form>
		)}
	</Form>
);`,
	'should migrate expression data-testid with variable',
);

// Test: Expression data-testid with function call
defineInlineTest(
	{ default: transformer, parser: 'tsx' },
	{},
	`import Form from '@atlaskit/form';

const MyComponent = ({ id }) => (
	<Form onSubmit={handleSubmit}>
		{({ formProps }) => (
			<form {...formProps} data-testid={getTestId(id)}>
				<input type="text" />
			</form>
		)}
	</Form>
);`,
	`import Form from '@atlaskit/form';

const MyComponent = ({ id }) => (
	<Form onSubmit={handleSubmit} testId={getTestId(id)}>
		{({ formProps }) => (
			<form {...formProps}>
				<input type="text" />
			</form>
		)}
	</Form>
);`,
	'should migrate expression data-testid with function call',
);

// Test: Multiple attributes on form element
defineInlineTest(
	{ default: transformer, parser: 'tsx' },
	{},
	`import Form from '@atlaskit/form';

const MyComponent = () => (
	<Form onSubmit={handleSubmit}>
		{({ formProps }) => (
			<form noValidate {...formProps} id="my-form" data-testid="my-form" className="custom-form">
				<input type="text" />
			</form>
		)}
	</Form>
);`,
	`import Form from '@atlaskit/form';

const MyComponent = () => (
	<Form onSubmit={handleSubmit} testId="my-form">
		{({ formProps }) => (
			<form noValidate {...formProps} id="my-form" className="custom-form">
				<input type="text" />
			</form>
		)}
	</Form>
);`,
	'should migrate data-testid while preserving other attributes',
);

// Test: Renamed formProps parameter
defineInlineTest(
	{ default: transformer, parser: 'tsx' },
	{},
	`import Form from '@atlaskit/form';

const MyComponent = () => (
	<Form onSubmit={handleSubmit}>
		{({ formProps: customProps }) => (
			<form {...customProps} data-testid="my-form">
				<input type="text" />
			</form>
		)}
	</Form>
);`,
	`import Form from '@atlaskit/form';

const MyComponent = () => (
	<Form onSubmit={handleSubmit} testId="my-form">
		{({ formProps: customProps }) => (
			<form {...customProps}>
				<input type="text" />
			</form>
		)}
	</Form>
);`,
	'should work with renamed formProps parameter',
);

// Test: Multiple destructured parameters
defineInlineTest(
	{ default: transformer, parser: 'tsx' },
	{},
	`import Form from '@atlaskit/form';

const MyComponent = () => (
	<Form onSubmit={handleSubmit}>
		{({ formProps, submitting, dirty }) => (
			<form {...formProps} data-testid="my-form">
				<input type="text" />
				<button type="submit" disabled={submitting}>
					{dirty ? 'Save Changes' : 'Submit'}
				</button>
			</form>
		)}
	</Form>
);`,
	`import Form from '@atlaskit/form';

const MyComponent = () => (
	<Form onSubmit={handleSubmit} testId="my-form">
		{({ formProps, submitting, dirty }) => (
			<form {...formProps}>
				<input type="text" />
				<button type="submit" disabled={submitting}>
					{dirty ? 'Save Changes' : 'Submit'}
				</button>
			</form>
		)}
	</Form>
);`,
	'should work with multiple destructured parameters',
);

// Test: Nested form within wrapper div
defineInlineTest(
	{ default: transformer, parser: 'tsx' },
	{},
	`import Form from '@atlaskit/form';

const MyComponent = () => (
	<Form onSubmit={handleSubmit}>
		{({ formProps }) => (
			<div className="form-wrapper">
				<form {...formProps} data-testid="nested-form">
					<input type="text" />
				</form>
			</div>
		)}
	</Form>
);`,
	`import Form from '@atlaskit/form';

const MyComponent = () => (
	<Form onSubmit={handleSubmit} testId="nested-form">
		{({ formProps }) => (
			<div className="form-wrapper">
				<form {...formProps}>
					<input type="text" />
				</form>
			</div>
		)}
	</Form>
);`,
	'should find form element nested within other elements',
);

// Test: Form with named imports and default import
defineInlineTest(
	{ default: transformer, parser: 'tsx' },
	{},
	`import Form, { Field, FormSection } from '@atlaskit/form';

const MyComponent = () => (
	<Form onSubmit={handleSubmit}>
		{({ formProps }) => (
			<form {...formProps} data-testid="complete-form">
				<FormSection>
					<Field name="username">
						{({ fieldProps }) => <input {...fieldProps} />}
					</Field>
				</FormSection>
			</form>
		)}
	</Form>
);`,
	`import Form, { Field, FormSection } from '@atlaskit/form';

const MyComponent = () => (
	<Form onSubmit={handleSubmit} testId="complete-form">
		{({ formProps }) => (
			<form {...formProps}>
				<FormSection>
					<Field name="username">
						{({ fieldProps }) => <input {...fieldProps} />}
					</Field>
				</FormSection>
			</form>
		)}
	</Form>
);`,
	'should work with mixed default and named imports',
);

// Test: No transformation when testId already exists
defineInlineTest(
	{ default: transformer, parser: 'tsx' },
	{},
	`import Form from '@atlaskit/form';

const MyComponent = () => (
	<Form testId="existing" onSubmit={handleSubmit}>
		{({ formProps }) => (
			<form {...formProps} data-testid="should-not-change">
				<input type="text" />
			</form>
		)}
	</Form>
);`,
	`import Form from '@atlaskit/form';

const MyComponent = () => (
	<Form testId="existing" onSubmit={handleSubmit}>
		{({ formProps }) => (
			<form {...formProps} data-testid="should-not-change">
				<input type="text" />
			</form>
		)}
	</Form>
);`,
	'should not migrate when testId prop already exists',
);

// Test: No transformation when no data-testid present
defineInlineTest(
	{ default: transformer, parser: 'tsx' },
	{},
	`import Form from '@atlaskit/form';

const MyComponent = () => (
	<Form onSubmit={handleSubmit}>
		{({ formProps }) => (
			<form {...formProps} id="my-form">
				<input type="text" />
			</form>
		)}
	</Form>
);`,
	`import Form from '@atlaskit/form';

const MyComponent = () => (
	<Form onSubmit={handleSubmit}>
		{({ formProps }) => (
			<form {...formProps} id="my-form">
				<input type="text" />
			</form>
		)}
	</Form>
);`,
	'should not transform when no data-testid is present',
);

// Test: No transformation with JSX children (not function children)
defineInlineTest(
	{ default: transformer, parser: 'tsx' },
	{},
	`import Form from '@atlaskit/form';

const MyComponent = () => (
	<Form onSubmit={handleSubmit}>
		<div>JSX children instead of function</div>
	</Form>
);`,
	`import Form from '@atlaskit/form';

const MyComponent = () => (
	<Form onSubmit={handleSubmit}>
		<div>JSX children instead of function</div>
	</Form>
);`,
	'should not transform JSX children (non-function children)',
);

// Test: No transformation without formProps parameter
defineInlineTest(
	{ default: transformer, parser: 'tsx' },
	{},
	`import Form from '@atlaskit/form';

const MyComponent = () => (
	<Form onSubmit={handleSubmit}>
		{({ submitting }) => (
			<form data-testid="no-formprops">
				<input type="text" />
				<button disabled={submitting}>Submit</button>
			</form>
		)}
	</Form>
);`,
	`import Form from '@atlaskit/form';

const MyComponent = () => (
	<Form onSubmit={handleSubmit}>
		{({ submitting }) => (
			<form data-testid="no-formprops">
				<input type="text" />
				<button disabled={submitting}>Submit</button>
			</form>
		)}
	</Form>
);`,
	'should not transform when no formProps parameter exists',
);

// Test: No transformation when no form element found
defineInlineTest(
	{ default: transformer, parser: 'tsx' },
	{},
	`import Form from '@atlaskit/form';

const MyComponent = () => (
	<Form onSubmit={handleSubmit}>
		{({ formProps }) => (
			<div {...formProps} data-testid="not-a-form">
				<input type="text" />
			</div>
		)}
	</Form>
);`,
	`import Form from '@atlaskit/form';

const MyComponent = () => (
	<Form onSubmit={handleSubmit}>
		{({ formProps }) => (
			<div {...formProps} data-testid="not-a-form">
				<input type="text" />
			</div>
		)}
	</Form>
);`,
	'should not transform when no HTML form element is found',
);

// Test: No transformation with only named imports (no default)
defineInlineTest(
	{ default: transformer, parser: 'tsx' },
	{},
	`import { Field, FormSection } from '@atlaskit/form';

const MyComponent = () => (
	<div>
		<Field name="test">
			{({ fieldProps }) => <input {...fieldProps} />}
		</Field>
	</div>
);`,
	`import { Field, FormSection } from '@atlaskit/form';

const MyComponent = () => (
	<div>
		<Field name="test">
			{({ fieldProps }) => <input {...fieldProps} />}
		</Field>
	</div>
);`,
	'should not transform when only named imports exist (no default Form import)',
);

// Test: Multiple forms in same component - only transform the one with data-testid
defineInlineTest(
	{ default: transformer, parser: 'tsx' },
	{},
	`import Form from '@atlaskit/form';

const MyComponent = () => (
	<div>
		<Form onSubmit={handleSubmit1}>
			{({ formProps }) => (
				<form {...formProps} data-testid="first-form">
					<input type="text" />
				</form>
			)}
		</Form>
		<Form onSubmit={handleSubmit2}>
			{({ formProps }) => (
				<form {...formProps} id="second-form">
					<input type="text" />
				</form>
			)}
		</Form>
	</div>
);`,
	`import Form from '@atlaskit/form';

const MyComponent = () => (
	<div>
		<Form onSubmit={handleSubmit1} testId="first-form">
			{({ formProps }) => (
				<form {...formProps}>
					<input type="text" />
				</form>
			)}
		</Form>
		<Form onSubmit={handleSubmit2}>
			{({ formProps }) => (
				<form {...formProps} id="second-form">
					<input type="text" />
				</form>
			)}
		</Form>
	</div>
);`,
	'should only transform forms with data-testid, leave others unchanged',
);

// Test: Complex real-world example like select-scopes
defineInlineTest(
	{ default: transformer, parser: 'tsx' },
	{},
	`import AkForm from '@atlaskit/form';

const MyComponent = () => (
	<AkForm onSubmit={handleSubmit}>
		{({ formProps }) => (
			<form {...formProps} id="form-id" data-testid="my-test-id">
				<input type="text" />
			</form>
		)}
	</AkForm>
);`,
	`import AkForm from '@atlaskit/form';

const MyComponent = () => (
	<AkForm onSubmit={handleSubmit} testId="my-test-id">
		{({ formProps }) => (
			<form {...formProps} id="form-id">
				<input type="text" />
			</form>
		)}
	</AkForm>
);`,
	'should handle complex real-world example with AkForm and mixed attributes',
);

// Test: Different import styles from various packages should not transform
defineInlineTest(
	{ default: transformer, parser: 'tsx' },
	{},
	`import CustomForm from '@some/other-package';
import { Form } from '@another/package';

const MyComponent = () => (
	<CustomForm onSubmit={handleSubmit}>
		{({ formProps }) => (
			<form {...formProps} data-testid="should-not-change">
				<input type="text" />
			</form>
		)}
	</CustomForm>
);`,
	`import CustomForm from '@some/other-package';
import { Form } from '@another/package';

const MyComponent = () => (
	<CustomForm onSubmit={handleSubmit}>
		{({ formProps }) => (
			<form {...formProps} data-testid="should-not-change">
				<input type="text" />
			</form>
		)}
	</CustomForm>
);`,
	'should not transform forms from other packages',
);

// Test: Preserve attribute order when adding testId
defineInlineTest(
	{ default: transformer, parser: 'tsx' },
	{},
	`import Form from '@atlaskit/form';

const MyComponent = () => (
	<Form isDisabled onSubmit={handleSubmit}>
		{({ formProps }) => (
			<form {...formProps} data-testid="ordered-form">
				<input type="text" />
			</form>
		)}
	</Form>
);`,
	`import Form from '@atlaskit/form';

const MyComponent = () => (
	<Form isDisabled onSubmit={handleSubmit} testId="ordered-form">
		{({ formProps }) => (
			<form {...formProps}>
				<input type="text" />
			</form>
		)}
	</Form>
);`,
	'should preserve existing prop order when adding testId',
);
