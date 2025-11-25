/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { useEffect, useRef, useState } from 'react';
import { jsx, css } from '@compiled/react';
import Button from '@atlaskit/button/new';
import TextField from '@atlaskit/textfield';
import LockIcon from '@atlaskit/icon/core/migration/lock-locked--lock';
import Form, { Field, type OnSubmitHandler } from '@atlaskit/form';
import { FormattedMessage, useIntl } from 'react-intl-next';
import { messages } from '@atlaskit/media-ui';
// eslint-disable-next-line @atlaskit/design-system/no-emotion-primitives -- to be migrated to @atlaskit/primitives/compiled – go/akcss
import { xcss, Box, Flex, Text } from '@atlaskit/primitives';
import { token } from '@atlaskit/tokens';
// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import ErrorIcon from '@atlaskit/icon/core/migration/status-error--error';
import Heading from '@atlaskit/heading';

interface PDFPasswordInputProps {
	onSubmit: OnSubmitHandler<{ password: string }>;
	hasPasswordError?: boolean;
	onRender?: () => void;
}

const COLOR_SHADE = '#b6c2cf';
const ERROR_COLOR = '#FD9891';

const headingStyle = css({
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
	h1: {
		font: token('font.body'),
		fontWeight: token('font.weight.bold'),
		color: COLOR_SHADE,
	},
});

const errorMessageWrapperStyle = css({
	marginTop: token('space.050', '4px'),
	font: token('font.body.UNSAFE_small'),
	display: 'flex',
	alignItems: 'center',
	color: ERROR_COLOR,

	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
	p: {
		color: ERROR_COLOR,
	},
});

const errorMessageStyle = css({
	marginTop: '0px',
	marginLeft: token('space.050', '4px'),
});

const headerStyles = xcss({
	textAlign: 'center',
	marginTop: 'space.200',
	marginBottom: 'space.200',
});

const inputStyle = xcss({
	width: '330px',
});

const footerStyles = xcss({
	marginTop: 'space.200',
	display: 'flex',
	justifyContent: 'center',
});

export const PDFPasswordInput = ({
	onSubmit,
	hasPasswordError,
	onRender,
}: PDFPasswordInputProps) => {
	const passwordInputRef = useRef<HTMLInputElement>(null);
	const onRenderRef = useRef(onRender);
	const [formError, setFormError] = useState(hasPasswordError);
	const intl = useIntl();

	useEffect(() => {
		onRenderRef.current?.();
	}, []);

	useEffect(() => {
		if (hasPasswordError) {
			setFormError(true);
			passwordInputRef.current?.focus();
		}
	}, [hasPasswordError]);

	return (
		<Form<{ password: string }> onSubmit={onSubmit}>
			{({ formProps, submitting }) => (
				<form {...formProps}>
					<Flex justifyContent="center">
						<LockIcon label="" LEGACY_size="xlarge" color={COLOR_SHADE as any} />
					</Flex>
					<Box xcss={headerStyles}>
						<div css={headingStyle}>
							<Heading as="h1" size="medium">
								<FormattedMessage {...messages.password_protected_pdf} />
							</Heading>
						</div>
					</Box>
					<Field name="password" defaultValue="" isRequired>
						{({ fieldProps }) => (
							<Box xcss={inputStyle}>
								<TextField
									{...fieldProps}
									type="password"
									aria-label={intl.formatMessage(messages.password)}
									placeholder={intl.formatMessage(messages.enter_password)}
									ref={passwordInputRef}
									aria-describedby={formError ? `${fieldProps.id}-error` : undefined}
									onChange={(value) => {
										fieldProps.onChange(value);
										setFormError(false);
									}}
								/>
								{formError && (
									<div css={errorMessageWrapperStyle} id={`${fieldProps.id}-error`}>
										<ErrorIcon color="currentColor" LEGACY_size="small" label="" size="small" />
										<div css={errorMessageStyle} id={`${fieldProps.id}-errorMessage`}>
											<Text as="p">
												<FormattedMessage {...messages.incorrect_password} />
											</Text>
										</div>
									</div>
								)}
							</Box>
						)}
					</Field>
					<Box xcss={footerStyles}>
						<Button appearance="primary" type="submit" isLoading={submitting}>
							<FormattedMessage {...messages.submit} />
						</Button>
					</Box>
				</form>
			)}
		</Form>
	);
};
