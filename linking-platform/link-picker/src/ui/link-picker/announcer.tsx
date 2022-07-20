import React, {
  forwardRef,
  memo,
  useState,
  useEffect,
  AriaAttributes,
  Ref,
} from 'react';

// How to use:
// https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/ARIA_Live_Regions#Preferring_specialized_live_region_roles
// Demo: https://dequeuniversity.com/library/aria/liveregion-playground

// Important: Strongly recommend test your solution in all supported screen readers
// if you use non default value of properties: ariaAtomic, ariaLive, ariaRelevant, role

// Note: Text won't be announced if the text message doesn't change after the render.
// For using a forced announcement in this case, set the 'key' attribute - key={Date.now()}

type AnnouncerProps = {
  ref?: Ref<HTMLDivElement>;

  /** Set 'false' for announcing only changed text
   * (not announce duplicate part of string after second render),
   * and 'true' for announcing all the string after each render */
  ariaAtomic?: AriaAttributes['aria-atomic'];

  /** Set politeness settings */
  ariaLive?: AriaAttributes['aria-live'];

  /** Used to describe what types of changes have occurred to an aria-live region */
  ariaRelevant?: AriaAttributes['aria-relevant'];

  /** Role used to set attribute role. See more details https://dequeuniversity.com/library/aria/liveregion-playground#configOptions */
  role?: 'status' | 'log' | 'alert' | 'timer' | 'marquee';

  /** Text message that will be announced */
  text: string;

  /** Debounce delay.
   *  Set delay (ms) to prevent announce the same string multiple times.
   *  It can be useful for cases when the parent component re-renders with the same announcer's text. */
  delay?: number;
};

// Note: Flag 'contentRendered' resolves bug with duplicates messages (NVDA + Firefox)
// https://github.com/nvaccess/nvda/labels/bug%2Fdouble-speaking

let timer: ReturnType<typeof setTimeout>;
const Announcer: React.FC<AnnouncerProps> = forwardRef(
  (
    {
      ariaAtomic = 'true',
      ariaLive = 'polite',
      ariaRelevant = 'all',
      role = 'status',
      text = '',
      delay = 0,
    },
    ref,
  ) => {
    const [contentRendered, setContentRendered] = useState(false);

    useEffect(() => {
      clearTimeout(timer);
      setContentRendered(false);
      timer = setTimeout(() => {
        setContentRendered(true);
      }, delay);

      return () => clearTimeout(timer);
    }, [text, delay]);

    return (
      <div
        className="assistive"
        ref={ref}
        role={role}
        aria-atomic={ariaAtomic}
        aria-relevant={ariaRelevant}
        aria-live={ariaLive}
      >
        {contentRendered && <span>{text}</span>}
      </div>
    );
  },
);

export default memo(Announcer);
