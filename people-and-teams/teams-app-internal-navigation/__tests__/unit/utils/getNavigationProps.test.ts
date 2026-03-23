import { getNavigationProps } from '../../../src/common/utils/getNavigationProps';
import {
	createMockContext,
	createMouseEvent,
	expectExternalLinkBehaviour,
	expectInternalLinkBehaviour,
	expectRouterNavigationNotUsed,
	expectRouterNavigationUsed,
} from '../test-utils';

const EXTERNAL_HREF = 'https://external.example.com';
const TEAMS_APP_HREF = 'https://home.atlassian.com/o/test-org-id/people/123';
const CONFLUENCE_HREF = 'https://confluence.atlassian.com/pages/123';

let mockWindowOpen: jest.SpyInstance;

beforeEach(() => {
	mockWindowOpen = jest.spyOn(window, 'open').mockImplementation(() => null);
});

afterEach(() => {
	jest.clearAllMocks();
});

test('external link: sets target="_blank", rel="noopener noreferrer", opens URL in new window, and does not use SPA navigation', () => {
	const context = createMockContext();
	const props = getNavigationProps({ href: EXTERNAL_HREF, intent: 'external', context });
	expectExternalLinkBehaviour(props);

	const event = createMouseEvent<HTMLAnchorElement>();
	props.onClick?.(event);
	expect(mockWindowOpen).toHaveBeenCalledWith(EXTERNAL_HREF, '_blank', 'noopener noreferrer');
	expect(event.preventDefault).toHaveBeenCalled();
	expect(context.navigate).not.toHaveBeenCalled();
});

describe('navigation intent with a Teams app route', () => {
	const expectedRoutePath = '/o/test-org-id/people/123';

	test('sets target="_self" and no rel attribute', () => {
		const context = createMockContext();
		const props = getNavigationProps({ href: TEAMS_APP_HREF, intent: 'navigation', context });
		expectInternalLinkBehaviour(props);
	});

	test('onClick uses SPA navigation on a plain left click', () => {
		const context = createMockContext();
		const props = getNavigationProps({ href: TEAMS_APP_HREF, intent: 'navigation', context });
		expectRouterNavigationUsed(props.onClick, context, expectedRoutePath);
	});

	test('onClick lets browser handle modifier key clicks (no preventDefault, no SPA navigation)', () => {
		const context = createMockContext();
		const props = getNavigationProps({ href: TEAMS_APP_HREF, intent: 'navigation', context });
		const event = createMouseEvent<HTMLAnchorElement>({ metaKey: true });
		props.onClick?.(event);
		expect(context.navigate).not.toHaveBeenCalled();
		expect(event.preventDefault).not.toHaveBeenCalled();
	});

	it.each([
		['non-left mouse button', { button: 1 }],
		['defaultPrevented', { defaultPrevented: true }],
	])('onClick does not use SPA navigation when %s', (_, eventOverrides) => {
		const context = createMockContext();
		const props = getNavigationProps({ href: TEAMS_APP_HREF, intent: 'navigation', context });
		const event = createMouseEvent<HTMLAnchorElement>(eventOverrides);
		props.onClick?.(event);
		expect(context.navigate).not.toHaveBeenCalled();
	});
});

test('navigation intent with a non-Teams app route, sets target="_self", no rel, and does not use SPA navigation', () => {
	const context = createMockContext();
	const props = getNavigationProps({ href: CONFLUENCE_HREF, intent: 'navigation', context });
	expectInternalLinkBehaviour(props);
	expectRouterNavigationNotUsed(props.onClick, context);
});

test('reference intent: sets target="_self" and no rel', () => {
	const context = createMockContext();
	const props = getNavigationProps({ href: TEAMS_APP_HREF, intent: 'reference', context });
	expectInternalLinkBehaviour(props);
});

describe('action intent', () => {
	test('calls openPreviewPanel on click, prevents default, and skips SPA navigation', () => {
		const context = createMockContext();
		const previewPanelProps = { ari: 'test-ari', name: 'Test Entity' };
		const props = getNavigationProps({
			href: TEAMS_APP_HREF,
			intent: 'action',
			previewPanelProps,
			context,
		});
		const event = createMouseEvent<HTMLAnchorElement>();
		props.onClick?.(event);
		expect(context.openPreviewPanel).toHaveBeenCalledWith(previewPanelProps);
		expect(event.preventDefault).toHaveBeenCalled();
		expect(context.navigate).not.toHaveBeenCalled();
	});

	test('opens in same tab when action intent has no preview panel props', () => {
		const context = createMockContext();
		// Using non-Teams href so it does not trigger SPA navigation
		const props = getNavigationProps({
			href: CONFLUENCE_HREF,
			intent: 'action',
			context,
		});
		expectInternalLinkBehaviour(props);
		props.onClick?.(createMouseEvent<HTMLAnchorElement>());
		expect(context.openPreviewPanel).not.toHaveBeenCalled();
		expectRouterNavigationNotUsed(props.onClick, context);
	});
});

test('previewPanelProps without action intent is a type error', () => {
	const context = createMockContext();
	const result = getNavigationProps({
		href: TEAMS_APP_HREF,
		intent: 'navigation',
		// @ts-expect-error - previewPanelProps is only valid with intent: 'action'
		previewPanelProps: { ari: 'test-ari', name: 'Test' },
		context,
	});
	expect(result.target).toBe('_self');
});

test('forceExternalIntent context override: sets target="_blank", rel="noopener noreferrer", opens in new window, and does not use SPA navigation', () => {
	const context = createMockContext({ forceExternalIntent: true });
	const props = getNavigationProps({ href: TEAMS_APP_HREF, intent: 'navigation', context });
	expectExternalLinkBehaviour(props);
	props.onClick?.(createMouseEvent<HTMLAnchorElement>());
	expect(mockWindowOpen).toHaveBeenCalled();
	expect(context.navigate).not.toHaveBeenCalled();
});

describe('href handling', () => {
	test.each([
		['external', EXTERNAL_HREF, 'external'],
		['internal', TEAMS_APP_HREF, 'navigation'],
	] as const)('leaves %s URLs unchanged', (_, href, intent) => {
		const context = createMockContext(intent === 'navigation' ? { orgId: 'my-org' } : {});
		const props = getNavigationProps({ href, intent, context });
		expect(props.href).toBe(href);
	});
});
