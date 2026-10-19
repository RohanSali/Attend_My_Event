import { useState, useRef, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { logoutUser } from "../services/authService";
import { userService } from "../services/userService";

export default function Navbar({ onOpenHostModal, onNavigateSection }) {
  const { user, profile, setProfile } = useAuth();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const [form, setForm] = useState({
    display_name: "",
    city: "",
    age: "",
    bio: "",
  });

  const popupRef = useRef(null);

  // Sync profile data to form
  useEffect(() => {
    if (profile) {
      setForm({
        display_name: profile.display_name || user?.displayName || "",
        city: profile.city || "",
        age: profile.age !== null && profile.age !== undefined ? String(profile.age) : "",
        bio: profile.bio || "",
      });
    } else if (user) {
      setForm({
        display_name: user.displayName || user.email?.split("@")[0] || "",
        city: "",
        age: "",
        bio: "",
      });
    }
  }, [profile, user]);

  // Click outside listener for profile popup
  useEffect(() => {
    function handleClickOutside(e) {
      if (popupRef.current && !popupRef.current.contains(e.target)) {
        setIsProfileOpen(false);
        setIsEditing(false);
      }
    }
    if (isProfileOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isProfileOpen]);

  async function handleSaveProfile(e) {
    e.preventDefault();
    setSaving(true);
    setErrorMsg("");
    setSaveSuccess(false);

    try {
      const updates = {
        display_name: form.display_name.trim(),
        city: form.city.trim(),
        age: form.age ? parseInt(form.age, 10) : null,
        bio: form.bio.trim(),
      };
      const updated = await userService.updateProfile(updates);
      setProfile((prev) => ({ ...prev, ...updated }));
      setIsEditing(false);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err) {
      setErrorMsg(err.message || "Failed to update profile.");
    } finally {
      setSaving(false);
    }
  }

  async function handleLogout() {
    setIsProfileOpen(false);
    await logoutUser();
  }

  const initials = (profile?.display_name || user?.displayName || user?.email || "U")
    .charAt(0)
    .toUpperCase();

  return (
    <header className="relative flex h-[78px] items-center border-b border-[#dce3ea] bg-white px-4 sm:px-6 z-30">
      {/* Brand logo & title - exact as specified */}
      <a
        className="inline-flex items-center gap-[9px] text-[17px] font-extrabold tracking-[-0.7px] text-[#17324d] max-[420px]:gap-1.5 max-[420px]:text-sm"
        href="#"
        aria-label="AttendMyEvent home"
      >
        <span
          className="grid size-[30px] shrink-0 place-items-center rounded-[10px_10px_10px_3px] bg-[#2f6f96] text-[21px] font-bold tracking-[-2px] text-white max-[420px]:size-[26px] max-[420px]:text-lg"
          aria-hidden="true"
        >
          a
        </span>
        <span>
          attend<span className="font-medium text-[#2f6f96]">my</span>event
        </span>
      </a>

      {/* Navigations */}
      <nav
        className="ml-[40px] md:ml-[60px] flex items-center gap-6 text-[13px] font-medium text-[#556575] max-[680px]:gap-4 max-[420px]:gap-2 max-[420px]:text-xs"
        aria-label="Main navigation"
      >
        {user ? (
          <>
            <button
              type="button"
              onClick={() => onNavigateSection?.("explore")}
              className="py-2.5 text-[#17324d] font-semibold border-b-2 border-[#f4a340] hover:text-[#2f6f96] transition-colors"
            >
              Explore Events
            </button>
            <button
              type="button"
              onClick={onOpenHostModal}
              className="py-2.5 text-[#556575] hover:text-[#17324d] transition-colors hidden sm:inline-block"
            >
              Host an event
            </button>
          </>
        ) : (
          <>
            <a
              href="#about"
              className="py-2.5 text-[#556575] hover:text-[#17324d] transition-colors"
            >
              About
            </a>
            <a
              href="#features"
              className="py-2.5 text-[#556575] hover:text-[#17324d] transition-colors hidden sm:inline-block"
            >
              Features
            </a>
          </>
        )}
      </nav>

      {/* Action buttons & Profile on the right */}
      <div className="ml-auto flex items-center gap-3">
        {user ? (
          <>
            <button
              type="button"
              onClick={onOpenHostModal}
              className="inline-flex items-center gap-1.5 rounded-lg border border-[#d2e0e9] bg-white px-3.5 py-2 text-[13px] font-semibold text-[#17324d] shadow-sm transition-colors hover:border-[#a9c6d7] hover:bg-[#f3f8fb] max-[680px]:px-2.5 max-[680px]:py-1.5 max-[680px]:text-xs"
            >
              <span className="text-[#2f6f96] font-bold text-base leading-none">+</span>
              <span>Host Event</span>
            </button>

            {/* Profile trigger */}
            <div className="relative" ref={popupRef}>
              <button
                type="button"
                onClick={() => setIsProfileOpen((prev) => !prev)}
                className="flex size-10 items-center justify-center rounded-full border-2 border-[#dce3ea] bg-[#2f6f96] text-sm font-bold text-white shadow-sm transition-all hover:scale-105 hover:border-[#2f6f96] focus:outline-none focus:ring-2 focus:ring-[#2f6f96]/30"
                aria-label="User profile menu"
                aria-expanded={isProfileOpen}
              >
                {user.photoURL ? (
                  <img
                    src={user.photoURL}
                    alt=""
                    className="size-full rounded-full object-cover"
                  />
                ) : (
                  <span>{initials}</span>
                )}
              </button>

              {/* Profile Popup Window - Right there in navbar */}
              {isProfileOpen && (
                <div
                  className="absolute right-0 top-12 z-50 w-84 sm:w-96 rounded-2xl border border-[#dce3ea] bg-white p-5 shadow-2xl animate-in fade-in zoom-in-95 duration-150"
                  role="dialog"
                  aria-label="Profile popup"
                >
                  {/* Header */}
                  <div className="flex items-center justify-between border-b border-[#eef2f6] pb-3 mb-4">
                    <div className="flex items-center gap-3">
                      <div className="flex size-11 items-center justify-center rounded-full bg-[#2f6f96] text-white font-bold text-lg">
                        {user.photoURL ? (
                          <img
                            src={user.photoURL}
                            alt=""
                            className="size-full rounded-full object-cover"
                          />
                        ) : (
                          <span>{initials}</span>
                        )}
                      </div>
                      <div className="min-w-0">
                        <p className="font-semibold text-sm text-[#17324d] truncate">
                          {profile?.display_name || user.displayName || "User"}
                        </p>
                        <p className="text-xs text-[#657384] truncate">{user.email}</p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setIsProfileOpen(false)}
                      className="text-slate-400 hover:text-slate-600 text-lg leading-none p-1"
                      aria-label="Close"
                    >
                      ✕
                    </button>
                  </div>

                  {saveSuccess && (
                    <div className="mb-3 rounded-lg bg-emerald-50 border border-emerald-200 px-3 py-2 text-xs font-medium text-emerald-700">
                      Profile updated successfully!
                    </div>
                  )}

                  {errorMsg && (
                    <div className="mb-3 rounded-lg bg-rose-50 border border-rose-200 px-3 py-2 text-xs text-rose-700">
                      {errorMsg}
                    </div>
                  )}

                  {/* Profile Details CRUD */}
                  {!isEditing ? (
                    <div className="space-y-2.5 text-xs">
                      <div className="flex justify-between items-center py-1.5 border-b border-slate-100">
                        <span className="text-[#657384] font-medium">Display Name</span>
                        <span className="text-[#17324d] font-semibold">
                          {profile?.display_name || user.displayName || "Not set"}
                        </span>
                      </div>
                      <div className="flex justify-between items-center py-1.5 border-b border-slate-100">
                        <span className="text-[#657384] font-medium">City / Location</span>
                        <span className="text-[#17324d] font-semibold">
                          {profile?.city || "Not set"}
                        </span>
                      </div>
                      <div className="flex justify-between items-center py-1.5 border-b border-slate-100">
                        <span className="text-[#657384] font-medium">Age</span>
                        <span className="text-[#17324d] font-semibold">
                          {profile?.age ? `${profile.age} yrs` : "Not set"}
                        </span>
                      </div>
                      <div className="py-1.5 border-b border-slate-100">
                        <span className="text-[#657384] font-medium block mb-1">Bio</span>
                        <p className="text-[#17324d] text-xs leading-relaxed bg-[#f6f8fb] p-2 rounded-lg">
                          {profile?.bio || "No bio added yet."}
                        </p>
                      </div>

                      <div className="pt-2 flex gap-2">
                        <button
                          type="button"
                          onClick={() => setIsEditing(true)}
                          className="flex-1 rounded-lg border border-[#2f6f96] py-2 text-center text-xs font-semibold text-[#2f6f96] hover:bg-[#e8f2f8] transition-colors"
                        >
                          Edit Profile
                        </button>
                        <button
                          type="button"
                          onClick={handleLogout}
                          className="rounded-lg border border-rose-200 bg-rose-50 px-4 py-2 text-center text-xs font-semibold text-rose-700 hover:bg-rose-100 transition-colors"
                        >
                          Sign out
                        </button>
                      </div>
                    </div>
                  ) : (
                    /* Edit Profile Form */
                    <form onSubmit={handleSaveProfile} className="space-y-3">
                      <div>
                        <label className="block text-[11px] font-semibold text-[#3e5368] mb-1">
                          Name
                        </label>
                        <input
                          type="text"
                          className="w-full h-8 px-2.5 text-xs rounded-lg border border-[#dce3ea] bg-[#f6f8fb] text-[#17324d] focus:outline-none focus:ring-1 focus:ring-[#2f6f96]"
                          value={form.display_name}
                          onChange={(e) =>
                            setForm((f) => ({ ...f, display_name: e.target.value }))
                          }
                          required
                          maxLength={80}
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="block text-[11px] font-semibold text-[#3e5368] mb-1">
                            City
                          </label>
                          <input
                            type="text"
                            placeholder="e.g. Pune, Mumbai"
                            className="w-full h-8 px-2.5 text-xs rounded-lg border border-[#dce3ea] bg-[#f6f8fb] text-[#17324d] focus:outline-none focus:ring-1 focus:ring-[#2f6f96]"
                            value={form.city}
                            onChange={(e) =>
                              setForm((f) => ({ ...f, city: e.target.value }))
                            }
                            maxLength={100}
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] font-semibold text-[#3e5368] mb-1">
                            Age
                          </label>
                          <input
                            type="number"
                            min="1"
                            max="120"
                            placeholder="e.g. 24"
                            className="w-full h-8 px-2.5 text-xs rounded-lg border border-[#dce3ea] bg-[#f6f8fb] text-[#17324d] focus:outline-none focus:ring-1 focus:ring-[#2f6f96]"
                            value={form.age}
                            onChange={(e) =>
                              setForm((f) => ({ ...f, age: e.target.value }))
                            }
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-[11px] font-semibold text-[#3e5368] mb-1">
                          Short Bio
                        </label>
                        <textarea
                          rows={2}
                          placeholder="Tell people a little about yourself"
                          className="w-full p-2 text-xs rounded-lg border border-[#dce3ea] bg-[#f6f8fb] text-[#17324d] focus:outline-none focus:ring-1 focus:ring-[#2f6f96] resize-none"
                          value={form.bio}
                          onChange={(e) =>
                            setForm((f) => ({ ...f, bio: e.target.value }))
                          }
                          maxLength={300}
                        />
                      </div>
                      <div className="flex gap-2 pt-1">
                        <button
                          type="button"
                          onClick={() => {
                            setIsEditing(false);
                            setErrorMsg("");
                          }}
                          className="flex-1 rounded-lg border border-slate-200 py-1.5 text-xs font-semibold text-[#556575] hover:bg-slate-50"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          disabled={saving}
                          className="flex-1 rounded-lg bg-[#2f6f96] py-1.5 text-xs font-semibold text-white hover:bg-[#245b7c] disabled:opacity-50"
                        >
                          {saving ? "Saving..." : "Save Details"}
                        </button>
                      </div>
                    </form>
                  )}
                </div>
              )}
            </div>
          </>
        ) : (
          <a
            href="#auth-section"
            className="rounded-lg bg-[#2f6f96] px-4 py-2 text-[13px] font-semibold text-white transition-colors hover:bg-[#245b7c]"
          >
            Sign in
          </a>
        )}
      </div>
    </header>
  );
}
