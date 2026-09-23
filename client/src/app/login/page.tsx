"use client";

import {
  FormEvent,
  useEffect,
  useState,
} from "react";

import { useRouter } from "next/navigation";

import {
  loginUser,
  clearAuthError,
} from "@/store/slices/authSlice";

import {
  useAppDispatch,
  useAppSelector,
} from "@/store/hooks";

export default function LoginPage() {
  const router = useRouter();

  const dispatch = useAppDispatch();

  const {
    loading,
    error,
    user,
  } = useAppSelector(
    (state) => state.auth
  );

  const [email, setEmail] = useState("");
  const [password, setPassword] =
    useState("");

  useEffect(() => {
    if (user) {
      router.push("/");
    }

    return () => {
      dispatch(clearAuthError());
    };
  }, [user, router, dispatch]);

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    await dispatch(
      loginUser({
        email,
        password,
      })
    );
  };

  return (
    <main className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <h1 className="text-3xl font-bold">
          Login
        </h1>

        <p className="mt-2 text-gray-600">
          Login to your TaskFlow account
        </p>

        {error && (
          <div className="mt-6 rounded-lg bg-red-100 p-3 text-red-700">
            {error}
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className="mt-8 space-y-5"
        >
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
              placeholder="you@example.com"
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
              placeholder="••••••••"
              required
              className="w-full rounded-lg border px-4 py-3"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-black px-4 py-3 text-white disabled:opacity-50"
          >
            {loading
              ? "Logging in..."
              : "Login"}
          </button>
        </form>
      </div>
    </main>
  );
}