import React from 'react';

import { fireEvent, render, screen } from '@testing-library/react';

import { renderWithIntl } from '@atlaskit/media-test-helpers/renderWithIntl';

import useResolve from '../../../state/hooks/use-resolve';
import { mocks } from '../../../utils/mocks';
import { EmbedCardErroredView } from '../../../view/EmbedCard/views/ErroredView';
import { EmbedCardResolvedView, type EmbedCardResolvedViewProps } from '../views/ResolvedView';
import UnresolvedView from '../views/unresolved-view';

jest.mock('@atlaskit/link-provider', () => ({
	...jest.requireActual('@atlaskit/link-provider'),
	useSmartLinkContext: () => ({
		store: { getState: () => ({ 'test-url': mocks.analytics }) },
		config: { authFlow: 'disabled' },
		connections: {
			client: {
				fetchData: jest.fn(),
			},
		},
	}),
}));
jest.mock('../../../state/hooks/use-resolve');

let mockOnClick: React.MouseEventHandler = jest.fn();
const getResolvedProps = (overrides = {}): EmbedCardResolvedViewProps => ({
	link: 'https://www.dropbox.com/sh/0isygvcskxbdwee/AADMfqcGx4XR15DeKnRo_YzHa?dl=0',
	preview: {
		src: 'https://www.dropbox.com/sh/0isygvcskxbdwee/AADMfqcGx4XR15DeKnRo_YzHa?dl=0',
		aspectRatio: 0.6,
	},
	title: 'Smart Link Assets',
	context: {
		text: 'Dropbox',
		icon: 'https://www.dropbox.com/static/30168/images/favicon.ico',
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
		it('renders view', async () => {
			const props = getResolvedProps();
			render(<EmbedCardResolvedView testId="embed-card-resolved-view" {...props} />);
			const outerFrame = screen.getByTestId('embed-card-resolved-view');
			const innerFrame = screen.getByTestId('embed-card-resolved-view-frame');
			expect(outerFrame).toHaveTextContent('Smart Link Assets');
			expect(innerFrame).toBeTruthy();
			expect(innerFrame.getAttribute('src')).toBe(props.preview?.src);

			await expect(document.body).toBeAccessible();
		});

		it('renders icon when icon prop is a jsx element', async () => {
			const props = getResolvedProps({
				context: { icon: <MockIconElement /> },
			});
			render(<EmbedCardResolvedView {...props} />);

			expect(screen.getByTestId('mock-icon-element')).toBeDefined();

			await expect(document.body).toBeAccessible();
		});

		it('renders correct icon when icon prop is a url string', async () => {
			const props = getResolvedProps();
			render(<EmbedCardResolvedView {...props} />);
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
			render(<EmbedCardResolvedView {...props} />);

			expect(screen.getByTestId('embed-card-fallback-icon')).toBeDefined();

			await expect(document.body).toBeAccessible();
		});

		it('should default to context text if title is missing', async () => {
			const props = getResolvedProps({ title: undefined });
			render(<EmbedCardResolvedView testId="embed-card-resolved-view" {...props} />);
			const outerFrame = screen.getByTestId('embed-card-resolved-view');

			expect(outerFrame).toHaveTextContent('Dropbox');

			await expect(document.body).toBeAccessible();
		});

		it('clicking on link should have no side-effects', async () => {
			const props = getResolvedProps({ title: undefined });
			render(<EmbedCardResolvedView testId="embed-card-resolved-view" {...props} />);
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
			const { container } = render(
				<EmbedCardResolvedView testId="embed-card-resolved-view" {...props} ref={ref} />,
			);
			const iframeEl = container.querySelector('iframe');
			expect(iframeEl).toBe(ref.current);

			await expect(document.body).toBeAccessible();
		});

		it('renders sandbox prop on <iframe> element on untrusted link', async () => {
			const props = getResolvedProps({ isTrusted: false });
			const { container } = render(
				<EmbedCardResolvedView testId="embed-card-resolved-view" {...props} />,
			);
			const iframeEl = container.querySelector('iframe');
			expect(iframeEl?.getAttribute('sandbox')).toBe(
				'allow-downloads allow-forms allow-popups allow-popups-to-escape-sandbox allow-presentation allow-same-origin allow-scripts',
			);

			await expect(document.body).toBeAccessible();
		});

		it('sandbox prop on <iframe> element on untrusted link', async () => {
			const props = getResolvedProps({ isTrusted: false });
			const { container } = render(
				<EmbedCardResolvedView testId="embed-card-resolved-view" {...props} />,
			);
			const iframeEl = container.querySelector('iframe');
			expect(iframeEl?.getAttribute('sandbox')).toBe(
				'allow-downloads allow-forms allow-popups allow-popups-to-escape-sandbox allow-presentation allow-same-origin allow-scripts',
			);

			await expect(document.body).toBeAccessible();
		});

		it('does not renders sandbox prop on <iframe> element on trusted link', async () => {
			const props = getResolvedProps({ isTrusted: true });
			const { container } = render(
				<EmbedCardResolvedView testId="embed-card-resolved-view" {...props} />,
			);
			const iframeEl = container.querySelector('iframe');
			expect(iframeEl?.getAttribute('sandbox')).toBeNull();

			await expect(document.body).toBeAccessible();
		});

		it('does allow scrolling of content through wrapper', async () => {
			const props = getResolvedProps({ isTrusted: true });
			render(<EmbedCardResolvedView testId="embed-card-resolved-view" {...props} />);
			const view = screen.getByTestId('embed-content-wrapper');
			expect(window.getComputedStyle(view).getPropertyValue('overflow')).toEqual('');

			await expect(document.body).toBeAccessible();
		});

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
			render(<EmbedCardResolvedView testId="embed-card-resolved-view" {...props} ref={ref} />);

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
			render(<EmbedCardResolvedView testId="embed-card-resolved-view" {...props} ref={ref} />);
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
			render(<EmbedCardResolvedView testId="embed-card-resolved-view" {...props} ref={ref} />);
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
