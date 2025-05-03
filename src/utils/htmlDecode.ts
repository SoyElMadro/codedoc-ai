import { decode } from 'he';

export function htmlDecode(input: string): string {
  return decode(input);
}
