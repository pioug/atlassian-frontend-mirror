import React from 'react';

import Button from '@atlaskit/button/standard-button';
import ShortcutIcon from '@atlaskit/icon/core/link-external';
// eslint-disable-next-line @atlaskit/design-system/no-emotion-primitives -- to be migrated to @atlaskit/primitives/compiled – go/akcss
import { Inline, xcss } from '@atlaskit/primitives';
import Toggle from '@atlaskit/toggle';
import { token } from '@atlaskit/tokens';
import Tooltip from '@atlaskit/tooltip';

import { type TemplateDisplay } from '../types';

const containerStyles = xcss({
	borderBottom: `${token('border.width')} solid ${token('color.border')}`,
});

const FlexibleToggle = ({
	display,
	onChange,
}: {
	display?: TemplateDisplay;
	onChange: (e: React.SyntheticEvent<HTMLInputElement>) => void;
}): React.JSX.Element => {
	return (
		<Inline alignBlock="center" space="space.050" xcss={containerStyles}>
			<Toggle
				id="toggle-flexible"
				label="Flexible Smart Link"
				isChecked={display === 'flexible'}
				onChange={onChange}
			/>
			<label htmlFor="toggle-flexible">
				<h5>Flexible Smart Links</h5>
			</label>
			<Tooltip content="go/flexible-smart-links-docs">
				{(tooltipProps) => (
					<Button
						appearance="subtle-link"
						{...tooltipProps}
						href="http://go/flexible-smart-links-docs"
						iconBefore={
							<ShortcutIcon
								label="Go to flexible smart links docs"
								LEGACY_size="small"
								color="currentColor"
							/>
						}
						spacing="none"
						target="_blank"
					/>
				)}
			</Tooltip>
		</Inline>
	);
};
export default FlexibleToggle;
