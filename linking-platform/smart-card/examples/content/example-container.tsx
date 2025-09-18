import React, { type PropsWithChildren } from 'react';

import { IntlProvider } from 'react-intl-next';

import { avatar1, avatar2, avatar3, image1 as previewImage } from '@atlaskit/link-test-helpers';

import { ActionName, IconType, MediaType, SmartLinkStatus } from '../../src/constants';
import { FlexibleCardContext } from '../../src/state/flexible-ui-context';
import { isFlexibleUiBlock } from '../../src/utils/flexible';
import { getContext } from '../utils/flexible-ui';

const today = new Date();
const yesterday = new Date().setDate(today.getDate() - 1);
const lastMonth = new Date().setDate(today.getMonth() - 1);
const nextMonth = new Date().setDate(today.getMonth() + 1);
const context = getContext({
	attachmentCount: 3,
	actions: {
		[ActionName.AutomationAction]: {
			product: 'confluence',
			resourceType: 'page',
			baseAutomationUrl: 'https://hello.atlassian.com',
			objectAri: 'ari:cloud:confluence:1234567890:page/1234567890',
			siteAri: 'ari:cloud:site:1234567890',
			canManageAutomation: false,
			analyticsSource: 'automationAction',
			objectName: 'Test Page',
		},
		[ActionName.PreviewAction]: {
			invokeAction: {
				actionFn: async () => {},
				actionType: ActionName.PreviewAction,
			},
		},
	},
	authorGroup: [{ name: 'Aliza', src: avatar3 }],
	checklistProgress: '4/6',
	collaboratorGroup: [
		{ name: 'Steve', src: avatar2 },
		{ name: 'Angie', src: avatar1 },
		{ name: 'Rolan' },
	],
	commentCount: 22,
	createdBy: 'Aliza',
	createdOn: new Date(lastMonth).toISOString(),
	dueOn: new Date(nextMonth).toISOString(),
	modifiedBy: 'Steve',
	modifiedOn: new Date(yesterday).toISOString(),
	preview: { type: MediaType.Image, url: previewImage },
	priority: { icon: IconType.PriorityMajor },
	programmingLanguage: 'Javascript',
	reactCount: 78,
	snippet:
		'Nunc justo lectus, blandit ut ultrices a, elementum quis quam. In ut dolor ac nulla gravida scelerisque vitae sit amet ipsum. Pellentesque vitae luctus lorem. Etiam enim ligula, lobortis vel convallis ut, elementum ut nibh. Mauris ultricies mi risus, vel condimentum lorem convallis eu. Cras pharetra, dui nec gravida rutrum, mauris odio commodo mauris, eu lacinia dui mi nec tortor. Curabitur eleifend tortor eros, id venenatis est posuere sit amet. ',
	sourceBranch: 'lp-flexible-smart-links',
	state: { appearance: 'success', text: 'DONE' },
	subscriberCount: 45,
	targetBranch: 'master',
	viewCount: 2,
	voteCount: 4,
	url: 'https://atlaskit.atlassian.com/packages/linking-platform/smart-card/docs/flexible-ui',
	latestCommit: '64862f5',
});

const flexibleCardContext = { data: context, status: SmartLinkStatus.Resolved };

const renderChildren = (children: React.ReactNode): React.ReactNode =>
	React.Children.map(children, (child) => {
		if (React.isValidElement(child) && isFlexibleUiBlock(child)) {
			const node = child as React.ReactElement;
			const status = node.props.status || SmartLinkStatus.Resolved;
			return React.cloneElement(node, { status, ...node.props });
		}
		return child;
	});

const ExampleContainer = ({ children }: PropsWithChildren<{}>) => (
	<IntlProvider locale="en">
		<FlexibleCardContext.Provider value={flexibleCardContext}>
			{renderChildren(children)}
		</FlexibleCardContext.Provider>
	</IntlProvider>
);

export default ExampleContainer;
