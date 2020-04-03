export function fileSizeMb(file: File): number {
  return file.size / 1024 / 1024;
}

export function getCanvas(width: number, height: number) {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const context = canvas.getContext('2d');

  return { canvas, context };
}
