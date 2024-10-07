import customMd from '../utils/custom-md';

export default customMd`

Our components are categorized into different states that dictate their appearance and functionality.

* **Resolving**: This state is temporary, indicating that the link is currently being processed and has not yet been fully resolved. It typically displays as a placeholder or skeleton view until the content is completely loaded.
* **Resolved**: This state signifies that the link has been successfully transformed into a Smart Link, displaying the content as originally intended.
* **Forbidden (403)**: This status denotes that the user is authenticated but lacks the necessary permissions to access the content.
* **Not Found**: This status indicates that the linked content is unavailable, possibly due to privacy settings or deletion.
* **Unauthorized (401)**: This status indicates that the user lacks proper authentication.
* **Error**: This status is displayed when the resolver encounters an error or when the URL is not supported.

`;
