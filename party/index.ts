import type * as Party from "partykit/server";
import { onConnect } from "y-partykit";
import * as Y from "yjs";
import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";
import { Buffer } from "buffer";

const prisma = new PrismaClient().$extends(withAccelerate());

export default class YjsServer implements Party.Server {
  constructor(public room: Party.Room) {}

  onConnect(conn: Party.Connection) {
    const postId = this.room.id;

    return onConnect(conn, this.room, {
      persist: { mode: "snapshot" },

      async load() {
        const room = await prisma.room.findUnique({
          where: { postId },
        });

        if (room) {
          const doc = new Y.Doc();
          const update = new Uint8Array(room.content);
          Y.applyUpdate(doc, update);

          return doc;
        }

        return null;
      },

      callback: {
        async handler(yDoc) {
          const update = Y.encodeStateAsUpdate(yDoc);

          await prisma.room.upsert({
            where: { postId },
            update: {
              content: Buffer.from(update),
            },
            create: {
              content: Buffer.from(update),
              postId,
            },
          });
        },
      },
    });
  }
}
