import { renderHook } from '@testing-library/react-hooks';

import type { CardType } from '@atlaskit/linking-common';

import {
  cardContext,
  mockCardContextState,
  mockPreview,
} from '../../ui/__tests__/_utils/mock-card-context';

import type { LinkUpgradeDiscoverabilityProps } from './useLinkUpgradeDiscoverability';
import useLinkUpgradeDiscoverability from './useLinkUpgradeDiscoverability';

describe('useLinkUpgradeDiscoverability', () => {
  const mockUrl = 'https://some.url';

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const mockPluginInjectionApi: any = {
    card: {
      sharedState: {
        currentState: () => {
          return {
            inlineCardAwarenessCandidatePosition: 1,
          };
        },
      },
    },
  };

  const defaultParams = {
    url: mockUrl,
    linkPosition: 1,
    isPulseEnabled: true,
    isOverlayEnabled: true,
    cardContext: cardContext.value,
    pluginInjectionApi: mockPluginInjectionApi,
  };

  const getCardState = (status: CardType = 'resolved') => ({
    [mockUrl]: {
      status: status,
    },
  });

  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
  });

  const setup = (overrideParams?: Partial<LinkUpgradeDiscoverabilityProps>) =>
    renderHook(() =>
      useLinkUpgradeDiscoverability({
        ...defaultParams,
        ...overrideParams,
      }),
    );

  describe('shouldShowLinkPulse', () => {
    it('should return false if isOverlayEnabled false', () => {
      mockCardContextState(getCardState());
      mockPreview('some-preview');

      const { result } = setup({ isPulseEnabled: false });
      expect(result.current.shouldShowLinkPulse).toBe(false);
    });

    it.each([
      'pending',
      'resolving',
      'errored',
      'fallback',
      'unauthorized',
      'forbidden',
      'not_found',
    ])('should return false if link status is "%s"', linkStatus => {
      mockCardContextState(getCardState(linkStatus as CardType));
      mockPreview('some-preview');

      const { result } = setup();
      expect(result.current.shouldShowLinkPulse).toBe(false);
    });

    it('should return false if link status is resolved, but there is no preview', () => {
      mockCardContextState(getCardState());
      mockPreview(undefined);

      const { result } = setup();
      expect(result.current.shouldShowLinkPulse).toBe(false);
    });

    it('should return false if local storage key for link pulse is already discovered', () => {
      mockCardContextState(getCardState());
      mockPreview('some-preview');

      localStorage.setItem(
        '@atlaskit/editor-plugin-card_smart-link-upgrade-pulse',
        JSON.stringify({ value: 'discovered' }),
      );

      const { result } = setup();
      expect(result.current.shouldShowLinkPulse).toBe(false);
    });

    it('should return false if link position is not equal to "inlineCardAwarenessCandidatePosition" in cardState', () => {
      mockCardContextState(getCardState());
      mockPreview('some-preview');

      const { result } = setup({ linkPosition: 4 });
      expect(result.current.shouldShowLinkPulse).toBe(false);
    });

    it('should return true if local storage key is not discovered, link is marked for pulse and it can be upgraded to embed', () => {
      mockCardContextState(getCardState());
      mockPreview('some-preview');

      const { result } = setup();
      expect(result.current.shouldShowLinkPulse).toBe(true);
    });
  });

  describe('shouldShowLinkOverlay', () => {
    it('should return false if isOverlayEnabled false', () => {
      mockCardContextState(getCardState());
      mockPreview('some-preview');

      const { result } = setup({ isOverlayEnabled: false });
      expect(result.current.shouldShowLinkOverlay).toBe(false);
    });

    it.each([
      'pending',
      'resolving',
      'errored',
      'fallback',
      'unauthorized',
      'forbidden',
      'not_found',
    ])('should return false if link status is "%s"', linkStatus => {
      mockCardContextState(getCardState(linkStatus as CardType));
      mockPreview('some-preview');

      const { result } = setup();
      expect(result.current.shouldShowLinkOverlay).toBe(false);
    });

    it('should return true if link status is resolved and there is no preview', () => {
      mockCardContextState(getCardState());

      const { result } = setup();
      expect(result.current.shouldShowLinkOverlay).toBe(true);
    });

    it('should return true if link is resolved and has preview', () => {
      mockCardContextState(getCardState());
      mockPreview('some-preview');

      const { result } = setup();
      expect(result.current.shouldShowLinkOverlay).toBe(true);
    });
  });
});
