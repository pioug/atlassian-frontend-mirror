import React from 'react';

import { IntlProvider } from 'react-intl';

// These imports are not included in the manifest file to avoid circular package dependencies blocking our Typescript and bundling tooling
// eslint-disable-next-line import/no-extraneous-dependencies
import { MockMentionResource } from '@atlaskit/util-data-test/mock-mention-resource';
import { render, screen } from '@atlassian/testing-library';

import ResourcedMentionList, { type Props } from '../../../components/ResourcedMentionList';
import * as fireSliAnalyticsEventModule from '../../../util/fire-sli-analytics-event';

type OptionalProps = Partial<Omit<Props, 'resourceProvider'>>;

const setupComponent = (props?: OptionalProps) => {
	const resourceProvider = new MockMentionResource({
		minWait: 0,
		maxWait: 0,
	});

	return render(
		<IntlProvider locale="en">
			<ResourcedMentionList resourceProvider={resourceProvider} query="" {...props} />
		</IntlProvider>,
	);
};

describe('ResourcedMentionList', () => {
	afterEach(() => {
		jest.restoreAllMocks();
	});

	it('should show mentions after loading using the resource', async () => {
		setupComponent({
			query: 's',
		});

		expect(await screen.findAllByTestId(/mention-item-/)).toHaveLength(6);
		await expect(document.body).toBeAccessible();
	});

	it('should trigger SLI analytics if search has been called', async () => {
		const analytics = jest.spyOn(fireSliAnalyticsEventModule, 'fireSliAnalyticsEvent');

		setupComponent({
			query: 's',
		});

		expect(await screen.findAllByTestId(/mention-item-/)).toHaveLength(6);
		expect(analytics).toHaveBeenCalled();
		await expect(document.body).toBeAccessible();
	});
});
