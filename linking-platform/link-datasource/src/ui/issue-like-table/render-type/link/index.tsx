import React, { useMemo } from 'react';

import { type Link } from '@atlaskit/linking-types';
import { Card } from '@atlaskit/smart-card';
import { HoverCard } from '@atlaskit/smart-card/hover-card';
import LinkUrl from '@atlaskit/smart-card/link-url';
import { N300 } from '@atlaskit/theme/colors';
import { h300 } from '@atlaskit/theme/typography';
import { token } from '@atlaskit/tokens';

import { fieldTextFontSize } from '../../styled';

interface LinkProps extends Link {
	testId?: string;
}

const linkStyles = {
	key: {
		...h300(),
		color: token('color.text.subtlest', N300),
		fontWeight: 600,
	},
	default: {},
};

export const LINK_TYPE_TEST_ID = 'link-datasource-render-type--link';

const LinkRenderType = ({ style, url, text, testId = LINK_TYPE_TEST_ID }: LinkProps) => {
	const linkStyle: React.CSSProperties = useMemo(() => {
		return (style?.appearance && linkStyles[style.appearance]) || {};
	}, [style]);

	const anchor = useMemo(
		() => (
			<HoverCard url={url}>
				<LinkUrl
					href={url}
					// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
					style={{ ...linkStyle, fontSize: fieldTextFontSize }}
					data-testid={testId}
					target="_blank"
				>
					{text || url}
				</LinkUrl>
			</HoverCard>
		),
		[linkStyle, url, text, testId],
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

export default React.memo(LinkRenderType);
