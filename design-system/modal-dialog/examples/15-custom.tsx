/**
 * @jsxRuntime classic
 */
/** @jsx jsx */
import React, { useCallback, useState } from 'react';

// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { css, jsx } from '@emotion/react';
import Lorem from 'react-lorem-component';

import ButtonGroup from '@atlaskit/button/button-group';
import Button, { IconButton } from '@atlaskit/button/new';
import CrossIcon from '@atlaskit/icon/glyph/cross';
import { Box, Inline, xcss } from '@atlaskit/primitives';
import { token } from '@atlaskit/tokens';
import Tooltip from '@atlaskit/tooltip';

import ModalDialog, {
	ModalBody,
	ModalFooter,
	ModalHeader,
	ModalTitle,
	ModalTransition,
	useModal,
} from '../src';

const defaults = ['header', 'footer', 'both', 'neither'];
const custom = ['custom header', 'custom body', 'custom footer'];

const containerStyles = xcss({
	padding: 'space.200',
});

const titleStyles = css({
	marginBlockEnd: token('space.200', '16px'),
});

const headerStyles: React.CSSProperties = {
	background:
		'url(https://atlassian.design/react_assets/images/cards/personality.png) center top no-repeat',
	backgroundSize: 'cover',
	borderRadius: '4px 4px 0 0',
	// eslint-disable-next-line @atlaskit/design-system/ensure-design-token-usage
	paddingTop: 170,
	position: 'relative',
};

const CustomHeader = () => {
	const { onClose } = useModal();

	return (
		// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
		<div style={headerStyles}>
			<span
				style={{
					// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
					position: 'absolute',
					// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
					right: 0,
					// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
					top: token('space.050', '4px'),
				}}
			>
				<IconButton
					onClick={onClose}
					icon={(iconProps) => <CrossIcon {...iconProps} size="small" />}
					label="Close Modal"
				/>
			</span>
		</div>
	);
};

const bodyStyles: React.CSSProperties = {
	// eslint-disable-next-line @atlaskit/design-system/ensure-design-token-usage
	padding: 90,
	backgroundColor: token('elevation.surface.overlay'),
	overflowY: 'auto',
	overflowX: 'hidden',
};

const CustomBody = React.forwardRef<HTMLDivElement, React.AllHTMLAttributes<HTMLDivElement>>(
	(props, ref) => (
		// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
		<div ref={ref} style={bodyStyles}>
			{props.children}
		</div>
	),
);

const CustomFooter = () => {
	const { onClose } = useModal();

	return (
		<ModalFooter>
			<Inline grow="fill" alignBlock="center" spread="space-between">
				<Tooltip content="Some hint text?">
					<Button>Hover Me!</Button>
				</Tooltip>
				<Button appearance="primary" onClick={onClose}>
					Close
				</Button>
			</Inline>
		</ModalFooter>
	);
};

export default function ModalDemo() {
	const [variant, setVariant] = useState<string | null>(null);
	const open = useCallback((name: string) => setVariant(name), []);
	const close = useCallback(() => setVariant(null), []);

	const btn = (name: string) => (
		<Button key={name} onClick={() => open(name)}>
			{name}
		</Button>
	);

	return (
		<Box xcss={containerStyles}>
			<h2 id="default-header-footer" css={titleStyles}>
				Default Header/Footer
			</h2>
			<ButtonGroup titleId="default-header-footer">{defaults.map(btn)}</ButtonGroup>

			<h2 id="custom-components" css={titleStyles}>
				Custom Components
			</h2>
			<ButtonGroup titleId="custom-components">{custom.map(btn)}</ButtonGroup>

			<ModalTransition>
				{variant && (
					<ModalDialog
						key={variant}
						onClose={close}
						width={variant === 'custom header' ? 300 : undefined}
					>
						{variant === 'custom header' && <CustomHeader />}
						{variant === 'header' && (
							<ModalHeader>
								<ModalTitle>Modal: {variant}</ModalTitle>
							</ModalHeader>
						)}
						{['both', 'custom footer', 'footer'].includes(variant) && (
							<ModalHeader>
								<ModalTitle>Modal: {variant}</ModalTitle>
								<IconButton
									onClick={close}
									icon={(iconProps) => <CrossIcon {...iconProps} size="small" />}
									label="Close Modal"
								/>
							</ModalHeader>
						)}

						{variant === 'custom body' ? (
							<CustomBody>
								<Lorem count="5" />
							</CustomBody>
						) : (
							<ModalBody>
								<Lorem count="5" />
							</ModalBody>
						)}

						{variant === 'custom footer' && <CustomFooter />}
						{['footer', 'both'].includes(variant) && (
							<ModalFooter>
								<Button appearance="subtle">Secondary Action</Button>
								<Button appearance="primary" onClick={close}>
									Close
								</Button>
							</ModalFooter>
						)}
					</ModalDialog>
				)}
			</ModalTransition>
		</Box>
	);
}
