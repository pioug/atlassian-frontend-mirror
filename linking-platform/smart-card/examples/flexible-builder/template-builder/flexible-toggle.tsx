/**
 * @jsxRuntime classic
 * @jsx jsx
 */
// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { css, jsx } from '@emotion/react';
import React from 'react';
import Button from '@atlaskit/button/standard-button';
import ShortcutIcon from '@atlaskit/icon/core/migration/link-external--shortcut';
import Tooltip from '@atlaskit/tooltip';
import { token } from '@atlaskit/tokens';
import Toggle from '@atlaskit/toggle';
import { type TemplateDisplay } from '../types';

const containerStyles = css({
	display: 'flex',
	alignItems: 'center',
	borderBottom: `1px solid ${token('color.border', '#091E4224')}`,
	gap: '0.3rem',
	paddingBottom: '0.5rem',
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
	h5: {
		marginTop: 'inherit',
	},
});

const FlexibleToggle = ({
	display,
	onChange,
}: {
	display?: TemplateDisplay;
	onChange: (e: React.SyntheticEvent<HTMLInputElement>) => void;
}) => {
	return (
		<div css={containerStyles}>
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
		</div>
	);
};
export default FlexibleToggle;
