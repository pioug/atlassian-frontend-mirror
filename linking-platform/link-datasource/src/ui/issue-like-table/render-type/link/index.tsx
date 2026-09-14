import React, { useMemo } from 'react';

import { useIntl } from 'react-intl';

import type { Link } from '@atlaskit/linking-types/datasource';
import { fg } from '@atlaskit/platform-feature-flags/fg';
import { Card } from '@atlaskit/smart-card';
import { useSmartLinkDestinationUrl } from '@atlaskit/smart-card/hook/use-smart-link-destination-url';
import { HoverCard } from '@atlaskit/smart-card/hover-card';
import LinkUrl from '@atlaskit/smart-card/link-url';
import { token } from '@atlaskit/tokens';
import VisuallyHidden from '@atlaskit/visually-hidden/visually-hidden';

import { messages } from './messages';

interface LinkProps extends Link {
	testId?: string;
}

const linkStyles = {
	key: {
		fontWeight: token('font.weight.semibold'),
		color: token('color.text.subtlest'),
		marginTop: token('space.250'),
	},
	default: {},
};

export const LINK_TYPE_TEST_ID = 'link-datasource-render-type--link';

type SmartCardProps = {
	crossProductUrl: string;
	fallbackComponent: React.JSX.Element;
	testId: string;
	url: string;
};
const SmartCard = ({
	url,
	crossProductUrl,
	testId,
	fallbackComponent,
}: SmartCardProps): React.JSX.Element => {
	const handleClick = (event: React.MouseEvent<HTMLElement>) => {
		event.preventDefault();
		window.open(crossProductUrl, '_blank', 'noopener, noreferrer');
	};

	return (
		<Card
			appearance="inline"
			onClick={handleClick}
			url={url}
			testId={testId}
			fallbackComponent={() => fallbackComponent}
		/>
	);
};

const LinkRenderTypeWithXpcWrappingUrl = ({
	style,
	url,
	text,
	testId = LINK_TYPE_TEST_ID,
}: LinkProps): React.JSX.Element | null => {
	const { formatMessage } = useIntl();
	const linkStyle: React.CSSProperties = useMemo(() => {
		return (style?.appearance && linkStyles[style.appearance]) || {};
	}, [style]);

	const destinationUrl = useSmartLinkDestinationUrl(url);

	const anchor = useMemo(
		() => (
			<HoverCard url={url}>
				<LinkUrl
					href={destinationUrl}
					// NOTE: This will no longer apply styles to `@atlaskit/link`.
					// Wrap `@atlaskit/link` in a Text component to provide font styles to Link
					// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop, @atlaskit/ui-styling-standard/no-imported-style-values -- Ignored via go/DSP-18766
					style={linkStyle}
					data-testid={testId}
					target="_blank"
				>
					{text || url}
					{/* This link always opens in a new tab (`target="_blank"` above), so
					 * screen reader users need to be told before activating it (WCAG 2.4.4). */}
					<VisuallyHidden>{` ${formatMessage(messages.opensInNewTab)}`}</VisuallyHidden>
				</LinkUrl>
			</HoverCard>
		),
		[linkStyle, url, text, testId, formatMessage, destinationUrl],
	);

	// url can be undefined before data is fetched whilst adding new link column to display
	if (!url) {
		return null;
	}

	return (
		<>
			{text ? (
				anchor
			) : (
				<SmartCard
					url={url}
					crossProductUrl={destinationUrl}
					testId={testId}
					fallbackComponent={anchor}
				/>
			)}
			<br />
		</>
	);
};

const LinkRenderType = ({
	style,
	url,
	text,
	testId = LINK_TYPE_TEST_ID,
}: LinkProps): React.JSX.Element | null => {
	const { formatMessage } = useIntl();
	const linkStyle: React.CSSProperties = useMemo(() => {
		return (style?.appearance && linkStyles[style.appearance]) || {};
	}, [style]);

	const anchor = useMemo(
		() => (
			<HoverCard url={url}>
				<LinkUrl
					href={url}
					// NOTE: This will no longer apply styles to `@atlaskit/link`.
					// Wrap `@atlaskit/link` in a Text component to provide font styles to Link
					// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop, @atlaskit/ui-styling-standard/no-imported-style-values -- Ignored via go/DSP-18766
					style={linkStyle}
					data-testid={testId}
					target="_blank"
				>
					{text || url}
					{/* This link always opens in a new tab (`target="_blank"` above), so
					 * screen reader users need to be told before activating it (WCAG 2.4.4). */}
					<VisuallyHidden>{` ${formatMessage(messages.opensInNewTab)}`}</VisuallyHidden>
				</LinkUrl>
			</HoverCard>
		),
		[linkStyle, url, text, testId, formatMessage],
	);

	const SmartCard = () => {
		const handleClick = (e: React.MouseEvent<HTMLElement>) => {
			e.preventDefault();
			window.open(url, '_blank', 'noopener, noreferrer');
		};

		return (
			<Card
				appearance="inline"
				onClick={handleClick}
				url={url}
				testId={testId}
				fallbackComponent={() => anchor}
			/>
		);
	};

	// url can be undefined before data is fetched whilst adding new link column to display
	if (!url) {
		return null;
	}

	return (
		<>
			{text ? anchor : <SmartCard />}
			<br />
		</>
	);
};

const LinkRenderTypeGated = (props: LinkProps) => {
	if (fg('electric_issue_like_table_xpc_url_wrapping')) {
		return <LinkRenderTypeWithXpcWrappingUrl {...props} />;
	}

	return <LinkRenderType {...props} />;
};

const _default_1: React.MemoExoticComponent<
	({ style, url, text, testId }: LinkProps) => React.JSX.Element | null
> = React.memo(LinkRenderTypeGated);
export default _default_1;
