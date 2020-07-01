import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ImageData } from '../../models/image.model';
import { Location } from '@angular/common';
import Cropper from 'cropperjs';

@Component({
  selector: 'app-image-crop',
  templateUrl: './image-crop.component.html',
  styleUrls: ['./image-crop.component.scss']
})
export class ImageCropComponent implements OnInit {

  @ViewChild('imgCanvas', { static: true }) imgCanvas: ElementRef;
  @ViewChild('prev1', { static: true }) prev1: ElementRef;
  @ViewChild('prev2', { static: true }) prev2: ElementRef;
  @ViewChild('prev3', { static: true }) prev3: ElementRef;

  imageBase: ImageData = {
    scale: 1,
    rotate: 0,
  };
  pageImg: any;

  constructor(
    private location: Location
  ) { }

  ngOnInit() {
    const imagePrev = this.prev1.nativeElement as HTMLImageElement;
    imagePrev.oncontextmenu = e => e.preventDefault();
    this.renderImage();
  }

  goBack() {
    this.location.back();
  }

  renderImage() {
    const url = './../../../assets/ine.jpg';
    const canvas = this.imgCanvas.nativeElement as HTMLCanvasElement;
    canvas.oncontextmenu = (e) => {
      // e.preventDefault();
    };
    const context = canvas.getContext('2d');
    const image = new Image();
    image.src = url;
    this.pageImg = image;
    image.onload = () => {
      context.drawImage(image, 0, 0, image.width, image.height);
      this.cropImage();
    };
    canvas.width = image.width;
    canvas.height = image.height;
  }

  cropImage() {
    const canvas = this.imgCanvas.nativeElement as HTMLCanvasElement;
    const imagePrev1 = this.prev1.nativeElement as HTMLImageElement;
    const imagePrev2 = this.prev2.nativeElement as HTMLImageElement;
    const imagePrev3 = this.prev3.nativeElement as HTMLImageElement;
    const cropper = new Cropper(canvas, {
      aspectRatio: 1 / 1,
      crop: () => {
        const current = cropper.getCroppedCanvas();
        imagePrev1.src = current.toDataURL('image/png');
        imagePrev2.src = current.toDataURL('image/png');
        imagePrev3.src = current.toDataURL('image/png');
      }
    });
  }
}
