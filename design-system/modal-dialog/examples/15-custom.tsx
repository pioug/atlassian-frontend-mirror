import React, { useCallback, useState } from 'react';

import Lorem from 'react-lorem-component';

import ButtonGroup from '@atlaskit/button/button-group';
import Button from '@atlaskit/button/new';
import { cssMap } from '@atlaskit/css';
import __noop from '@atlaskit/ds-lib/noop';
import Heading from '@atlaskit/heading';
import ModalDialog, {
	CloseButton,
	ModalBody,
	ModalFooter,
	ModalHeader,
	ModalTitle,
	ModalTransition,
	useModal,
} from '@atlaskit/modal-dialog';
import { Box, Flex, Inline } from '@atlaskit/primitives/compiled';
import { token } from '@atlaskit/tokens';
import Tooltip from '@atlaskit/tooltip';

const defaults = ['header', 'footer', 'both', 'neither'];
const custom = ['custom header', 'custom body', 'custom footer'];

const styles = cssMap({
	container: {
		paddingBlockEnd: token('space.200'),
		paddingBlockStart: token('space.200'),
		paddingInlineEnd: token('space.200'),
		paddingInlineStart: token('space.200'),
	},
	title: {
		marginBlockEnd: token('space.200'),
	},
	header: {
		backgroundImage: `linear-gradient(${token('color.background.accent.blue.subtler')}, ${token('color.background.accent.purple.subtler')})`,
		paddingBlockStart: token('space.1000'),
		position: 'relative',
		flexDirection: 'row-reverse',
	},
});

const CustomHeader = () => {
	const { onClose } = useModal();

	return (
		<Flex alignItems="center" justifyContent="space-between" xcss={styles.header}>
			<CloseButton onClick={onClose} />
			<ModalTitle>Custom header</ModalTitle>
		</Flex>
	);
};

const bodyStyles: React.CSSProperties = {
	padding: 90,
	backgroundColor: token('elevation.surface.overlay'),
	overflowY: 'auto',
	overflowX: 'hidden',
};

const CustomBody: React.ForwardRefExoticComponent<
	React.PropsWithoutRef<React.AllHTMLAttributes<HTMLDivElement>> &
		React.RefAttributes<HTMLDivElement>
> = React.forwardRef<HTMLDivElement, React.AllHTMLAttributes<HTMLDivElement>>((props, ref) => (
	// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
	<Box ref={ref} style={bodyStyles}>
		{props.children}
	</Box>
));

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

export default function ModalDemo(): React.JSX.Element {
	const [variant, setVariant] = useState<string | null>(null);
	const open = useCallback((name: string) => setVariant(name), []);
	const close = useCallback(() => setVariant(null), []);

	const btn = (name: string) => (
		<Button aria-haspopup="dialog" key={name} onClick={() => open(name)}>
			{name}
		</Button>
	);

	return (
		<Box xcss={styles.container}>
			<Heading size="large" as="h2" id="default-header-footer">
				<Inline xcss={styles.title}>Default Header/Footer</Inline>
			</Heading>
			<ButtonGroup titleId="default-header-footer">{defaults.map(btn)}</ButtonGroup>

			<Heading size="large" as="h2" id="custom-components">
				<Inline xcss={styles.title}>Custom Components</Inline>
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
							<ModalHeader hasCloseButton>
								<ModalTitle>Modal: {variant}</ModalTitle>
							</ModalHeader>
						)}
						{['both', 'custom footer', 'footer'].includes(variant) && (
							<ModalHeader hasCloseButton>
								<ModalTitle>Modal: {variant}</ModalTitle>
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
