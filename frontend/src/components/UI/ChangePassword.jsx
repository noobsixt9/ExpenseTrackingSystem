import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Button } from "./button";
import { BiLoader } from "react-icons/bi";
import Input from "./input";
import api from "../../libs/apiCall";

export const ChagePasword = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues,
  } = useForm();

  const [loading, setLoading] = useState(false);

  const submitPasswordHandler = async (data) => {
    try {
      setLoading(true);

      const { data: res } = await api.put(`/user/change-password`, data);
      if (res?.status === "Success") {
        toast.success(res?.message);
      }
    } catch (error) {
      console.log("Something went wrong: ", error.message);
      toast.error(error?.response?.data?.message || error.message);
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="py-20">
      <form onSubmit={handleSubmit(submitPasswordHandler)}>
        <div className="space-y-6">
          <p className="text-xl font-bold text-black dark:text-white mb-1">
            Change Password
          </p>
          <span className="labelStyles">
            This will be used to log into your account and complete severity
            actions.
          </span>
          <div className="mt-6">
            <Input
              disabled={loading}
              id="currentPassword"
              label="Current Password"
              type="password"
              error={
                errors.currentPassword ? errors.currentPassword?.message : ""
              }
              {...register("currentPassword", {
                required: "Current password is required.",
              })}
              className="inputStyle"
            />
          </div>
          <div className="mt-6">
            <Input
              disabled={loading}
              id="newPassword"
              label="New Password"
              type="password"
              error={errors.newPassword ? errors.newPassword?.message : ""}
              {...register("newPassword", {
                required: "New password.",
              })}
              className="inputStyle"
            />
          </div>

          <div className="mt-6">
            <Input
              disabled={loading}
              id="confirmPassword"
              label="Confirm New Password"
              className="inputStyle"
              type="password"
              error={
                errors.confirmPassword ? errors.confirmPassword?.message : ""
              }
              {...register("confirmPassword", {
                required: "Confirm password.",
                validate: (val) => {
                  const { newPassword } = getValues();
                  return newPassword === val || "Passwords don't match  ";
                },
              })}
            />
          </div>
          <div className="flex items-center gap-6 justify-end pb-10 border-b-2 border-gray-200 dark:border-gray-800">
            <Button
              variant="outline"
              loading={loading}
              type="reset"
              className="px-6 bg-transparent dark:text-black border-gray-200 dark:border-gray-700 cursor-pointer"
            >
              Reset
            </Button>
            <Button
              type="submit"
              className="px-8 bg-violet-800 text-white cursor-pointer"
              disabled={loading}
            >
              {loading ? (
                <BiLoader className="animate-spin text-white" />
              ) : (
                "Save"
              )}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
};
