import { Pipe, PipeTransform } from '@angular/core';
import * as moment from 'moment';

@Pipe({
  name: 'datetimeago',
})
export class DatetimeagoPipe implements PipeTransform {
  transform(value: any, args?: any): any {
    if (value) {
      const seconds = Math.floor((+new Date() - +new Date(value)) / 1000);
      if (seconds < 29)
        // less than 30 seconds ago will show as 'Just now'
        return 'Just now';
      const intervals: any = {
        hr: 3600,
        min: 60,
        sec: 1,
      };
      let counter;
      for (const i in intervals) {
        counter = Math.floor(seconds / intervals[i]);
        if (counter > 0) {
          if (counter === 1) {
            return counter + ' ' + i + ' ago'; // singular (1 day ago)
          } else {
            if (intervals[i] == 3600 && counter > 23 && counter < 48) {
              const time = moment(value).format('LT');
              const currentDate = moment((new Date()).setDate((new Date()).getDate()-2)).format("L");
              const createdAt = moment(new Date(value)).format("L");
              if(currentDate == createdAt){
                return moment(value).format('DD MMM, yyyy');
                // return moment(value).format('DD MMM, yyyy') + " "+ time;
              }else{
                return 'Yesterday at ';
                // return 'Yesterday at ' + time;
              }
            } else if (intervals[i] == 3600 && counter > 48) {
              return moment(value).format('DD MMM, yyyy');
              // return moment(value).format('DD MMM, yyyy h:m A');
            } else {
              return counter + ' ' + i + ' ago'; // plural (2 days ago)
            }
          }
        }
      }
    }
    return value;
  }
}
