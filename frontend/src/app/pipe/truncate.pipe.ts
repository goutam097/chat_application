import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'truncate'
})
export class TruncatePipes implements PipeTransform{
  transform(value: string, limit: number =50, completeWords: boolean = true): string {
    if (!value) return '';
    
    let words = value.split(' ');
    if (words.length > limit) {
      words = words.slice(0, limit);
      if (completeWords) {
        // Remove any partial word at the end
        while (words.length && !/\W/.test(words[words.length - 1])) {
          words.pop();
        }
      }
      return words.join(' ') + '...';
    } else {
      return value;
    }
  }
}