# Modal dialog

A modal dialog displays content that requires user interaction, in a layer above the page.

# Installation

```sh
yarn add @atlaskit/modal-dialog
```

## Usage

Detailed docs and example usage can be found
[here](https://atlassian.design/components/modal-dialog/).

## Internationalisation

With `platform_modal_title_icon_label` enabled, the warning and danger title icons use the
application's React Intl message catalog. Include translations for
`modal-dialog.title.warning-icon-label` and `modal-dialog.title.danger-icon-label` in the existing
`IntlProvider` messages. No additional modal props are needed. Missing translations and applications
without an `IntlProvider` retain the English labels.

The package is registered in `platform/i18n-resources.json` for Traduki extraction. Translation
catalog publication and inclusion in consuming applications are prerequisites for enabling the gate.
The localized title example demonstrates the catalog integration.
