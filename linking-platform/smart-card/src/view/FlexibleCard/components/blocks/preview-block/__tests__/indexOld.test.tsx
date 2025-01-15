import React from 'react';

// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled
import { css } from '@emotion/react';
import { render, screen } from '@testing-library/react';
import { IntlProvider } from 'react-intl-next';

import { ffTest } from '@atlassian/feature-flags-test-utils';

import context from '../../../../../../__fixtures__/flexible-ui-data-context';
import { SmartLinkStatus } from '../../../../../../constants';
import { FlexibleUiContext } from '../../../../../../state/flexible-ui-context';
import { type FlexibleUiDataContext } from '../../../../../../state/flexible-ui-context/types';
import PreviewBlock from '../index';
import { type PreviewBlockProps } from '../types';

const testId = 'test-smart-block-preview';

const renderPreviewBlock = (props?: PreviewBlockProps, customContext?: FlexibleUiDataContext) => {
	const ctx = customContext || context;
	return render(
		<IntlProvider locale="en">
			<FlexibleUiContext.Provider value={ctx}>
				<PreviewBlock status={SmartLinkStatus.Resolved} {...props} />
			</FlexibleUiContext.Provider>
		</IntlProvider>,
	);
};

ffTest.off('bandicoots-compiled-migration-smartcard', '', () => {
	it('renders with override css', async () => {
		const overrideCss = css({
			backgroundColor: 'blue',
		});
		renderPreviewBlock({
			overrideCss,
			testId,
		});

		const block = await screen.findByTestId(`${testId}-resolved-view`);

		expect(block).toHaveStyleDeclaration('background-color', 'blue');
	});
});
