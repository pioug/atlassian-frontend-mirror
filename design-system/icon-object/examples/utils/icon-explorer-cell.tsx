import React, { useRef, useState, type ComponentType, type FC } from 'react';
// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import styled from '@emotion/styled';

import Textfield from '@atlaskit/textfield';
import Button from '@atlaskit/button/new';
import Modal, { ModalTransition, ModalBody, ModalFooter } from '@atlaskit/modal-dialog';
import Tooltip from '@atlaskit/tooltip';
import { N30A } from '@atlaskit/theme/colors';
import { token } from '@atlaskit/tokens';

// eslint-disable-next-line @atlaskit/design-system/ensure-design-token-usage, @atlaskit/ui-styling-standard/no-styled -- To migrate as part of go/ui-styling-standard
const IconExplorerLink = styled.a({
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-selectors -- Ignored via go/DSP-18766
	'&, &:hover, &:active, &:focus': {
		display: 'block',
		padding: '10px',
		borderRadius: token('border.radius.100', '4px'),
		color: 'inherit',
		cursor: 'pointer',
		lineHeight: 0,
	},
	'&:hover': {
		background: N30A,
	},
});

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-styled -- To migrate as part of go/ui-styling-standard
const IconModalHeader = styled.h3({
	display: 'flex',
	padding: token('space.250', '20px'),
	alignItems: 'center',
	justifyContent: 'flex-start',
	flexDirection: 'row',
});

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-styled -- To migrate as part of go/ui-styling-standard
const Divider = styled.h4({
	width: '100%',
	textAlign: 'center',
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
		} catch (err) {
			console.error('Unable to copy text');
		}
	};

	if (divider) {
		return (
			<Divider>
				<Icon />
			</Divider>
		);
	}

	const importStatement = isNamedImport
		? `import { ${componentName} } from '${packageName}';`
		: `import ${componentName} from '${packageName}';`;

	const modal = (
		<Modal onClose={closeModal}>
			<IconModalHeader>
				<Icon label={componentName} size="medium" />
				{componentName}
			</IconModalHeader>
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
				<Button onClick={copyToClipboard} appearance="primary" autoFocus>
					Copy
				</Button>
			</ModalFooter>
		</Modal>
	);

	return (
		<div>
			<Tooltip content={componentName}>
				{/* eslint-disable-next-line styled-components-a11y/click-events-have-key-events, styled-components-a11y/no-static-element-interactions, styled-components-a11y/anchor-is-valid */}
				<IconExplorerLink onClick={openModal}>
					<Icon label={componentName} size="medium" />
				</IconExplorerLink>
			</Tooltip>
			<ModalTransition>{isModalOpen ? modal : null}</ModalTransition>
		</div>
	);
};

export default IconExplorerCell;
