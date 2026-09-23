# Locale

Utility functions for handling localization.

## Installation

```sh
yarn add @atlaskit/locale
```

## Usage

Detailed docs and example usage can be found
[here](https://atlaskit.atlassian.com/packages/helpers/locale).

## Browser compatibility

The week-info fallback requires `Intl.Locale`. It uses native `getWeekInfo()` or the legacy
`weekInfo` getter when available, otherwise Unicode CLDR 48 regional data. It runs behind
`platform-dst-locale-week-start-day` and does not modify `Intl.Locale.prototype`.

## Unicode data license

The week-info fallback includes Unicode CLDR 48 data. See
[third-party notices](./THIRD_PARTY_NOTICES.md) for its license.
