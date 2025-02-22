"use client";
import { Input } from "./input";
import Swal from "sweetalert2";
import { login } from "../_lib/action";
import { useRouter } from "next/navigation";
import SubmitButton from "./SubmitButton";
import { useSearchParams } from "next/navigation";

export default function Login() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const user = searchParams.get("user") || "";

  const handleSubmit = async (formData) => {
    const res = await login(formData);

    if (!res.success) {
      Swal.fire({
        title: "Login Error!",
        text: res.message,
        icon: "error",
      });
      return;
    }

    return router.refresh();
  };

  return (
    <>
      <p className="text-sm text-center mb-10">
        Login with your hosting account:{" "}
        <span className="text-primary font-semibold">{user}</span> to access
        your MongoDB databases.
      </p>
      <form action={handleSubmit} className="space-y-3">
        <div>
          <label
            htmlFor="username"
            className="block text-sm/6 font-medium text-red-500"
          >
            Hosting Username
          </label>
          <div className="mt-1">
            <Input type="text" name="username" defaultValue={user} required />
          </div>
        </div>
        <div>
          <label
            htmlFor="password"
            className="block text-sm/6 font-medium text-red-500"
          >
            Hosting Password
          </label>
          <div className="mt-1">
            <Input
              type="password"
              name="password"
              defaultValue=""
              required
            />
          </div>
        </div>

        <div>
          <SubmitButton>Continue</SubmitButton>
        </div>
      </form>
    </>
  );
}
