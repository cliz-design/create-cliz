import { api, inquirer } from '@cliz/cli';
import * as boxen from 'boxen';
import { CLIConfig } from '../config';
import { generate } from '../utils/generator';

export interface CreateOptions {
  codePath?: string;
}

export async function create(options?: CreateOptions) {
  const config = new CLIConfig();
  config.set('codePath', options?.codePath);

  // await generate(config.toJSON());

  // return;

  const answers = await inquirer.prompt([
    {
      type: 'list',
      name: 'type',
      message: '请选择 CLI 类型？',
      choices: [
        {
          name: `multiple   - ${api.color.chalk.gray(
            '组合命令模式，比如 docker / kubectl 等',
          )}`,
          value: 'multiple-commands',
        },
        {
          name: `single     - ${api.color.chalk.gray(
            '单一命令模式，比如 ls / find 等',
          )}`,
          value: 'single-command',
        },
      ],
      required: true,
    },
    {
      type: 'input',
      name: 'name',
      message: '请输入 CLI 名称？',
      validate: async (input: string) => {
        if (!input) {
          return '请输入 CLI 名称！';
        }

        if (input.length < 2) {
          return 'CLI 名称长度不能小于 2 个字符！';
        }

        if (input.length > 20) {
          return 'CLI 名称长度不能大于 20 个字符！';
        }

        if (!/^[a-zA-Z0-9_]+$/.test(input)) {
          return 'CLI 名称只能包含字母、数字、下划线！';
        }

        if (await api.fs.exist(config.getProjectPath(input))) {
          return '项目或 CLI 已存在，请使用其他名称！';
        }

        return true;
      },
      required: true,
    },
    {
      type: 'input',
      name: 'description',
      message: '请输入 CLI 描述？',
      validate: (input: string) => {
        if (!input) {
          return 'CLI 描述是必须的！';
        }
        if (input.length < 2) {
          return 'CLI 描述长度不能小于 2 个字符！';
        }
        if (input.length > 100) {
          return 'CLI 描述长度不能大于 100 个字符！';
        }
        return true;
      },
      required: true,
    },
    {
      type: 'input',
      name: 'author',
      message: '请输入 CLI 作者？',
      validate: (input: string) => {
        if (!input) {
          return 'CLI 作者是必须的！';
        }
        if (input.length < 2) {
          return '作者长度不能小于 2 个字符！';
        }
        if (input.length > 20) {
          return '作者长度不能大于 20 个字符！';
        }
        return true;
      },
      required: true,
    },
    {
      type: 'input',
      name: 'scope',
      message: '请输入 CLI NPM Scope？（可选）',
    },
    {
      type: 'input',
      name: 'repository',
      message: '请输入 CLI 仓库地址？（可选）',
    },
    {
      type: 'input',
      name: 'homepage',
      message: '请输入 CLI 官网地址？（可选）',
    },
  ]);

  config.set('type', answers.type);
  config.set('name', answers.name);
  config.set('description', answers.description);
  config.set('author', answers.author);
  config.set('scope', answers.scope);
  config.set('repository', answers.repository);
  config.set('homepage', answers.homepage);

  if (api.is.debug()) {
    console.info(`Config: ${JSON.stringify(config.toJSON(), null, 2)}`);
  }

  await generate(config.toJSON());

  const message = `
    ${api.color.chalk.green('Every thing is ready!')}
    
    Project path(${api.color.chalk.cyan(
      config.projectPath,
    )}) (${api.color.chalk.grey('copied to clipboard')})
    - cd ${api.color.chalk.cyan(config.projectPath)}

    Available commands:
    - ${api.color.chalk.bold('Bootstrap  ')}:         ${api.color.chalk.cyan(
    'yarn bootstrap',
  )}
    - ${api.color.chalk.bold('Dev        ')}:         ${api.color.chalk.cyan(
    'yarn dev',
  )}
    - ${api.color.chalk.bold('CLI        ')}:         ${api.color.chalk.cyan(
    'yarn cli',
  )}
    - ${api.color.chalk.bold('Build      ')}:         ${api.color.chalk.cyan(
    'yarn build',
  )}
      `;

  console.log(
    boxen(message, {
      padding: 1,
      borderColor: 'green',
      margin: 1,
    }),
  );
}
