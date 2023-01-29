import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavMenuComponent } from './nav-menu/nav-menu.component';
import { FooterComponent } from './footer/footer.component';
import { BuilderComponent } from './builder/builder.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FaIconLibrary, FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {
  faTimes,
  faArrowRight,
  faTrash,
  faPencil
} from '@fortawesome/free-solid-svg-icons';
import {DialogModule} from '@angular/cdk/dialog';
import {MatInputModule} from '@angular/material/input';
import {MatDialogModule} from '@angular/material/dialog';
import {MatTabsModule} from '@angular/material/tabs';
import { ExportTreeDialog } from './builder/dialog-export-tree';
import { ImportTreeDialog } from './builder/dialog-import-tree';
@NgModule({
  declarations: [
    AppComponent,
    NavMenuComponent,
    FooterComponent,
    BuilderComponent, ExportTreeDialog, ImportTreeDialog

  ],
  imports: [
    FormsModule,
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    FontAwesomeModule,
    DialogModule,
    MatInputModule,
    MatDialogModule,
    MatTabsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { 
  /**
   *
   */
  constructor(library: FaIconLibrary) {
    library.addIcons(
      faTimes,
      faArrowRight,
      faTrash,
      faPencil
    );
    
  }
}
