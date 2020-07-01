import { ImageCropComponent } from './components/image-crop/image-crop.component';
import { ImageViewComponent } from './components/image-view/image-view.component';
import { PdfViewerComponent } from './components/pdf-viewer/pdf-viewer.component';
import { ResultsComponent } from './components/results/results.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PdfCanvasComponent } from './components/pdf-canvas/pdf-canvas.component';


const routes: Routes = [
  { path: '', component: ResultsComponent },
  { path: 'pdf-view', component: PdfViewerComponent },
  { path: 'pdf-canvas', component: PdfCanvasComponent },
  { path: 'image-view/:id', component: ImageViewComponent },
  { path: 'image-crop/:id', component: ImageCropComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
