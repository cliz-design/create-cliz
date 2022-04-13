import * as path from 'path';
export type CLIType = 'single' | 'multiple';

export interface ICLIConfig {
  type: CLIType;
  name: string;
  description: string;
  author: string;
  scope?: string;
  repository?: string;
  homepage?: string;
  //
  codePath: string;
}

export class CLIConfig {
  private data: ICLIConfig = {} as any;

  public get template() {
    return `template-${this.get('type')}`;
  }

  public get templateURL() {
    return `https://github.com/cliz-design/${this.template}`;
  }

  public get packageName() {
    const scope = this.get('scope');
    const name = this.get('name');

    if (scope) {
      return `@${scope}/${name}`;
    }

    return name;
  }

  public get projectPath() {
    return path.resolve(this.get('codePath') ?? '', this.get('name') ?? '');
  }

  public set<K extends keyof ICLIConfig>(key: K, value: ICLIConfig[K]) {
    this.data[key as any as string] = value;
  }

  public get<K extends keyof ICLIConfig>(key: K): ICLIConfig[K] {
    return this.data[key as any as string];
  }

  public toJSON() {
    const { data } = this;

    return {
      ...data,
      template: this.template,
      templateURL: this.templateURL,
      packageName: this.packageName,
      projectPath: this.projectPath,
    };
  }

  public getProjectPath(name: string) {
    return path.resolve(this.get('codePath') ?? '', name);
  }
}
