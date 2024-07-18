/**
 * @jsxRuntime classic
 */
/** @jsx jsx */
import { type ComponentType, type FC, useRef, useState } from 'react';

// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { css, jsx } from '@emotion/react';

import Button, { IconButton } from '@atlaskit/button/new';
import Modal, { ModalBody, ModalFooter, ModalTransition } from '@atlaskit/modal-dialog';
import { Box } from '@atlaskit/primitives';
import Textfield from '@atlaskit/textfield';
import { token } from '@atlaskit/tokens';
import Tooltip from '@atlaskit/tooltip';

const iconModalHeaderStyles = css({
	display: 'flex',
	padding: token('space.250', '20px'),
	alignItems: 'center',
	justifyContent: 'flex-start',
	flexDirection: 'row',
});

const dividerStyles = css({
	width: '100%',
	textAlign: 'center',
});

export interface IconCommonProps {
	// eslint-disable-next-line @repo/internal/react/consistent-props-definitions
	component: ComponentType<any>;
	componentName: string;
	isDivider?: boolean;
	isNamedImport?: boolean;
}

interface IconExplorerCellProps extends IconCommonProps {
	package?: string;
}

const IconExplorerCell: FC<IconExplorerCellProps> = ({
	component: Icon,
	componentName,
	package: packageName,
	isDivider,
	isNamedImport,
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

	if (isDivider) {
		return (
			<h4 css={dividerStyles}>
				<Icon />
			</h4>
		);
	}

	const importStatement = isNamedImport
		? `import { ${componentName} } from '${packageName}';`
		: `import ${componentName} from '${packageName}';`;

	const modal = (
		<Modal onClose={closeModal}>
			<h3 css={iconModalHeaderStyles}>
				<Icon label={componentName} size="medium" />
				{componentName}
			</h3>
			<ModalBody>
				<Textfield
					isReadOnly
					value={importStatement}
					ref={inputEl}
					onClick={(e) => {
						e.currentTarget.select();
					}}
				/>
			</ModalBody>
			<ModalFooter>
				<Button onClick={closeModal} appearance="subtle">
					Close
				</Button>
				<Button onClick={copyToClipboard} appearance="primary" autoFocus>
					Copy
				</Button>
			</ModalFooter>
		</Modal>
	);

	return (
		<Box padding="space.250">
			<Tooltip content={componentName}>
				<IconButton
					icon={(iconProps) => <Icon {...iconProps} size="large" />}
					label={componentName}
					onClick={openModal}
					appearance="subtle"
				/>
			</Tooltip>
			<ModalTransition>{isModalOpen ? modal : null}</ModalTransition>
		</Box>
	);
};

export default IconExplorerCell;
