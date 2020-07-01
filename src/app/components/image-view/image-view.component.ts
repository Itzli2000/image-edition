import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ImageData } from '../../models/image.model';
import { Location } from '@angular/common';

@Component({
  selector: 'app-image-view',
  templateUrl: './image-view.component.html',
  styleUrls: ['./image-view.component.scss']
})
export class ImageViewComponent implements OnInit {

  @ViewChild('imgCanvas', { static: true }) imgCanvas: ElementRef;

  imageBase: ImageData = {
    scale: 1,
    rotate: 0,
  };
  pageImg: any;

  constructor(
    private location: Location
  ) { }

  ngOnInit() {
    this.renderImage();
  }

  goBack() {
    this.location.back();
  }

  /**
   * This function is used to rotate the "base image"
   * in order to let the scale function works without blur the image
   */
  updatePageImage = (data: number): void => {
    const temporalImage = new Image();
    temporalImage.src = this.pageImg.src;
    temporalImage.onload = () => {
      // Create container canvas for base image
      const canvas = document.createElement('canvas');
      canvas.width = temporalImage.width;
      canvas.height = temporalImage.height;
      const context = canvas.getContext('2d');
      context.drawImage(temporalImage, 0, 0);
      // Temporal canvas to rotate base imge
      const tempCanvas = document.createElement('canvas');
      tempCanvas.width = canvas.width;
      tempCanvas.height = canvas.height;
      const tempCtx = tempCanvas.getContext('2d');
      tempCtx.drawImage(canvas, 0, 0, canvas.width, canvas.height);
      // Now clear the portion to rotate.
      context.fillStyle = '#000';
      context.clearRect(0, 0, canvas.width, canvas.height);
      canvas.width = tempCanvas.height;
      canvas.height = tempCanvas.width;
      context.fillRect(0, 0, tempCanvas.height, tempCanvas.width);
      context.save();
      // Translate to the center of the canvas
      context.translate(tempCanvas.height / 2, tempCanvas.width / 2);
      // Rotate it
      context.rotate((data * Math.PI) / 180);
      // Finally draw the image data from the temp canvas.
      context.drawImage(tempCanvas, -canvas.height / 2, -canvas.width / 2);
      context.restore();

      // document.body.appendChild(canvas); // this append is used to visualy check the position of the new image
      const newImage = document.createElement('img');
      newImage.src = canvas.toDataURL('image/png');
      this.pageImg = newImage;
      // document.body.appendChild(newImage); // Double check of the created image with the new rotation
    };
    return;
  }

  /**
   * Creates a helper canvas to rotate the main canvas image
   * Recive a number (90, -90) to know the rotation direction
   */
  updateRotation = (data: number): void => {
    // Save rotation data
    this.imageBase.rotate += data;
    // Get visible canvas
    const canvas = this.imgCanvas.nativeElement as HTMLCanvasElement;
    const context = canvas.getContext('2d');
    // Temporal canvas
    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = canvas.width;
    tempCanvas.height = canvas.height;
    const tempCtx = tempCanvas.getContext('2d');
    tempCtx.drawImage(canvas, 0, 0, canvas.width, canvas.height);
    // Now clear the portion to rotate.
    context.fillStyle = '#000';
    context.clearRect(0, 0, canvas.width, canvas.height);
    canvas.width = tempCanvas.height;
    canvas.height = tempCanvas.width;
    context.fillRect(0, 0, tempCanvas.height, tempCanvas.width);
    context.save();
    // Translate to the center of the canvas
    context.translate(tempCanvas.height / 2, tempCanvas.width / 2);
    // Rotate it
    context.rotate((data * Math.PI) / 180);
    // Finally draw the image data from the temp canvas.
    context.drawImage(tempCanvas, -canvas.height / 2, -canvas.width / 2);
    context.restore();
    // Rotate the base image for scales work
    this.updatePageImage(data);
    return;
  }

  updateScale = (data: number): void => {
    const currentScale = this.imageBase.scale;
    if (data === -0.2 && currentScale <= 0.8) {
      return;
    }
    if (data === 0.2 && currentScale >= 2) {
      return;
    }
    this.imageBase.scale += data;
    // Get visible canvas
    const canvas = this.imgCanvas.nativeElement as HTMLCanvasElement;
    canvas.width = this.pageImg.width;
    canvas.height = this.pageImg.height;
    const context = canvas.getContext('2d');
    context.drawImage(this.pageImg, 0, 0);
    // Temporal canvas
    const tempCanvas = document.createElement('canvas');
    const tempCtx = tempCanvas.getContext('2d');
    tempCanvas.width = canvas.width;
    tempCanvas.height = canvas.height;
    tempCtx.drawImage(canvas, 0, 0);
    // Now clear the portion to rotate.
    context.fillStyle = '#000';
    context.clearRect(0, 0, canvas.width, canvas.height);
    canvas.width = canvas.width * this.imageBase.scale;
    canvas.height = canvas.height * this.imageBase.scale;
    context.fillRect(0, 0, tempCanvas.height, tempCanvas.width);
    context.save();
    // Finally draw the image data from the temp canvas.
    context.drawImage(tempCanvas, 0, 0, tempCanvas.width, tempCanvas.height, 0, 0, canvas.width, canvas.height);
    context.restore();
    return;
  }

  renderImage() {
    const url = './../../../assets/ine.jpg';
    const canvas = this.imgCanvas.nativeElement as HTMLCanvasElement;
    canvas.oncontextmenu = (e) => {
      e.preventDefault();
    };
    const context = canvas.getContext('2d');
    const image = new Image();
    image.src = url;
    this.pageImg = image;
    image.onload = () => {
      context.drawImage(image, 0, 0, image.width, image.height);
    };


    canvas.width = image.width;
    canvas.height = image.height;

    context.lineWidth = 3;
    context.lineCap = 'round';
    context.strokeStyle = '#000';
  }

}
