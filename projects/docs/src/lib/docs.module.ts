import { NgModule, ModuleWithProviders } from '@angular/core';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { MatListModule, MatIconModule, MatButtonModule } from '@angular/material';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MarkdownModule, MarkedOptions, MarkedRenderer } from 'ngx-markdown';
import { NgxMarkdownDocsComponent } from './docs.component';
import { CommonModule } from '@angular/common';

export function markedOptionsFactory(): MarkedOptions {
	const renderer = new MarkedRenderer();

	renderer.link = (href: string, title: string, text: string) => {
		return `<a title="${title || ''}" href="${href}">${text || title || href}</a>`;
	};

	renderer.paragraph = (text: string)=> {
		return `<p class="mat-body-3">${text}</p>`;
	};

	return {
		renderer: renderer
	};
}

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
