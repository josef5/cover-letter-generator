import { Document, LineRuleType, Packer, Paragraph, TextRun } from "docx";
import { dialog, shell } from "electron";
import * as fs from "fs";

export async function saveCoverLetter(
  _: Electron.IpcMainInvokeEvent,
  text: string,
) {
  const date = new Date().toISOString().split("T")[0];

  const { filePath } = await dialog.showSaveDialog({
    filters: [{ name: "Word Document", extensions: ["docx"] }],
    defaultPath: `Cover-Letter-${date}.docx`,
  });

  // Units in 'twips'
  const cm = 566.9;
  const lineHeight = 240;

  if (!filePath) return;

  const doc = new Document({
    sections: [
      {
        properties: {
          page: {
            margin: {
              top: 2.5 * cm,
              right: 1.75 * cm,
              bottom: 3.5 * cm,
              left: 1.75 * cm,
            },
          },
        },
        children: [
          new Paragraph({
            spacing: {
              line: 1.2 * lineHeight,
              lineRule: LineRuleType.AUTO,
            },
            children: [
              new TextRun({
                text,
                font: {
                  name: "Arial",
                },
              }),
            ],
          }),
        ],
      },
    ],
  });

  try {
    // Save the file
    const buffer = await Packer.toBuffer(doc);
    await fs.promises.writeFile(filePath, buffer);

    // Open the file
    await shell.openPath(filePath);
  } catch (error) {
    console.error("Failed to save or open document:", error);
    throw error; // Propagate error to renderer
  }
}
