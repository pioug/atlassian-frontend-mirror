# Why is this here?

This file exists because we need to have a src/ directory in polyfills or the `build:babel` step
will fail to run. By having the directory with no js files, an empty dist will be created (but not
published) and everything will work as expected.

The alternative would be to add this package to the ignore glob of the build steps but that feels
brittle and less scableable
