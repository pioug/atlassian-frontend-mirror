import { ElementName } from '../../constants';
import { ElementItem } from '../../view/FlexibleCard/components/blocks/types';
import { MetadataOptions } from '../../view/HoverCard/types';
import { JsonLd } from 'json-ld-types';

export const elementNamesToItems = (elementNames: string[]): ElementItem[] => {
  return elementNames
    .filter((element) => element in ElementName)
    .map(
      (elementName) =>
        ({
          name: elementName,
          testId: `${elementName.toLowerCase()}-metadata-element`,
        } as ElementItem),
    );
};

export const extractMetadata: (
  jsonLd: JsonLd.Primitives.Property<any>,
) => MetadataOptions = (jsonLd) => {
  const metadata = jsonLd.metadata ?? [];
  return {
    primary: elementNamesToItems(metadata.primary ?? []),
    secondary: elementNamesToItems(metadata.secondary ?? []),
    subtitle: elementNamesToItems(metadata.subtitle ?? []),
  };
};
