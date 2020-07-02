import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Location } from '@angular/common';

@Component({
  selector: 'app-image-css',
  templateUrl: './image-css.component.html',
  styleUrls: ['./image-css.component.scss']
})
export class ImageCssComponent implements OnInit {

  @ViewChild('imgCanvas', { static: true }) public imgCanvas: ElementRef;

  rotatedata: number;
  zoomData: number;
  mainCanvas: HTMLCanvasElement;
  rotateBy: number;
  zoomBy: number;

  constructor(
    private location: Location
  ) {
  }

  ngOnInit() {
    this.mainCanvas = this.imgCanvas.nativeElement as HTMLCanvasElement;
    this.mainCanvas.oncontextmenu = e => e.preventDefault();
    this.rotatedata = 1;
    this.zoomData = 1;
    this.rotateBy = 30;
    this.zoomBy = 0.3;
    this.renderImage();
  }

  goBack() {
    this.location.back();
  }

  zoom(data: number) {
    console.log(this.zoomData);
    if (this.zoomData <= 0.8 && Math.sign(data) === -1) { return; }
    if (this.zoomData >= 2 && data === 0.1) { return; }
    this.zoomData += data;
    this.updateCanvas();
  }

  rotate(data: number) {
    console.log(this.rotatedata);
    this.rotatedata += data;
    this.updateCanvas();
  }

  updateCanvas() {
    this.mainCanvas.style.transform = `rotate(${this.rotatedata}deg) scale(${this.zoomData})`;
  }

  restore() {
    this.rotatedata = 1;
    this.zoomData = 1;
    this.updateCanvas();
  }

  renderImage() {
    const url = './../../../assets/ine.jpg';
    const canvas = this.mainCanvas;
    const context = canvas.getContext('2d');
    const image = new Image();
    image.src = url;
    image.onload = () => {
      canvas.width = image.width;
      canvas.height = image.height;
      context.drawImage(image, 0, 0, image.width, image.height);
    };
  }

}
