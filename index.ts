import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';

import drawCommand from './commands/draw.js';
import registerCommand from './commands/register.js';
import pdfCommand from './commands/pdf.js';
import mailCommand from './commands/mail.js';

void yargs(hideBin(process.argv))
  .usage('Usage: $0 <command> [options]')
  .locale('en')
  .command(drawCommand)
  .command(registerCommand)
  .command(pdfCommand)
  .command(mailCommand)
  .demandCommand()
  .epilog(`© Église Lyon Gerland ${new Date().getFullYear()}`)
  // .wrap(Math.min(100, yargs))
  .help()
  .parse();
