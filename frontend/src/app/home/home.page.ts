import { Component, ElementRef, ViewChild } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  @ViewChild('video', { static: false }) video: ElementRef<HTMLVideoElement> | any;
  @ViewChild('canvas', { static: false }) canvas: ElementRef<HTMLCanvasElement> | any;
  @ViewChild('screenshot', { static: false }) screenshot: ElementRef<HTMLImageElement> | any;
  constructor() {}


  onVideoUpload(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];
      const url = URL.createObjectURL(file);
      this.video.nativeElement.src = url;
      this.video.nativeElement.load();
      this.video.nativeElement.play();
      setTimeout(async () => {
        this.takeScreenshot()
      }, 2000);
    }
  }

  takeScreenshot(): void {
    const videoElement = this.video.nativeElement;
    const canvasElement = this.canvas.nativeElement;
    const screenshotElement = this.screenshot.nativeElement;

    canvasElement.width = videoElement.videoWidth;
    canvasElement.height = videoElement.videoHeight;
    const context = canvasElement.getContext('2d');
    context?.drawImage(videoElement, 0, 0, canvasElement.width, canvasElement.height);
    const dataURL = canvasElement.toDataURL('image/png');
    screenshotElement.src = dataURL;
    screenshotElement.style.display = 'block';
  }
}
