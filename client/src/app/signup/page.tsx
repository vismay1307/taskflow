"use client";

import {
  FormEvent,
  useEffect,
  useState,
} from "react";

import { useRouter } from "next/navigation";

import {
  signupUser,
  clearAuthError,
  clearSignupMessage,
} from "@/store/slices/authSlice";

import {
  useAppDispatch,
  useAppSelector,
} from "@/store/hooks";

export default function SignupPage() {
  const router = useRouter();

  const dispatch = useAppDispatch();

  const {
    loading,
    error,
    signupMessage,
  } = useAppSelector(
    (state) => state.auth
  );

  const [firstName, setFirstName] =
    useState("");

  const [lastName, setLastName] =
    useState("");

  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [
    confirmPassword,
    setConfirmPassword,
  ] = useState("");

  useEffect(() => {
    return () => {
      dispatch(clearAuthError());
      dispatch(clearSignupMessage());
    };
  }, [dispatch]);

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    const result = await dispatch(
      signupUser({
        firstName,
        lastName,
        email,
        password,
        confirmPassword,
      })
    );

    if (
      signupUser.fulfilled.match(result)
    ) {
      router.push("/login");
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-md">
        <h1 className="text-3xl font-bold">
          Create Account
        </h1>

        <p className="mt-2 text-gray-600">
          Create your TaskFlow account
        </p>

        {error && (
          <div className="mt-6 rounded-lg bg-red-100 p-3 text-red-700">
            {error}
          </div>
        )}

        {signupMessage && (
          <div className="mt-6 rounded-lg bg-green-100 p-3 text-green-700">
            {signupMessage}
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className="mt-8 space-y-5"
        >
          <div>
            <label className="mb-2 block font-medium">
              First Name
            </label>

            <input
              type="text"
              value={firstName}
              onChange={(e) =>
                setFirstName(e.target.value)
              }
              required
              className="w-full rounded-lg border px-4 py-3"
            />
          </div>

          <div>
            <label className="mb-2 block font-medium">
              Last Name
            </label>

            <input
              type="text"
              value={lastName}
              onChange={(e) =>
                setLastName(e.target.value)
              }
              className="w-full rounded-lg border px-4 py-3"
            />
          </div>

          <div>
            <label className="mb-2 block font-medium">
              Email
            </label>

            <input
              type="email"
              value={email}
              onChange={(e) =>
                setEmail(e.target.value)
              }
              required
              className="w-full rounded-lg border px-4 py-3"
            />
          </div>

          <div>
            <label className="mb-2 block font-medium">
              Password
            </label>

            <input
              type="password"
              value={password}
              onChange={(e) =>
                setPassword(e.target.value)
              }
              required
              minLength={6}
              className="w-full rounded-lg border px-4 py-3"
            />
          </div>

          <div>
            <label className="mb-2 block font-medium">
              Confirm Password
            </label>

            <input
              type="password"
              value={confirmPassword}
              onChange={(e) =>
                setConfirmPassword(
                  e.target.value
                )
              }
              required
              minLength={6}
              className="w-full rounded-lg border px-4 py-3"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-black px-4 py-3 text-white disabled:opacity-50"
          >
            {loading
              ? "Creating account..."
              : "Create Account"}
          </button>
        </form>
      </div>
    </main>
  );
}