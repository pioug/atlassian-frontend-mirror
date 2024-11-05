/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { useEffect, useRef, useState } from 'react';
import Button from '@atlaskit/button/new';
import TextField from '@atlaskit/textfield';
import LockIcon from '@atlaskit/icon/core/migration/lock-locked--lock';
import Form, { Field, type OnSubmitHandler } from '@atlaskit/form';
import { FormattedMessage, useIntl } from 'react-intl-next';
import { messages } from '@atlaskit/media-ui';
import { xcss, Box, Flex } from '@atlaskit/primitives';
import { token } from '@atlaskit/tokens';
// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { jsx, css } from '@emotion/react';
import ErrorIcon from '@atlaskit/icon/utility/migration/error';

interface PDFPasswordInputProps {
	onSubmit: OnSubmitHandler<{ password: string }>;
	hasPasswordError?: boolean;
	onRender?: () => void;
}

const COLOR_SHADE = '#b6c2cf';

const headingStyle = css({
	font: token('font.body'),
	fontWeight: token('font.weight.bold'),
	// eslint-disable-next-line @atlaskit/design-system/ensure-design-token-usage
	color: COLOR_SHADE,
});

const errorMessageWrapperStyle = css({
	marginTop: token('space.050', '4px'),
	// eslint-disable-next-line @atlaskit/design-system/ensure-design-token-usage
	color: '#FD9891',
	font: token('font.body.UNSAFE_small'),
	display: 'flex',
	alignItems: 'center',
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
						<h1 css={headingStyle}>
							<FormattedMessage {...messages.password_protected_pdf} />
						</h1>
					</Box>
					<Field aria-required={true} name="password" defaultValue="" isRequired>
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
										<ErrorIcon color="currentColor" LEGACY_size="small" label="" />
										<p css={errorMessageStyle}>
											<FormattedMessage {...messages.incorrect_password} />
										</p>
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
