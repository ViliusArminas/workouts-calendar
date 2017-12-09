import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { Ng2BreadcrumbModule } from 'ng2-breadcrumb/ng2-breadcrumb';
import { HttpClientModule } from '@angular/common/http';
import { CustomOption } from './modules/util/toaster-options';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastModule } from 'ng2-toastr/ng2-toastr';
import { ToastOptions } from 'ng2-toastr/ng2-toastr';
import { InMemoryWebApiModule } from 'angular-in-memory-web-api';
import { AlertModule } from 'ng2-bootstrap';

import { AppComponent } from './app.component';
import { FooterComponent } from './components/footer/footer.component';
import { HeaderComponent } from './components/header/header.component';
import { MenuComponent } from './components/menu/menu.component';
import { SideControlsComponent } from './components/side-controls/side-controls.component';
import { PageHeaderComponent } from './components/page-header/page-header.component';

import { AppRoutingModule } from './app.routing.module';
import { DataModule } from './modules/data/data.module';
import { HttpModule, Http, RequestOptions } from '@angular/http';
import { InMemDataService } from './service/inMemoryDataService';
import { LoadingComponent } from './modules/util/loading.component';
import { HomePageComponent } from './components/home-page/home-page.component';
import { ChartsModule } from 'ng2-charts/ng2-charts';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { AuthService } from './service/auth.service';
import { AuthHttp, AuthConfig } from 'ng2-bearer';
import { CalendarModule } from 'angular-calendar';

export function authHttpServiceFactory(http: Http, options: RequestOptions) {
  return new AuthHttp(new AuthConfig(), http, options);
}

@NgModule({
  declarations: [
    AppComponent,
    FooterComponent,
    HeaderComponent,
    MenuComponent,
    SideControlsComponent,
    PageHeaderComponent,
    HomePageComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    Ng2BreadcrumbModule.forRoot(),
    DataModule,
    HttpClientModule,
    BrowserAnimationsModule,
    ToastModule.forRoot(),
    HttpModule,
    InMemoryWebApiModule.forRoot(InMemDataService, {
      passThruUnknownUrl: true
    }),
    CalendarModule.forRoot(),
    AlertModule.forRoot(),
    ChartsModule,
    FormsModule,
    ReactiveFormsModule
  ],
  providers: [
    {
      provide: ToastOptions,
      useClass: CustomOption
    },
    {
      provide: AuthHttp,
      useFactory: authHttpServiceFactory,
      deps: [Http, RequestOptions]
    },
    AuthService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
