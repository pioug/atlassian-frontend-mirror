import React, { type ReactNode, useEffect } from 'react';

import { di } from 'react-magnetic-di';

import { ErrorMessage } from '@atlaskit/form';
import { JQLSyntaxError } from '@atlaskit/jql-ast';
import { fg } from '@atlaskit/platform-feature-flags';

import { JQL_EDITOR_INPUT_ID, JQL_EDITOR_VALIDATION_ID } from '../../../../common/constants';
import { commonMessages } from '../../../../common/messages';
import { useEditorThemeContext } from '../../../../hooks/use-editor-theme';
import { useEditorViewIsInvalid } from '../../../../hooks/use-editor-view-is-invalid';
import {
	useCustomErrorComponent,
	useExternalMessages,
	useIntl,
	useJqlError,
	useScopedId,
	useStoreActions,
} from '../../../../state';
import { type CustomErrorComponent } from '../../../../state/types';
import { FormatMessages, MessageContainer } from '../format';

import { messages } from './messages';

const useFormattedErrorMessage = (): ReactNode => {
	di(useIntl, useJqlError, useStoreActions, useExternalMessages, useEditorViewIsInvalid);

	const [{ formatMessage }] = useIntl();
	const [jqlError] = useJqlError();
	const [{ errors: externalErrors }] = useExternalMessages();
	const [, { externalErrorMessageViewed }] = useStoreActions();
	const editorViewIsInvalid = useEditorViewIsInvalid();

	useEffect(() => {
		// Emit a UI event whenever external errors has changed
		externalErrorMessageViewed();
	}, [externalErrorMessageViewed, externalErrors]);

	if (!editorViewIsInvalid) {
		return null;
	}

	// Prioritise client over external errors
	if (jqlError instanceof JQLSyntaxError) {
		return `${jqlError.message} ${formatMessage(messages.jqlErrorPosition, {
			lineNumber: jqlError.line,
			charPosition: jqlError.charPositionInLine + 1,
		})}`;
	} else if (externalErrors.length > 0) {
		return <FormatMessages messages={externalErrors} />;
	} else if (jqlError !== null) {
		return formatMessage(commonMessages.unknownError);
	}

	return null;
};

type CustomErrorMessageProps = Omit<
	React.ComponentProps<CustomErrorComponent>,
	'editorTheme' // omitting the editorTheme prop since that will be injected by the CustomErrorMessage component itself
> & {
	Component: CustomErrorComponent;
};

/**
 * This is a decorator component to include the editorTheme prop to the already passed list of props
 */
const CustomComponentDecoratedWithEditorTheme = (props: CustomErrorMessageProps) => {
	di(useEditorThemeContext);

	const { Component, ...rest } = props;
	const editorThemeContext = useEditorThemeContext();

	// This is a slightly redundant condition.
	// Technically, CustomErrorMessage component should never be called with an undefined Component
	// This is enforced by the static types. Adding this condition as an extra layer of protection
	if (!Component) {
		return <>props.children</>;
	}

	return <Component editorTheme={editorThemeContext} {...rest} />;
};

export const ErrorMessages = () => {
	di(useScopedId, useFormattedErrorMessage, useCustomErrorComponent);

	const [editorId] = useScopedId(JQL_EDITOR_INPUT_ID);
	const [validationId] = useScopedId(JQL_EDITOR_VALIDATION_ID);
	const errorMessage = useFormattedErrorMessage();

	const [CustomErrorComponent] = useCustomErrorComponent();

	const childrenToRender =
		errorMessage != null ? (
			<MessageContainer>
				<ErrorMessage testId={JQL_EDITOR_VALIDATION_ID}>
					{fg('jql_editor_a11y') ? (
						<span role="alert" id={validationId}>
							{errorMessage}
						</span>
					) : (
						<span role="alert" aria-describedby={editorId}>
							{errorMessage}
						</span>
					)}
				</ErrorMessage>
			</MessageContainer>
		) : null;

	// Only render CustomErrorComponent if there is an errorMessage
	if (errorMessage != null && CustomErrorComponent) {
		return (
			<CustomComponentDecoratedWithEditorTheme
				testId={JQL_EDITOR_VALIDATION_ID}
				editorId={editorId}
				Component={CustomErrorComponent}
			>
				{childrenToRender}
			</CustomComponentDecoratedWithEditorTheme>
		);
	}

	return childrenToRender;
};
