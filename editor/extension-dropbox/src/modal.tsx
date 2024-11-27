/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import React, { useState } from 'react';
// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { jsx, css } from '@emotion/react';

import ModalDialog, {
	ModalTransition,
	useModal,
	ModalBody as AKModalBody,
} from '@atlaskit/modal-dialog';

import EditorCloseIcon from '@atlaskit/icon/glyph/editor/close';
import Button from '@atlaskit/button';
import Heading from '@atlaskit/heading';

import { DROPBOX_IFRAME_NAME } from './constants';
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
				<Button
					appearance="subtle"
					iconBefore={<EditorCloseIcon label="close dropbox modal" />}
					onClick={onClose}
				/>
			</div>
		</div>
	);
};

const Modal = ({
	onClose,
	TEST_ONLY_src,
	showModal,
}: {
	onClose: () => any;
	TEST_ONLY_src?: string;
	showModal?: boolean;
}) => {
	let [isOpen, setIsOpen] = useState(true);

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
