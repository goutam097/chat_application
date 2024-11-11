import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'calculateNumberInK'
})
export class CalculateNumberInKPipe implements PipeTransform {

  transform(length: number): any {
    if (!length) return 0
    else if (length < 1000) return length
    else if (length >= 1000) {
      const valueInK = Math.floor(length / 1000)
      const remainder = length % 1000
      if (remainder < 100) return `${valueInK}K`
      else return `${valueInK}.${Math.floor(remainder / 100)}K`
    }
    return length
  }

}
