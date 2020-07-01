import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { PdfViewer } from './../../models/pdf.model';
import * as PDFJSLIB from 'pdfjs-dist/es5/build/pdf';
import * as PDFWORKER from 'pdfjs-dist/es5/build/pdf.worker.entry';
import { Location } from '@angular/common';

@Component({
  selector: 'app-pdf-canvas',
  templateUrl: './pdf-canvas.component.html',
  styleUrls: ['./pdf-canvas.component.scss']
})
export class PdfCanvasComponent implements OnInit {

  @ViewChild('pdfCanvas', { static: true }) pdfCanvas: ElementRef;

  pdfBase: PdfViewer = {
    pageNum: 1,
    pageTotal: 0,
    scale: 1,
    rotate: 0,
  };
  pdfFile: any;
  pageImg: any;

  constructor(
    private location: Location
  ) { }

  ngOnInit() {
    this.getPDF();
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
    this.pdfBase.rotate += data;
    // Get visible canvas
    const canvas = this.pdfCanvas.nativeElement as HTMLCanvasElement;
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
    const currentScale = this.pdfBase.scale;
    if (data === -0.2 && currentScale <= 0.8) {
      return;
    }
    if (data === 0.2 && currentScale >= 2) {
      return;
    }
    this.pdfBase.scale += data;
    // Get visible canvas
    const canvas = this.pdfCanvas.nativeElement as HTMLCanvasElement;
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
    canvas.width = canvas.width * this.pdfBase.scale;
    canvas.height = canvas.height * this.pdfBase.scale;
    context.fillRect(0, 0, tempCanvas.height, tempCanvas.width);
    context.save();
    // Finally draw the image data from the temp canvas.
    context.drawImage(tempCanvas, 0, 0, tempCanvas.width, tempCanvas.height, 0, 0, canvas.width, canvas.height);
    context.restore();
    return;
  }

  updatePage = (data: number): void => {
    if (data === -1 && this.pdfBase.pageNum <= 1) {
      return;
    }
    if (data === 1 && this.pdfBase.pageNum >= this.pdfFile.numPages) {
      return;
    }
    this.pdfBase.pageNum += data;
    this.renderPdfFile(this.pdfFile);
    return;
  }

  getPDF = () => {
    const url = './../../../assets/Película.pdf';

    PDFJSLIB.GlobalWorkerOptions.workerSrc = PDFWORKER;

    const loadingTask = PDFJSLIB.getDocument(url);
    loadingTask.promise.then((pdf) => {
      this.pdfFile = pdf;
      this.pdfBase.pageTotal = pdf.numPages;
      this.renderPdfFile(pdf);
    }, (reason) => {
      console.error(reason);
    });
  }

  renderPdfFile = (pdf) => {
    const pageNumber = this.pdfBase.pageNum;
    pdf.getPage(pageNumber).then((page) => {
      const scale = this.pdfBase.scale;
      const rotation = this.pdfBase.rotate;
      const canvas = this.pdfCanvas.nativeElement as HTMLCanvasElement;
      canvas.oncontextmenu = (e) => {
        e.preventDefault();
      };
      const viewport = page.getViewport({ scale, rotation });
      const context = canvas.getContext('2d');
      canvas.height = viewport.height;
      canvas.width = viewport.width;

      const renderContext = {
        canvasContext: context,
        viewport
      };
      const renderTask = page.render(renderContext);
      renderTask.promise.then(() => {
        const newImage = document.createElement('img');
        newImage.src = canvas.toDataURL('image/png');
        this.pageImg = newImage;
      });
    });
  }

}
