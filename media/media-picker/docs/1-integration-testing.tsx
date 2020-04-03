import { md } from '@atlaskit/docs';

export default md`
# CSS Selectors to help integration testing

Here is the list of available css selectors (\`[data-test-...=""]\`) attributes that you might find useful to use in
integration/e2e tests available in media-picker:

- \`[data-testid="media-picker-popup"]\`: Main element that contains everything in Popup Media Picker
- \`[data-testid="media-picker-upload-button"]\`: Upload button that opens up native file picker
- \`[data-testid="media-picker-insert-button"]\`: "Insert" button that closes media picker and give selected files to the consumer
- \`[data-testid="media-picker-cancel-button"]\`: "Cancel" button that closes media picker
- \`[data-testid="media-picker-uploading-media-card"]\`: Card wrapper for a file that was just recently (in current session) upload
- \`[data-testid="media-picker-recent-media-card"]\`: Card wrapper for a file that was uploaded in recent session
- \`[data-testid="media-picker-recents-infinite-scroll"]\`: Element that contains all the cards in recents (and a dropzone) that can be scrolled
- \`[data-testid="media-picker-file-input"]\`: \`<input type="file" />\` used to upload file from disk
- \`[data-testid="media-picker-upload-menu-item"]\`: Button to switch to "Upload" section of popup media picker (default on open)
- \`[data-testid="media-picker-giphy-menu-item"]\`: Button to switch to "Giphy" section of popup media picker
- \`[data-testid="media-picker-dropbox-menu-item"]\`: Button to switch to "Dropbox" section of popup media picker
- \`[data-testid="media-picker-google-menu-item"]\`: Button to switch to "Google Drive" section of popup media picker
`;
