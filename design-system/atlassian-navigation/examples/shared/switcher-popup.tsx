/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { useEffect, useState } from 'react';

// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { css, jsx } from '@emotion/react';

import Popup from '@atlaskit/popup';
import Spinner from '@atlaskit/spinner';
import { token } from '@atlaskit/tokens';
import AtlassianSwitcher from '@atlassian/switcher';
import { mockEndpoints, REQUEST_FAST } from '@atlassian/switcher-test-utils';

import { AppSwitcher } from '../../src';
import { withAnalyticsLogger, withIntlProvider } from '../helpers';

const spinnerStyles = css({
	display: 'flex',
	maxWidth: 240,
	position: 'relative',
	justifyContent: 'center',
	insetBlockStart: '11.25rem',
});

type SwitcherDataProps = {
	update: () => void;
};

const SwitcherData = ({ update }: SwitcherDataProps) => {
	const [isLoaded, setIsLoaded] = useState(false);

	useEffect(() => {
		mockEndpoints(
			'jira',
			(originalMockData) => {
				return {
					...originalMockData,
					RECENT_CONTAINERS_DATA: {
						data: [],
					},
					CUSTOM_LINKS_DATA: {
						data: [],
					},
					XFLOW_SETTINGS: {},
				};
			},
			REQUEST_FAST,
		);

		setIsLoaded(true);
		update();
	}, [update]);

	return isLoaded ? (
		// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
		<div style={{ width: 400, maxHeight: 'calc(100vh - 100px)' }}>
			<h3
				style={{
					padding: `${token('space.300', '24px')} ${token(
						'space.300',
						'24px',
					)} ${token('space.100', '8px')} ${token('space.300', '24px')}`,
				}}
			>
				Switch to
			</h3>
			<div style={{ padding: `0 ${token('space.200', '16px')}` }}>
				<AtlassianSwitcher product="jira" cloudId="some-cloud-id" />
			</div>
		</div>
	) : (
		<div css={spinnerStyles}>
			<Spinner size="large" />
		</div>
	);
};

const SwitcherContent = withIntlProvider(withAnalyticsLogger(SwitcherData));

export const SwitcherPopup = () => {
	const [isOpen, setIsOpen] = useState(false);

	const onClick = () => {
		setIsOpen(!isOpen);
	};

	const onClose = () => {
		setIsOpen(false);
	};

	return (
		<Popup
			shouldRenderToParent
			placement="bottom-start"
			content={({ update }) => <SwitcherContent update={update} />}
			isOpen={isOpen}
			onClose={onClose}
			trigger={(triggerProps) => (
				<AppSwitcher onClick={onClick} tooltip="Switch to..." {...triggerProps} />
			)}
		/>
	);
};
