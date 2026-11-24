# Media Client

Media API client for file metadata, previews, uploads and downloads.

## Bounded read credentials

With `platform_media_bounded_read_tokens` enabled, reads with tokens longer than 7,000 characters
ask the auth provider for a single-file read credential through `AuthContext.access`. Providers
must return a credential covering that file. Metadata requests are grouped by credential; a
failure in any group rejects the metadata operation. Short tokens keep one metadata request.

Fetch-based reads send the credential in the authorization header. APIs that return signed URLs
still include authentication in the URL, using the bounded credential. Synchronous URL generation,
artifact URLs, uploads and copy operations retain their existing authentication behavior.
