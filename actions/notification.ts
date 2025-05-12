"use server";

import webpush from "web-push";
import { z } from "zod";

import env from "@/env";
import { db } from "@/lib/db";

webpush.setVapidDetails(
  `mailto:${env.EMAIL_FROM}`,
  env.NEXT_PUBLIC_VAPID_PUBLIC_KEY,
  env.VAPID_PRIVATE_KEY
);

const keysSchema = z.object({
  p256dh: z.string(),
  auth: z.string(),
});

export const sendNotification = async (payload: string | Buffer) => {
  const subscriptions = await db.subscription.findMany();
  await Promise.all(
    subscriptions.map(async (subscription) => {
      try {
        return await webpush.sendNotification(
          {
            endpoint: subscription.endpoint,
            keys: keysSchema.parse(subscription.keys),
          },
          payload
        );
      } catch (error) {
        if (error instanceof webpush.WebPushError) {
          if (error.statusCode === 410 || error.statusCode === 404) {
            return db.subscription.delete({
              where: { endpoint: subscription.endpoint },
            });
          }
        }
      }
    })
  );
};
