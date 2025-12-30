import React from 'react';

import { fireEvent, render, screen } from '@testing-library/react';
import { IntlProvider } from 'react-intl-next';

import { SmartCardProvider } from '@atlaskit/link-provider';
import {
	AtlasProject,
	overrideEmbedContent,
	renderWithIntl,
	ResolvedClient,
} from '@atlaskit/link-test-helpers';

import useResolve from '../../../state/hooks/use-resolve';
import { EmbedCardErroredView } from '../../../view/EmbedCard/views/ErroredView';
import { EmbedCardResolvedView, type EmbedCardResolvedViewProps } from '../views/ResolvedView';
import UnresolvedView from '../views/unresolved-view';

jest.mock('../../../state/hooks/use-resolve');
jest.mock('react-render-image', () => ({
	...jest.requireActual('react-render-image'),
	__esModule: true,
	default: jest.fn(({ src, loading, loaded, errored }: any) => {
		switch (src) {
			case 'src-loading':
				return loading;
			case 'src-loaded':
				return loaded;
			case 'src-error':
				return errored;
			default:
				return loaded;
		}
	}),
}));

let mockOnClick: React.MouseEventHandler = jest.fn();
const getResolvedProps = (overrides = {}): EmbedCardResolvedViewProps => ({
	link: AtlasProject.data.url,
	preview: {
		src: overrideEmbedContent,
		aspectRatio: 0.6,
	},
	title: AtlasProject.data.name,
	context: {
		text: AtlasProject.data.generator.name,
		icon: AtlasProject.data.generator.icon.url,
	},
	isTrusted: true,
	onClick: mockOnClick,
	...overrides,
});
const MockIconElement = () => {
	return <span data-testid="mock-icon-element" />;
};

describe('EmbedCard Views', () => {
	beforeEach(() => {
		mockOnClick = jest.fn().mockImplementation((event: React.MouseEvent) => {
			expect(event.isPropagationStopped()).toBe(true);
			expect(event.isDefaultPrevented()).toBe(true);
		});
	});

	afterEach(() => {
		jest.clearAllMocks();
	});

	describe('view: resolved', () => {
		const setupResolved = (
			props: React.ComponentProps<typeof EmbedCardResolvedView> = getResolvedProps(),
		) =>
			render(<EmbedCardResolvedView {...props} />, {
				wrapper: ({ children }) => (
					<IntlProvider locale="en">
						<SmartCardProvider client={new ResolvedClient()}>{children}</SmartCardProvider>
					</IntlProvider>
				),
			});

		it('renders view', async () => {
			const title = 'Smart Link Assets';
			const props = getResolvedProps({ title });
			setupResolved(props);
			const outerFrame = screen.getByTestId('embed-card-resolved-view');
			const innerFrame = screen.getByTestId('embed-card-resolved-view-frame');
			expect(outerFrame).toHaveTextContent(title);
			expect(innerFrame).toBeTruthy();
			expect(innerFrame.getAttribute('src')).toBe(props.preview?.src);

			await expect(document.body).toBeAccessible();
		});

		it('renders icon when icon prop is a jsx element', async () => {
			const props = getResolvedProps({
				context: { icon: <MockIconElement /> },
			});
			setupResolved(props);

			expect(screen.getByTestId('mock-icon-element')).toBeDefined();

			await expect(document.body).toBeAccessible();
		});

		it('renders correct icon when icon prop is a url string', async () => {
			const props = getResolvedProps();
			setupResolved(props);
			const embedCardResolved = screen.getByTestId('embed-card-resolved-view');

			expect(embedCardResolved.querySelector('.smart-link-icon')?.getAttribute('src')).toBe(
				props.context!.icon,
			);

			await expect(document.body).toBeAccessible();
		});

		it('renders fallback icon when icon prop is not a valid link or element', async () => {
			const props = getResolvedProps({
				context: { icon: 'src-error' },
			});
			setupResolved(props);

			expect(screen.getByTestId('embed-card-fallback-icon')).toBeDefined();

			await expect(document.body).toBeAccessible();
		});

		it('should default to context text if title is missing', async () => {
			const props = getResolvedProps({ title: undefined });
			setupResolved(props);
			const outerFrame = screen.getByTestId('embed-card-resolved-view');

			expect(outerFrame).toHaveTextContent('Atlas');

			await expect(document.body).toBeAccessible();
		});

		it('clicking on link should have no side-effects', async () => {
			const props = getResolvedProps({ title: undefined });
			setupResolved(props);
			const view = screen.getByTestId('embed-card-resolved-view');
			const link = view.querySelector('a');

			expect(link).toBeTruthy();
			fireEvent.click(link!);
			expect(mockOnClick).toHaveBeenCalledTimes(1);

			await expect(document.body).toBeAccessible();
		});

		it('should pass iframe forward ref down to <iframe> element', async () => {
			const props = getResolvedProps();
			const ref = React.createRef<HTMLIFrameElement>();
			const { container } = setupResolved({ ...props, ref });

			const iframeEl = container.querySelector('iframe');
			expect(iframeEl).toBe(ref.current);

			await expect(document.body).toBeAccessible();
		});

		it('renders sandbox prop on <iframe> element on untrusted link', async () => {
			const props = getResolvedProps({ isTrusted: false });
			const { container } = setupResolved(props);
			const iframeEl = container.querySelector('iframe');
			expect(iframeEl?.getAttribute('sandbox')).toBe(
				'allow-downloads allow-forms allow-popups allow-popups-to-escape-sandbox allow-presentation allow-same-origin allow-scripts',
			);

			await expect(document.body).toBeAccessible();
		});

		it('sandbox prop on <iframe> element on untrusted link', async () => {
			const props = getResolvedProps({ isTrusted: false });
			const { container } = setupResolved(props);

			const iframeEl = container.querySelector('iframe');
			expect(iframeEl?.getAttribute('sandbox')).toBe(
				'allow-downloads allow-forms allow-popups allow-popups-to-escape-sandbox allow-presentation allow-same-origin allow-scripts',
			);

			await expect(document.body).toBeAccessible();
		});

		it('does not renders sandbox prop on <iframe> element on trusted link', async () => {
			const props = getResolvedProps({ isTrusted: true });
			const { container } = setupResolved(props);

			const iframeEl = container.querySelector('iframe');
			expect(iframeEl?.getAttribute('sandbox')).toBeNull();

			await expect(document.body).toBeAccessible();
		});

		it('does allow scrolling of content through wrapper', async () => {
			const props = getResolvedProps({ isTrusted: true });
			setupResolved(props);
			const view = screen.getByTestId('embed-content-wrapper');
			expect(window.getComputedStyle(view).getPropertyValue('overflow')).toEqual('');

			await expect(document.body).toBeAccessible();
		});

		// TODO: Different view?
		it(`doesn't remove overflow attribute for Unresolved embeds`, async () => {
			const props = getResolvedProps({ isTrusted: true });
			render(
				<UnresolvedView
					testId="embed-card-unresolved-view"
					{...props}
					description="description"
					title="title"
					icon={null}
					image={null}
				/>,
			);
			const view = screen.getByTestId('embed-content-wrapper');
			expect(view).toHaveCompiledCss('overflow-x', 'auto');
			expect(view).toHaveCompiledCss('overflow-y', 'auto');

			await expect(document.body).toBeAccessible();
		});
		it('should force resolve when "force-resolve-smart-link" message is posted from the same iframe', async () => {
			const mockResolve = jest.fn();
			(useResolve as jest.Mock).mockImplementation(() => mockResolve);

			const props = getResolvedProps();
			const ref = React.createRef<HTMLIFrameElement>();
			setupResolved({ ...props, ref });

			const iframeEl = ref.current;
			fireEvent(
				window,
				new MessageEvent('message', {
					data: 'force-resolve-smart-link',
					source: iframeEl?.contentWindow,
				}),
			);

			expect(mockResolve).toHaveBeenCalledWith(props.link, true);

			await expect(document.body).toBeAccessible();
		});
		it('should not force resolve when a random message is posted', async () => {
			const mockResolve = jest.fn();
			(useResolve as jest.Mock).mockImplementation(() => mockResolve);

			const props = getResolvedProps();
			const ref = React.createRef<HTMLIFrameElement>();
			setupResolved({ ...props, ref });
			const iframeEl = ref.current;
			fireEvent(
				window,
				new MessageEvent('message', {
					data: 'some-other-message',
					source: iframeEl?.contentWindow,
				}),
			);
			expect(mockResolve).not.toHaveBeenCalled();

			await expect(document.body).toBeAccessible();
		});
		it('should not force resolve when the iframe is not the same as the one that posted the message', async () => {
			const mockResolve = jest.fn();
			(useResolve as jest.Mock).mockImplementation(() => mockResolve);

			const props = getResolvedProps();
			const ref = React.createRef<HTMLIFrameElement>();
			const differentRef = React.createRef<HTMLIFrameElement>();
			setupResolved({ ...props, ref });

			fireEvent(
				window,
				new MessageEvent('message', {
					data: 'force-resolve-smart-link',
					source: differentRef.current?.contentWindow,
				}),
			);
			expect(mockResolve).not.toHaveBeenCalled();

			await expect(document.body).toBeAccessible();
		});
	});

	describe('view: errored', () => {
		it('renders view', async () => {
			renderWithIntl(<EmbedCardErroredView testId="errored-view" />);
			const frame = screen.getByTestId('errored-view');
			expect(frame).toHaveTextContent("We couldn't load this link for an unknown reason.Try again");

			await expect(document.body).toBeAccessible();
		});

		it('renders view - clicking on retry enacts callback', async () => {
			const onRetryMock = jest.fn();
			renderWithIntl(<EmbedCardErroredView testId="errored-view" onRetry={onRetryMock} />);
			const frame = screen.getByTestId('errored-view');
			expect(frame).toHaveTextContent("We couldn't load this link for an unknown reason.Try again");

			// Check the button is there
			const button = screen.getByTestId('err-view-retry');
			expect(button).toHaveTextContent('Try again');

			// Click it, check mock is called
			fireEvent.click(button);
			expect(onRetryMock).toHaveBeenCalled();
			expect(onRetryMock).toHaveBeenCalledTimes(1);

			await expect(document.body).toBeAccessible();
		});
	});
});
