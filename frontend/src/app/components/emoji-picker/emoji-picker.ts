import { Component, EventEmitter, Input, Output } from '@angular/core';
import { EMOJIS } from './emojis.data';

@Component({
  selector: 'emoji-picker',
  template: `<div *ngIf="isEmojiPickerVisible" class="overlay" (click)="closeEmojiPicker()">
  <div class="emoji_picker_container" (click)="$event.stopPropagation()">
    <div *ngIf="emojiList" class="emoji_picker">
      <ul class="emoji_ul">
        <li class="emoji_li" *ngFor="let emoji of emojiList" (click)="showEmojiList(emoji.id)">{{emoji.icon}}</li>
      </ul>
      <hr>
      <input *ngIf="activeIndex === 0"  type="text" (keyup)="search($event)" class="search_input">
      <div class="showEmojis">
        <ul class="emoji_list">
          <li class="emoji_li" *ngFor="let emoji of categoryEmojiSet" (click)="selectEmoji(emoji[0])">{{emoji[0]}}</li>
        </ul>
      </div>
    </div>
  </div>
</div>`,
  styles: [`
  .overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 999;
  }

  .emoji_picker_container {
    background: white;
    padding: 20px;
    border-radius: 8px;
    position: relative;
  }
    .emoji_ul {
      display: flex !important;
      margin-left: -22px !important;
      margin-right: 3px !important;
      font-size: 18px !important;
      justify-content: space-between !important;
    }
    .emoji_li {
      margin-right: 10px !important;
      cursor: pointer !important;
      margin-bottom:0
    }
    .showEmojis{
      height: 150px !important;
      overflow-y: auto !important;
    }
    .emoji_list{
      display: flex !important;
      flex-wrap: wrap !important;
      justify-content: space-evenly !important;
      margin-left: -20px !important;
      font-size: 18px !important;
      margin-top:0;
    }
    .search_input{
      width: 100% !important;
      border-radius: 5px !important;
      background: #dde8f0 !important;
      color: var(--text-primary) !important;
      border: none !important;
      height: 28px !important;
      margin: 0px 0px !important;
      padding: 2px 10px !important;
      font-size: 17px !important;
      margin-bottom: 5px !important;
    }
    .emoji_picker{
      background: white !important;
      width: 310px !important;
      padding: 10px !important;
      border: 1px solid #ede9e9 !important;
      border-radius: 10px !important;
      box-shadow: 0px 1px 2px 0px #ccc !important;
      // position: absolute !important;
      z-index: 999 !important;
      bottom: 90px !important;
      left: 0 !important;
    }
    ::-webkit-scrollbar {
      width: 5px !important;
      height: 6px !important;
    }
    ::-webkit-scrollbar-track {
      box-shadow: inset 0 0 1px grey; 
      border-radius: 10px;
      background: transparent;
    }
    ::-webkit-scrollbar-thumb {
      background: #ccc; 
      border-radius: 10px;
    }
    ::-webkit-scrollbar-thumb:hover {
      background: #ccc;
    }
  `]
})
export class EmojiPickerComponent {
  @Input() icon: any;
  @Input() inputRef: HTMLTextAreaElement | undefined;
  @Output() onemojipick: any = new EventEmitter;
  activeIndex: number = 0;

  emojiList: any = EMOJIS;
  categoryEmojiSet: any = [];
  isEmojiPickerVisible: boolean = false;

  showEmojiList(id: number) {
    this.activeIndex = id
    const emojis = this.emojiList[id]?.emojis || []

    this.categoryEmojiSet = emojis
  }

  search(e: any) {
    let searchSet: any[] = [];
    for (let i = 1; i < EMOJIS.length; i++) {
      searchSet = searchSet.concat(EMOJIS[i].emojis);
    }

    const query = e?.target?.value?.toLowerCase();
    if (query && query.trim() !== '') {
      this.categoryEmojiSet = searchSet.filter((item: any) => {
        if (item[1].toLowerCase().indexOf(query.trim()) > -1) return item;
      });

    } else {
      this.categoryEmojiSet = [];
    }
  }

  selectEmoji(emoji: any) {
    if (this.inputRef) {
      const inputArea = this.inputRef;
      const startPos = inputArea.selectionStart || 0;
      const endPos = inputArea.selectionEnd || 0;
      const text = inputArea.value;
      const newText = text.substring(0, startPos) + emoji + text.substring(endPos, text.length);
      inputArea.value = newText;
      const newCursorPos = startPos + emoji.length;
      inputArea.setSelectionRange(newCursorPos, newCursorPos);
      inputArea.dispatchEvent(new Event('input'));
      inputArea.focus();
    }
  }

  openEmojiPicker() {
    this.isEmojiPickerVisible = true;
  }

  closeEmojiPicker() {
    this.isEmojiPickerVisible = false;
  }
}
