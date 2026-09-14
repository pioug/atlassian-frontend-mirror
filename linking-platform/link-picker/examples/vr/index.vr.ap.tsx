/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { css, jsx } from '@atlaskit/css';
import { Popup } from '@atlaskit/popup/popup';

import { MockLinkPickerPromisePlugin } from '../../src/__tests__/__helpers/mock-plugins.ts';
import LinkPicker from '../../src/ui';

const noWrapContainerStyle = css({
	whiteSpace: 'nowrap',
});

const NOOP = () => {};

/** Remove on cleanup of platform_link_picker_fix_error_state_text_overflow */
export const VrNoResultsInPopupWithWhitespaceNowrapAncestor = (): JSX.Element => (
	<span css={noWrapContainerStyle}>
		<Popup
			shouldRenderToParent
			isOpen
			onClose={NOOP}
			content={() => (
				<LinkPicker
					plugins={[
						new MockLinkPickerPromisePlugin({
							tabKey: 'confluence',
							tabTitle: 'Confluence',
							promise: Promise.resolve([]),
						}),
						new MockLinkPickerPromisePlugin({
							tabKey: 'loom',
							tabTitle: 'Loom',
							promise: Promise.resolve([]),
						}),
					]}
					url="some search query"
					onSubmit={NOOP}
					onCancel={NOOP}
					hideDisplayText
				/>
			)}
			trigger={(triggerProps) => (
				<button {...triggerProps} type="button">
					Open
				</button>
			)}
		/>
	</span>
);

/** Remove on cleanup of platform_link_picker_fix_error_state_text_overflow */
export const VrErrorInPopupWithWhitespaceNowrapAncestor = (): JSX.Element => (
	<span css={noWrapContainerStyle}>
		<Popup
			shouldRenderToParent
			isOpen
			onClose={NOOP}
			content={() => (
				<LinkPicker
					plugins={[
						new MockLinkPickerPromisePlugin({
							tabKey: 'confluence',
							tabTitle: 'Confluence',
							promise: Promise.reject(new Error('Simulated search error')),
						}),
						new MockLinkPickerPromisePlugin({
							tabKey: 'loom',
							tabTitle: 'Loom',
							promise: Promise.reject(new Error('Simulated search error')),
						}),
					]}
					url="some search query"
					onSubmit={NOOP}
					onCancel={NOOP}
					hideDisplayText
				/>
			)}
			trigger={(triggerProps) => (
				<button {...triggerProps} type="button">
					Open
				</button>
			)}
		/>
	</span>
);
