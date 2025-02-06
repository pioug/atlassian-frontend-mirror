/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { css, jsx } from '@compiled/react';
import { useIntl } from 'react-intl-next';

import { ButtonGroup } from '@atlaskit/button';
import ErrorIcon from '@atlaskit/icon/core/migration/error';
import { fg } from '@atlaskit/platform-feature-flags';
import { token } from '@atlaskit/tokens';

import { Button } from '../../../common/ui/Button';

import { EditButton } from './edit-button';
import { messages } from './messages';
import { CreateFormFooterOld } from './old/main';
import { SubmitButton } from './submit-button';

const formFooterWrapperStyles = css({
	display: 'flex',
	marginTop: token('space.300', '24px'),
	justifyContent: 'flex-end',
});

const errorStyles = css({
	display: 'flex',
	alignItems: 'center',
	marginRight: 'auto',
});

export interface CreateFormFooterProps {
	formErrorMessage: string | undefined;
	handleCancel: () => void;
	testId?: string;
}
/**
 * Footer for the Create Form, used as a wrapper for action buttons
 * and form error messages. This component is unmounted if
 * hideFooter is true in the Create Form.
 */
const CreateFormFooterNew = ({
	formErrorMessage,
	handleCancel,
	testId,
}: CreateFormFooterProps): JSX.Element => {
	const intl = useIntl();

	return (
		<footer data-testid={`${testId}-footer`} css={formFooterWrapperStyles}>
			{formErrorMessage && (
				<div role="alert" css={errorStyles} data-testid={`${testId}-error`}>
					<ErrorIcon
						label={formErrorMessage}
						color={token('color.icon.danger', '#E34935')}
						spacing="spacious"
					/>
					{formErrorMessage}
				</div>
			)}
			<ButtonGroup>
				<Button
					type="button"
					actionSubjectId="cancel"
					appearance="subtle"
					onClick={(e: React.MouseEvent<HTMLElement, MouseEvent>) => {
						e.stopPropagation();
						handleCancel();
					}}
					testId={`${testId}-button-cancel`}
				>
					{intl.formatMessage(messages.close)}
				</Button>
				<EditButton />
				<SubmitButton />
			</ButtonGroup>
		</footer>
	);
};

export const CreateFormFooter = (props: CreateFormFooterProps) => {
	if (fg('platform_bandicoots-link-create-css')) {
		return <CreateFormFooterNew {...props} />;
	}
	return <CreateFormFooterOld {...props} />;
};
