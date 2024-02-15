import mockAtlasProject from './atlas-project';

const mockAtlasProjectWithAISummary = JSON.parse(
  JSON.stringify(mockAtlasProject),
);
mockAtlasProjectWithAISummary.meta.supportedFeatures = ['AISummary'];

export default mockAtlasProjectWithAISummary;
