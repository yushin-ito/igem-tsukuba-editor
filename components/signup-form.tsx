"use client";

import { useSearchParams } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useTransition } from "react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { signupSchema } from "@/schemas/auth";
import Icons from "@/components/icons";
import { signInWithEmail, signInWithProvider } from "@/actions/auth";

type FormData = z.infer<typeof signupSchema>;

const SignupForm = () => {
  const t = useTranslations("auth");
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(signupSchema),
  });
  const [isPendingSignInWithEmail, startTransitionSignInWithEmail] =
    useTransition();
  const [isPendingSignInWithGoogle, startTransitionSignInWithGoogle] =
    useTransition();
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get("from") || "/";

  const onSubmit = (data: FormData) => {
    startTransitionSignInWithEmail(async () => {
      await signInWithEmail(data.email, redirectUrl);

      toast.success(t("signup.success.title"), {
        description: t("signup.success.description"),
      });
    });
  };

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="space-y-6">
          <div className="space-y-1">
            <Label className="sr-only" htmlFor="email">
              {t("email")}
            </Label>
            <div className="spacd-y-2">
              <Input
                id="email"
                placeholder="name@example.com"
                type="email"
                autoCapitalize="none"
                autoComplete="email"
                autoCorrect="off"
                disabled={isPendingSignInWithEmail}
                {...register("email")}
              />
              {errors.email && (
                <p className="text-error px-1 text-xs">
                  {t(errors.email.message as "invalid_email")}
                </p>
              )}
            </div>
          </div>
          <Button className="w-full" disabled={isPendingSignInWithEmail}>
            {isPendingSignInWithEmail ? (
              <Icons.spinner className="size-4 animate-spin" />
            ) : (
              t("signup.submit")
            )}
          </Button>
        </div>
      </form>
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">
            {t("or")}
          </span>
        </div>
      </div>
      <Button
        variant="outline"
        className="relative w-full"
        onClick={() => {
          startTransitionSignInWithGoogle(async () => {
            await signInWithProvider("google", redirectUrl);
          });
        }}
        disabled={isPendingSignInWithGoogle}
      >
        {isPendingSignInWithGoogle ? (
          <Icons.spinner className="size-4 animate-spin" />
        ) : (
          <>
            <Icons.google className="mr-0.5 size-4" />
            {t.rich("signup.signup_with_provider", {
              provider: "Google",
            })}
          </>
        )}
      </Button>
    </div>
  );
};

export default SignupForm;
