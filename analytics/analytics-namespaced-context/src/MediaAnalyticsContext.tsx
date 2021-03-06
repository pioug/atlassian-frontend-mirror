// Media uses a namespaced analytics context under the following key MEDIA_CONTEXT.
export const MEDIA_CONTEXT = 'mediaCtx';

// However we don't export any JSX component to create that namespaced analytics context.
// In media components, analytics context is being created by this component:

// @see packages/media/media-common/src/analytics/withMediaAnalyticsContext.tsx
