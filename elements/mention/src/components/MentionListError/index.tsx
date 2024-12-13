import React from 'react';
import Heading from '@atlaskit/heading';
import { Stack, Text, xcss } from '@atlaskit/primitives';
import { type HttpError } from '../../api/MentionResource';
import {
	DefaultAdvisedAction,
	DefaultHeadline,
	DifferentText,
	type Formatter,
	LoginAgain,
} from '../../util/i18n';
import { GenericErrorIllustration } from './GenericErrorIllustration';
export interface Props {
	error?: Error;
}

const advisedActionMessages: {
	[key: string]: Formatter;
} = {
	'401': LoginAgain,
	'403': DifferentText,
	default: DefaultAdvisedAction,
};

export default class MentionListError extends React.PureComponent<Props, {}> {
	/**
	 * Translate the supplied Error into a message suitable for display in the MentionList.
	 *
	 * @param error the error to be displayed
	 */
	private static getAdvisedActionMessage(error: Error | undefined): Formatter {
		if (error && error.hasOwnProperty('statusCode')) {
			const httpError = error as HttpError;
			return (
				advisedActionMessages[httpError.statusCode.toString()] || advisedActionMessages.default
			);
		}
		return advisedActionMessages.default;
	}

	render() {
		const { error } = this.props;
		const ErrorMessage = MentionListError.getAdvisedActionMessage(error);
		return (
			<Stack
				space="space.400"
				alignBlock="center"
				alignInline="center"
				xcss={mentionListErrorStyles}
			>
				<GenericErrorIllustration />
				<Stack space="space.100">
					<Heading size="xsmall" as="div">
						<DefaultHeadline />
					</Heading>
					<Text as="p" color="color.text.subtle">
						<ErrorMessage />
					</Text>
				</Stack>
			</Stack>
		);
	}
}

const mentionListErrorStyles = xcss({
	paddingBlock: 'space.500',
	textAlign: 'center',
});
