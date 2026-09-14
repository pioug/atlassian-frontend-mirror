/**
 * @jsxRuntime classic
 * @jsx jsx
 */

import { css, jsx, styled } from '@compiled/react';

import Button from '@atlaskit/button/default/button';
import { Manager } from '@atlaskit/popper/manager';
import { Popper } from '@atlaskit/popper/main';
import { Reference } from '@atlaskit/popper/reference';
import { token } from '@atlaskit/tokens';

const placeholderText =
	'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.';

const PlaceholderContent = ({ count }: { count: number }) => (
	<div>
		{Array.from({ length: count }, (_, index) => (
			<p key={index}>{placeholderText}</p>
		))}
	</div>
);

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-styled -- To migrate as part of go/ui-styling-standard
const Popup = styled.div({
	background: 'white',
	borderColor: 'red',
	borderStyle: 'solid',
	borderWidth: token('border.width.selected'),
	// eslint-disable-next-line @atlaskit/design-system/no-unsafe-design-token-usage
	borderRadius: token('radius.small', '3px'),
	maxWidth: '160px',
	paddingTop: token('space.100'),
	paddingRight: token('space.100'),
	paddingBottom: token('space.100'),
	paddingLeft: token('space.100'),
	transition: 'opacity 200ms ease-in-out',
	boxShadow: token('elevation.shadow.overlay'),
});

const referenceShown = css({ opacity: 1 });
const referenceHidden = css({ opacity: 0 });

const BasicPopper = () => (
	<Manager>
		<Reference>
			{({ ref }) => (
				<Button testId="horizontal-scroll-identifier" appearance="primary" ref={ref}>
					Reference element
				</Button>
			)}
		</Reference>
		<Popper>
			{({ ref, style, placement, isReferenceHidden }) => (
				<Popup
					data-testid="expanded-popup"
					ref={ref}
					style={style}
					css={[referenceShown, isReferenceHidden && referenceHidden]}
					data-placement={placement}
				>
					<h3>New Popper</h3>
					<PlaceholderContent count={1} />
				</Popup>
			)}
		</Popper>
	</Manager>
);

const containerStyles = css({
	maxWidth: '800px',
	maxHeight: '400px',
	borderColor: 'black',
	borderStyle: 'solid',
	borderWidth: token('border.width'),
	marginBlockStart: token('space.250'),
	overflow: 'auto',
});

const innerStyles = css({
	boxSizing: 'border-box',
	width: '300%',
	height: '250%',
	paddingBlockEnd: token('space.200'),
	paddingBlockStart: token('space.200'),
	paddingInlineEnd: token('space.200'),
	paddingInlineStart: token('space.200'),
});

const popperWrapperStyles = css({
	display: 'flex',
	justifyContent: 'center',
});

export default (): JSX.Element => (
	<div css={containerStyles}>
		<div css={innerStyles}>
			<h2>Scroll down halfway, then across to see the popper</h2>
			<PlaceholderContent count={10} />
			<h2 data-testid="vertical-scroll-identifier">Halfway, now scroll right</h2>
			<div css={popperWrapperStyles}>
				<BasicPopper />
			</div>
			<PlaceholderContent count={10} />
		</div>
	</div>
);
