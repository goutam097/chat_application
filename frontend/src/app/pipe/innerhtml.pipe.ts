import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser'
@Pipe({
  name: 'innerhtml'
})
export class InnerhtmlPipe implements PipeTransform {

  constructor(private sanitizer:DomSanitizer){}
  transform(value: any,args?: any): any {
    if(value)
    return this.sanitizer.bypassSecurityTrustHtml(value);
  }
}
