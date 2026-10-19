import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";
import { subscribeToAuthChanges } from "../services/authService";
import { userService } from "../services/userService";

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchProfile = useCallback(async (currentUser) => {
    if (!currentUser) {
      setProfile(null);
      return;
    }
    try {
      const p = await userService.syncProfile({
        display_name: currentUser.displayName || "",
        photo_url: currentUser.photoURL || "",
      });
      setProfile(p);
    } catch {
      // Fallback local profile if backend is warming up
      setProfile({
        uid: currentUser.uid,
        email: currentUser.email,
        display_name: currentUser.displayName || currentUser.email?.split("@")[0] || "User",
        photo_url: currentUser.photoURL || "",
        city: "",
        age: "",
        bio: "",
      });
    }
  }, []);

  useEffect(() => {
    const unsubscribe = subscribeToAuthChanges(async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        await fetchProfile(currentUser);
      } else {
        setProfile(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, [fetchProfile]);

  const refreshProfile = useCallback(async () => {
    if (!user) return;
    try {
      const p = await userService.getProfile();
      setProfile(p);
    } catch {
      // fallback
    }
  }, [user]);

  return (
    <AuthContext.Provider value={{ user, profile, setProfile, loading, refreshProfile }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}