/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import React, { useState } from 'react';
// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { jsx, css } from '@emotion/react';

import ModalDialog, {
	ModalTransition,
	CloseButton,
	useModal,
	ModalBody as AKModalBody,
} from '@atlaskit/modal-dialog';

import Heading from '@atlaskit/heading';

import { DROPBOX_IFRAME_NAME } from './constants';
// eslint-disable-next-line @atlaskit/design-system/no-emotion-primitives -- to be migrated to @atlaskit/primitives/compiled – go/akcss
import { xcss, Box } from '@atlaskit/primitives';

const ModalBody = React.forwardRef<HTMLDivElement, React.AllHTMLAttributes<HTMLDivElement>>(
	(props, ref) => {
		return (
			// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
			<div ref={ref} style={{ height: '100%' }}>
				{props.children}
			</div>
		);
	},
);

// eslint-disable-next-line @atlaskit/design-system/consistent-css-prop-usage -- Ignored via go/DSP-18766
const iframeStyle = {
	width: '100%',
	height: '100%',
	borderRadius: '0 0 3px 3px',
};

const bottomShadow = css({
	display: 'flex',
	justifyContent: 'space-between',
	alignItems: 'baseline',
});

// eslint-disable-next-line @atlaskit/design-system/consistent-css-prop-usage -- Ignored via go/DSP-18766
const spacingDivStyle = { width: '28px' };
// eslint-disable-next-line @atlaskit/design-system/consistent-css-prop-usage -- Ignored via go/DSP-18766
const headingStyle = xcss({ marginTop: 'space.100' });

const Header = () => {
	const { onClose, titleId } = useModal();
	return (
		<div css={bottomShadow}>
			{/* This div is offsetting the button to the right */}
			<div css={spacingDivStyle} />
			<Box xcss={headingStyle}>
				<Heading id={titleId} size="xsmall">
					Dropbox
				</Heading>
			</Box>
			<div>
				<CloseButton onClick={onClose} />
			</div>
		</div>
	);
};

const Modal = ({
	onClose,
	TEST_ONLY_src,
	showModal,
}: {
	// Ignored via go/ees005
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	onClose: () => any;
	showModal?: boolean;
	TEST_ONLY_src?: string;
}) => {
	const [isOpen, setIsOpen] = useState(true);

	if (typeof showModal === 'boolean' && isOpen !== showModal) {
		setIsOpen(showModal);
	}

	return (
		<ModalTransition>
			{isOpen && (
				<ModalDialog
					height="100%"
					width="large"
					onClose={() => {
						setIsOpen(false);
						onClose();
					}}
				>
					<Header />
					<AKModalBody>
						<ModalBody>
							{TEST_ONLY_src ? (
								// eslint-disable-next-line jsx-a11y/iframe-has-title
								<iframe
									css={iframeStyle}
									name={DROPBOX_IFRAME_NAME}
									frameBorder={0}
									src={TEST_ONLY_src}
								/>
							) : (
								// eslint-disable-next-line jsx-a11y/iframe-has-title
								<iframe css={iframeStyle} name={DROPBOX_IFRAME_NAME} frameBorder={0} />
							)}
						</ModalBody>
					</AKModalBody>
				</ModalDialog>
			)}
		</ModalTransition>
	);
};

export default Modal;
