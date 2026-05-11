import React from 'react';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import { mountWithIntl } from '@atlaskit/editor-test-helpers/enzyme';
import CodeBlock from '../../../../react/nodes/codeBlock/codeBlock';
import { CodeBlock as AkCodeBlock } from '@atlaskit/code';
import AnalyticsContext from '../../../../analytics/analyticsContext';
import { ACTION, ACTION_SUBJECT, ACTION_SUBJECT_ID, EVENT_TYPE } from '../../../../analytics/enums';
import { setupEditorExperiments } from '@atlaskit/tmp-editor-statsig/setup';

const textSample = 'window.alert';
const render = (overrides = {}, fireAnalyticsEvent = jest.fn()) => {
	return mountWithIntl(
		<AnalyticsContext.Provider value={{ fireAnalyticsEvent }}>
			<CodeBlock
				language="javascript"
				allowCopyToClipboard={false}
				allowWrapCodeBlock={false}
				text={textSample}
				codeBidiWarningTooltipEnabled={true}
				{...overrides}
			/>
		</AnalyticsContext.Provider>,
	);
};
describe('Renderer - React/Nodes/CodeBlock', () => {
	beforeEach(() => {
		setupEditorExperiments('test');
	});

	afterEach(() => {
		setupEditorExperiments('test', {}, {}, { disableTestOverrides: true });
	});

	it('should render @atlaskit/code component', () => {
		const node = render();
		const codeBlockWrapper = node.find(AkCodeBlock);
		expect(codeBlockWrapper).toHaveLength(1);
		expect(codeBlockWrapper.at(0).prop('text')).toBe(textSample);
		node.unmount();
	});

	it('should render CopyButton component if allowCopyToClipboard is enabled', () => {
		const node = render({ allowCopyToClipboard: true });
		expect(node.find('CopyButton')).toHaveLength(1);
		node.unmount();
	});

	it('should not render CopyButton component if allowCopyToClipboard is disabled', () => {
		const node = render();
		expect(node.find('CopyButton').exists()).toBe(false);
		node.unmount();
	});

	it('should render wrap button if allowWrapCodeBlock is enabled', () => {
		const node = render({ allowWrapCodeBlock: true });
		expect(node.find('CodeBlockWrapButton')).toHaveLength(1);
		node.unmount();
	});

	it('should not render wrap button if allowWrapCodeBlock is disabled', () => {
		const node = render();
		expect(node.find('CodeBlockWrapButton').exists()).toBe(false);
		node.unmount();
	});

	it('should initialise wrapped lines from the ADF wrap attribute when wrapping is allowed', () => {
		const node = render({ allowWrapCodeBlock: true, wrap: true });

		expect(node.find(AkCodeBlock).prop('shouldWrapLongLines')).toBe(true);

		node.unmount();
	});

	it('should not initialise wrapped lines when the ADF wrap attribute is false', () => {
		const node = render({ allowWrapCodeBlock: true, wrap: false });

		expect(node.find(AkCodeBlock).prop('shouldWrapLongLines')).toBe(false);

		node.unmount();
	});

	it('should not initialise wrapped lines when the ADF wrap attribute is not provided', () => {
		const node = render({ allowWrapCodeBlock: true });

		expect(node.find(AkCodeBlock).prop('shouldWrapLongLines')).toBe(false);

		node.unmount();
	});

	it('should not initialise wrapped lines from the ADF wrap attribute when experiment is disabled', () => {
		setupEditorExperiments('test', {}, {}, { disableTestOverrides: true });
		const node = render({ allowWrapCodeBlock: true, wrap: true });

		expect(node.find(AkCodeBlock).prop('shouldWrapLongLines')).toBe(false);

		node.unmount();
	});

	it('should keep the wrap button as a local toggle and fire analytics', () => {
		const fireAnalyticsEvent = jest.fn();
		const node = render({ allowWrapCodeBlock: true, wrap: true }, fireAnalyticsEvent);

		expect(node.find(AkCodeBlock).prop('shouldWrapLongLines')).toBe(true);

		node
			.find('CodeBlockWrapButton')
			.find('button')
			.simulate('click', { stopPropagation: jest.fn() });

		expect(node.find(AkCodeBlock).prop('shouldWrapLongLines')).toBe(false);
		expect(fireAnalyticsEvent).toHaveBeenCalledWith({
			action: ACTION.CLICKED,
			actionSubject: ACTION_SUBJECT.BUTTON,
			actionSubjectId: ACTION_SUBJECT_ID.CODEBLOCK_WRAP,
			attributes: {
				wrapped: false,
			},
			eventType: EVENT_TYPE.UI,
		});

		node.unmount();
	});
});
