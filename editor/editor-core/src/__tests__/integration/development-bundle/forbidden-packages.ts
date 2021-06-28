test.skip.each(['enzyme', 'jest'])('%s should not be bundled', async (name) => {
  await expect(name).not.toBeBundled({
    chunks: ['packages/editor/editor-core/examples'],
  });
});

// avoid --isolatedModules error
export {};
