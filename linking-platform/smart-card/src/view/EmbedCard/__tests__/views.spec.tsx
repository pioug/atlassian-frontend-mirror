import React from 'react';
import { render, cleanup, fireEvent } from '@testing-library/react';
import {
  type EmbedCardResolvedViewProps,
  EmbedCardResolvedView,
} from '../views/ResolvedView';
import { BlockCardResolvingView } from '../../BlockCard';
import { renderWithIntl } from '@atlaskit/media-test-helpers/renderWithIntl';
import { EmbedCardErroredView } from '../../../view/EmbedCard/views/ErroredView';
import { mocks } from '../../../utils/mocks';
import {ffTest} from "@atlassian/feature-flags-test-utils";

jest.mock('@atlaskit/link-provider', () => ({
  useSmartLinkContext: () => ({
    store: { getState: () => ({ 'test-url': mocks.analytics }) },
  }),
}));

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
    cleanup();
  });

  describe('view: resolved', () => {
    it('renders view', () => {
      const props = getResolvedProps();
      const { getByTestId } = render(
        <EmbedCardResolvedView testId="embed-card-resolved-view" {...props} />,
      );
      const outerFrame = getByTestId('embed-card-resolved-view');
      const innerFrame = getByTestId('embed-card-resolved-view-frame');
      expect(outerFrame.textContent).toBe('Smart Link Assets');
      expect(innerFrame).toBeTruthy();
      expect(innerFrame.getAttribute('src')).toBe(props.preview?.src);
    });

    it('renders icon when icon prop is a jsx element', async () => {
      const props = getResolvedProps({
        context: { icon: <MockIconElement /> },
      });
      const { getByTestId } = render(<EmbedCardResolvedView {...props} />);

      expect(getByTestId('mock-icon-element')).toBeDefined();
    });

    it('renders correct icon when icon prop is a url string', async () => {
      const props = getResolvedProps();
      const { getByTestId } = render(<EmbedCardResolvedView {...props} />);
      const embedCardResolved = getByTestId('embed-card-resolved-view');

      expect(
        embedCardResolved
          .querySelector('.smart-link-icon')
          ?.getAttribute('src'),
      ).toBe(props.context!.icon);
    });

    it('renders fallback icon when icon prop is not a valid link or element', async () => {
      const props = getResolvedProps({
        context: { icon: 'src-error' },
      });
      const { getByTestId } = render(<EmbedCardResolvedView {...props} />);

      expect(getByTestId('embed-card-fallback-icon')).toBeDefined();
    });

    it('should default to context text if title is missing', () => {
      const props = getResolvedProps({ title: undefined });
      const { getByTestId } = render(
        <EmbedCardResolvedView testId="embed-card-resolved-view" {...props} />,
      );
      const outerFrame = getByTestId('embed-card-resolved-view');

      expect(outerFrame.textContent).toBe('Dropbox');
    });

    it('clicking on link should have no side-effects', () => {
      const props = getResolvedProps({ title: undefined });
      const { getByTestId } = render(
        <EmbedCardResolvedView testId="embed-card-resolved-view" {...props} />,
      );
      const view = getByTestId('embed-card-resolved-view');
      const link = view.querySelector('a');

      expect(link).toBeTruthy();
      fireEvent.click(link!);
      expect(mockOnClick).toHaveBeenCalledTimes(1);
    });

    it('should pass iframe forward ref down to <iframe> element', async () => {
      const props = getResolvedProps();
      const ref = React.createRef<HTMLIFrameElement>();
      const { container } = render(
        <EmbedCardResolvedView
          testId="embed-card-resolved-view"
          {...props}
          ref={ref}
        />,
      );
      const iframeEl = await container.querySelector('iframe');
      expect(iframeEl).toBe(ref.current);
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
    });

    it('sandbox prop on <iframe> element on untrusted link', () => {
      const props = getResolvedProps({ isTrusted: false });
      const { container } = render(
        <EmbedCardResolvedView testId="embed-card-resolved-view" {...props} />,
      );
      const iframeEl = container.querySelector('iframe');
      expect(iframeEl?.getAttribute('sandbox')).toBe(
        'allow-downloads allow-forms allow-popups allow-popups-to-escape-sandbox allow-presentation allow-same-origin allow-scripts',
      );
    });

    it('does not renders sandbox prop on <iframe> element on trusted link', async () => {
      const props = getResolvedProps({ isTrusted: true });
      const { container } = render(
        <EmbedCardResolvedView testId="embed-card-resolved-view" {...props} />,
      );
      const iframeEl = container.querySelector('iframe');
      expect(iframeEl?.getAttribute('sandbox')).toBeNull();
    });

    it('does not allow scrolling of content through wrapper when FF is off', () => {
      const props = getResolvedProps({ isTrusted: true });
      const { getByTestId } = render(
        <EmbedCardResolvedView testId="embed-card-resolved-view" {...props} />,
      );
      const view = getByTestId('embed-content-wrapper');
      expect(
        window.getComputedStyle(view).getPropertyValue('overflow'),
      ).toEqual('hidden');
    });

    ffTest.on(
      'platform.linking-platform.smart-card.fix-embed-card-blurring',
      'with fix for embed card blurring on',
      () => {
        it('does allow scrolling of content through wrapper when FF is on', () => {
          const props = getResolvedProps({ isTrusted: true });
          const { getByTestId } = render(
            <EmbedCardResolvedView testId="embed-card-resolved-view" {...props} />,
          );
          const view = getByTestId('embed-content-wrapper');
          expect(
            window.getComputedStyle(view).getPropertyValue('overflow'),
          ).toEqual('');
        })
    });
  });

  // Same as BlockCard
  describe('view: resolving', () => {
    it('renders view', () => {
      const { getByTestId } = renderWithIntl(
        <BlockCardResolvingView testId="embed-card-resolving-view" />,
      );
      const frame = getByTestId('embed-card-resolving-view');
      expect(frame.textContent).toBe('Loading...');
    });
  });

  describe('view: errored', () => {
    it('renders view', () => {
      const { getByTestId } = renderWithIntl(
        <EmbedCardErroredView testId="errored-view" />,
      );
      const frame = getByTestId('errored-view');
      expect(frame.textContent).toBe(
        "We couldn't load this link for an unknown reason.Try again",
      );
    });

    it('renders view - clicking on retry enacts callback', () => {
      const onRetryMock = jest.fn();
      const { getByTestId } = renderWithIntl(
        <EmbedCardErroredView testId="errored-view" onRetry={onRetryMock} />,
      );
      const frame = getByTestId('errored-view');
      expect(frame.textContent).toBe(
        "We couldn't load this link for an unknown reason.Try again",
      );

      // Check the button is there
      const button = getByTestId('err-view-retry');
      expect(button.textContent).toBe('Try again');

      // Click it, check mock is called
      fireEvent.click(button);
      expect(onRetryMock).toHaveBeenCalled();
      expect(onRetryMock).toHaveBeenCalledTimes(1);
    });
  });
});
