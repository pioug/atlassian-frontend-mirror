const hackerNouns = [
  'system',
  'protocol',
  'microchip',
  'alarm',
  'protocol',
  'panel',
  'pixel',
];

export const getHackerNoun = () =>
  hackerNouns[Math.round(Math.random() * hackerNouns.length)];

const commonFileName = [
  'kwanza_industrial_neural',
  'quality',
  'timor_leste',
  'cambridgeshire_transmitting_e_business',
  'greens_unbranded_soft_shirt_manager',
  'music_moratorium',
];

export const imageFileTypes = ['.svgz', '.svg'];
export const textFileTypes = ['.txt', '.in', '.ini', '.text', '.conf', '.list'];
export const getTextFileType = () =>
  textFileTypes[Math.floor(Math.random() * textFileTypes.length)];

export const getFakeFileName = (
  ext = imageFileTypes[Math.round(Math.random())],
) =>
  `${commonFileName[Math.floor(Math.random() * commonFileName.length)]}${ext}`;

export const getFakeFileSize = (maxSize = 1e7) =>
  Math.round(Math.random() * maxSize);

// This fake image was generated using faker. It never changes so we are just
// using the output exact call Faker.image.dataUri(320, 240)
export const fakeImage =
  'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZlcnNpb249IjEuMSIgYmFzZVByb2ZpbGU9ImZ1bGwiIHdpZHRoPSIzMjAiIGhlaWdodD0iMjQwIj4gPHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0iZ3JleSIvPiAgPHRleHQgeD0iMCIgeT0iMjAiIGZvbnQtc2l6ZT0iMjAiIHRleHQtYW5jaG9yPSJzdGFydCIgZmlsbD0id2hpdGUiPjMyMHgyNDA8L3RleHQ+IDwvc3ZnPg==';

export const getDateWithOffset = (offset: number) => {
  let time = new Date();
  time.setTime(time.getTime() + offset);
  return time;
};

export const getPastDate = () => {
  let offset = 0 - Math.round(Math.random() * 10000);
  return getDateWithOffset(offset);
};
export const getFutureDate = () => {
  let offset = 100000 + Math.round(Math.random() * 10000);
  return getDateWithOffset(offset);
};

// This function is taken directly from Faker
export const mockDataUri = function (width: string, height: string) {
  const rawPrefix = 'data:image/svg+xml;base64,';
  const svgString = `<svg xmlns="http://www.w3.org/2000/svg" version="1.1" baseProfile="full" width="${width}" height="${height}"> <rect width="100%" height="100%" fill="grey"/>  <text x="0" y="20" font-size="20" text-anchor="start" fill="white">${width}x${height}</text> </svg>`;
  return rawPrefix + btoa(svgString);
};
