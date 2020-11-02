import { SyntheticEvent } from 'react';

import { CardEvent } from '@atlaskit/media-card';
import { Identifier } from '@atlaskit/media-client';

export interface CardSurroundings {
  collectionName: string;
  list: Identifier[];
}

export type MentionEventHandler = (
  mentionId: string,
  text: string,
  event?: SyntheticEvent<HTMLSpanElement>,
) => void;
export type CardEventClickHandler = (
  result: CardEvent,
  surroundings?: CardSurroundings,
  analyticsEvent?: any,
) => void;
export type LinkEventClickHandler = (
  event: SyntheticEvent<HTMLAnchorElement>,
  url?: string,
) => void;
export type SmartCardEventClickHandler = (
  event: SyntheticEvent<HTMLAnchorElement>,
  url?: string,
) => void;

export type OnUnhandledClickHandler = (event: React.MouseEvent) => void;

export interface MentionEventHandlers {
  onClick?: MentionEventHandler;
  onMouseEnter?: MentionEventHandler;
  onMouseLeave?: MentionEventHandler;
}

/** Callbacks for mouse events in the renderer */
export interface EventHandlers {
  /** This fires when there is a click in the renderer that wasn’t handled by anything in the
   * renderer. Example usage of this callback: load the editor in place of the renderer when
   * renderer text is clicked.
   * See example at /examples.html?groupId=editor&packageId=editor-core&exampleId=full-page-click-to-edit
   *  */
  onUnhandledClick?: OnUnhandledClickHandler;
  mention?: MentionEventHandlers;
  media?: {
    onClick?: CardEventClickHandler;
  };
  link?: {
    onClick?: LinkEventClickHandler;
  };
  smartCard?: {
    onClick?: SmartCardEventClickHandler;
  };
  /*
  Note: If you add more handlers here (eg. Adding a new interactive component), update
  the logic inside packages/editor/renderer/src/ui/Renderer/index.tsx so that onUnhandledClick isn't
  fired incorrectly (see https://product-fabric.atlassian.net/browse/ED-8720) and add to the tests
  in either:
  - packages/editor/renderer/src/__tests__/unit/ui/event-handlers.tsx
  - packages/editor/editor-core/src/__tests__/integration/media/full-flow-insert-and-publish.ts
  - packages/editor/renderer/src/__tests__/visual-regression/event-handlers.ts

  The fact this message has to exist isn't ideal, but previously Jira needed a PR.
  */
}
