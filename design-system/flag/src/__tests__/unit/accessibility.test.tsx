import React from 'react';

import { render } from '@testing-library/react';

import { axe } from '@af/accessibility-testing';
import InfoIcon from '@atlaskit/icon/core/status-information';
import SuccessIcon from '@atlaskit/icon/core/status-success';
import { token } from '@atlaskit/tokens';

import Flag, { AutoDismissFlag, FlagGroup } from '../../index';

describe('Accessibility jest-axe', () => {
	it('FlagGroup', async () => {
		const flags = [
			{
				description: 'Marzipan croissant pie. Jelly beans gingerbread caramels brownie icing.',
				id: '1',
				key: '1',
				title: 'New version published',
				icon: <InfoIcon color={token('color.icon.information')} label="Info" />,
			},
			{
				description:
					'Scott Farquhar published a new version of this page. Refresh to see the changes.',
				id: '2',
				key: '2',
				title: 'New version published',
				icon: <InfoIcon color={token('color.icon.information')} label="Info" />,
			},
		];
		const { container } = render(
			<FlagGroup>
				{flags.map((flag) => (
					<Flag {...flag} />
				))}
			</FlagGroup>,
		);

		await axe(container);
	});

	it('AutoDismissFlag', async () => {
		const { container } = render(
			<AutoDismissFlag
				id={1}
				icon={<SuccessIcon color={token('color.icon.success')} label="Success" size="medium" />}
				title={`#${1} Your changes were saved`}
				description="I will auto dismiss after 8 seconds."
			/>,
		);

		await axe(container);
	});
});
