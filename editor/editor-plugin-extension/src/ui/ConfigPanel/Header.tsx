/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { Fragment, lazy, Suspense, useMemo } from 'react';

// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { css, jsx } from '@emotion/react';
import type { WrappedComponentProps } from 'react-intl-next';
import { injectIntl } from 'react-intl-next';

import { IconButton } from '@atlaskit/button/new';
import type { Icon } from '@atlaskit/editor-common/extensions';
import { configPanelMessages as messages } from '@atlaskit/editor-common/extensions';
import { relativeFontSizeToBase16 } from '@atlaskit/editor-shared-styles';
import CrossIcon from '@atlaskit/icon/core/migration/close--cross';
import { Box, Text, xcss } from '@atlaskit/primitives';
import { N200 } from '@atlaskit/theme/colors';
import { borderRadius } from '@atlaskit/theme/constants';
import { token } from '@atlaskit/tokens';

import { HelpLink } from './HelpLink';

const iconWidth = 40;
const buttonWidth = 40;
const margin = 16;
const gapSizeForEllipsis = iconWidth + buttonWidth + margin * 2;

const itemStyles = css({
	display: 'flex',
	marginBottom: token('space.300', '24px'),
});

const itemIconStyles = css({
	width: iconWidth,
	height: iconWidth,
	overflow: 'hidden',
	border: `1px solid ${token('color.border', 'rgba(223, 225, 229, 0.5)')}`,
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
	borderRadius: `${borderRadius()}px`,
	boxSizing: 'border-box',
	display: 'flex',
	justifyContent: 'center',
	alignItems: 'center',
	// eslint-disable-next-line @atlaskit/design-system/no-nested-styles, @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
	div: {
		width: iconWidth,
		height: iconWidth,
	},
});

const itemBodyStyles = css({
	display: 'flex',
	flexDirection: 'row',
	flexWrap: 'nowrap',
	justifyContent: 'space-between',
	// eslint-disable-next-line @atlaskit/design-system/use-tokens-typography
	lineHeight: 1.4,
	margin: `0 ${token('space.200', '16px')}`,
	flexGrow: 3,
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
	maxWidth: `calc(100% - ${gapSizeForEllipsis}px)`,
});

const centeredItemTitleStyles = css({
	display: 'flex',
	flexDirection: 'column',
	justifyContent: 'center',
});

const itemTextStyles = css({
	maxWidth: '100%',
	whiteSpace: 'initial',
	// eslint-disable-next-line @atlaskit/design-system/no-nested-styles, @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
	itemSummary: {
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
		fontSize: relativeFontSizeToBase16(11.67),
		color: token('color.text.subtlest', N200),
		marginTop: token('space.050', '4px'),
		whiteSpace: 'nowrap',
		overflow: 'hidden',
		textOverflow: 'ellipsis',
	},
});

const descriptionStyles = xcss({
	marginBottom: 'space.300',
});

const helpLinkStyles = xcss({
	paddingTop: 'space.150',
});

const closeButtonWrapperStyles = css({
	width: buttonWidth,
	textAlign: 'right',
});

type Props = {
	title: string;
	description?: string;
	summary?: string;
	documentationUrl?: string;
	enableHelpCTA?: boolean;
	icon: Icon;
	onClose: () => void;
} & WrappedComponentProps;

const Header = ({
	icon,
	title,
	description,
	summary,
	documentationUrl,
	enableHelpCTA,
	onClose,
	intl,
}: Props) => {
	const ResolvedIcon = useMemo(() => {
		return lazy(() =>
			icon().then((Cmp) => {
				if ('default' in Cmp) {
					return Cmp;
				}
				return { default: Cmp };
			}),
		);
	}, [icon]);

	return (
		<Fragment>
			<div css={itemStyles}>
				<div css={itemIconStyles}>
					<Suspense fallback={null}>
						<ResolvedIcon label={title} />
					</Suspense>
				</div>
				<div css={itemBodyStyles}>
					{summary ? (
						<div css={itemTextStyles}>
							<div
								// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop -- Ignored via go/DSP-18766
								className="item-title"
								id="context-panel-title"
								data-testid="context-panel-title"
							>
								{title}
							</div>
							{/* eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop -- Ignored via go/DSP-18766 */}
							<div className="item-summary">{summary}</div>
						</div>
					) : (
						<div
							css={centeredItemTitleStyles}
							id="context-panel-title"
							data-testid="context-panel-title"
						>
							{title}
						</div>
					)}
				</div>
				<div css={closeButtonWrapperStyles}>
					<IconButton
						appearance="subtle"
						testId="config-panel-header-close-button"
						label={intl.formatMessage(messages.close)}
						icon={CrossIcon}
						onClick={onClose}
					/>
				</div>
			</div>
			{(description || documentationUrl) && (
				<Box xcss={descriptionStyles}>
					<Text as="p" testId="config-panel-header-description">
						{description && (
							<Fragment>
								{
									// Ignored via go/ees005
									// eslint-disable-next-line require-unicode-regexp
									description.replace(/([^.])$/, '$1.')
								}{' '}
							</Fragment>
						)}
						{documentationUrl &&
							(enableHelpCTA ? (
								<Box xcss={helpLinkStyles}>
									<Text as="p">
										<HelpLink
											documentationUrl={documentationUrl}
											label={intl.formatMessage(messages.help)}
										/>
									</Text>
								</Box>
							) : (
								<HelpLink
									documentationUrl={documentationUrl}
									label={intl.formatMessage(messages.documentation)}
								/>
							))}
					</Text>
				</Box>
			)}
		</Fragment>
	);
};

export default injectIntl(Header);
