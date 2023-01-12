/** @jsx jsx */
import { jsx } from '@emotion/react';
import React, {
  useEffect,
  useState,
  useRef,
  Ref,
  RefObject,
  MutableRefObject,
} from 'react';
import { getIframeSandboxAttribute } from '../../../utils';
import { IframeDwellTracker } from './IframeDwellTracker';
import { useFeatureFlag } from '@atlaskit/link-provider';

export interface FrameProps {
  url?: string;
  isTrusted?: boolean;
  testId?: string;
  onIframeDwell?: (dwellTime: number, dwellPercentVisible: number) => void;
  onIframeFocus?: () => void;
}

type Refs =
  | Ref<HTMLElement | null>
  | RefObject<HTMLElement | null>
  | ((node: HTMLElement | null) => void);

function mergeRefs(refs: Refs[]) {
  return (value: HTMLElement | null) => {
    refs.forEach((ref) => {
      if (typeof ref === 'function') {
        ref(value);
      } else if (ref !== null) {
        (ref as MutableRefObject<HTMLElement | null>).current = value;
      }
    });
  };
}

export const Frame = React.forwardRef<HTMLIFrameElement, FrameProps>(
  (
    { url, isTrusted = false, testId, onIframeDwell, onIframeFocus },
    iframeRef,
  ) => {
    const [isIframeLoaded, setIframeLoaded] = useState(false);
    const [isMouseOver, setMouseOver] = useState(false);
    const [isWindowFocused, setWindowFocused] = useState(true);

    const ref = useRef<HTMLIFrameElement>();
    const mergedRef = mergeRefs([
      iframeRef,
      ref as RefObject<HTMLIFrameElement>,
    ]);
    const trackIframeDwellEvents = useFeatureFlag('trackIframeDwellEvents');

    const [percentVisible, setPercentVisible] = useState(0);

    /**
     * These are the 'percent visible' thresholds at which the intersectionObserver will
     * trigger a state change. Eg. when the user scrolls and moves from 74% to 76%, or
     * vice versa. It's in a state object so that its static for the useEffect
     */
    const [threshold] = useState([0.75, 0.8, 0.85, 0.9, 0.95, 1]);
    useEffect(() => {
      if (!trackIframeDwellEvents) {
        return;
      }
      if (!ref || !ref.current) {
        return;
      }

      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            setPercentVisible(entry?.intersectionRatio);
          });
        },
        { threshold },
      );

      observer.observe(ref.current);

      return () => {
        observer.disconnect();
      };
    }, [trackIframeDwellEvents, threshold, mergedRef]);

    useEffect(() => {
      if (!trackIframeDwellEvents) {
        return;
      }

      const onBlur = () => {
        setWindowFocused(false);
        if (document.activeElement === ref.current) {
          onIframeFocus && onIframeFocus();
        }
      };

      const onFocus = () => {
        setWindowFocused(true);
      };

      window.addEventListener('blur', onBlur);
      window.addEventListener('focus', onFocus);
      return () => {
        window.removeEventListener('blur', onBlur);
        window.removeEventListener('focus', onFocus);
      };
    }, [trackIframeDwellEvents, ref, onIframeFocus]);

    if (!url) {
      return null;
    }

    return (
      <React.Fragment>
        {trackIframeDwellEvents ? (
          <IframeDwellTracker
            isIframeLoaded={isIframeLoaded}
            isMouseOver={isMouseOver}
            isWindowFocused={isWindowFocused}
            iframePercentVisible={percentVisible}
            onIframeDwell={onIframeDwell}
          />
        ) : null}
        <iframe
          ref={mergedRef}
          src={url}
          data-testid={`${testId}-frame`}
          data-iframe-loaded={isIframeLoaded}
          css={{
            border: 0,
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            position: 'relative',
            overflow: 'hidden',
            borderRadius: '3px',
          }}
          onMouseEnter={
            trackIframeDwellEvents ? () => setMouseOver(true) : undefined
          }
          onMouseLeave={
            trackIframeDwellEvents ? () => setMouseOver(false) : undefined
          }
          allowFullScreen
          scrolling="yes"
          allow="autoplay; encrypted-media; clipboard-write"
          onLoad={() => {
            setIframeLoaded(true);
          }}
          sandbox={getIframeSandboxAttribute(isTrusted)}
        />
      </React.Fragment>
    );
  },
);
