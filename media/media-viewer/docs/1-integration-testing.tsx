import { md } from '@atlaskit/docs';

export default md`
# CSS Selectors to help integration testing

Here is the list of available css selectors (\`[data-test-...=""]\`) attributes that you might find useful to use in
integration/e2e tests available in media-viewer:

- \`[data-testid="media-viewer-popup"]\`: Main Media Viewer element
- \`[data-testid="media-viewer-close-button"]\`: Close button
- \`[data-testid="media-viewer-download-button"]\`: Download button
- \`[data-testid="media-viewer-sidebar-button"]\`: Sidebar toggle button
- \`[data-testid="media-viewer-sidebar-content"]\`: Sidebar content container
- \`[data-testid="media-viewer-navigation-prev"]\`: Navigation left/previous file button
- \`[data-testid="media-viewer-navigation-next"]\`: Navigation right/next file button
- \`[data-testid="media-viewer-error"]\`: When media viewer can't show preview of a file, this component present
- \`[data-testid="media-viewer-pdf-content"]\`: Content element for PDF document
- \`[data-testid="media-viewer-image-content"]\`: Content element for image document
  - \`[data-testid="media-viewer-image"]\`: \`<img />\` with image itself. Can be found inside 'media-viewer-image-content'
- \`[data-testid="media-viewer-audio-content"]\`: Content element for audio document
- \`[data-testid="media-viewer-video-content"]\`: Content element for video document
- These controls can be found as part of media players:
  - \`[data-testid="custom-media-player-fullscreen-button"]\`: Fullscreen button
  - \`[data-testid="custom-media-player-download-button"]\`: Download button
  - \`[data-testid="custom-media-player-play-toggle-button"]\`: Pause/Pause button
  - \`[data-test-is-playing="data-test-is-playing"]\`: Contains 'true' if it media is playing and 'false' otherwise.
`;
