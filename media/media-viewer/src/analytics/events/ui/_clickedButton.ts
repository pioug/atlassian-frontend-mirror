import { UIAttributes, UIEventPayload } from '@atlaskit/media-common';

export type ButtonClickEventPayload<
  Attributes extends UIAttributes
> = UIEventPayload<Attributes, 'clicked', 'button'>;
