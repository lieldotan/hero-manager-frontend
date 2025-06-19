export function getContrastColor(colorStr: string): 'black' | 'white' {
  if (typeof CSS !== 'undefined' && !CSS.supports('color', colorStr)) {
    return 'black';
  }

  let computedStyle: string;
  try {
    const canvas = document.createElement('canvas');
    canvas.width = canvas.height = 1;
    const ctx = canvas.getContext('2d')!;
    ctx.fillStyle = colorStr;
    computedStyle = (ctx.fillStyle as string).trim().toLowerCase();
  } catch {
    return 'black';
  }

  if (!computedStyle.startsWith('#') || computedStyle.length !== 7) {
    return 'black';
  }

  const r = parseInt(computedStyle.substr(1, 2), 16);
  const g = parseInt(computedStyle.substr(3, 2), 16);
  const b = parseInt(computedStyle.substr(5, 2), 16);
  const yiq = (r * 299 + g * 587 + b * 114) / 1000;

  return yiq >= 128 ? 'black' : 'white';
}
