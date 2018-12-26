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
import { FlatTreeControl } from "@angular/cdk/tree";
import { MatTreeFlattener, MatTreeFlatDataSource } from "@angular/material";
import { Observable, of as observableOf } from "rxjs";
import { MarkedOptions, MarkedRenderer } from "ngx-markdown";

export class FileNode {
  children: FileNode[];
  filename: string;
  level: number;
  path: string;
}

/** Flat node with expandable and level information */
export class FileFlatNode {
  constructor(
    public expandable: boolean,
    public filename: string,
    public level: number,
    public path: string
  ) {}
}

export const originalHeading = new MarkedRenderer().heading;

export function markedOptionsFactory(): MarkedOptions {
  const renderer = new MarkedRenderer();

  let lastLevel = 0;

  const origHeading = renderer.heading;

  renderer.heading = function(text: string, level: number, raw: string) {
    lastLevel = level;

    // return origHeading(text, level, raw);

    // if (this.options.headerIds) {
    //   return (
    //     "<h" +
    //     level +
    //     ' id="' +
    //     this.options.headerPrefix +
    //     raw.toLowerCase().replace(/[^\w]+/g, "-") +
    //     '">' +
    //     text +
    //     "</h" +
    //     level +
    //     ">\n"
    //   );
    // } else
    return "<h" + level + ">" + text + "</h" + level + ">\n";
  };

  renderer.link = (href: string, title: string, text: string) => {
    return `<a title="${title || ""}" href="${href}">${text ||
      title ||
      href}</a>`;
  };

  renderer.paragraph = (text: string) => {
    var pClass = "";

    switch (lastLevel) {
      case 1:
      case 2:
      pClass = "mat-body-3";
        break;

      case 3:
      case 4:
        pClass = "mat-body-2";
        break;

      default:
        pClass = "mat-body-1";
        break;
    }

    return `<p class="${pClass}">${text}</p>`;
  };

  return {
    renderer: renderer
  };
}

@Component({
  selector: "ngx-markdown-docs",
  templateUrl: "./docs.component.html",
  styles: []
})
export class NgxMarkdownDocsComponent implements OnInit {
  //  Fields

  //  Properties
  public TreeControl: FlatTreeControl<FileFlatNode>;

  public TreeFlattener: MatTreeFlattener<FileNode, FileFlatNode>;

  public DataSource: MatTreeFlatDataSource<FileNode, FileFlatNode>;

  public ActiveDocPath: string;

  public ActiveDocData: string;

  @Input("config")
  public Config: NgxMarkdownDocsConfig;

  @Output("docChange")
  public DocChange: EventEmitter<NgxMarkdownDocChangeEvent>;

  @Input("docs")
  public set Docs(docs: string) {
    this.http
      .get(join(docs, "lcu.docs.json"))
      .subscribe((res: NgxMarkdownDocsConfig) => {
        this.Config = res;

        this.Reload();
      });
  }

  //  Constructors
  constructor(protected http: HttpClient) {
    this.DocChange = new EventEmitter();

    this.TreeFlattener = new MatTreeFlattener(
      this.Transformer,
      this.getLevel,
      this.isExpandable,
      this.getChildren
    );

    this.TreeControl = new FlatTreeControl<FileFlatNode>(
      this.getLevel,
      this.isExpandable
    );

    this.DataSource = new MatTreeFlatDataSource(
      this.TreeControl,
      this.TreeFlattener
    );
  }

  //  Life Cycle
  public ngOnInit() {
    this.Reload();
  }

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

  //  API Methods
  public BuildFileTree(): void {
    this.DataSource.data = this.buildFileTree(this.Config.Docs, 0);
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

  public HasChild(_: number, _nodeData: FileFlatNode) {
    return _nodeData.expandable;
  }

  public Reload() {
    if (this.Config && this.Config.Docs && this.Config.Docs.length > 0) {
      this.BuildFileTree();

      this.GoToDoc(
        this.ActiveDocPath || this.Config.DefaultDocPath || this.Config.Docs[0]
      );
    }
  }

  public Transformer(node: FileNode) {
    return new FileFlatNode(!!node.children, node.filename, node.level, node.path);
  }

  //  Herlpers
  protected buildFileTree(docs: NgxMarkdownDoc[], level: number): FileNode[] {
    return docs.reduce<FileNode[]>((accumulator, doc) => {
      var node = this.buildFileNodeFromDoc(doc, level);

      return accumulator.concat(node);
    }, []);
  }

  protected buildFileNodeFromDoc(
    doc: NgxMarkdownDoc,
    level: number,
    bypassChildren?: boolean
  ): FileNode {
    const node = new FileNode();

    if (doc != null) {
      node.filename = doc.Title;

      node.level = level;

      if (!bypassChildren && doc.Children && doc.Children.length > 0) {
        node.children = this.buildFileTree(doc.Children, level + 1);

        var docCatch = {...doc};

        docCatch.Children = null;

        // node.children.unshift(this.buildFileNodeFromDoc(docCatch, level + 1, true));
      } else {
        node.path = doc.Path;
      }
    }

    return node;
  }

  protected calculateActiveDocData() {
    if (this.Config && this.ActiveDocPath)
      this.ActiveDocData = join(this.Config.LocationRoot, this.ActiveDocPath);
    else this.ActiveDocData = null;
  }

  protected getLevel(node: FileFlatNode) {
    return node.level;
  }

  protected isExpandable(node: FileFlatNode) {
    return node.expandable;
  }

  protected getChildren(node: FileNode): Observable<FileNode[]> {
    return observableOf(node.children);
  }
}
