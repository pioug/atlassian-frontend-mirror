import React from 'react';

import { ElementName } from '../../../../../constants';
import { messages } from '../../../../../messages';
import { useFlexibleUiContext } from '../../../../../state/flexible-ui-context';
import { BaseTextElement, type BaseTextElementProps, toFormattedTextProps } from '../common';

export type UserAttributesElementProps = BaseTextElementProps;

const UserAttributesElement = (props: UserAttributesElementProps): JSX.Element | null => {
	const context = useFlexibleUiContext();

	const renderUserAttributes = (userAttributes: any): JSX.Element[] | null => {
		if (!userAttributes) {
			return null;
		}

		const attributeKeys = ['pronouns', 'role', 'department', 'location'];
		const attributes: JSX.Element[] = [];

		attributeKeys.forEach((key) => {
			if (userAttributes[key]) {
				const data = toFormattedTextProps(messages.user_attributes, userAttributes[key]);
				if (data) {
					attributes.push(
						<BaseTextElement
							key={key}
							{...data}
							testId={`smart-element-text-${key}`}
							{...props}
							name={ElementName.UserAttributes}
						/>,
					);
				}
			}
		});

		return attributes.length > 0 ? attributes : null;
	};

	const elements = context ? renderUserAttributes(context.userAttributes) : null;

	return elements ? <>{elements}</> : null;
};

export default UserAttributesElement;
