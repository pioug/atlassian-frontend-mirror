import { md } from '@atlaskit/docs';

export default md`
# CSS Selectors to help integration testing

\`<Card />\` component has optional \`testId: string\` property that will be assigned to the top level DOM element as \`data-testid\` attribute.

Here is the list of available css selectors (\`[data-test-...=""]\`) attributes that you might find useful to use in
integration/e2e tests available in media-card:

Following three \`data-testid\` attributes are default values in case \`testId\` prop is undefined.
Only one of these three can be found as a top DOM element:

- \`[data-testid="media-card-loading"]\`: Media Card in loading state (with a spinner in the middle and nothing else)
- \`[data-testid="media-card-view"]\`: Non loading (resolved) Media Card
- \`[data-testid="media-card-inline-player"]\`: Media Card with inline media player

- \`[data-test-loading]\`: This present for loading card (on the same element as \`media-card-loading\` (or 'testId')
- \`[data-testid="media-file-card-view"]\`: This selector can be used to get some extra meta information via following attributes:
  - \`data-test-status\` will contain media card status - one from this list:
    - \`uploading\`
    - \`loading\`
    - \`processing\`
    - \`complete\`
    - \`error\`
    - \`failed-processing\`
  - \`data-test-progress\` will have a number (from 0 to 1) indication uploading progress
  - \`data-test-selected\` will be present if card is selected
  - \`data-test-media-name\` will contain the name of the file
- \`[data-testid="media-card-retry-button"]\`: Retry button
- \`[data-testid="media-card-primary-action"]\`: Primary action button (there could be two of them max)
- \`[data-testid="media-card-actions-menu"]\`: Actions menu button (three dots icon) that open dropdown
- \`[data-testid="media-card-actions-menu-item"]\`: Action dropdown item
- \`[data-testid="media-image"]\`: Actual image (\`<img />\`) of a card
- \`[data-testid="media-card-file-name"]\`: Element that contains filename
- \`[data-testid="media-card-play-button"]\`: Button containing a play button in preview mode
- \`[data-testid="custom-media-player"]\`: Wrapper around custom media player
  - These controls can be found as part of Card's inline media player:
  - \`[data-testid="custom-media-player-fullscreen-button"]\`: Fullscreen button
  - \`[data-testid="custom-media-player-download-button"]\`: Download button
  - \`[data-testid="custom-media-player-play-toggle-button"]\`: Pause/Pause button
  - \`[data-testid="custom-media-player-skip-backward-button"]\`: Skip 10 seconds backward button
  - \`[data-testid="custom-media-player-skip-forward-button"]\`: Skip 10 seconds forward button
  - \`[data-testid="custom-media-player-volume-toggle-button"]\`: Volume button
  - \`[data-testid="custom-media-player-playback-speed-toggle-button"]\`: Open/Close playback speed menu
  - \`[data-test-is-playing="data-test-is-playing"]\`: Contains 'true' if it media is playing and 'false' otherwise.
`;
