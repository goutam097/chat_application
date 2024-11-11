import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InnerhtmlPipe } from '../innerhtml.pipe';
import { DatetimeagoPipe } from '../datetimeago.pipe';
// import { TruncatePipe } from '../truncate.pipe';
import { CalculateNumberInKPipe } from '../calculate-number-in-k.pipe';
import { TruncatePipes } from '../truncate.pipe';
import { BrowserModule } from '@angular/platform-browser';
import { SafeHtmlPipe } from '../safe-html.pipe';
@NgModule({
  declarations: [
    InnerhtmlPipe,
    DatetimeagoPipe,
    CalculateNumberInKPipe,
    TruncatePipes,
    SafeHtmlPipe
  ],
  imports: [CommonModule],
  exports: [
    InnerhtmlPipe,
    DatetimeagoPipe,
    CalculateNumberInKPipe,
    TruncatePipes,
    SafeHtmlPipe
  ],
})
export class PipeModule { }
