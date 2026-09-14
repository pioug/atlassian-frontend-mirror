import React from 'react';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import { renderWithIntl } from '@atlaskit/editor-test-helpers/rtl';
import userEvent from '@testing-library/user-event';
import CodeBlock from '../../../../react/nodes/codeBlock/codeBlock';
import AnalyticsContext from '../../../../analytics/analyticsContext';
import { ACTION, ACTION_SUBJECT, ACTION_SUBJECT_ID, EVENT_TYPE } from '../../../../analytics/enums';
import { setupEditorExperiments } from '@atlaskit/tmp-editor-statsig/setup';

const textSample = 'window.alert';
const renderCodeBlock = (overrides = {}, fireAnalyticsEvent = jest.fn()) => {
	return renderWithIntl(
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

const lineNumbers = (container: HTMLElement) => container.querySelectorAll('.linenumber');
const codeTag = (container: HTMLElement) => container.querySelector('code');

// eslint-disable-next-line @atlassian/a11y/require-jest-coverage
describe('Renderer - React/Nodes/CodeBlock', () => {
	beforeEach(() => {
		setupEditorExperiments('test');
	});

	afterEach(() => {
		setupEditorExperiments('test', {}, {}, { disableTestOverrides: true });
	});

	it('should render @atlaskit/code component', () => {
		const { container } = renderCodeBlock();

		expect(container.querySelectorAll('[data-ds--code--code-block]')).toHaveLength(1);
		expect(container).toHaveTextContent(textSample);
	});

	it('should show line numbers by default', () => {
		const { container } = renderCodeBlock();

		expect(lineNumbers(container)).toHaveLength(1);
	});

	it('should hide line numbers when hideLineNumbers is true', () => {
		const { container } = renderCodeBlock({ hideLineNumbers: true });

		expect(lineNumbers(container)).toHaveLength(0);
	});

	it('should render CopyButton component if allowCopyToClipboard is enabled', () => {
		const { container } = renderCodeBlock({ allowCopyToClipboard: true });

		expect(container.querySelector('button.copy-to-clipboard')).toBeInTheDocument();
	});

	it('should not render CopyButton component if allowCopyToClipboard is disabled', () => {
		const { container } = renderCodeBlock();

		expect(container.querySelector('button.copy-to-clipboard')).not.toBeInTheDocument();
	});

	it('should render wrap button if allowWrapCodeBlock is enabled', () => {
		const { container } = renderCodeBlock({ allowWrapCodeBlock: true });

		expect(container.querySelector('button.wrap-code')).toBeInTheDocument();
	});

	it('should not render wrap button if allowWrapCodeBlock is disabled', () => {
		const { container } = renderCodeBlock();

		expect(container.querySelector('button.wrap-code')).not.toBeInTheDocument();
	});

	it('should initialise wrapped lines from the ADF wrap attribute when wrapping is allowed', () => {
		const { container } = renderCodeBlock({ allowWrapCodeBlock: true, wrap: true });

		expect(codeTag(container)).toHaveStyle({ whiteSpace: 'pre-wrap' });
	});

	it('should not initialise wrapped lines when the ADF wrap attribute is false', () => {
		const { container } = renderCodeBlock({ allowWrapCodeBlock: true, wrap: false });

		expect(codeTag(container)).toHaveStyle({ whiteSpace: 'pre' });
	});

	it('should not initialise wrapped lines when the ADF wrap attribute is not provided', () => {
		const { container } = renderCodeBlock({ allowWrapCodeBlock: true });

		expect(codeTag(container)).toHaveStyle({ whiteSpace: 'pre' });
	});

	it('should not initialise wrapped lines from the ADF wrap attribute when experiment is disabled', () => {
		setupEditorExperiments('test', {}, {}, { disableTestOverrides: true });
		const { container } = renderCodeBlock({ allowWrapCodeBlock: true, wrap: true });

		expect(codeTag(container)).toHaveStyle({ whiteSpace: 'pre' });
	});

	it('should keep the wrap button as a local toggle and fire analytics', async () => {
		const fireAnalyticsEvent = jest.fn();
		const { container } = renderCodeBlock(
			{ allowWrapCodeBlock: true, wrap: true },
			fireAnalyticsEvent,
		);

		expect(codeTag(container)).toHaveStyle({ whiteSpace: 'pre-wrap' });

		await userEvent.click(container.querySelector('button.wrap-code')!);

		expect(codeTag(container)).toHaveStyle({ whiteSpace: 'pre' });
		expect(fireAnalyticsEvent).toHaveBeenCalledWith({
			action: ACTION.CLICKED,
			actionSubject: ACTION_SUBJECT.BUTTON,
			actionSubjectId: ACTION_SUBJECT_ID.CODEBLOCK_WRAP,
			attributes: {
				wrapped: false,
			},
			eventType: EVENT_TYPE.UI,
		});
	});
});
