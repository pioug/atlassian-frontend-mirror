import React, { useCallback, useEffect, useState } from 'react';

import Lorem from 'react-lorem-component';

import Banner from '@atlaskit/banner';
import Button from '@atlaskit/button/new';
import ErrorIcon from '@atlaskit/icon/glyph/error';
import Modal, {
	ModalBody,
	ModalFooter,
	ModalHeader,
	ModalTitle,
	ModalTransition,
} from '@atlaskit/modal-dialog';
import Popup from '@atlaskit/popup';
import { Box, xcss } from '@atlaskit/primitives';

declare global {
	interface Window {
		AJS: any;
	}
}

const wrapperStyles = xcss({
	display: 'flex',
	flexDirection: 'column',
});
const OpenAuiFromModalExample = () => {
	const [isOpen, setIsOpen] = useState(false);
	const [isPopupOpen, setIsPopupOpen] = useState(false);
	const open = useCallback(() => setIsOpen(true), []);
	const close = useCallback(() => setIsOpen(false), []);

	useEffect(() => {
		const auiCssLink = document.createElement('link');
		auiCssLink.rel = 'stylesheet';
		auiCssLink.type = 'text/css';
		auiCssLink.href = 'https://unpkg.com/@atlassian/aui@9.12.2/dist/aui/aui-prototyping.css';
		document.head.appendChild(auiCssLink);
		const jqueryScript = document.createElement('script');
		jqueryScript.src = 'https://cdnjs.cloudflare.com/ajax/libs/jquery/3.3.1/jquery.js';
		document.body.appendChild(jqueryScript);
		const auiScript = document.createElement('script');
		auiScript.src = 'https://unpkg.com/@atlassian/aui@9.12.2/dist/aui/aui-prototyping.js';
		document.body.appendChild(auiScript);
		return () => {
			document.head.removeChild(auiCssLink);
			document.body.removeChild(jqueryScript);
			document.body.removeChild(auiScript);
		};
	}, []);

	useEffect(() => {
		if (window.AJS && window.AJS.$) {
			window.AJS.$('#dialog-show-button').on('click', function (e: Event) {
				e.preventDefault();
				window.AJS.dialog2('#demo-dialog').show();
			});
			window.AJS.$('#dialog-submit-button').on('click', function (e: Event) {
				e.preventDefault();
				window.AJS.dialog2('#demo-dialog').hide();
			});
		}
	});

	return (
		<>
			<Banner icon={<ErrorIcon label="Error" secondaryColor="inherit" />} testId="basicTestId">
				This example is intended solely for testing purposes. Please refrain from implementing it in
				any environments, as it may lead to unintended consequences or vulnerabilities.
			</Banner>
			<Button aria-haspopup="dialog" appearance="primary" onClick={open} testId="ak-modal-trigger">
				Open Modal
			</Button>

			<ModalTransition>
				{isOpen && (
					<Modal onClose={close} testId="ak-modal">
						<ModalHeader>
							<ModalTitle>Modal Title</ModalTitle>
						</ModalHeader>
						<ModalBody>
							<Lorem count={2} />
							<Popup
								isOpen={isPopupOpen}
								onClose={() => setIsPopupOpen(false)}
								placement="bottom"
								content={() => (
									<Box xcss={wrapperStyles}>
										<Button>Button 1</Button>
										<Button>Button 2</Button>
										<Button testId="aui-trigger" id="dialog-show-button">
											Open AUI dialog
										</Button>
									</Box>
								)}
								shouldRenderToParent
								trigger={(triggerProps) => (
									<Button
										testId="popup-trigger"
										{...triggerProps}
										onClick={() => setIsPopupOpen(!isPopupOpen)}
									>
										{isOpen ? 'Open' : 'close'} popup
									</Button>
								)}
							/>
						</ModalBody>
						<ModalFooter>
							<Button testId="ak-modal-close" appearance="primary" onClick={close}>
								Close
							</Button>
						</ModalFooter>
					</Modal>
				)}
				<section
					id="demo-dialog"
					// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop
					className="aui-dialog2 aui-dialog2-small aui-layer"
					role="dialog"
					tabIndex={-1}
					aria-modal="true"
					aria-labelledby="dialog-show-button--heading"
					aria-describedby="dialog-show-button--description"
					hidden
					data-testid="aui-dialog"
				>
					{/* eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop */}
					<header className="aui-dialog2-header">
						{/* eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop */}
						<h2 className="aui-dialog2-header-main" id="dialog-show-button--heading">
							Captain...
						</h2>
					</header>
					{/* eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop */}
					<div className="aui-dialog2-content" id="dialog-show-button--description">
						<p>We've detected debris of some sort in a loose orbit.</p>
						<p>I suggest we beam a section aboard for analysis...</p>
						<input data-testid="aui-input" type="text" aria-label="Receive focus" />
					</div>
					{/* eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop */}
					<footer className="aui-dialog2-footer">
						{/* eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop */}
						<div className="aui-dialog2-footer-actions">
							<button
								type="button"
								data-testid="aui-submit-button"
								id="dialog-submit-button"
								// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop
								className="aui-button aui-button-primary"
							>
								Make it so
							</button>
						</div>
					</footer>
				</section>
			</ModalTransition>
		</>
	);
};

export default OpenAuiFromModalExample;
