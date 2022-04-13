#!/usr/bin/env node
import { createSingleCommandProgram } from '@cliz/cli';

import { create } from './core/create';

createSingleCommandProgram(
  __dirname,
  { autoOutputHelp: false },
  async function (program) {
    program
      .option('-c, --code-path <path>', '设置代码路径，默认为当前目录', {
        default: process.env.CODE_PATH || process.cwd(),
      })
      .action(async ({ options }) => {
        await create(options);
      });
  },
);
