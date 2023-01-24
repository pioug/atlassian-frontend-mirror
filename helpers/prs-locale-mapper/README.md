# Profile Retrieval Service Locale Mapper

Maps locales to the PRS locale format

This package is being used to address locale discrepancies in Atlassian products.
See: https://hello.atlassian.net/wiki/spaces/i18n/pages/528623554/Locale+Discrepancies+Across+Atlassian+Products+and+Platform+Areas


## Usage

```
import mapToPRSLocale from '@atlaskit/prs-locale-mapper';

const normalisedLocale = mapToPRSLocale('fr-FR');

// output: 'fr'
```


