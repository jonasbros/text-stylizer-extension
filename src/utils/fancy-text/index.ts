import { fancyTextMap } from './fancy-text-map';

export default function fancyText(text: string, style: string) {
  const s = fancyTextMap[style];
  if (!s) return text;

  return text
    .split('')
    .map(c => s.map?.[c] || s.transform?.(c) || c)
    .join('');
}
