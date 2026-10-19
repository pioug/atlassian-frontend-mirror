/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { useEffect, useRef, useState } from 'react';

import { jsx, css } from '@compiled/react';
import { FormattedMessage, useIntl } from 'react-intl';

import Button from '@atlaskit/button/default/button';
import Field from '@atlaskit/form/field';
import Form from '@atlaskit/form/form';
import type { OnSubmitHandler } from '@atlaskit/form/types';
import Heading from '@atlaskit/heading/heading';
import LockIcon from '@atlaskit/icon/core/lock-locked';
// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import ErrorIcon from '@atlaskit/icon/core/status-error';
import { messages } from '@atlaskit/media-ui/messages';
// eslint-disable-next-line @atlaskit/design-system/no-emotion-primitives -- to be migrated to @atlaskit/primitives/compiled – go/akcss
import { Box } from '@atlaskit/primitives/box';
// eslint-disable-next-line @atlaskit/design-system/no-emotion-primitives -- to be migrated to @atlaskit/primitives/compiled – go/akcss
import { Flex } from '@atlaskit/primitives/components/flex';
// eslint-disable-next-line @atlaskit/design-system/no-emotion-primitives -- to be migrated to @atlaskit/primitives/compiled – go/akcss
import { Text } from '@atlaskit/primitives/text';
// eslint-disable-next-line @atlaskit/design-system/no-emotion-primitives -- to be migrated to @atlaskit/primitives/compiled – go/akcss
import { xcss } from '@atlaskit/primitives/xcss/xcss';
import TextField from '@atlaskit/textfield/text-field';
import { token } from '@atlaskit/tokens';

import { useIsInsetViewer } from '../../insetViewerContext';

interface PDFPasswordInputProps {
	onSubmit: OnSubmitHandler<{ password: string }>;
	hasPasswordError?: boolean;
	onRender?: () => void;
}

const COLOR_SHADE = '#b6c2cf';
const ERROR_COLOR = '#FD9891';

const headingStyle = css({
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors, @atlaskit/ui-styling-standard/no-unsafe-selectors -- increased specificity to override Heading component
	'&& h1': {
		font: token('font.body'),
		fontWeight: token('font.weight.bold'),
		color: COLOR_SHADE,
	},
});

const insetViewerHeadingStyle = css({
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors, @atlaskit/ui-styling-standard/no-unsafe-selectors -- increased specificity to override Heading component
	'&& h1': {
		color: token('color.text.subtle'),
	},
});

const errorMessageWrapperStyle = css({
	marginTop: token('space.050'),
	font: token('font.body.small'),
	display: 'flex',
	alignItems: 'center',
});

const errorMessageColorStyle = css({
	color: ERROR_COLOR,

	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
	p: {
		color: ERROR_COLOR,
	},
});

// The message itself takes its color from the Text color prop, so this is just for the icon.
const insetViewerErrorMessageColorStyle = css({
	color: token('color.text.danger'),
});

const errorMessageStyle = css({
	marginTop: '0px',
	marginLeft: token('space.050'),
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

export const PasswordInput = ({
	onSubmit,
	hasPasswordError,
	onRender,
}: PDFPasswordInputProps): JSX.Element => {
	const passwordInputRef = useRef<HTMLInputElement>(null);
	const onRenderRef = useRef(onRender);
	const [formError, setFormError] = useState(hasPasswordError);
	const intl = useIntl();
	const isInsetViewer = useIsInsetViewer();

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
						<LockIcon
							label=""
							color={isInsetViewer ? (token('color.icon.subtle') as any) : (COLOR_SHADE as any)}
						/>
					</Flex>
					<Box xcss={headerStyles}>
						<div css={[headingStyle, isInsetViewer && insetViewerHeadingStyle]}>
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
									<div
										css={[
											errorMessageWrapperStyle,
											isInsetViewer ? insetViewerErrorMessageColorStyle : errorMessageColorStyle,
										]}
										id={`${fieldProps.id}-error`}
									>
										<ErrorIcon color="currentColor" label="" size="small" />
										<div css={errorMessageStyle} id={`${fieldProps.id}-errorMessage`}>
											<Text as="p" color={isInsetViewer ? 'color.text.danger' : undefined}>
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
