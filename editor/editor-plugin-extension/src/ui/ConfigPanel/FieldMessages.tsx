import React, { Fragment, useMemo } from 'react';

import type { WrappedComponentProps } from 'react-intl-next';
import { injectIntl } from 'react-intl-next';

import { configPanelMessages as messages } from '@atlaskit/editor-common/extensions';
import { ErrorMessage, HelperMessage } from '@atlaskit/form';
import { Text } from '@atlaskit/primitives/compiled';

import { FieldTypeError, ValidationError } from './types';

// sidestep XSS issues
function makeMarkup(fragment: Node, key?: string) {
	const { nodeName, nodeType, childNodes, textContent } = fragment;

	if (nodeType === Node.TEXT_NODE) {
		return <Fragment key={key}>{textContent}</Fragment>;
	}

	// NOTE: NodeList doesn't have .map
	const children: JSX.Element[] = [];
	childNodes.forEach((childNode, i) => {
		const markup = makeMarkup(childNode, String(i));
		if (markup) {
			children.push(markup);
		}
	});

	switch (nodeName) {
		case 'B':
			return <b key={key}>{children}</b>;
		case 'I':
			return <i key={key}>{children}</i>;
		case 'STRONG':
			return (
				<Text as="strong" color="color.text.subtlest" size="UNSAFE_small" key={key}>
					{children}
				</Text>
			);
		case 'EM':
			return (
				<Text as="em" color="color.text.subtlest" size="UNSAFE_small" key={key}>
					{children}
				</Text>
			);
		case 'CODE':
			// eslint-disable-next-line @atlaskit/design-system/no-html-code
			return <code key={key}>{children}</code>;
	}

	if (children.length === 1) {
		return <Fragment key={key}>{children[0]}</Fragment>;
	}
	if (children.length) {
		return <span key={key}>{children}</span>;
	}

	return null;
}

function Description({ description }: { description: string }) {
	const markup = useMemo(() => {
		const dom = new DOMParser().parseFromString(description, 'text/html');
		return makeMarkup(dom);
	}, [description]);

	return <HelperMessage testId="field-message-description">{markup}</HelperMessage>;
}

const FieldMessages = function ({
	error,
	description,
	intl,
}: { error?: string; description?: string } & WrappedComponentProps) {
	if (!error && description) {
		return <Description description={description} />;
	}

	switch (error) {
		case ValidationError.Required:
			return (
				<ErrorMessage testId="config-panel-error-message">
					{intl.formatMessage(messages.required)}
				</ErrorMessage>
			);

		case ValidationError.Invalid:
			return (
				<ErrorMessage testId="config-panel-error-message">
					{intl.formatMessage(messages.invalid)}
				</ErrorMessage>
			);

		case FieldTypeError.isMultipleAndRadio:
			return (
				<ErrorMessage testId="config-panel-error-message">
					{intl.formatMessage(messages.isMultipleAndRadio)}
				</ErrorMessage>
			);

		default:
			return null;
	}
};

export default injectIntl(FieldMessages);
