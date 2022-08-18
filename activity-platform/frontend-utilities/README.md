# Frontend Utilities

Collecton of small useful frontend utilities

## Utilities

### Documentation

#### [Markdown Renderer](./src/documentation/markdown-renderer/README.md)

### Error Handling

#### [Convert to Error](./src/error-handling/convert-to-error/README.md)

### Network

#### [Retry Operation](./src/network/retry-operation/README.md)

### Storage

#### [Local Storage mock](./src/storage/local-storage/README.md)

#### [Storage Client](./src/storage/storage-client/README.md)

## Contributing

Anyone is free to contribute a utility that they find themselves copying into multiple packages or that they think will be
benefitial to other teams. We just ask that you "own" that slice of this package, ensure it has tests written,
and that you add a README stating why and how to use it, as well as what team to contact for more information.

Please put your business logic into 'main.ts' and exports into 'index.ts' as well as a separate entry-point in the package.json.

Then you can update this README and the [docs](./docs) folder. Utility specific documentation can utilise the `MarkdownRenderer`
to render your README file as-is.
