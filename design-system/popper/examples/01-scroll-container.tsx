/**
 * @jsxRuntime classic
 * @jsx jsx
 */

import { css, jsx, styled } from '@compiled/react';
import Lorem from 'react-lorem-component';

import Button from '@atlaskit/button/new';
import { Manager, Popper, Reference } from '@atlaskit/popper';
import { token } from '@atlaskit/tokens';

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-styled -- To migrate as part of go/ui-styling-standard
const Popup = styled.div({
	background: 'white',
	borderColor: 'red',
	borderStyle: 'solid',
	borderWidth: '2px',
	borderRadius: '3px',
	maxWidth: '160px',
	paddingTop: token('space.100', '8px'),
	paddingRight: token('space.100', '8px'),
	paddingBottom: token('space.100', '8px'),
	paddingLeft: token('space.100', '8px'),
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
					// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
					style={style}
					css={[referenceShown, isReferenceHidden && referenceHidden]}
					data-placement={placement}
				>
					<h3>New Popper</h3>
					<Lorem count={1} />
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
	borderWidth: '1px',
	marginBlockStart: token('space.250', '20px'),
	overflow: 'auto',
});

const innerStyles = css({
	boxSizing: 'border-box',
	width: '300%',
	height: '250%',
	paddingBlockEnd: token('space.200', '16px'),
	paddingBlockStart: token('space.200', '16px'),
	paddingInlineEnd: token('space.200', '16px'),
	paddingInlineStart: token('space.200', '16px'),
});

const popperWrapperStyles = css({
	display: 'flex',
	justifyContent: 'center',
});

export default () => (
	<div css={containerStyles}>
		<div css={innerStyles}>
			<h2>Scroll down halfway, then across to see the popper</h2>
			<Lorem count={10} />
			<h2 data-testid="vertical-scroll-identifier">Halfway, now scroll right</h2>
			<div css={popperWrapperStyles}>
				<BasicPopper />
			</div>
			<Lorem count={10} />
		</div>
	</div>
);
