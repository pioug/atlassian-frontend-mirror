// @ts-ignore
import { ruleTester } from '@atlassian/eslint-utils';

import { linesOnly } from '../../../__tests__/utils/_strings';
import rule from '../../index';

ruleTester.run('use-field-message-wrapper', rule, {
	valid: [
		`
			// No field
			<input />
		`,
		`
			// Field, no message
			import { Field } from '@atlaskit/form';
			<Field>
				{({ fieldProps }) => (
					<input {...fieldProps} />
				)}
			</Field>
		`,
		`
			// Message, no field
			import { ErrorMessage } from '@atlaskit/form';
			<ErrorMessage>Error</ErrorMessage>
		`,
		`
			// Field, message in wrapper
			import { Field, ErrorMessage, MessageWrapper } from '@atlaskit/form';
			<Field>
				{({ fieldProps, error }) => (
					<>
						<input {...fieldProps} />
						<MessageWrapper>
							<ErrorMessage>Error</ErrorMessage>
						</MessageWrapper>
					</>
				)}
			</Field>
		`,
		`
			// Field, not our message
			import { Field } from '@atlaskit/form';
			import ErrorMessage from 'foo';
			<Field>
				{({ fieldProps, error }) => (
					<>
						<input {...fieldProps} />
						<ErrorMessage>Error</ErrorMessage>
					</>
				)}
			</Field>
		`,
		`
			// No field
			import { ErrorMessage, MessageWrapper } from '@atlaskit/form';
			import FooField from 'foo';
			<FooField>
				{({ fieldProps }) => (
					<>
						<input {...fieldProps} />
						<ErrorMessage>Error</ErrorMessage>
					</>
				)}
			</FooField>
		`,
	],
	invalid: [
		{
			code: linesOnly`
				import { Field, ErrorMessage } from '@atlaskit/form';
				// No message wrapper
				<Field>
					{({ fieldProps }) => (
						<>
							<input {...fieldProps} />
							<ErrorMessage>Error</ErrorMessage>
						</>
					)}
				</Field>
			`,
			errors: [
				{
					messageId: 'useMessageWrapper',
				},
			],
		},
		{
			code: linesOnly`
				import { Field, ErrorMessage, HelperMessage } from '@atlaskit/form';
				// No message wrapper, multiple
				<Field>
					{({ fieldProps }) => (
						<>
							<input {...fieldProps} />
							<ErrorMessage>Error</ErrorMessage>
							<HelperMessage>Error</HelperMessage>
						</>
					)}
				</Field>
			`,
			errors: [
				{
					messageId: 'useMessageWrapper',
				},
				{
					messageId: 'useMessageWrapper',
				},
			],
		},
	],
});
