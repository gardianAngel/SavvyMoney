# SavvyMoney — Build Instructions

## Prerequisites

| Tool | Required Version |
|------|-----------------|
| Node.js | 18+ |
| npm | 9+ |
| Java JDK | 17+ |
| Android Studio | Latest (for SDK) |

---

## 1. Install Dependencies

```bash
npm install
```

---

## 2. Environment Setup

Create `.env.local` in the root directory:

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_GEMINI_API_KEY=your_gemini_api_key
```

> ⚠️ **Never commit .env.local to git**. It is in .gitignore.

---

## 3. Web Build (Vite)

```bash
npm run build
```

Output goes to `dist/`.

---

## 4. Capacitor Sync

After any web build, sync to Android:

```bash
npx cap sync android
```

---

## 5. Debug APK (for testing)

```bash
cd android
./gradlew assembleDebug
```

APK location: `android/app/build/outputs/apk/debug/app-debug.apk`

### Install on device via ADB:
```bash
adb install android/app/build/outputs/apk/debug/app-debug.apk
```

### Or copy to phone manually:
Transfer `app-debug.apk` to your Android phone, then tap to install (enable "Install from unknown sources" in Android settings).

---

## 6. One-Line Full Build

```bash
npm run build && npx cap sync android && cd android && ./gradlew assembleDebug
```

---

## 7. Open in Android Studio (optional)

```bash
npx cap open android
```

This opens the project in Android Studio where you can:
- Build, run, and debug on emulator or device
- Configure signing for release APK
- Add push notifications

---

## Database Setup (Supabase)

Run this SQL in your Supabase dashboard SQL editor to fix user creation trigger:

```sql
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.users (id, email, full_name, role)
  VALUES (NEW.id, NEW.email, COALESCE(NEW.raw_user_meta_data->>'full_name',''), 'adult')
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Backfill existing users
INSERT INTO public.users (id, email, full_name, role)
SELECT au.id, au.email, COALESCE(au.raw_user_meta_data->>'full_name',''), 'adult'
FROM auth.users au LEFT JOIN public.users pu ON pu.id = au.id
WHERE pu.id IS NULL ON CONFLICT (id) DO NOTHING;
```

---

## Android Deployment Guide

### Enable developer mode on your Android phone:
1. Go to **Settings → About Phone**
2. Tap **Build Number** 7 times
3. Go back to **Settings → Developer Options**
4. Enable **USB Debugging**

### Install via USB:
```bash
adb devices          # verify device is listed
adb install app-debug.apk
```

### Install without USB:
1. Copy `app-debug.apk` to your phone (via Google Drive, WhatsApp, USB cable)
2. Open the file on your phone
3. Tap **Install**
4. If prompted, go to **Settings → Security → Install Unknown Apps** and allow for your file manager

---

## Troubleshooting

| Issue | Fix |
|-------|-----|
| `ANDROID_HOME not set` | Install Android Studio and set `ANDROID_HOME` in shell profile |
| `SDK not found` | Open Android Studio → SDK Manager → Install Android 14 (API 34) |
| `gradle build failed` | Run `./gradlew clean assembleDebug` |
| `App crashes on launch` | Check CORS settings in Supabase dashboard |
| `Login not working` | Disable email confirmation in Supabase Auth settings |
