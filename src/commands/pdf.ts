import fs from 'fs';

import PDFDocument from 'pdfkit';

import { rootPath } from '../config/index.js';
import draws from '../data/draws/index.js';
import { byId as persons } from '../data/persons/index.js';
import { createModule } from './utils/yargs.js';

const width = 2480;
const height = 3508;
const paddings = [12, 76];
const topMargin = 350;
const contentWidth = width - paddings[0] * 2;
const contentHeight = height - paddings[1] * 2;

function addPage(doc: typeof PDFDocument, type: 'recto' | 'verso' = 'recto') {
  doc
    .addPage()
    .save()
    .rect(0, 0, width, height)
    .fill('#fff')
    .restore()
    .image(`${rootPath}/assets/${type}.png`, 0, 0, {
      fit: [width, height],
      align: 'center',
      valign: 'center',
    });
}

const commandModule = createModule({
  command: 'pdf',
  describe: 'Generate PDF for print',

  builder: (argv) =>
    argv.option('year', {
      alias: 'y',
      desc: 'Year',
      type: 'number',
      default: new Date().getFullYear(),
    }),

  handler: async ({ year }) => {
    if (!(year in draws)) {
      throw new Error(`Draw ${year} not found`);
    }

    const outputPath = `${rootPath}/../export/draw${year}.pdf`;
    const draw = draws[year];

    if (fs.existsSync(outputPath)) {
      fs.unlinkSync(outputPath);
    }

    await new Promise((resolve) => setTimeout(resolve, 1000));

    const doc = new PDFDocument({
      size: [width, height],
      autoFirstPage: false,
    });

    doc.pipe(fs.createWriteStream(outputPath));

    Object.values(draw).forEach((personId, index) => {
      if (index % 8 === 0) {
        addPage(doc, 'recto');
      }

      const rowIndex = Math.floor((index % 8) / 2);
      const columnIndex = Math.floor(index % 2);

      const x = (contentWidth / 2) * columnIndex + paddings[0];
      const y = (contentHeight / 4) * rowIndex + topMargin + paddings[1];
      const { firstname, lastname } = persons[personId];

      doc
        .save()
        .font('/System/Library/Fonts/Supplemental/Zapfino.ttf')
        .fontSize(56)
        .fill('#32251C')
        .text(`${firstname} ${lastname}`, x, y, {
          width: contentWidth / 2,
          align: 'center',
        })
        .restore();

      if ((index + 1) % 8 === 0) {
        addPage(doc, 'verso');
      }
    });

    doc.end();
  },
});

export default commandModule;
