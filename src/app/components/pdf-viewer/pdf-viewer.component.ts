import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { PdfViewer } from './../../models/pdf.model';
import * as PDFJSLIB from 'pdfjs-dist/es5/build/pdf';
import * as PDFWORKER from 'pdfjs-dist/es5/build/pdf.worker.entry';
import { Location } from '@angular/common';

@Component({
  selector: 'app-pdf-viewer',
  templateUrl: './pdf-viewer.component.html',
  styleUrls: ['./pdf-viewer.component.scss']
})
export class PdfViewerComponent implements OnInit {

  @ViewChild('pdfCanvas', { static: true }) pdfCanvas: ElementRef;

  pdfBase: PdfViewer = {
    pageNum: 1,
    pageTotal: 0,
    scale: 0.8,
    rotate: 0,
  };
  pdfFile: any;

  constructor(
    private location: Location
  ) {}

  ngOnInit(): void {
    this.getPDF();
  }

  goBack() {
    this.location.back();
  }

  updateRotation = (data: number): void => {
    const currentScale = this.pdfBase.rotate;
    this.pdfBase.rotate += data;
    this.renderPdfFile(this.pdfFile);
    return;
  }

  updateScale = (data: number): void => {
    const currentScale = this.pdfBase.scale;
    console.log(data);
    if (data === -0.2 && currentScale <= 0.8) {
      return;
    }
    if (data === 0.2 && currentScale >= 2) {
      return;
    }
    this.pdfBase.scale += data;
    this.renderPdfFile(this.pdfFile);
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
      });
    });
  }

}
