# chunkinator

Upload large files from the browser with ease

# Pipeline pieces description

See `examples/integrator.ts` for good example of usage.

```Javascript
import {chunkinator} from '@atlaskit/chunkinator';
```

`chunkinator` is a main customizable high level component that gives you a way to upload large files.
It takes a file as an input and pushes it through Observable pipe that consist of the following parts:

- `slicenator`
- `hashinator`
- `probinator`
- `uploadinator`
- `processinator`

As a second argument `chunkinator` takes configuration options with following interface:

```Typescript
interface Options {
  chunkSize: number;
  hashingConcurrency: number;
  hashingFunction?: HashingFunction;
  probingBatchSize: number;
  probingFunction: ProbingFunction;
  uploadingConcurrency: number;
  uploadingFunction: UploadingFunction;
  processingBatchSize: number;
  processingFunction?: ProcessingFunction;
}
```

As a third argument `chunkinator` takes list of handy callbacks. Currently there is only one: `onProgress`.

## slicenator

This component takes a blob, chunk size and returns Observable sequential stream of blob chunks.

Options' `chunkSize` is what defines chunk size

## hashinator

This component takes stream of blobs and hashes each chunk. Returning stream contains blob and it's hash.

Options' `hashingConcurrency` defines how many
chunks are hashed at the same time. `hashingFunction` is optional hashing function. If `hashingFunction` is not
provided `SHA-1` will be used instead.

## probinator

This component takes already hashed blobs and probes each of them with backend for it already being uploaded.
Resulting stream contains blob with hash and boolean indicating if it exists on a backend already.

Options' `probingFunction` is a function that takes batch of hashed blobs and returns list of booleans.
`probingBatchSize` controls how many hashed blobs are given to probing function at a time.

## uploadinator

This component takes probed and hashed blobs and uploads them if blob doesn't exists on a backend.

Options' `uploadingFunction` is a callback that takes a blob and uploads it to the server.
`uploadingConcurrency` controls how many of these calls happens at the same time.

## processinator

With this component consumer has an opportunity to finalize already uploaded chunks in some way.

Options' `processingFunction` defines a function that is called with sequential batches of uploaded chunks.
`processingBatchSize` controls how many uploaded chunks are given to processing function.

## onProgress callback

This callback is called with every uploaded chunk. The only argument it is called with a portion of already
uploaded chunks to it's total number.
