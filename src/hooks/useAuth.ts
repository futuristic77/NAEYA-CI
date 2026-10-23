import { trpc } from "@/lib/trpc";
import { isUnauthorizedError } from "@/lib/auth-error";
import { useCallback, useEffect, useMemo } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router";
import { LOGIN_PATH } from "@/const";

type UseAuthOptions = {
  redirectOnUnauthenticated?: boolean;
  redirectPath?: string;
};

export function useAuth(options?: UseAuthOptions) {
  const { redirectOnUnauthenticated = false, redirectPath = LOGIN_PATH } =
    options ?? {};

  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const {
    data: user,
    isLoading,
    error,
    refetch,
  } = trpc.auth.me.useQuery(undefined, {
    staleTime: 0,
    retry: false,
  });

  const clearPrivateState = useCallback(() => {
    queryClient.removeQueries();
  }, [queryClient]);

  const logoutMutation = trpc.auth.logout.useMutation({
    onSuccess: () => {
      clearPrivateState();
      navigate(redirectPath, { replace: true });
    },
  });

  const logout = useCallback(() => {
    if (logoutMutation.isPending) return;
    logoutMutation.mutate();
  }, [logoutMutation]);

  useEffect(() => {
    const onPageShow = (event: PageTransitionEvent) => {
      if (event.persisted) void refetch();
    };
    window.addEventListener("pageshow", onPageShow);
    return () => window.removeEventListener("pageshow", onPageShow);
  }, [refetch]);

  const currentUser = isUnauthorizedError(error) ? null : user ?? null;

  useEffect(() => {
    if (redirectOnUnauthenticated && !isLoading && !currentUser) {
      const currentPath = window.location.pathname;
      if (currentPath !== redirectPath) {
        navigate(redirectPath, { replace: true });
      }
    }
  }, [redirectOnUnauthenticated, isLoading, currentUser, navigate, redirectPath]);

  return useMemo(
    () => ({
      user: currentUser,
      isAuthenticated: !!currentUser,
      isLoading: isLoading || logoutMutation.isPending,
      isLoggingOut: logoutMutation.isPending,
      error,
      logout,
      refresh: refetch,
    }),
    [
      currentUser,
      isLoading,
      logoutMutation.isPending,
      error,
      logout,
      refetch,
    ],
  );
}
