import { NgModule, ModuleWithProviders } from '@angular/core';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { MatListModule, MatIconModule, MatButtonModule, MatTreeModule } from '@angular/material';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MarkdownModule, MarkedOptions } from 'ngx-markdown';
import { NgxMarkdownDocsComponent, markedOptionsFactory } from './docs.component';
import { CommonModule } from '@angular/common';

@NgModule({
  imports: [
    CommonModule,
		HttpClientModule,
		MarkdownModule.forRoot({
			loader: HttpClient,
			markedOptions: {
				provide: MarkedOptions,
				useFactory: markedOptionsFactory,
			},
    }),
    FlexLayoutModule,
    MatButtonModule,
    MatIconModule,
    MatListModule,
    MatTreeModule,
  ],
  declarations: [
    NgxMarkdownDocsComponent
  ],
  exports: [
    NgxMarkdownDocsComponent
  ]
})
export class NgxMarkdownDocsModule {
}
