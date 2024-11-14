import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EmojiPickerComponent } from '../emoji-picker/emoji-picker';

@NgModule({
  declarations: [EmojiPickerComponent],
  imports: [CommonModule],
  exports: [EmojiPickerComponent],
  // entryComponents: [EmojiPickerComponent],
})
export class ComponentModule {}
