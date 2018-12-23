import { HttpClient } from "@angular/common/http";
import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  HostListener
} from "@angular/core";
import {
  NgxMarkdownDocsConfig,
  NgxMarkdownDocChangeEvent,
  NgxMarkdownDoc
} from "./docs-config";
import { isString } from "util";
import { join } from "path-browserify";

@Component({
  selector: "ngx-markdown-docs",
  templateUrl: "./docs.component.html",
  styles: []
})
export class NgxMarkdownDocsComponent implements OnInit {
  //  Fields

  //  Properties
  public ActiveDocPath: string;

  public ActiveDocData: string;

  @Input("config")
  public Config: NgxMarkdownDocsConfig;

  @Output("docChange")
  public DocChange: EventEmitter<NgxMarkdownDocChangeEvent>;

  //  Constructors
  constructor(protected http: HttpClient) {
    this.DocChange = new EventEmitter();
  }

  //  Life Cycle
  public ngOnInit() {
    if (this.Config && this.Config.Docs && this.Config.Docs.length > 0)
      this.GoToDoc(this.Config.DefaultDocPath || this.Config.Docs[0]);
  }

  //  API Methods
  @HostListener("click", ["$event.target"])
  public onClick(btn: any) {
    if (btn && btn.pathname && (<string>btn.pathname).endsWith('.md')) {
      this.GoToDoc(btn.pathname);

      return false;
    }
  }

  public FindDoc(path: string) {
    return this.Config.Docs.find(d => d.Path == path);
  }

  public GoToDoc(docOpt: NgxMarkdownDoc | string) {
    var docPath = isString(docOpt)
      ? <string>docOpt
      : (<NgxMarkdownDoc>docOpt).Path;

    if (this.ActiveDocPath != docPath)
      this.ActiveDocPath = docPath;

    this.calculateActiveDocData();

    this.DocChange.emit({ DocPath: docPath });
  }

  //  Herlpers
  protected calculateActiveDocData() {
    if (this.Config && this.ActiveDocPath)
      this.ActiveDocData = join(this.Config.LocationRoot, this.ActiveDocPath);
    else this.ActiveDocData = null;
  }
}
