import React, { Fragment, type SyntheticEvent, useState } from 'react';

import Button from '@atlaskit/button/new';
import Link from '@atlaskit/link';
import { fg } from '@atlaskit/platform-feature-flags';
import Popup from '@atlaskit/popup';
import { token } from '@atlaskit/tokens';

import { PageHeader, PageWrapper } from '../example-helpers/common';
import { LinkPicker } from '../src';

type OnSubmitPayload = Parameters<Required<React.ComponentProps<typeof LinkPicker>>['onSubmit']>[0];

function WithoutPlugins() {
	const [isOpen, setIsOpen] = useState(true);
	const [link, setLink] = useState<OnSubmitPayload>({
		url: '',
		displayText: null,
		title: null,
		meta: {
			inputMethod: 'manual',
		},
	});

	const handleToggle = () => setIsOpen(!isOpen);

	const handleSubmit = (payload: OnSubmitPayload) => {
		setLink(payload);
		setIsOpen(false);
	};

	const handleClick = (e: SyntheticEvent) => {
		e.preventDefault();
		e.stopPropagation();
		setIsOpen(true);
	};

	const linkPickerInPopup = (
		<Popup
			isOpen={isOpen}
			autoFocus={false}
			onClose={handleToggle}
			content={({ update }) => (
				<LinkPicker
					url={link.url}
					displayText={link.displayText}
					onSubmit={handleSubmit}
					onCancel={handleToggle}
					onContentResize={update}
				/>
			)}
			placement="right-start"
			trigger={({ ref, ...triggerProps }) => (
				<Button
					{...triggerProps}
					ref={ref}
					appearance="primary"
					isSelected={isOpen}
					onClick={handleToggle}
				>
					{isOpen ? '-' : '+'}
				</Button>
			)}
		/>
	);

	return (
		<Fragment>
			<PageHeader>
				<p>
					<b>LinkPicker</b> without search, used as an interface to submit a valid link with custom
					display text.
				</p>
			</PageHeader>
			{/* eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766 */}
			<div style={{ paddingBottom: token('space.250', '20px') }}>
				{fg('dst-a11y__replace-anchor-with-link__linking-platfo') ? (
					<Link id="test-link" href={link.url} target="_blank" onClick={handleClick}>
						{link.displayText || link.url}
					</Link>
				) : (
					// eslint-disable-next-line @atlaskit/design-system/no-html-anchor
					<a id="test-link" href={link.url} target="_blank" onClick={handleClick}>
						{link.displayText || link.url}
					</a>
				)}
			</div>
			{linkPickerInPopup}
		</Fragment>
	);
}

export default function WithoutPluginsWrapper(): React.JSX.Element {
	return (
		<PageWrapper>
			<WithoutPlugins />
		</PageWrapper>
	);
}
