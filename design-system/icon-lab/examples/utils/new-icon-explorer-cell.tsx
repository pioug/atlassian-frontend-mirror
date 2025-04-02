/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { type ComponentType, type FC, useRef, useState } from 'react';

// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { jsx } from '@emotion/react';

import Button from '@atlaskit/button/new';
import { IconTile } from '@atlaskit/icon';
import legacyIconMetadata from '@atlaskit/icon/metadata';
import Modal, {
	ModalBody,
	ModalFooter,
	ModalHeader,
	ModalTitle,
	ModalTransition,
} from '@atlaskit/modal-dialog';
import { Box, Inline, Pressable, Stack, Text, xcss } from '@atlaskit/primitives';
import Textfield from '@atlaskit/textfield';
import Tooltip from '@atlaskit/tooltip';

import type newIconMetadata from '../../src/metadata-core';

const pressableStyles = xcss({
	borderRadius: 'border.radius.100',
	color: 'color.text',
	width: 'size.600',
	paddingInline: 'space.050',
	backgroundColor: 'color.background.neutral.subtle',
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-selectors
	':hover': {
		backgroundColor: 'color.background.neutral.subtle.hovered',
	},
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-selectors
	':active': {
		backgroundColor: 'color.background.neutral.subtle.pressed',
	},
});

const iconTextStyles = xcss({
	overflowWrap: 'break-word',
	height: 'size.300',
});

export type IconExplorerCellProps = {
	// eslint-disable-next-line @repo/internal/react/consistent-props-definitions
	component: ComponentType<any>;
	isNamedImport?: boolean;
} & (typeof newIconMetadata)[string];

const IconExplorerCell: FC<IconExplorerCellProps> = ({
	component: Icon,
	componentName,
	package: packageName,
	isNamedImport,
	oldName,
	categorization,
	team,
	type,
	usage,
}) => {
	const inputEl = useRef<HTMLInputElement>(null);
	const [isModalOpen, setIsModalOpen] = useState(false);

	const closeModal = () => setIsModalOpen(false);
	const openModal = () => setIsModalOpen(true);
	const copyToClipboard = () => {
		if (!isModalOpen || !inputEl) {
			return;
		}

		try {
			inputEl.current!.select();
			const wasCopied = document.execCommand('copy');

			if (!wasCopied) {
				throw new Error();
			}
		} catch (err) {
			console.error('Unable to copy text');
		}
	};

	const importStatement = isNamedImport
		? `import { ${componentName} } from '${packageName}';`
		: `import ${componentName} from '${packageName}';`;

	const metadata: { [index: string]: string } = {
		'Icon type': type || 'TBD',
		Category: categorization || 'TBD',
		'Owning team': team || 'TBD',
		'Recommended usage': usage || '',
	};

	if (oldName && typeof oldName === 'string') {
		(metadata['Legacy Icon name'] = oldName),
			(metadata['Legacy Icon import'] =
				Object.entries(legacyIconMetadata).find(
					([_, value]) => value.componentName === oldName,
				)?.[1].package || '');
	} else if (Array.isArray(oldName)) {
		metadata['Legacy Icon names'] = oldName.join(', ');
		metadata['Legacy Icon imports'] = oldName.reduce((acc, name) => {
			const legacyIconImport =
				Object.values(legacyIconMetadata).find((value) => value.componentName === name)?.package ||
				undefined;
			if (!acc && legacyIconImport) {
				return legacyIconImport;
			}
			return legacyIconImport ? `${acc}, ${legacyIconImport}` : acc;
		}, '');
	}

	const modal = (
		<Modal onClose={closeModal}>
			<ModalHeader hasCloseButton>
				<Inline space="space.100" alignBlock="center">
					{type !== 'utility' ? (
						<IconTile label={componentName} appearance={'blue'} icon={Icon} size="32" />
					) : (
						<Icon label={componentName} />
					)}
					<ModalTitle>{componentName}</ModalTitle>
				</Inline>
			</ModalHeader>
			<ModalBody>
				<Stack space="space.200">
					<Stack space="space.050">
						{Object.entries(metadata).map(([key, value]) => {
							return (
								<Inline space="space.050" rowSpace="space.0" shouldWrap={true} key={key}>
									<Text weight="semibold">{key}:</Text>
									{value}
								</Inline>
							);
						})}
					</Stack>
					<Textfield
						isReadOnly
						value={importStatement}
						ref={inputEl}
						onClick={(e) => {
							e.currentTarget.select();
						}}
					/>
				</Stack>
			</ModalBody>
			<ModalFooter>
				<Button onClick={closeModal} appearance="subtle">
					Close
				</Button>
				<Button onClick={copyToClipboard} appearance="primary">
					Copy
				</Button>
			</ModalFooter>
		</Modal>
	);

	const splitIconName = packageName.split('/').at(-1)?.split('-').join(' ') || '';
	const splitIconNameCapitalized = splitIconName.charAt(0).toUpperCase() + splitIconName?.slice(1);

	const ExampleIcon = () => <Icon label={componentName} />;
	return (
		<Box padding="space.050">
			<Tooltip content={componentName}>
				<Pressable padding="space.200" xcss={pressableStyles} onClick={openModal}>
					<Stack space="space.100">
						<ExampleIcon />
						<Box xcss={iconTextStyles}>
							<Text size="small">{splitIconNameCapitalized}</Text>
						</Box>
					</Stack>
				</Pressable>
			</Tooltip>
			<ModalTransition>{isModalOpen ? modal : null}</ModalTransition>
		</Box>
	);
};

export default IconExplorerCell;
