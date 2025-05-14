"use client";

import type React from "react";
import { useTranslations } from "next-intl";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import { useEffect, useState, useTransition } from "react";
import { z } from "zod";
import { User } from "@prisma/client";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Label } from "@/components/ui/label";
import { profileSchema } from "@/schemas/settings";
import Icons from "@/components/icons";
import { cn } from "@/lib/utils";
import { signOut } from "@/actions/auth";
import { ScrollArea, ScrollBar } from "./ui/scroll-area";

type FormData = z.infer<typeof profileSchema>;

interface ProfileFormProps {
  user: Pick<User, "id" | "image" | "name" | "color">;
}

const ProfileForm = ({ user }: ProfileFormProps) => {
  const t = useTranslations("settings.profile");
  const router = useRouter();
  const {
    register,
    control,
    reset,
    handleSubmit,
    formState: { errors, isDirty },
  } = useForm<FormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: user.name ?? undefined,
      color: user.color ?? undefined,
      image: undefined,
    },
  });
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  const colors = ["red", "rose", "orange", "green", "blue", "yellow", "violet"];

  const onDelete = async () => {
    const response = await fetch(`/api/user/${user.id}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      toast.error(t("error.delete.title"), {
        description: t("error.delete.description"),
      });

      return;
    }

    toast.success(t("success.delete.title"), {
      description: t("success.delete.description"),
    });

    signOut();

    router.refresh();
  };

  const onSubmit = (data: FormData) => {
    startTransition(async () => {
      if (data.image) {
        const formData = new FormData();
        formData.append("bucket", "images");
        formData.append("file", data.image);

        const response = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });

        if (!response.ok) {
          toast.error(t("error.upload.title"), {
            description: t("error.upload.description"),
          });

          return;
        }

        const blob = await response.json();
        data.image = blob.url;
      }

      const response = await fetch(`/api/user/${user.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: data.name,
          color: data.color,
          image: data.image,
        }),
      });

      if (!response.ok) {
        toast.error(t("error.save.title"), {
          description: t("error.save.description"),
        });

        return;
      }

      toast.success(t("success.save.title"), {
        description: t("success.save.description"),
      });

      reset(data);
      router.refresh();
    });
  };

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
        <div className="max-w-4xl space-y-8">
          <div className="space-y-4">
            <Label className="text-lg font-medium">{t("avatar")}</Label>
            <div className="flex flex-col space-y-4">
              <div className="flex items-end space-x-6">
                <div className="relative">
                  <Controller
                    name="image"
                    control={control}
                    render={({ field }) => (
                      <>
                        <Label
                          htmlFor="image"
                          className="cursor-pointer hover:opacity-90"
                        >
                          <Avatar key={user.id} className="size-20">
                            {user.image ? (
                              <Image
                                src={user.image}
                                alt={user.name ?? t("unknown_user")}
                                width={80}
                                height={80}
                                className="bg-muted"
                              />
                            ) : (
                              <AvatarFallback
                                className={cn(
                                  "text-primary-foreground",
                                  `bg-${user.color}-600`
                                )}
                              >
                                {(user.name ?? t("unknown_user"))
                                  .charAt(0)
                                  .toUpperCase()}
                              </AvatarFallback>
                            )}
                          </Avatar>
                          <div className="absolute -bottom-px -right-px flex size-8 cursor-pointer items-center justify-center rounded-full bg-primary shadow">
                            <Icons.camera className="size-4 text-primary-foreground" />
                            <span className="sr-only">
                              {t("avatar_placeholder")}
                            </span>
                          </div>
                        </Label>
                        <Input
                          id="image"
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              field.onChange(file);
                            }
                          }}
                        />
                      </>
                    )}
                  />
                </div>
                <div className="text-sm text-muted-foreground">
                  {t("file_format")}
                  <br />
                  {t("file_size")}
                </div>
              </div>
              {errors.image && (
                <span className="px-1 text-xs text-destructive">
                  {/* eslint-disable-next-line @typescript-eslint/ban-ts-comment */}
                  {/* @ts-expect-error */}
                  {t(errors.image.message)}
                </span>
              )}
            </div>
          </div>
          <hr className="w-full" />
          <div className="space-y-4">
            <Label className="text-lg font-medium">{t("name")}</Label>
            <div className="max-w-sm space-y-2">
              <Input
                id="name"
                placeholder={t("name_placeholder")}
                {...register("name")}
              />
              {errors.name && (
                <span className="px-1 text-xs text-destructive">
                  {/* eslint-disable-next-line @typescript-eslint/ban-ts-comment */}
                  {/* @ts-expect-error */}
                  {t(errors.name.message)}
                </span>
              )}
            </div>
          </div>
          <hr className="w-full" />
          <div className="space-y-4">
            <Label className="text-lg font-medium">{t("theme_color")}</Label>
            <Controller
              name="color"
              control={control}
              render={({ field }) => (
                <div className="max-w-sm space-y-2">
                  <ScrollArea className="w-full">
                    <div className="flex space-x-4">
                      {colors.map((color, index) => (
                        <Button
                          key={index}
                          type="button"
                          className={cn(
                            "relative size-10 rounded-full [&_svg]:size-5",
                            `bg-${color}-600 hover:bg-${color}-600/90`
                          )}
                          onClick={() => field.onChange(color)}
                        >
                          {field.value === color && (
                            <Icons.check className="absolute inset-0 m-auto text-primary-foreground" />
                          )}
                        </Button>
                      ))}
                    </div>
                    <ScrollBar orientation="horizontal" className="hidden" />
                  </ScrollArea>
                  <div className="flex items-center space-x-1">
                    <span className="text-muted-foreground">
                      {t("selected_color")}:
                    </span>
                    <span className={`text-${field.value}-600`}>
                      {/* eslint-disable-next-line @typescript-eslint/ban-ts-comment */}
                      {/* @ts-expect-error */}
                      {t(`colors.${field.value}`)}
                    </span>
                  </div>
                </div>
              )}
            />
          </div>
          <hr className="w-full" />
          <div className="flex flex-col space-y-6">
            <Label className="text-lg font-medium">{t("danger_zone")}</Label>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" className="w-40">
                  {t("delete_account")}
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>
                    {t("dialog.unsaved.title")}
                  </AlertDialogTitle>
                  <AlertDialogDescription>
                    {t("dialog.unsaved.description")}
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>{t("cancel")}</AlertDialogCancel>
                  <AlertDialogAction onClick={onDelete}>
                    {t("continue")}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
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
            <AlertDialogTitle>{t("dialog.unsaved.title")}</AlertDialogTitle>
            <AlertDialogDescription>
              {t("dialog.unsaved.description")}
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

export default ProfileForm;
