/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { type ComponentType, type FC, useRef, useState } from 'react';

import Button from '@atlaskit/button/new';
import { cssMap, jsx } from '@atlaskit/css';
import Modal, {
	ModalBody,
	ModalFooter,
	ModalHeader,
	ModalTitle,
	ModalTransition,
} from '@atlaskit/modal-dialog';
import { Inline, Pressable } from '@atlaskit/primitives/compiled';
import Textfield from '@atlaskit/textfield';
import { token } from '@atlaskit/tokens';
import Tooltip from '@atlaskit/tooltip';

const styles = cssMap({
	iconExplorerButton: {
		display: 'block',
		paddingBlockStart: token('space.150'),
		paddingInlineEnd: token('space.150'),
		paddingBlockEnd: token('space.150'),
		paddingInlineStart: token('space.150'),
		borderRadius: token('radius.small', '4px'),
		backgroundColor: token('elevation.surface'),
		'&:hover': {
			backgroundColor: token('elevation.surface.hovered'),
		},
	},
	divider: {
		width: '100%',
		textAlign: 'center',
	},
});

interface IconExplorerCellProps {
	// eslint-disable-next-line @repo/internal/react/consistent-props-definitions
	component: ComponentType<any>;
	componentName: string;
	package?: string;
	// eslint-disable-next-line @repo/internal/react/boolean-prop-naming-convention
	divider?: boolean;
	// eslint-disable-next-line @repo/internal/react/boolean-prop-naming-convention
	namedImport?: boolean;
}

const IconExplorerCell: FC<IconExplorerCellProps> = ({
	component: Icon,
	componentName,
	package: packageName,
	divider,
	namedImport: isNamedImport,
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
		} catch {
			console.error('Unable to copy text');
		}
	};

	if (divider) {
		return (
			<div css={styles.divider}>
				<Icon />
			</div>
		);
	}

	const importStatement = isNamedImport
		? `import { ${componentName} } from '${packageName}';`
		: `import ${componentName} from '${packageName}';`;

	const modal = (
		<Modal onClose={closeModal}>
			<ModalHeader hasCloseButton>
				<Inline alignBlock="center" space="space.100">
					<Icon label={componentName} size="medium" />
					<ModalTitle>{componentName}</ModalTitle>
				</Inline>
			</ModalHeader>
			<ModalBody>
				{/* Add onClick handler to select the value from read only input */}
				<Textfield
					isReadOnly
					value={importStatement}
					ref={inputEl}
					onClick={() => inputEl.current!.select()}
				/>
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

	return (
		<div>
			<Tooltip content={componentName}>
				<Pressable xcss={styles.iconExplorerButton} onClick={openModal}>
					<Icon label={componentName} size="medium" />
				</Pressable>
			</Tooltip>
			<ModalTransition>{isModalOpen ? modal : null}</ModalTransition>
		</div>
	);
};

export default IconExplorerCell;
