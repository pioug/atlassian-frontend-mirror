import mockAtlasProject from './atlas-project';

const mockAtlasProjectWithAISummary = JSON.parse(
  JSON.stringify(mockAtlasProject),
);
mockAtlasProjectWithAISummary.meta.supportedFeature = ['AISummary'];

export default mockAtlasProjectWithAISummary;
