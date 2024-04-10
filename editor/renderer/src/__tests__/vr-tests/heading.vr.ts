import { snapshot, Device } from '@af/visual-regression';
import {
  HeadingRenderer,
  HeadingsCenterRenderer,
  HeadingsLeftRenderer,
  HeadingsRightRenderer,
  HeadingCommentRenderer,
  HeadingMultilineRenderer,
  HeadingsRightMobileRenderer,
  HeadingsLeftMobileRenderer,
  HeadingsCenterMobileRenderer,
  HeadingRightStatusRenderer,
  HeadingRightSymbolsRenderer,
  HeadingRightEmojiRenderer,
} from './heading.fixture';

snapshot(HeadingRenderer);
snapshot(HeadingsCenterRenderer);
snapshot(HeadingsLeftRenderer);
snapshot(HeadingsRightRenderer);

/**
 * Should only apply RTL to copy link
 *
 * Note: We are only using "mobile" variant so we can force all the anchor links
 * to display.
 */
snapshot(HeadingRightStatusRenderer, {
  description: 'should not apply RTL to status',
  variants: [{ name: 'mobile', device: Device.MOBILE_CHROME }],
});
snapshot(HeadingRightSymbolsRenderer, {
  description: 'should not apply RTL to symbols',
  variants: [{ name: 'mobile', device: Device.MOBILE_CHROME }],
});
snapshot(HeadingRightEmojiRenderer, {
  description: 'should not apply RTL to emoji',
  variants: [{ name: 'mobile', device: Device.MOBILE_CHROME }],
});

/**
 * Mobile tests
 */
snapshot(HeadingsRightMobileRenderer, {
  variants: [{ name: 'mobile', device: Device.MOBILE_CHROME }],
});
snapshot(HeadingsLeftMobileRenderer, {
  variants: [{ name: 'mobile', device: Device.MOBILE_CHROME }],
});
snapshot(HeadingsCenterMobileRenderer, {
  variants: [{ name: 'mobile', device: Device.MOBILE_CHROME }],
});

/**
 * Other cases
 */
snapshot(HeadingRenderer, {
  description: 'heading should show anchor on link',
  states: [
    {
      state: 'hovered',
      selector: { byRole: 'link' },
    },
  ],
});

snapshot(HeadingCommentRenderer, {
  description: 'heading not show anchor on comment renderer',
  states: [
    {
      state: 'hovered',
      selector: { byRole: 'heading', options: { level: 1 } },
    },
  ],
});

/**
 * Multiline tests
 */
snapshot(HeadingMultilineRenderer, {
  description: 'heading link should render for multilined left',
  states: [
    {
      state: 'hovered',
      selector: {
        byRole: 'heading',
        options: { name: 'Multiline heading left' },
      },
    },
  ],
});

snapshot(HeadingMultilineRenderer, {
  description: 'heading link should render for multilined center',
  states: [
    {
      state: 'hovered',
      selector: {
        byRole: 'heading',
        options: { name: 'Multiline heading center' },
      },
    },
  ],
});

snapshot(HeadingMultilineRenderer, {
  description: 'heading link should render for multilined right',
  states: [
    {
      state: 'hovered',
      selector: {
        byRole: 'heading',
        options: { name: 'Multiline heading right' },
      },
    },
  ],
});

/**
 * Headings with anchor link - snapshot every level for left (most common)
 * Then once for center and right aligned - this should be sufficient
 */
snapshot(HeadingsLeftRenderer, {
  description: 'heading left with links heading 1 hovered',
  states: [
    {
      state: 'hovered',
      selector: { byRole: 'heading', options: { level: 1 } },
    },
  ],
});

snapshot(HeadingsLeftRenderer, {
  description: 'heading left with links heading 2 hovered',
  states: [
    {
      state: 'hovered',
      selector: { byRole: 'heading', options: { level: 2 } },
    },
  ],
});
snapshot(HeadingsLeftRenderer, {
  description: 'heading left with links heading 3 hovered',
  states: [
    {
      state: 'hovered',
      selector: { byRole: 'heading', options: { level: 3 } },
    },
  ],
});
snapshot(HeadingsLeftRenderer, {
  description: 'heading left with links heading 4 hovered',
  states: [
    {
      state: 'hovered',
      selector: { byRole: 'heading', options: { level: 4 } },
    },
  ],
});
snapshot(HeadingsLeftRenderer, {
  description: 'heading left with links heading 5 hovered',
  states: [
    {
      state: 'hovered',
      selector: { byRole: 'heading', options: { level: 5 } },
    },
  ],
});
snapshot(HeadingsLeftRenderer, {
  description: 'heading left with links heading 6 hovered',
  states: [
    {
      state: 'hovered',
      selector: { byRole: 'heading', options: { level: 6 } },
    },
  ],
});

snapshot(HeadingsRightRenderer, {
  description: 'heading right with links heading 1 hovered',
  states: [
    {
      state: 'hovered',
      selector: { byRole: 'heading', options: { level: 1 } },
    },
  ],
});

snapshot(HeadingsCenterRenderer, {
  description: 'heading center with links heading 1 hovered',
  states: [
    {
      state: 'hovered',
      selector: { byRole: 'heading', options: { level: 1 } },
    },
  ],
});
