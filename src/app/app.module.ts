import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { PdfViewerComponent } from './components/pdf-viewer/pdf-viewer.component';
import { ResultsComponent } from './components/results/results.component';
import { ImageViewComponent } from './components/image-view/image-view.component';
import { PdfCanvasComponent } from './components/pdf-canvas/pdf-canvas.component';
import { TopBarComponent } from './components/top-bar/top-bar.component';
import { ImageCropComponent } from './components/image-crop/image-crop.component';

@NgModule({
  declarations: [
    AppComponent,
    PdfViewerComponent,
    ResultsComponent,
    ImageViewComponent,
    PdfCanvasComponent,
    TopBarComponent,
    ImageCropComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
