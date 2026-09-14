import React from 'react';

import { messages } from '../components/i18n';
import { propFormatter } from './prop-formatter';

export type Formatter = (props: {
	children?(props: string): React.ReactElement;
	values?: { [k: string]: string };
}) => React.ReactElement | null;

export const UnknownUserError: Formatter = propFormatter(messages.unknownUserError);

export const NoAccessWarning: Formatter = propFormatter(messages.noAccessWarning);

export const NoAccessLabel: Formatter = propFormatter(messages.noAccessLabel);

export const DefaultHeadline: Formatter = propFormatter(messages.defaultHeadline);

export const DefaultAdvisedAction: Formatter = propFormatter(messages.defaultAdvisedAction);

export const LoginAgain: Formatter = propFormatter(messages.loginAgain);

export const DifferentText: Formatter = propFormatter(messages.differentText);
