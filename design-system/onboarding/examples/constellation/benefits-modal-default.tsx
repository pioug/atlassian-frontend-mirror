import React, { useState } from 'react';

import Button from '@atlaskit/button/new';
import { Modal, ModalTransition } from '@atlaskit/onboarding';

import welcomeImage from '../assets/this-is-new-jira.png';

const BenefitModalBasicExample = () => {
	const [isActive, setIsActive] = useState(false);

	return (
		<>
			<Button appearance="primary" onClick={() => setIsActive(true)}>
				Launch benefits modal
			</Button>
			<ModalTransition>
				{isActive && (
					<Modal
						actions={[
							{
								onClick: () => setIsActive(false),
								text: 'Get started',
							},
							{ onClick: () => setIsActive(false), text: 'Remind me later' },
						]}
						heading="Experience the new Jira"
						image={welcomeImage}
						key="welcome"
					>
						<p>
							Check out our restructured interface and a bold, colorful design that reflects the
							vibrance of your team. Try it out early and get a chance to influence how we build the
							next generation of Atlassian.
						</p>
					</Modal>
				)}
			</ModalTransition>
		</>
	);
};

export default BenefitModalBasicExample;
