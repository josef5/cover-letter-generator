import { Document, Packer, Paragraph, TextRun } from "docx";
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

  if (!filePath) return;

  const doc = new Document({
    sections: [
      {
        properties: {},
        children: [
          new Paragraph({
            children: [
              new TextRun({
                text,
                font: {
                  name: "Inter",
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
