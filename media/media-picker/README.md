# Media picker

## Drop positioning

When `platform_editor_media_drop_position` experiment's `isEnabled` parameter is true, `Dropzone` accepts optional `onDragOver(event)` and `onDropWithContext(event, traceContext)` callbacks. The latter runs before upload preparation. Return `false` to reject the drop, or a cleanup function to release preparation state after all upload batches have been prepared.

Use `onUploadsStart` and its matching `traceContext.traceId` to associate media file IDs with the original drop. Preview callbacks can arrive later and in a different order. The existing no-argument `onDrop` callback and default upload behavior remain unchanged for consumers that do not opt in.
