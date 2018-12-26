export class NgxMarkdownDocsConfig {
  public DefaultDocPath?: string;

  public Docs: NgxMarkdownDoc[];

  public DisableNavigation?: boolean;

  public IndentVariant: number = 1;

  public LocationRoot: string;
}

export class NgxMarkdownDoc {
  public Children: NgxMarkdownDoc[];

  public Path: string;

  public Title: string;
}

export class NgxMarkdownDocChangeEvent {
  public DocPath: string;
}
