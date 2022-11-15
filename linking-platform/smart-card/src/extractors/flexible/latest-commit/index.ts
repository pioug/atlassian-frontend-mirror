import { JsonLd } from 'json-ld-types';

export const extractLatestCommit = (
  jsonLd: JsonLd.Data.SourceCodeRepository,
): string | undefined => {
  const latestCommit = jsonLd['atlassian:latestCommit'];
  if (typeof latestCommit === 'string') {
    return latestCommit;
  }

  if (latestCommit) {
    //todo: change the properties to latestCommit.hash when BE is ready
    return latestCommit ? latestCommit.name : undefined;
  }
};
