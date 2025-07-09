/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { useState } from 'react';

import { css, jsx } from '@compiled/react';

import Button from '@atlaskit/button/new';
import { Label } from '@atlaskit/form';
import {
	BitbucketIcon,
	ConfluenceIcon,
	JiraSoftwareIcon,
	OpsgenieIcon,
	StatuspageIcon,
} from '@atlaskit/logo';
import { FadeIn, StaggeredEntrance, useResizingHeight } from '@atlaskit/motion';
import { token } from '@atlaskit/tokens';

import { Centered } from './utils';

const logos = [
	[<BitbucketIcon size="small" />, 'Bitbucket'],
	[<ConfluenceIcon size="small" />, 'Confluence'],
	[<JiraSoftwareIcon size="small" />, 'Jira Software'],
	[<OpsgenieIcon size="small" />, 'Opsgenie'],
	[<StatuspageIcon size="small" />, 'Statuspage'],
];

const searchTerm: { [key: string]: string } = {
	s1: 'dev',
	s2: 'design',
	s3: 'software',
	s4: 'ops',
	s5: 'all',
};

export default () => {
	const [num, setNum] = useState(1);

	return (
		<div>
			<div
				// eslint-disable-next-line @atlaskit/design-system/consistent-css-prop-usage -- Ignored via go/DSP-18766
				css={{
					textAlign: 'center',
					'> *': { margin: token('space.025', '2px') },
				}}
			>
				{[1, 2, 3, 4, 5].map((number) => (
					<Button
						testId={`button--${number}`}
						key={number}
						isSelected={num === number}
						onClick={() => {
							setNum(number);
						}}
					>
						{number}
					</Button>
				))}
			</div>

			<Centered>
				<div
					data-testid="menu"
					{...useResizingHeight()}
					// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/design-system/consistent-css-prop-usage -- Ignored via go/DSP-18766
					css={css({
						width: '100%',
						maxWidth: '500px',
						borderRadius: token('border.radius.100', '3px'),
						boxShadow: token('elevation.shadow.overlay'),
						marginBlockEnd: '56px',
						marginBlockStart: token('space.300', '24px'),
						paddingBlockEnd: token('space.100', '8px'),
					})}
				>
					<Label htmlFor="resize-text">Resize</Label>
					<input
						id="resize-text"
						type="text"
						readOnly
						value={searchTerm[`s${num}`]}
						// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/design-system/consistent-css-prop-usage -- Ignored via go/DSP-18766
						css={css({
							display: 'block',
							boxSizing: 'border-box',
							width: '100%',
							border: 'none',
							borderRadius: `${token('border.radius', '3px')} ${token('border.radius', '3px')} 0 0`,
							color: '#172b4d',
							fontSize: '24px',
							marginBlockEnd: token('space.100', '8px'),
							paddingBlockEnd: token('space.200', '16px'),
							paddingBlockStart: token('space.200', '16px'),
							paddingInlineEnd: token('space.200', '16px'),
							paddingInlineStart: token('space.200', '16px'),
							'&:hover': {
								backgroundColor: token('color.background.neutral.subtle.hovered'),
							},
						})}
					/>
					<StaggeredEntrance columns={1}>
						{Array(num)
							.fill(undefined)
							.map((_, index) => (
								<FadeIn key={index}>
									{(motion) => (
										<div
											// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/design-system/consistent-css-prop-usage -- Ignored via go/DSP-18766
											css={css({
												display: 'flex',
												fontSize: '16px',
												fontWeight: token('font.weight.medium', '500'),
												paddingBlockEnd: token('space.200', '16px'),
												paddingBlockStart: token('space.200', '16px'),
												paddingInlineEnd: token('space.200', '16px'),
												paddingInlineStart: token('space.200', '16px'),
												'&:hover': {
													backgroundColor: token('color.background.neutral.subtle.hovered'),
												},
											})}
											// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop
											className={motion.className}
											// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop
											style={motion.style}
											ref={motion.ref}
										>
											{logos[index][0]}
											<h3
												// eslint-disable-next-line @atlaskit/design-system/consistent-css-prop-usage -- Ignored via go/DSP-18766
												css={{
													margin: 0,
													fontWeight: 300,
													marginLeft: token('space.100', '8px'),
												}}
											>
												{logos[index][1]}
											</h3>
										</div>
									)}
								</FadeIn>
							))}
					</StaggeredEntrance>
				</div>
			</Centered>
		</div>
	);
};
