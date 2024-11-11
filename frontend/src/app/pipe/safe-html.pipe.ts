import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'safeHtml'
})
export class SafeHtmlPipe implements PipeTransform {

  transform(value: string): string {
    if (!value) {
      return '';
    }
    // Replace encoded HTML entities with actual HTML characters
    return value.replace(/&lt;/g, '<').replace(/&gt;/g, '>');
  }
}
