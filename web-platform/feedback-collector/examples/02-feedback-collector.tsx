import React, { useRef, useState } from 'react';

import Button from '@atlaskit/button/new';
import { FlagGroup } from '@atlaskit/flag';

import FeedbackCollector, { FeedbackFlag } from '../src';

const ENTRYPOINT_ID: string = 'e0d501eb-7386-4ba7-aedc-68dc1dde485a';
const name: string = 'Feedback Sender';
const aaid: string = 'test-aaid';

const DisplayFeedback = () => {
	const ref = useRef<HTMLElement | null>(null);

	const [isOpen, setIsOpen] = useState(false);
	const [displayFlag, setDisplayFlag] = useState(false);

	const open = () => setIsOpen(true);

	const close = () => setIsOpen(false);

	const displayFlagTrue = () => setDisplayFlag(true);

	const hideFlag = () => setDisplayFlag(false);

	return (
		<div>
			<Button appearance="primary" onClick={open}>
				Display Feedback
			</Button>

			{isOpen && (
				<FeedbackCollector
					locale={'en'}
					url={'https://api-private.atlassian.com'}
					onClose={close}
					onSubmit={displayFlagTrue}
					atlassianAccountId={aaid}
					name={name}
					entrypointId={ENTRYPOINT_ID}
					// @ts-ignore
					shouldReturnFocusRef={ref}
				/>
			)}

			<FlagGroup onDismissed={hideFlag}>{displayFlag && <FeedbackFlag />}</FlagGroup>
		</div>
	);
};

export default (): React.JSX.Element => (
	<>
		<>Click the button to display the feedback collector.</>
		<DisplayFeedback />
	</>
);
