import { api, doreamon } from '@cliz/cli';

export interface GeneratorConfig {
  name: string;
  projectPath: string;
  templateURL: string;
  packageName: string;
  description: string;
  author: string;
  homepage?: string;
  repository?: string;
}

// 1. clone
// 2. change config
// 3. install
// 4.
export class Generator {
  constructor(private readonly config: GeneratorConfig) {
    //
  }

  public async clone() {
    const { config } = this;
    // await api.$.runShell(`git clone --progress ${config.templateURL} ${config.projectPath}`);
    await api.$`git clone ${config.templateURL} ${config.projectPath}`;

    // clean git history and regenerate
    await api.fs.rmdir(`${config.projectPath}/.git`);
    await api.$.cd(config.projectPath);
    await api.$`git init`;
  }

  public async changeConfig() {
    const { config } = this;
    const pkg = await api.fs.json.read(`${config.projectPath}/package.json`);

    pkg.version = '0.0.0';
    pkg.name = config.packageName;
    pkg.description = config.description;
    pkg.author = config.author;
    pkg.homepage = config.homepage ?? '';
    pkg.repository = config.repository ?? '';
    pkg.bin = {
      [config.name]: 'lib/cli.js',
    };
    pkg.cliz = {
      name: config.name,
    };

    if (pkg.repository) {
      pkg.bugs = {
        url: `${pkg.repository}/issues`,
      };
    } else {
      delete pkg.bugs;
    }

    await api.fs.writeFile(
      `${config.projectPath}/package.json`,
      JSON.stringify(pkg, null, 2),
    );
  }

  public async install() {
    const { config } = this;
    await api.$.cd(config.projectPath);
    // await api.$.runShell(`yarn`);
    await api.$`yarn`;
  }

  public async copyProjectPath() {
    const { config } = this;
    await api.clipboard.copy(config.projectPath);
  }
}

export async function generate(options: GeneratorConfig) {
  const generator = new Generator(options);

  api.task.add(
    {
      title: 'Load template ...',
      task: async () => {
        await doreamon.delay(1000);
        await generator.clone();
      },
    },
    {
      title: 'Apply config ...',
      task: async () => {
        await doreamon.delay(1000);
        await generator.changeConfig();
      },
    },
    // {
    //   title: 'Install dependencies',
    //   task: async () => {
    //     await doreamon.delay(1000);
    //     await generator.install();
    //   },
    // },
    {
      title: 'Copy project path ...',
      task: async () => {
        await doreamon.delay(1000);
        await generator.copyProjectPath();
      },
    },
  );

  await api.task.run();
}
