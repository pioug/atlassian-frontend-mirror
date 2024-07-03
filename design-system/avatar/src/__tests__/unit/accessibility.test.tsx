import React from 'react';

import { render } from '@testing-library/react';

import { axe } from '@af/accessibility-testing';
import __noop from '@atlaskit/ds-lib/noop';
import { ffTest } from '@atlassian/feature-flags-test-utils';

import { Block, Gap } from '../../../examples-util/helpers';
import Avatar, { AvatarItem } from '../../index';

ffTest.both(
	'platform.design-system-team.component-visual-refresh_t8zbo',
	'Avatar accessibility',
	() => {
		it('Basic Avatar examples (circle, square, disabled, with presence, with status) should not fail aXe audit', async () => {
			const { container } = render(
				<div>
					<Block heading="Circle">
						<Avatar name="xxlarge" size="xxlarge" testId="avatar" />
						<Gap />
						<Avatar name="xlarge" size="xlarge" presence="online" />
						<Gap />
						<Avatar name="large" size="large" presence="offline" />
						<Gap />
						<Avatar name="medium" size="medium" presence="busy" />
						<Gap />
						<Avatar name="small" size="small" presence="focus" />
						<Gap />
						<Avatar name="xsmall" size="xsmall" />
					</Block>
					<Block heading="Square">
						<Avatar appearance="square" name="xxlarge" size="xxlarge" />
						<Gap />
						<Avatar appearance="square" name="xlarge" size="xlarge" status="approved" />
						<Gap />
						<Avatar appearance="square" name="large" size="large" status="declined" />
						<Gap />
						<Avatar appearance="square" name="medium" size="medium" status="locked" />
						<Gap />
						<Avatar appearance="square" name="small" size="small" />
						<Gap />
						<Avatar appearance="square" name="xsmall" size="xsmall" />
					</Block>
					<Block heading="Disabled">
						<Avatar name="xxlarge" size="xxlarge" isDisabled />
						<Gap />
						<Avatar name="xlarge" size="xlarge" presence="online" isDisabled />
						<Gap />
						<Avatar name="large" size="large" presence="offline" isDisabled />
						<Gap />
						<Avatar name="medium" size="medium" presence="busy" isDisabled />
						<Gap />
						<Avatar name="small" size="small" presence="focus" isDisabled />
						<Gap />
						<Avatar name="xsmall" size="xsmall" isDisabled />
					</Block>
				</div>,
			);
			await axe(container);
		});

		it('Avatar Item examples should not fail aXe audit', async () => {
			const { container } = render(
				// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
				<div id="avatar-item-examples" style={{ display: 'flex' }}>
					<div>
						<h2>onClick</h2>
						<AvatarItem
							avatar={<Avatar presence="online" />}
							onClick={__noop}
							primaryText="Klaatu Baratta Nikto"
							secondaryText="zom@zombo.com"
							testId="avataritem-onClick"
							label="onClick"
						/>
						<h2>href</h2>
						<AvatarItem
							avatar={<Avatar status="approved" />}
							href="#"
							primaryText="Primary"
							secondaryText="Secondary"
							testId="avataritem-href"
							label="href"
						/>
					</div>
					<div>
						<h2>non-interactive</h2>
						<AvatarItem
							avatar={<Avatar presence="online" />}
							primaryText="Primary"
							secondaryText="Secondary"
							testId="avataritem-non-interactive"
							label="non-interactive"
						/>
						<h1>disabled</h1>
						<AvatarItem
							avatar={<Avatar status="approved" />}
							primaryText="Primary"
							secondaryText="Secondary"
							href="#"
							testId="avataritem-disabled"
							label="disabled"
							isDisabled
						/>
					</div>
				</div>,
			);
			await axe(container);
		});
	},
);
