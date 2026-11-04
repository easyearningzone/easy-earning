# EASY EARNING BD — Production Online Earning Platform
**Developed by DEVELOPER AHAD**

---

## 📌 Overview
**EASY EARNING BD** is a complete, mobile-first online earning web application inspired by contemporary Bangladeshi earning platforms, customized with original branding, navy blue header theme, animated rainbow borders, and a reactive financial ledger.

## 🚀 Key Features

### 1. User Authentication & Profile
- Full registration with **Full Name, Mobile Number, Email, Password, Confirm Password, and Referral Code**.
- Session persistence and secure authentication.
- Unique referral code and invitation link generation for every user.
- KYC / Account Verification submission (NID, Birth Certificate, Passport, Student ID) with admin review.

### 2. User Dashboard
- **Header**: Navy blue branding, logo, notifications badge, hamburger menu, quick admin toggle for administrators.
- **Sidebar**: Profile card with verification badge, affiliate ID with 1-click copy button, joining date, and links to all platform pages.
- **Banner Slider**: Touch swipe, auto-slide, dot indicators, and promo announcements.
- **Verification Status Card**: Highlights account KYC state with rainbow glow border.
- **Social Media Grid**: 4-column responsive grid linking to official Facebook Page, Group, Telegram, WhatsApp, YouTube, Instagram, and Live Support.
- **All 26 Earning Projects**: 4-column responsive icon grid with category filters (Bonus, Micro Tasks, Services) and interactive action modals.
- **Fixed Bottom Navigation**: Home, Agent, Product (elevated rainbow center button), Wallet, and Network.
- **Floating Support Widget**: Pulse-animated expandable widget for WhatsApp, Telegram, and 24/7 Live Tickets.

### 3. Financial & Wallet System
- **Wallets**: Total Balance, Available Balance, Pending Balance, Total Earnings, and Total Withdrawals.
- **Withdrawal Methods**: Bangladesh manual payment processing via **bKash, Nagad, and Rocket**.
- **Security & Integrity**: Immutable ledger, minimum/maximum withdrawal validation, service charge calculation, prevention of negative balances or double payouts.

### 4. Micro-Jobs & Tasks
- Real tasks with instructions, links, requirements, participant caps, and reward amounts.
- User proof submission (text + image proof upload).
- Admin approval with instant wallet crediting or rejection with feedback.

### 5. Bonuses & Gamification
- **7-Day Streak Daily Bonus**: Claimable once per 24 hours.
- **Lucky Spin Wheel**: Interactive physics-animated wheel with confetti celebration and instant reward credit.
- **Gift Code Redemption**: Redeem promo codes (e.g. `EASY2026`, `WELCOME10`, `AHADSPECIAL`).
- **Referral Network**: ৳10 referral bonus + 10% lifetime commission tracking, team members table, and direct WhatsApp/Telegram/Facebook sharing.

### 6. Complete Admin Panel
- **Overview Dashboard**: Total users, pending withdrawals, pending task proofs, total approved payouts, and live audit logs.
- **Withdrawal Processing**: Review bKash/Nagad/Rocket cashout requests, approve with TrxID, or reject with auto refund.
- **Task Submission Review**: View user screenshots, approve with instant credit, or reject with reason.
- **User KYC Review**: Verify NID/ID documents.
- **Task Manager**: Create and publish new micro jobs.
- **Wallet Adjustments**: Manual credit/debit with mandatory audit reason.
- **Website Settings & Database**: Change site name, developer credit, withdrawal limits, fee %, payment numbers, and Supabase integration.

---

## 🗄️ Supabase PostgreSQL Setup

The project includes production-ready SQL scripts located at:
- `/supabase/schema.sql` (22 tables, RLS policies, trigger for new profiles/wallets, stored procedures for atomic financial withdrawals and approvals)
- `/supabase/seed.sql` (initial settings, banners, notices, social links, gift codes)

### Quick Supabase Deployment Steps:
1. Open your Supabase project dashboard at [https://supabase.com](https://supabase.com).
2. Go to **SQL Editor** -> **New Query**.
3. Copy the entire content of `supabase/schema.sql` and click **Run**.
4. Copy the entire content of `supabase/seed.sql` and click **Run**.
5. Add your `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` in `.env` or in **Admin Panel > Supabase SQL**.

---

## 🔑 Demo Accounts for Instant Testing

| Account Role | Email Address | Password | Permissions |
| :--- | :--- | :--- | :--- |
| **Admin** | `admin@easyearningbd.com` | `admin123` | Full access to Admin Dashboard, KYC, Tasks, and Withdrawals |
| **User (Demo)** | `user@easyearningbd.com` | `user123` | Pre-funded user with referral network, wallet history, and verified status |
