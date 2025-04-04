/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { type ComponentType, forwardRef, type ReactNode, type Ref } from 'react';

import Button, { Theme as ButtonTheme } from '@atlaskit/button/custom-theme-button';
import { css, cssMap, cx, jsx } from '@atlaskit/css';
import Heading from '@atlaskit/heading';
import { useLayering } from '@atlaskit/layering';
import { Box, Text } from '@atlaskit/primitives/compiled';
import { token } from '@atlaskit/tokens';

import { DialogActionItem, DialogActionItemContainer } from '../styled/dialog';
import { type Actions } from '../types';

import { spotlightButtonTheme } from './theme';

const bodyStyles = css({
	display: 'flex',
	flexDirection: 'column',
	paddingBlockEnd: token('space.200', '16px'),
	paddingBlockStart: token('space.200', '16px'),
	paddingInlineEnd: token('space.250', '20px'),
	paddingInlineStart: token('space.250', '20px'),
});

const imageStyles = css({
	display: 'block',
});

const defaultHeaderStyles = css({
	display: 'flex',
	alignItems: 'baseline',
	justifyContent: 'space-between',
	paddingBlockEnd: token('space.100', '8px'),
});

const DefaultHeader = ({ children }: { children: ReactNode }) => (
	<div css={defaultHeaderStyles}>{children}</div>
);

const defaultFooterStyles = css({
	display: 'flex',
	alignItems: 'center',
	justifyContent: 'space-between',
	paddingBlockStart: token('space.100', '8px'),
});

const DefaultFooter = ({ children }: { children: ReactNode }) => (
	<div data-testid="spotlight--dialog-footer" css={defaultFooterStyles}>
		{children}
	</div>
);

const containerStyles = cssMap({
	root: {
		height: 'fit-content',
		borderRadius: token('border.radius'),
		color: token('color.text.inverse'),
		overflow: 'auto',
		minWidth: '160px',
		maxWidth: '600px',
	},
});

const containerShadowStyles = cssMap({
	root: {
		boxShadow: token('elevation.shadow.raised'),
	},
});

interface SpotlightCardProps {
	/**
	 * Buttons to render in the footer.
	 */
	actions?: Actions;
	/**
	 * An optional element rendered to the left of the footer actions.
	 */
	actionsBeforeElement?: ReactNode;
	/**
	 * The content of the card.
	 */
	children?: ReactNode;
	/**
	 * The container elements rendered by the component.
	 */
	components?: {
		Header?: ComponentType<any>;
		Footer?: ComponentType<any>;
	};
	/**
	 * The heading to be rendered above the body content.
	 */
	heading?: ReactNode;
	/**
	 * Specifies the heading level in the document structure.
	 * If not specified, level 4 will be applied by default.
	 */
	headingLevel?: 1 | 2 | 3 | 4 | 5 | 6;
	/**
	 * An optional element rendered to the right of the heading, usually used to number steps in a multi-step flow.
	 */
	headingAfterElement?: ReactNode;
	/**
	 * The image src to render above the heading.
	 */
	image?: string | ReactNode;
	/**
	 * Removes elevation styles if set.
	 */
	isFlat?: boolean;

	/**
	 * Specifies the width of the card component. Accepts either a number or the string '100%'.
	 * When a number is provided, the width is set in pixels. When '100%' is provided, the width
	 * is set to occupy 100% of the parent container's width. Regardless of whether `width` is set,
	 * the width is constrained to a minimum width of 160px and a maximum width of 600px.
	 */
	width?: number | '100%';
	/**
	 * @deprecated
	 * Use `ref` instead.
	 */
	innerRef?: Ref<HTMLDivElement> | null;
	/**
	 * A `testId` prop is provided for specified elements,
	 * which is a unique string that appears as a data attribute `data-testid` in the rendered code,
	 * serving as a hook for automated tests.
	 */
	testId?: string;
	/**
	 * The ID of heading.
	 */
	headingId?: string;
}

/**
 * __Spotlight card__
 *
 * A spotlight card is for onboarding messages that need a more flexible layout, or don't require a dialog.
 *
 * - [Examples](https://atlassian.design/components/onboarding/spotlight-card/examples)
 * - [Code](https://atlassian.design/components/onboarding/spotlight-card/code)
 * - [Usage](https://atlassian.design/components/onboarding/spotlight-card/usage)
 */
const SpotlightCard = forwardRef<HTMLDivElement, SpotlightCardProps>(
	(props: SpotlightCardProps, ref) => {
		const {
			actions = [],
			actionsBeforeElement,
			children,
			components = {},
			heading,
			headingLevel = 4,
			headingAfterElement,
			image,
			innerRef,
			isFlat,
			testId,
			width = 400,
			headingId,
		} = props;
		const { Header = DefaultHeader, Footer = DefaultFooter } = components;
		const { currentLevel } = useLayering();

		return (
			<ButtonTheme.Provider value={spotlightButtonTheme}>
				<Box
					backgroundColor="color.background.discovery.bold"
					xcss={cx(containerStyles.root, !isFlat && containerShadowStyles.root)}
					style={{ width }}
					ref={ref || innerRef}
					testId={testId}
					data-ds--level={currentLevel}
					// temporarily use this data attribute to prevent clicking outside won't close spotlight correctly issue
					data-ds--close--type="single"
				>
					{typeof image === 'string' ? <img css={imageStyles} src={image} alt="" /> : image}
					<div css={bodyStyles}>
						{heading || headingAfterElement ? (
							<Header>
								<Heading
									id={headingId}
									size="medium"
									as={`h${headingLevel}`}
									color="color.text.inverse"
								>
									{heading}
								</Heading>
								{headingAfterElement}
							</Header>
						) : null}
						<Text>{children}</Text>
						{actions.length > 0 || actionsBeforeElement ? (
							<Footer>
								{/* Always need an element so space-between alignment works */}
								{actionsBeforeElement || <span />}
								<DialogActionItemContainer>
									{actions.map(({ text, key, ...rest }, idx) => {
										return (
											<DialogActionItem key={key || (typeof text === 'string' ? text : `${idx}`)}>
												<Button {...rest}>{text}</Button>
											</DialogActionItem>
										);
									})}
								</DialogActionItemContainer>
							</Footer>
						) : null}
					</div>
				</Box>
			</ButtonTheme.Provider>
		);
	},
);

SpotlightCard.displayName = 'SpotlightCard';

export default SpotlightCard;
