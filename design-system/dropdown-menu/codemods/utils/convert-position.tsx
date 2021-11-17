type Entity = {
  [key: string]: string;
};

const positionMap: Entity = {
  'top left': 'top-start',
  'top center': 'top',
  'top right': 'top-end',
  'right top': 'right-start',
  'right middle': 'right',
  'right bottom': 'right-end',
  'bottom left': 'bottom-start',
  'bottom center': 'bottom',
  'bottom right': 'bottom-end',
  'left top': 'left-start',
  'left middle': 'left',
  'left bottom': 'left-end',
};

const convertPosition = (position: string | undefined = ''): string => {
  return positionMap[position.trim()] || 'bottom-start';
};

export default convertPosition;
