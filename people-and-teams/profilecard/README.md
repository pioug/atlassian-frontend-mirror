# `@atlaskit/profilecard`

## i18n

`src/i18n` is generated folder by `yarn i18:pull`, so don't update any files in that folder manually.
Contact Atlaskit team to get `TRANSIFEX_API_TOKEN` as a global variable

### Pushing translation

In `atlaskit-mk-2/packages/people-and-teams/profilecard` folder:

- Run `yarn i18n:push` to build and then find messages in `dis/esm/src` and push them to Transifex

### Pulling translation

In `atlaskit-mk-2/packages/people-and-teams/profilecard` folder:

- Run `yarn i18n:pull` to delete current `src/i18n` folder and download all messages from Transifex and generate `src/i18n` again.
