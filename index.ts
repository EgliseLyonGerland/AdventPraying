import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
import chalk from 'chalk';

import drawCommand from './commands/draw.js';
import registerCommand from './commands/register.js';
import pdfCommand from './commands/pdf.js';
import mailCommand from './commands/mail.js';
import personsCommand from './commands/persons.js';

void yargs(hideBin(process.argv))
  .usage('Usage: $0 <command> [options]')
  .locale('en')
  .command(drawCommand)
  .command(registerCommand)
  .command(pdfCommand)
  .command(mailCommand)
  .command(personsCommand)
  .demandCommand()
  .epilog(`© Église Lyon Gerland ${new Date().getFullYear()}`)
  .fail((msg, err, argv) => {
    console.log(chalk.red(msg));
    console.log();
    console.log(argv.help());
  })
  .parse();
