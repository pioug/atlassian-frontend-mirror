import React from 'react';
import ImageLoader from 'react-render-image';
import { Icon, Shimmer } from '../Icon';
import {
	IconEmptyWrapper,
	IconPositionWrapper,
	IconTitleWrapper,
	IconWrapper,
	TitleWrapper,
	EmojiWrapper,
	TitleWrapperClassName,
} from './styled';
import LinkIcon from '@atlaskit/icon/core/migration/link';
import { LinkAppearance, NoLinkAppearance } from '../styled';

export interface IconAndTitleLayoutProps {
	emoji?: React.ReactNode;
	icon?: React.ReactNode;
	title: React.ReactNode;
	right?: React.ReactNode;
	titleColor?: string;
	titleTextColor?: string;
	children?: React.ReactNode;
	defaultIcon?: React.ReactNode;
	testId?: string;
	link?: string;
	rightSide?: React.ReactNode;
	rightSideSpacer: boolean;
	onClick?: React.EventHandler<React.MouseEvent | React.KeyboardEvent>;
}

export class IconAndTitleLayout extends React.Component<IconAndTitleLayoutProps> {
	public static defaultProps = {
		rightSideSpacer: true,
	};

	private renderAtlaskitIcon() {
		const { icon, emoji } = this.props;

		if (emoji) {
			return <EmojiWrapper>{emoji}</EmojiWrapper>;
		}

		if (!icon || typeof icon === 'string') {
			return null;
		}

		return <IconWrapper>{icon}</IconWrapper>;
	}

	private renderImageIcon(errored: React.ReactNode, testId: string) {
		const { icon: url } = this.props;

		if (!url || typeof url !== 'string') {
			return null;
		}

		return (
			<ImageLoader
				src={url}
				loaded={
					<Icon
						// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop -- Ignored via go/DSP-18766
						className="smart-link-icon"
						src={url}
						data-testid={`${testId}-image`}
					/>
				}
				errored={errored}
				loading={<Shimmer testId={`${testId}-loading`} />}
			/>
		);
	}

	private renderIconPlaceholder(testId: string) {
		const { defaultIcon } = this.props;

		if (defaultIcon) {
			return <IconWrapper>{defaultIcon}</IconWrapper>;
		}

		return (
			<IconWrapper>
				<LinkIcon
					label="link"
					LEGACY_size="small"
					testId={`${testId}-default`}
					color="currentColor"
				/>
			</IconWrapper>
		);
	}

	renderIcon(testId: string) {
		// We render two kinds of icons here:
		// - Image: acquired from either DAC or Teamwork Platform Apps;
		// - Atlaskit Icon: an Atlaskit SVG;
		// Each of these are scaled down to 12x12.
		const icon = this.renderAtlaskitIcon();
		if (icon) {
			return icon;
		}

		const placeholder = this.renderIconPlaceholder(testId);
		const image = this.renderImageIcon(placeholder, testId);

		return image || placeholder;
	}

	handleClick = (event: React.MouseEvent) => {
		const { onClick } = this.props;
		if (onClick) {
			event.preventDefault();
			event.stopPropagation();
			onClick(event);
		}
	};

	handleKeyPress = (event: React.KeyboardEvent<HTMLAnchorElement>) => {
		const { onClick } = this.props;
		if (event.key !== ' ' && event.key !== 'Enter') {
			return;
		}
		if (onClick) {
			event.preventDefault();
			event.stopPropagation();
			onClick(event);
		}
	};

	render() {
		const {
			children,
			title,
			titleColor,
			titleTextColor,
			link,
			rightSide,
			testId = 'inline-card-icon-and-title',
		} = this.props;

		const titlePart = (
			<>
				<IconPositionWrapper>
					{children || (
						<>
							<IconEmptyWrapper />
							{this.renderIcon(testId)}
						</>
					)}
				</IconPositionWrapper>
				<TitleWrapper
					// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
					style={{ color: titleTextColor }}
					// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop -- Ignored via go/DSP-18766
					className={TitleWrapperClassName}
				>
					{title}
				</TitleWrapper>
			</>
		);

		return (
			// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
			<IconTitleWrapper style={{ color: titleColor }} data-testid={testId}>
				{link ? (
					<LinkAppearance href={link} onClick={this.handleClick} onKeyPress={this.handleKeyPress}>
						{titlePart}
					</LinkAppearance>
				) : (
					titlePart
				)}
				{rightSide ? <NoLinkAppearance>{rightSide}</NoLinkAppearance> : null}
			</IconTitleWrapper>
		);
	}
}
