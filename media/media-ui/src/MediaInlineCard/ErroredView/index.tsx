/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { token } from '@atlaskit/tokens';
import React from 'react';
import { css, jsx } from '@compiled/react';
import { R500 } from '@atlaskit/theme/colors';
import WarningIcon from '@atlaskit/icon/core/migration/status-warning--warning';
import { Frame } from '../Frame';
import { IconAndTitleLayout } from '../IconAndTitleLayout';
import { AKIconWrapper } from '../Icon';
export interface MediaInlineCardErroredViewProps {
	/** The error message to display */
	message: string;
	/** The optional click handler */
	onClick?: React.EventHandler<React.MouseEvent | React.KeyboardEvent>;
	/** A flag that determines whether the card is selected in edit mode. */
	isSelected?: boolean;
	/** A `testId` prop is provided for specified elements, which is a unique string that appears as a data attribute `data-testid` in the rendered code, serving as a hook for automated tests */
	testId?: string;
	/* Icon to be provided to show this error state */
	icon?: React.ReactNode;
	innerRef?: React.Ref<HTMLSpanElement>;
}

const errorTitleStyles = css({
	color: token('color.text.danger', R500),
});
export class MediaInlineCardErroredView extends React.Component<MediaInlineCardErroredViewProps> {
	render() {
		const {
			onClick,
			isSelected,
			innerRef,
			testId = 'media-inline-card-errored-view',
			icon,
		} = this.props;

		return (
			<Frame testId={testId} innerRef={innerRef} onClick={onClick} isSelected={isSelected} isError>
				<IconAndTitleLayout
					icon={
						icon || (
							<AKIconWrapper>
								<WarningIcon
									label="error"
									LEGACY_size="small"
									color={token('color.icon.danger', R500)}
									size="small"
								/>
							</AKIconWrapper>
						)
					}
					title={<span css={errorTitleStyles}>{this.props.message}</span>}
				/>
			</Frame>
		);
	}
}
