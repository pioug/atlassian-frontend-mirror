import React, { type ReactElement } from 'react';

import { cssMap, cx } from '@atlaskit/css';
import LinkFilledIcon from '@atlaskit/icon/core/migration/link--link-filled';
import CheckCircleIcon from '@atlaskit/icon/core/migration/status-success--check-circle';
import { fg } from '@atlaskit/platform-feature-flags';
import Popup, { type TriggerProps } from '@atlaskit/popup';
import { Box } from '@atlaskit/primitives/compiled';
import { G300 } from '@atlaskit/theme/colors';
import { layers } from '@atlaskit/theme/constants';
import { token } from '@atlaskit/tokens';
import Tooltip from '@atlaskit/tooltip';

import { InlineDialogContentWrapper } from './ShareFormWrapper/compiled';
import Button from './styles';

const Z_INDEX = layers.modal();

const AUTO_DISMISS_SECONDS = 8;

export const AUTO_DISMISS_MS = AUTO_DISMISS_SECONDS * 1000;

const styles = cssMap({
	messageContainer: {
		display: 'flex',
		alignItems: 'center',
		marginTop: token('space.negative.100', '-8px'),
		marginRight: token('space.negative.200', '-16px'),
		marginBottom: token('space.negative.100', '-8px'),
		marginLeft: token('space.negative.200', '-16px'),
	},
	boxWrapper: {
		marginRight: token('space.025', '2px'),
	},
	copyIconContainerStyles: {
		marginRight: token('space.025', '2px'),
		minWidth: '28px',
		textAlign: 'left',
	},
	messageText: {
		textIndent: token('space.075', '6px'),
	},
});

const isSafari = typeof window !== 'undefined' && window.navigator.userAgent.indexOf('Safari');

type InputProps = {
	label: string;
	text: string;
};

export const HiddenInput = React.forwardRef<HTMLInputElement, InputProps>(
	// we need a hidden input to reliably copy to clipboard across all browsers.
	(props, ref) => (
		<input
			// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
			style={{ position: 'absolute', left: '-9999px' }}
			tabIndex={-1}
			aria-hidden={true}
			ref={ref}
			value={props.text}
			aria-label={props.label}
			readOnly
		/>
	),
);

export type Props = {
	children?: string | ReactElement;
	copiedToClipboardText: string;
	copyLinkButtonText: string;
	copyTooltipText?: string;
	iconBefore?: ReactElement;
	isDisabled?: boolean;
	isExtendedShareDialogEnabled?: boolean;
	link: string;
	onLinkCopy?: (link: string) => void;
};

export type State = {
	shouldShowCopiedMessage: boolean;
};

// eslint-disable-next-line @repo/internal/react/no-class-components
export class CopyLinkButton extends React.Component<Props, State> {
	private autoDismiss: ReturnType<typeof setTimeout> | undefined;
	private inputRef: React.RefObject<HTMLInputElement> = React.createRef();

	state = {
		shouldShowCopiedMessage: false,
	};

	componentWillUnmount() {
		this.clearAutoDismiss();
	}

	private clearAutoDismiss = () => {
		if (this.autoDismiss) {
			clearTimeout(this.autoDismiss);
			this.autoDismiss = undefined;
		}
	};

	private handleClick = () => {
		this.inputRef.current!.select();
		document.execCommand('copy');

		if (this.props.onLinkCopy) {
			this.props.onLinkCopy!(this.props.link);
		}

		this.setState({ shouldShowCopiedMessage: true }, () => {
			this.clearAutoDismiss();
			this.autoDismiss = setTimeout(() => {
				this.setState({ shouldShowCopiedMessage: false });
			}, AUTO_DISMISS_MS);
		});
	};

	private handleDismissCopiedMessage = () => {
		this.clearAutoDismiss();
		this.setState({ shouldShowCopiedMessage: false });
	};

	renderTriggerButton = (triggerProps: TriggerProps) => {
		const { isDisabled, copyLinkButtonText, children, iconBefore, isExtendedShareDialogEnabled } =
			this.props;
		return (
			<Button
				aria-label={copyLinkButtonText}
				isDisabled={isDisabled}
				// TODO: (from codemod)"link" and "subtle-link" appearances are only available in LinkButton, please either provide a href prop then migrate to LinkButton, or remove the appearance from the default button.
				// https://product-fabric.atlassian.net/browse/DSP-18980
				appearance="subtle-link"
				iconBefore={
					iconBefore || (
						<Box
							xcss={cx(
								isExtendedShareDialogEnabled ? styles.copyIconContainerStyles : styles.boxWrapper,
							)}
						>
							<LinkFilledIcon
								LEGACY_margin={`0 ${token('space.negative.025')} 0 0`}
								color={isExtendedShareDialogEnabled ? token('color.text.subtle') : 'currentColor'}
								label=""
								LEGACY_size="medium"
							/>
						</Box>
					)
				}
				onClick={this.handleClick}
				ref={triggerProps.ref}
				spacing={isExtendedShareDialogEnabled ? 'none' : 'default'}
				theme={
					isExtendedShareDialogEnabled
						? (current, themeProps) => ({
								buttonStyles: {
									...current(themeProps).buttonStyles,
									color: token('color.text'),
									font: token('font.body'),
									alignItems: 'center',
								},
								spinnerStyles: current(themeProps).spinnerStyles,
							})
						: undefined
				}
			>
				{children || copyLinkButtonText}
			</Button>
		);
	};

	render() {
		const { shouldShowCopiedMessage } = this.state;
		const { copyTooltipText, copiedToClipboardText } = this.props;

		return (
			<React.Fragment>
				{/* Added ARIA live region specifically for VoiceOver + Safari since the status */}
				{/* message 'Link copied to clipboard' is not announced by VO */}
				{isSafari && (
					// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop -- Ignored via go/DSP-18766
					<div className="assistive" aria-live="assertive">
						{shouldShowCopiedMessage && copiedToClipboardText}
					</div>
				)}
				<HiddenInput ref={this.inputRef} text={this.props.link} label={copiedToClipboardText} />
				{/* eslint-disable-next-line @atlaskit/design-system/use-should-render-to-parent */}
				<Popup
					zIndex={Z_INDEX}
					autoFocus={false}
					content={() => (
						<InlineDialogContentWrapper>
							<Box xcss={cx(styles.messageContainer)} testId="message-container" aria-hidden>
								<React.Fragment>
									<CheckCircleIcon
										spacing="spacious"
										label=""
										color={token('color.icon.success', G300)}
									/>
									<Box xcss={cx(styles.messageText)}>{copiedToClipboardText}</Box>
								</React.Fragment>
							</Box>
						</InlineDialogContentWrapper>
					)}
					isOpen={shouldShowCopiedMessage}
					onClose={this.handleDismissCopiedMessage}
					placement="top-start"
					trigger={(triggerProps: TriggerProps) =>
						copyTooltipText ? (
							<Tooltip content={copyTooltipText} position="bottom-start">
								{this.renderTriggerButton(triggerProps)}
							</Tooltip>
						) : (
							this.renderTriggerButton(triggerProps)
						)
					}
					shouldRenderToParent={fg('enable-appropriate-reading-order-in-share-dialog')}
				/>
			</React.Fragment>
		);
	}
}

export default CopyLinkButton;
