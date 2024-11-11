import React, { useCallback, useState } from 'react';

import Lorem from 'react-lorem-component';

import ButtonGroup from '@atlaskit/button/button-group';
import Button from '@atlaskit/button/new';
import __noop from '@atlaskit/ds-lib/noop';
import Heading from '@atlaskit/heading';
import ModalDialog, {
	ModalBody,
	ModalFooter,
	ModalHeader,
	ModalTitle,
	ModalTransition,
	useModal,
} from '@atlaskit/modal-dialog';
import { Box, Inline, xcss } from '@atlaskit/primitives';
import { token } from '@atlaskit/tokens';
import Tooltip from '@atlaskit/tooltip';

import ModalTitleWithClose from './common/modal-title';

const defaults = ['header', 'footer', 'both', 'neither'];
const custom = ['custom header', 'custom body', 'custom footer'];

const containerStyles = xcss({
	padding: 'space.200',
});

const titleStyles = xcss({
	marginBlockEnd: 'space.200',
});

const headerStyles = xcss({
	background:
		'url(https://atlassian.design/react_assets/images/cards/personality.png) center top no-repeat',
	backgroundSize: 'cover',
	borderRadius: '4px 4px 0 0',
});

const CustomHeader = () => {
	const { onClose } = useModal();

	return (
		// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
		<Box>
			<ModalTitleWithClose onClose={onClose}>
				<Box xcss={headerStyles}></Box>
			</ModalTitleWithClose>
		</Box>
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
		<Box ref={ref} style={bodyStyles}>
			{props.children}
		</Box>
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
		<Button aria-haspopup="dialog" key={name} onClick={() => open(name)}>
			{name}
		</Button>
	);

	return (
		<Box xcss={containerStyles}>
			<Heading size="large" as="h2" id="default-header-footer">
				<Inline xcss={titleStyles}>Default Header/Footer</Inline>
			</Heading>
			<ButtonGroup titleId="default-header-footer">{defaults.map(btn)}</ButtonGroup>

			<Heading size="large" as="h2" id="custom-components">
				<Inline xcss={titleStyles}>Custom Components</Inline>
			</Heading>
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
								<ModalTitleWithClose onClose={close}>
									<ModalTitle>Modal: {variant}</ModalTitle>
								</ModalTitleWithClose>
							</ModalHeader>
						)}
						{['both', 'custom footer', 'footer'].includes(variant) && (
							<ModalHeader>
								<ModalTitleWithClose onClose={close}>
									<ModalTitle>Modal: {variant}</ModalTitle>
								</ModalTitleWithClose>
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
