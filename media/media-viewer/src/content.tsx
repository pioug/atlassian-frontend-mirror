import React from 'react';
import { Component, type ReactElement } from 'react';
import CrossIcon from '@atlaskit/icon/core/cross';
import { MediaButton, hideControlsClassName, InactivityDetector } from '@atlaskit/media-ui';
import { CloseButtonWrapper, ContentWrapper } from './styleWrappers';
import { type WithShowControlMethodProp } from '@atlaskit/media-ui';

export interface ContentProps {
	onClose?: () => void;
	children: ReactElement<WithShowControlMethodProp>;
	isSidebarVisible?: boolean;
}

export class Content extends Component<ContentProps> {
	/*
	 * Here we get called by InactivityDetector and given a function we
	 * pass down as "showControls" to out children.
	 */
	render(): React.JSX.Element {
		const { onClose, isSidebarVisible } = this.props;

		return (
			<ContentWrapper isSidebarVisible={isSidebarVisible}>
				<InactivityDetector>
					{(triggerActivityCallback) => {
						const children = React.cloneElement(this.props.children, {
							showControls: triggerActivityCallback,
						});
						return (
							<>
								{/* eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop -- Ignored via go/DSP-18766 */}
								<CloseButtonWrapper className={hideControlsClassName}>
									<MediaButton
										testId="media-viewer-close-button"
										onClick={onClose}
										iconBefore={<CrossIcon color="currentColor" spacing="spacious" label="Close" />}
									/>
								</CloseButtonWrapper>
								{children}
							</>
						);
					}}
				</InactivityDetector>
			</ContentWrapper>
		);
	}
}
