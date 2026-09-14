import DefaultInteractionID, { type InteractionIDContextType } from './defaultInteractionId';

// eslint-disable-next-line @atlaskit/volt-strict-mode/no-multiple-exports
export const getInteractionId = (): InteractionIDContextType => DefaultInteractionID;
