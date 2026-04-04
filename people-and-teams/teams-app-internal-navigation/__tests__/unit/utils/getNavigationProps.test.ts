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
	test('calls openPreviewPanel on click with url derived from href, prevents default, and skips SPA navigation', () => {
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
		expect(context.openPreviewPanel).toHaveBeenCalledWith({
			ari: 'test-ari',
			name: 'Test Entity',
			url: TEAMS_APP_HREF,
		});
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
		const context = createMockContext();
		const props = getNavigationProps({ href, intent, context });
		expect(props.href).toBe(href);
	});
});

describe('contextEntryPoint prefixing', () => {
	test('prefixes relative href with contextEntryPoint for navigation intent', () => {
		const context = createMockContext({ contextEntryPoint: '/wiki/people' });
		const props = getNavigationProps({ href: 'team/123', intent: 'navigation', context });
		expect(props.href).toBe('/wiki/people/team/123');
	});

	test('prefixes relative href with contextEntryPoint for action intent', () => {
		const context = createMockContext({ contextEntryPoint: '/wiki/people' });
		const props = getNavigationProps({ href: 'team/123', intent: 'action', context });
		expect(props.href).toBe('/wiki/people/team/123');
	});

	test('does not prefix absolute URLs', () => {
		const context = createMockContext({ contextEntryPoint: '/wiki/people' });
		const props = getNavigationProps({
			href: 'https://team.atlassian.com/goal/123',
			intent: 'navigation',
			context,
		});
		expect(props.href).toBe('https://team.atlassian.com/goal/123');
	});

	test('does not prefix URLs that already start with contextEntryPoint', () => {
		const context = createMockContext({ contextEntryPoint: '/wiki/people' });
		const props = getNavigationProps({
			href: '/wiki/people/team/123',
			intent: 'navigation',
			context,
		});
		expect(props.href).toBe('/wiki/people/team/123');
	});

	test('does not prefix URLs that start with /', () => {
		const context = createMockContext({ contextEntryPoint: '/wiki/people' });
		const props = getNavigationProps({ href: '/people/team/123', intent: 'navigation', context });
		expect(props.href).toBe('/people/team/123');
	});

	test('does not prefix for external intent', () => {
		const context = createMockContext({ contextEntryPoint: '/wiki/people' });
		const props = getNavigationProps({ href: 'team/123', intent: 'external', context });
		expect(props.href).toBe('team/123');
	});

	test('does not prefix when forceExternalIntent is true', () => {
		const context = createMockContext({
			contextEntryPoint: '/wiki/people',
			forceExternalIntent: true,
		});
		const props = getNavigationProps({ href: 'team/123', intent: 'navigation', context });
		expect(props.href).toBe('team/123');
	});

	test('does not prefix when contextEntryPoint is not set', () => {
		const context = createMockContext();
		const props = getNavigationProps({ href: 'team/123', intent: 'navigation', context });
		expect(props.href).toBe('team/123');
	});
});

describe('onBeforeNavigate', () => {
	test('is called before navigation onClick for internal links', () => {
		const context = createMockContext();
		const onBeforeNavigate = jest.fn();
		const props = getNavigationProps({
			href: TEAMS_APP_HREF,
			intent: 'navigation',
			context,
			onBeforeNavigate,
		});
		const event = createMouseEvent<HTMLAnchorElement>();
		props.onClick?.(event);
		expect(onBeforeNavigate).toHaveBeenCalledWith(event);
		expect(context.navigate).toHaveBeenCalled();
	});

	test('is called before navigation onClick for external links', () => {
		const context = createMockContext();
		const onBeforeNavigate = jest.fn();
		const props = getNavigationProps({
			href: EXTERNAL_HREF,
			intent: 'external',
			context,
			onBeforeNavigate,
		});
		const event = createMouseEvent<HTMLAnchorElement>();
		props.onClick?.(event);
		expect(onBeforeNavigate).toHaveBeenCalledWith(event);
		expect(mockWindowOpen).toHaveBeenCalled();
	});

	test('skips navigation when onBeforeNavigate calls preventDefault', () => {
		const context = createMockContext();
		const onBeforeNavigate = jest.fn((e: { preventDefault: () => void }) => {
			e.preventDefault();
		});
		const props = getNavigationProps({
			href: TEAMS_APP_HREF,
			intent: 'navigation',
			context,
			onBeforeNavigate,
		});
		const event = createMouseEvent<HTMLAnchorElement>();
		// Make preventDefault actually set defaultPrevented
		event.preventDefault = jest.fn(() => {
			Object.defineProperty(event, 'defaultPrevented', { value: true });
		});
		props.onClick?.(event);
		expect(onBeforeNavigate).toHaveBeenCalled();
		expect(context.navigate).not.toHaveBeenCalled();
	});

	test('works correctly when onBeforeNavigate is not provided', () => {
		const context = createMockContext();
		const props = getNavigationProps({ href: TEAMS_APP_HREF, intent: 'navigation', context });
		const event = createMouseEvent<HTMLAnchorElement>();
		props.onClick?.(event);
		expect(context.navigate).toHaveBeenCalled();
	});
});
