import WebSocket from "ws";
import type { NextApiRequest, NextApiResponse } from "next";
import { Connection } from "sharedb/lib/client";
import json0 from "ot-json0";

const documentCollection = "tables";

function createOrGetDoc(id: string): Promise<string> {
  const socket = new WebSocket("ws://localhost:8080");
  const connection = new Connection(socket);
  const doc = connection.get(documentCollection, id);

  return new Promise((resolve, reject) => {
    doc.fetch((err) => {
      try {
        if (err) {
          throw err;
        } else if (doc.type === null) {
          doc.create({ images: [] }, json0.type.uri, (error) => {
            if (error) {
              reject(error);
            }

            resolve(id);
          });
        } else {
          resolve(id);
        }
      } catch (error) {
        // DEBUG
        console.log("rejected", error);
        reject(error);
      }
    });
  });
}

function generateId(name: string, dateSeed: number): string {
  const prefix = dateSeed.toString().slice(-6).padStart(6, "0");
  const sanitizedName = name
    .toLowerCase()
    .replace(/[\s_]/g, "-")
    .replace(/[^-a-z0-9]/g, "");

  return `${prefix}-${sanitizedName}`;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const userSuppliedName = req.body.name;

  switch (req.method) {
    case "POST":
      const id = generateId(userSuppliedName, Date.now());

      try {
        await createOrGetDoc(id);

        res.status(200).json({ id });
      } catch (error) {
        res.status(500).end("Unable to create or get table");
      }
      break;

    default:
      res.setHeader("Allow", ["POST"]);
      res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
