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

  @Input("docs")
  public set Docs(docs: string) {
    this.http.get(join(docs, 'docs.json')).subscribe(
      (res: NgxMarkdownDocsConfig) => {
        this.Config = res;
      }
    )
  }

  //  Constructors
  constructor(protected http: HttpClient) {
    this.DocChange = new EventEmitter();
  }

  //  Life Cycle
  public ngOnInit() {
    this.Reload();
  }

  //  API Methods
  @HostListener("click", ["$event.target"])
  public onClick(btn: any) {
    if (btn && btn.href && (<string>btn.href).endsWith(".md")) {
      var path = btn.href.replace(
        document.getElementsByTagName("base")[0].href,
        ""
      );

      console.log(`Going to doc: ${path}`);

      this.GoToDoc(path);

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

    if (this.ActiveDocPath != docPath) this.ActiveDocPath = docPath;

    this.calculateActiveDocData();

    this.DocChange.emit({ DocPath: docPath });
  }

  public Reload() {
    if (this.Config && this.Config.Docs && this.Config.Docs.length > 0)
      this.GoToDoc(this.ActiveDocPath || this.Config.DefaultDocPath || this.Config.Docs[0]);
  }

  //  Herlpers
  protected calculateActiveDocData() {
    if (this.Config && this.ActiveDocPath)
      this.ActiveDocData = join(this.Config.LocationRoot, this.ActiveDocPath);
    else this.ActiveDocData = null;
  }
}
