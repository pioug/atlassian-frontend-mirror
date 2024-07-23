/* eslint-disable @atlaskit/design-system/consistent-css-prop-usage */
/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import React, { useState } from 'react';

// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { jsx } from '@emotion/react';

import Expand from '@atlaskit/icon/glyph/arrow-down';
import Calendar from '@atlaskit/icon/glyph/calendar';
import Open from '@atlaskit/icon/glyph/editor/open';
import Unlink from '@atlaskit/icon/glyph/editor/unlink';
import Page from '@atlaskit/icon/glyph/page';
import Question from '@atlaskit/icon/glyph/question';

import { type Appearance } from '../src';
import Button, { type ButtonProps } from '../src/old-button/button';

const styles = {
	sample: {
		display: 'flex',
		justifyContent: 'space-between',
		alignItems: 'baseline',
		borderBottom: '1px solid',
		paddingBottom: '10px',
		paddingTop: '10px',
	},
	customColor: {
		backgroundColor: '#ffbbc7 !important',
		border: '1px solid #c87a88',
		color: '#6B0014 !important',
	},
	truncated: {
		maxWidth: '100px',
	},
	buttonContainer: {
		'> a': {
			marginRight: '5px',
		},
		'> button': {
			marginRight: '5px',
		},
		'.sample > a': {
			marginRight: '5px',
		},
		'.sample > button': {
			marginRight: '5px',
		},
	},
};

const CustomComponent = React.forwardRef<HTMLDivElement, React.PropsWithChildren<{}>>(
	(props, ref) => (
		<div {...props} ref={ref}>
			{props.children}
		</div>
	),
);

const BuildStory = (props: ButtonProps) => {
	const { appearance } = props;
	return (
		<div data-testid="combinations" css={{ padding: '10px' }}>
			<div css={styles.sample}>
				<Button appearance={appearance}>Create Issue</Button>
				<span>no extra attrs</span>
			</div>

			<div css={styles.sample}>
				<Button appearance={appearance} href="//www.atlassian.com">
					Create Issue
				</Button>
				<span>with href attribute</span>
			</div>

			<div css={styles.sample}>
				<Button appearance={appearance} href="//www.atlassian.com">
					Create Issue
				</Button>
				<span>with href attribute + no target</span>
			</div>

			<div css={styles.sample}>
				<span>
					text
					<Button appearance={appearance} onClick={() => console.log('clicking the Component')}>
						Create Issue
					</Button>
					text
				</span>
				<span>click event + text alignment check</span>
			</div>

			<div css={styles.sample}>
				<Button
					appearance={appearance}
					isDisabled
					onClick={() => console.log('clicking the Component')}
				>
					Disabled Option
				</Button>
				<span>disabled</span>
			</div>

			<div css={styles.sample}>
				<Button
					appearance={appearance}
					isDisabled
					onClick={() => console.log('clicking the Component')}
					href="//www.atlassian.com"
					target="_blank"
				>
					Go to Site
				</Button>
				<span>disabled + href + target</span>
			</div>

			<div css={styles.sample}>
				<Button appearance={appearance} component={CustomComponent}>
					With a custom component
				</Button>
			</div>

			<div css={styles.sample}>
				<Button appearance={appearance} css={styles.customColor}>
					Custom classes with crazy colors
				</Button>
				<span>custom classes</span>
			</div>

			<div css={styles.sample}>
				<Button appearance={appearance} css={styles.truncated}>
					Truncated text which is very long and has many words to demonstrate truncation
				</Button>
				<span>truncated</span>
			</div>

			<div css={styles.sample}>
				<Button appearance={appearance} isSelected>
					Selected
				</Button>
				<span>selected</span>
			</div>

			<div css={styles.sample}>
				<Button appearance={appearance} iconBefore={<Page label="" />}>
					Comment
				</Button>
				<span>button + text with page icon</span>
			</div>

			<div css={styles.sample}>
				<span>
					text
					<Button appearance={appearance} iconBefore={<Question label="">Question</Question>}>
						Info
					</Button>
					text
				</span>
				<span>button + text with question icon + text alignment check</span>
			</div>

			<div css={styles.sample}>
				<span>
					text
					<Button appearance={appearance} isSelected iconAfter={<Calendar label="" />}>
						Pick Date
					</Button>
					text
				</span>
				<span>button + text with calendar icon + text alignment check + selected</span>
			</div>

			<div css={styles.sample}>
				<Button appearance={appearance} iconAfter={<Expand label="" />}>
					Show Options
				</Button>
				<span>button + text with expand icon</span>
			</div>

			<div css={styles.sample}>
				<Button
					appearance={appearance}
					href="//www.atlassian.com"
					iconBefore={<Page label="page icon" />}
				/>
				<span>button with Page icon + href</span>
			</div>

			<div css={styles.sample}>
				<Button
					appearance={appearance}
					href="//www.atlassian.com"
					target="_blank"
					iconBefore={<Expand label="expand icon" />}
				/>
				<span>button with icons + href + target</span>
			</div>

			<div css={styles.sample}>
				<span>
					text
					<Button appearance={appearance} iconBefore={<Calendar label="calendar icon" />} />
					text
				</span>
				<span>button with Calendar icon + text alignment check</span>
			</div>

			<div css={styles.sample}>
				<Button
					appearance={appearance}
					isSelected
					iconBefore={<Question label="question icon">Question</Question>}
				/>
				<span>button with Question icon + selected</span>
			</div>

			<div css={styles.sample}>
				<div css={styles.buttonContainer}>
					<Button appearance={appearance} spacing="none">
						1
					</Button>
					<Button appearance={appearance} spacing="compact">
						1
					</Button>
					<Button appearance={appearance}>1</Button>
				</div>
				<span>Button with small text</span>
			</div>

			<div css={styles.sample}>
				<div css={styles.buttonContainer}>
					<Button
						appearance={appearance}
						spacing="none"
						iconBefore={<Unlink label="unlink icon">unlink</Unlink>}
					/>
					<Button
						appearance={appearance}
						spacing="none"
						isSelected
						iconBefore={<Unlink label="unlink icon">unlink selected</Unlink>}
					/>
					<Button
						appearance={appearance}
						spacing="none"
						iconBefore={<Open label="open icon">open</Open>}
					/>
					<Button
						appearance={appearance}
						spacing="none"
						isSelected
						iconBefore={<Open label="open icon">open selected</Open>}
					/>
				</div>
				<span>button with icons, no spacing &amp; selected</span>
			</div>

			<div css={styles.sample}>
				<Button appearance={appearance} spacing="compact">
					Create Issue
				</Button>
				<Button
					appearance={appearance}
					spacing="compact"
					iconBefore={<Page label="">create issue</Page>}
				>
					Create Issue
				</Button>
				<span>compact</span>
			</div>

			<div css={styles.sample}>
				<Button
					appearance={appearance}
					onClick={() => console.log('clicking the Component')}
					spacing="compact"
					isDisabled
				>
					Disabled Option
				</Button>
				<span>compact + disabled</span>
			</div>

			<div css={styles.sample}>
				<Button appearance={appearance} spacing="compact" isSelected>
					Selected Option
				</Button>
				<span>compact + selected</span>
			</div>

			<div css={styles.sample}>
				<Button appearance={appearance} shouldFitContainer>
					Create Issue
				</Button>
				<span>shouldFitContainer</span>
			</div>

			<div css={styles.sample}>
				<Button appearance={appearance} iconBefore={<Page label="" />} shouldFitContainer>
					Comment
				</Button>
				<span>shouldFitContainer with page icon</span>
			</div>
			<div css={styles.sample}>
				<Button
					appearance={appearance}
					iconBefore={<Page label="page icon" />}
					shouldFitContainer
				/>
				<span>shouldFitContainer icon only</span>
			</div>
		</div>
	);
};

const appearances: Appearance[] = [
	'default',
	'danger',
	'link',
	'primary',
	'subtle',
	'subtle-link',
	'warning',
];

/* eslint-disable react/no-multi-comp */
export default function Example() {
	const [appearance, setAppearance] = useState<Appearance>('default');

	const onChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
		setAppearance(event.target.value as Appearance);
	};

	return (
		<div>
			<h3>Select an appearance option to see its effects in contexts</h3>
			{/* eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766 */}
			<div style={{ marginTop: '1rem' }}>
				<label htmlFor="appearance">Appearance</label>
				<select
					id="appearance"
					// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
					style={{ display: 'block' }}
					onChange={onChange}
					value={appearance}
				>
					{appearances.map((a) => (
						<option key={a} value={a}>
							{a}
						</option>
					))}
				</select>
			</div>
			<BuildStory appearance={appearance} />
		</div>
	);
}
