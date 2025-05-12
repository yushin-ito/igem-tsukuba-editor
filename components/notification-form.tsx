"use client";

import { useTranslations } from "next-intl";
import { Notification } from "@prisma/client";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useEffect, useState, useTransition } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import Link from "next/link";

import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import Icons from "@/components/icons";
import { notificationSchema } from "@/schemas/settings";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "./ui/alert-dialog";
import { Button, buttonVariants } from "./ui/button";
import useNotification from "@/hooks/use-notification";
import { Alert, AlertDescription, AlertTitle } from "./ui/alert";

interface NotificationFormProps {
  notification: Pick<
    Notification,
    "id" | "created" | "updated" | "deleted"
  > | null;
  subscribed: boolean;
}

type FormData = z.infer<typeof notificationSchema>;

const NotificationForm = ({ notification }: NotificationFormProps) => {
  const t = useTranslations("settings.notification");
  const router = useRouter();
  const {
    control,
    reset,
    watch,
    handleSubmit,
    setValue,
    formState: { isDirty },
  } = useForm<FormData>({
    resolver: zodResolver(notificationSchema),
    defaultValues: {
      all:
        notification?.created && notification.updated && notification.deleted,
      created: notification?.created,
      updated: notification?.updated,
      deleted: notification?.deleted,
    },
  });
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  const { permission, supported, subscribe, unsubscribe } = useNotification();

  const onSubmit = (data: FormData) => {
    startTransition(async () => {
      if (data.created || data.updated || data.deleted) {
        subscribe();
      }

      if (!data.created && !data.updated && !data.deleted) {
        unsubscribe();
      }

      const response = await fetch("/api/notification", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          created: data.created,
          updated: data.updated,
          deleted: data.deleted,
        }),
      });

      if (!response.ok) {
        toast.error(t("error.title"), {
          description: t("error.description"),
        });

        return;
      }

      toast.success(t("success.title"), {
        description: t("success.description"),
      });

      reset(data);
      router.refresh();
    });
  };

  const values = watch(["created", "updated", "deleted"]);

  useEffect(() => {
    setValue("all", values[0] && values[1] && values[2]);
  }, [values, setValue]);

  useEffect(() => {
    window.history.pushState(null, "", window.location.pathname);

    const onPopState = () => {
      if (isDirty) {
        setOpen(true);
      }
    };

    const onBeforeUnload = (e: BeforeUnloadEvent) => {
      if (isDirty) {
        e.preventDefault();
      }
    };

    window.addEventListener("popstate", onPopState);
    window.addEventListener("beforeunload", onBeforeUnload);

    return () => {
      window.removeEventListener("popstate", onPopState);
      window.removeEventListener("beforeunload", onBeforeUnload);
    };
  }, [isDirty]);

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="max-w-4xl space-y-16">
          {!supported && (
            <Alert variant="destructive">
              <Icons.alertCircle className="size-4" />
              <AlertTitle>{t("alert.unsupported.title")}</AlertTitle>
              <AlertDescription>
                {t("alert.unsupported.description")}
              </AlertDescription>
            </Alert>
          )}

          {permission === "denied" && (
            <Alert>
              <Icons.alert className="size-4" />
              <AlertTitle>{t("alert.denied.title")}</AlertTitle>
              <AlertDescription>
                {t("alert.denied.description")}
              </AlertDescription>
            </Alert>
          )}
          <div className="space-y-6">
            <Controller
              name="all"
              control={control}
              render={({ field }) => (
                <div className="flex items-center justify-between py-2">
                  <div className="flex items-center space-x-3">
                    {field.value ? (
                      <Icons.bell className="size-5 text-muted-foreground" />
                    ) : (
                      <Icons.bellOff className="size-5 text-muted-foreground" />
                    )}
                    <Label htmlFor="all" className="font-medium">
                      {t("all")}
                    </Label>
                  </div>
                  <Switch
                    id="all"
                    checked={field.value}
                    onCheckedChange={(checked) => {
                      field.onChange(checked);
                      setValue("created", checked, {
                        shouldDirty: true,
                      });
                      setValue("updated", checked, {
                        shouldDirty: true,
                      });
                      setValue("deleted", checked, {
                        shouldDirty: true,
                      });
                    }}
                    disabled={!supported || permission === "denied"}
                  />
                </div>
              )}
            />
            <hr className="w-full" />
            <div className="space-y-8">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Icons.create className="size-5 text-muted-foreground" />
                  <div className="space-y-1">
                    <Label htmlFor="created" className="font-medium">
                      {t("created.title")}
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      {t("created.description")}
                    </p>
                  </div>
                </div>
                <Controller
                  name="created"
                  control={control}
                  render={({ field }) => (
                    <Switch
                      id="created"
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      disabled={!supported || permission === "denied"}
                    />
                  )}
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Icons.update className="size-5 text-muted-foreground" />
                  <div className="space-y-1">
                    <Label htmlFor="updated" className="font-medium">
                      {t("updated.title")}
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      {t("updated.description")}
                    </p>
                  </div>
                </div>
                <Controller
                  name="updated"
                  control={control}
                  render={({ field }) => (
                    <Switch
                      id="updated"
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      disabled={!supported || permission === "denied"}
                    />
                  )}
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Icons.delete className="size-5 text-muted-foreground" />
                  <div className="space-y-1">
                    <Label htmlFor="deleted" className="font-medium">
                      {t("deleted.title")}
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      {t("deleted.description")}
                    </p>
                  </div>
                </div>
                <Controller
                  name="deleted"
                  control={control}
                  render={({ field }) => (
                    <Switch
                      id="deleted"
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      disabled={!supported || permission === "denied"}
                    />
                  )}
                />
              </div>
            </div>
          </div>
          <div className="flex w-full justify-end space-x-3">
            <Link
              href="/dashboard"
              className={buttonVariants({ variant: "outline" })}
              onNavigate={(e) => {
                if (isDirty) {
                  e.preventDefault();
                  setOpen(true);
                }
              }}
            >
              {t("back")}
            </Link>
            <Button type="submit" disabled={!isDirty || isPending}>
              {isPending ? (
                <Icons.spinner className="size-4 animate-spin" />
              ) : (
                t("save")
              )}
            </Button>
          </div>
        </div>
      </form>
      <AlertDialog open={open} onOpenChange={setOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t("dialog.title")}</AlertDialogTitle>
            <AlertDialogDescription>
              {t("dialog.description")}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              onClick={() =>
                window.history.pushState(null, "", window.location.pathname)
              }
            >
              {t("cancel")}
            </AlertDialogCancel>
            <AlertDialogAction onClick={() => router.push("/dashboard")}>
              {t("continue")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default NotificationForm;
