import { Component } from '@angular/core';
import { NgxMarkdownDocsConfig } from 'projects/docs/src/lcu.api';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  //  Properties
  public Config: NgxMarkdownDocsConfig;

  //  Constructors
  constructor() {
    this.Config = <NgxMarkdownDocsConfig>{
      DefaultDocPath: 'overview.md',
      Docs: [
        {
          Children: [],
          Path: 'overview.md',
          Title: 'Overview'
        }
      ],
      LocationRoot: 'https://raw.githubusercontent.com/lowcodeunit/lcu-sln-assets/master/docs/'
    };
  }
}
