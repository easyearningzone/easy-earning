-- ==============================================================================
-- EASY EARNING BD — COMPLETE POSTGRESQL & SUPABASE DATABASE SETUP
-- Developed by DEVELOPER AHAD
-- All-in-One: Drop old tables, Create 23 Tables, Ledger, RLS & Seed Data
-- ==============================================================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. CLEAN UP OLD INCOMPATIBLE TABLES (IF ANY)
DROP TABLE IF EXISTS public.gmail_submissions CASCADE;
DROP TABLE IF EXISTS public.task_submissions CASCADE;
DROP TABLE IF EXISTS public.tasks CASCADE;
DROP TABLE IF EXISTS public.wallet_transactions CASCADE;
DROP TABLE IF EXISTS public.withdrawal_requests CASCADE;
DROP TABLE IF EXISTS public.wallets CASCADE;
DROP TABLE IF EXISTS public.bonus_claims CASCADE;
DROP TABLE IF EXISTS public.gift_code_redemptions CASCADE;
DROP TABLE IF EXISTS public.gift_codes CASCADE;
DROP TABLE IF EXISTS public.verification_requests CASCADE;
DROP TABLE IF EXISTS public.support_tickets CASCADE;
DROP TABLE IF EXISTS public.reviews CASCADE;
DROP TABLE IF EXISTS public.notifications CASCADE;
DROP TABLE IF EXISTS public.site_settings CASCADE;
DROP TABLE IF EXISTS public.banners CASCADE;
DROP TABLE IF EXISTS public.notices CASCADE;
DROP TABLE IF EXISTS public.social_links CASCADE;
DROP TABLE IF EXISTS public.projects CASCADE;
DROP TABLE IF EXISTS public.project_categories CASCADE;
DROP TABLE IF EXISTS public.audit_logs CASCADE;
DROP TABLE IF EXISTS public.referrals CASCADE;
DROP TABLE IF EXISTS public.profiles CASCADE;

-- 3. USER PROFILES TABLE (Supports both Supabase Auth UUID & custom IDs)
CREATE TABLE public.profiles (
    id TEXT PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    full_name TEXT NOT NULL,
    mobile TEXT NOT NULL,
    avatar_url TEXT DEFAULT 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
    role TEXT NOT NULL DEFAULT 'user' CHECK (role IN ('user', 'admin')),
    referral_code TEXT UNIQUE NOT NULL,
    referred_by TEXT,
    is_verified TEXT NOT NULL DEFAULT 'unverified' CHECK (is_verified IN ('unverified', 'pending', 'verified', 'rejected')),
    is_suspended BOOLEAN NOT NULL DEFAULT FALSE,
    verification_doc_type TEXT,
    verification_doc_number TEXT,
    verification_doc_image TEXT,
    verification_notes TEXT,
    verification_payment_method TEXT,
    verification_sender_number TEXT,
    verification_trx_id TEXT,
    verification_fee_amount NUMERIC(10, 2) DEFAULT 100.00,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4. WALLETS TABLE (One wallet per profile, matched TEXT user_id)
CREATE TABLE public.wallets (
    id TEXT PRIMARY KEY DEFAULT uuid_generate_v4()::TEXT,
    user_id TEXT UNIQUE NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    total_balance NUMERIC(12, 2) NOT NULL DEFAULT 0.00 CHECK (total_balance >= 0),
    available_balance NUMERIC(12, 2) NOT NULL DEFAULT 0.00 CHECK (available_balance >= 0),
    pending_balance NUMERIC(12, 2) NOT NULL DEFAULT 0.00 CHECK (pending_balance >= 0),
    total_earnings NUMERIC(12, 2) NOT NULL DEFAULT 0.00 CHECK (total_earnings >= 0),
    total_withdrawals NUMERIC(12, 2) NOT NULL DEFAULT 0.00 CHECK (total_withdrawals >= 0),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 5. WALLET TRANSACTIONS TABLE (Immutable ledger)
CREATE TABLE public.wallet_transactions (
    id TEXT PRIMARY KEY DEFAULT uuid_generate_v4()::TEXT,
    user_id TEXT NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    amount NUMERIC(12, 2) NOT NULL,
    type TEXT NOT NULL CHECK (type IN (
        'deposit', 'task_reward', 'referral_bonus', 'daily_bonus', 
        'spin_win', 'welcome_bonus', 'gift_code', 'withdrawal', 'admin_adjustment'
    )),
    description TEXT NOT NULL,
    reference_id TEXT,
    status TEXT NOT NULL DEFAULT 'completed' CHECK (status IN ('completed', 'pending', 'failed', 'cancelled')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 6. WITHDRAWAL REQUESTS TABLE
CREATE TABLE public.withdrawal_requests (
    id TEXT PRIMARY KEY DEFAULT uuid_generate_v4()::TEXT,
    user_id TEXT NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    method TEXT NOT NULL CHECK (method IN ('bkash', 'nagad', 'rocket')),
    account_number TEXT NOT NULL,
    account_type TEXT DEFAULT 'personal' CHECK (account_type IN ('personal', 'agent')),
    amount NUMERIC(12, 2) NOT NULL CHECK (amount > 0),
    fee NUMERIC(12, 2) NOT NULL DEFAULT 0.00 CHECK (fee >= 0),
    final_amount NUMERIC(12, 2) NOT NULL CHECK (final_amount > 0),
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
    admin_transaction_id TEXT,
    rejection_reason TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    processed_at TIMESTAMPTZ
);

-- 7. TASKS TABLE (Micro-Jobs)
CREATE TABLE public.tasks (
    id TEXT PRIMARY KEY DEFAULT uuid_generate_v4()::TEXT,
    title TEXT NOT NULL,
    category TEXT NOT NULL,
    description TEXT NOT NULL,
    instructions TEXT[] NOT NULL DEFAULT '{}',
    reward_amount NUMERIC(10, 2) NOT NULL CHECK (reward_amount > 0),
    task_link TEXT,
    required_proof TEXT NOT NULL,
    max_participants INT NOT NULL DEFAULT 100,
    current_participants INT NOT NULL DEFAULT 0,
    deadline TIMESTAMPTZ,
    status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
    icon TEXT DEFAULT 'tasks',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 8. TASK SUBMISSIONS TABLE
CREATE TABLE public.task_submissions (
    id TEXT PRIMARY KEY DEFAULT uuid_generate_v4()::TEXT,
    task_id TEXT NOT NULL REFERENCES public.tasks(id) ON DELETE CASCADE,
    user_id TEXT NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    task_title TEXT NOT NULL,
    reward_amount NUMERIC(10, 2) NOT NULL,
    proof_text TEXT NOT NULL,
    proof_image_url TEXT,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
    admin_feedback TEXT,
    submitted_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    processed_at TIMESTAMPTZ,
    CONSTRAINT one_submission_per_user_task UNIQUE (task_id, user_id)
);

-- 9. GMAIL MARKETING / SELL SUBMISSIONS TABLE
CREATE TABLE public.gmail_submissions (
    id TEXT PRIMARY KEY DEFAULT uuid_generate_v4()::TEXT,
    user_id TEXT NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    gmail_address TEXT NOT NULL,
    gmail_password TEXT NOT NULL,
    recovery_email TEXT,
    price_rate NUMERIC(10, 2) NOT NULL DEFAULT 14.00,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
    rejection_reason TEXT,
    submitted_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    reviewed_at TIMESTAMPTZ
);

-- 10. PROJECTS TABLE
CREATE TABLE public.projects (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    title_bn TEXT NOT NULL,
    category TEXT NOT NULL,
    icon TEXT NOT NULL,
    icon_color TEXT NOT NULL DEFAULT '#2563eb',
    status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
    requires_verification BOOLEAN NOT NULL DEFAULT FALSE,
    action_type TEXT NOT NULL DEFAULT 'modal' CHECK (action_type IN ('modal', 'route', 'external')),
    modal_id TEXT,
    badge TEXT,
    description TEXT,
    is_coming_soon BOOLEAN DEFAULT FALSE,
    order_index INT NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 11. BANNERS TABLE
CREATE TABLE public.banners (
    id TEXT PRIMARY KEY DEFAULT uuid_generate_v4()::TEXT,
    title TEXT NOT NULL,
    image_url TEXT NOT NULL,
    link TEXT,
    badge TEXT,
    status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
    order_index INT NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 12. NOTICES TABLE
CREATE TABLE public.notices (
    id TEXT PRIMARY KEY DEFAULT uuid_generate_v4()::TEXT,
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    telegram_url TEXT,
    whatsapp_url TEXT,
    tutorial_url TEXT,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    display_frequency TEXT NOT NULL DEFAULT 'once_per_session' CHECK (display_frequency IN ('always', 'once_per_session', 'disabled')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 13. SOCIAL LINKS TABLE
CREATE TABLE public.social_links (
    id TEXT PRIMARY KEY DEFAULT uuid_generate_v4()::TEXT,
    platform TEXT NOT NULL,
    name TEXT NOT NULL,
    name_bn TEXT NOT NULL,
    url TEXT NOT NULL,
    icon TEXT NOT NULL,
    color TEXT NOT NULL,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    order_index INT NOT NULL DEFAULT 0
);

-- 14. BONUS CLAIMS TABLE
CREATE TABLE public.bonus_claims (
    id TEXT PRIMARY KEY DEFAULT uuid_generate_v4()::TEXT,
    user_id TEXT NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    bonus_type TEXT NOT NULL CHECK (bonus_type IN ('daily', 'welcome', 'target', 'spin', 'weekly', 'monthly')),
    amount NUMERIC(10, 2) NOT NULL CHECK (amount >= 0),
    claimed_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 15. GIFT CODES TABLE
CREATE TABLE public.gift_codes (
    id TEXT PRIMARY KEY DEFAULT uuid_generate_v4()::TEXT,
    code TEXT UNIQUE NOT NULL,
    reward_amount NUMERIC(10, 2) NOT NULL CHECK (reward_amount > 0),
    max_uses INT NOT NULL DEFAULT 100,
    current_uses INT NOT NULL DEFAULT 0,
    expires_at TIMESTAMPTZ,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 16. SITE SETTINGS TABLE (Single row)
CREATE TABLE public.site_settings (
    id INT PRIMARY KEY DEFAULT 1 CHECK (id = 1),
    site_name TEXT NOT NULL DEFAULT 'EASY EARNING BD',
    tagline TEXT NOT NULL DEFAULT 'বাংলাদেশের বিশ্বস্ত অনলাইন আর্নিং প্ল্যাটফর্ম',
    developer_credit TEXT NOT NULL DEFAULT 'DEVELOPER AHAD',
    currency_symbol TEXT NOT NULL DEFAULT '৳',
    min_withdrawal NUMERIC(10, 2) NOT NULL DEFAULT 50.00,
    max_withdrawal NUMERIC(10, 2) NOT NULL DEFAULT 25000.00,
    withdrawal_fee_pct NUMERIC(5, 2) NOT NULL DEFAULT 2.00,
    referral_bonus NUMERIC(10, 2) NOT NULL DEFAULT 10.00,
    referral_commission_pct NUMERIC(5, 2) NOT NULL DEFAULT 10.00,
    daily_bonus_base NUMERIC(10, 2) NOT NULL DEFAULT 5.00,
    welcome_bonus_amount NUMERIC(10, 2) NOT NULL DEFAULT 25.00,
    support_whatsapp TEXT NOT NULL DEFAULT '+8801700000000',
    support_telegram TEXT NOT NULL DEFAULT 'https://t.me/easyearningbd',
    support_email TEXT NOT NULL DEFAULT 'support@easyearningbd.com',
    support_phone TEXT NOT NULL DEFAULT '+8801800000000',
    notice_headline TEXT NOT NULL DEFAULT 'আমাদের টেলিগ্রাম চ্যানেলে জয়েন করে প্রতিদিনের নতুন অফার ও পেমেন্ট প্রুফ দেখুন!',
    notice_enabled BOOLEAN NOT NULL DEFAULT TRUE,
    is_maintenance BOOLEAN NOT NULL DEFAULT FALSE,
    payment_bkash TEXT NOT NULL DEFAULT '01700000001',
    payment_nagad TEXT NOT NULL DEFAULT '01700000002',
    payment_rocket TEXT NOT NULL DEFAULT '01700000003',
    gmail_sell_price NUMERIC(10, 2) NOT NULL DEFAULT 14.00,
    gmail_daily_limit INT NOT NULL DEFAULT 1000,
    gmail_today_password TEXT NOT NULL DEFAULT '@easybd2026',
    gmail_tutorial_url TEXT NOT NULL DEFAULT 'https://youtu.be/SVnx1ErWc0s?si=_TNFeyqdNl_J_TQV',
    gmail_report_time TEXT NOT NULL DEFAULT '২-৩ দিন',
    verification_fee NUMERIC(10, 2) NOT NULL DEFAULT 100.00,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 17. AUDIT LOGS TABLE
CREATE TABLE public.audit_logs (
    id TEXT PRIMARY KEY DEFAULT uuid_generate_v4()::TEXT,
    admin_id TEXT NOT NULL REFERENCES public.profiles(id),
    admin_name TEXT NOT NULL,
    action TEXT NOT NULL,
    target_type TEXT NOT NULL,
    target_id TEXT NOT NULL,
    details TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ==============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wallets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wallet_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.withdrawal_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.task_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gmail_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.banners ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.social_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bonus_claims ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gift_codes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- Allow public read of essential settings, tasks, banners & projects
CREATE POLICY "Public read profiles" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Public insert profiles" ON public.profiles FOR INSERT WITH CHECK (true);
CREATE POLICY "Public update profiles" ON public.profiles FOR UPDATE USING (true);

CREATE POLICY "Public read wallets" ON public.wallets FOR SELECT USING (true);
CREATE POLICY "Public manage wallets" ON public.wallets FOR ALL USING (true);

CREATE POLICY "Public read transactions" ON public.wallet_transactions FOR SELECT USING (true);
CREATE POLICY "Public insert transactions" ON public.wallet_transactions FOR INSERT WITH CHECK (true);

CREATE POLICY "Public manage withdrawals" ON public.withdrawal_requests FOR ALL USING (true);
CREATE POLICY "Public read tasks" ON public.tasks FOR SELECT USING (true);
CREATE POLICY "Public manage tasks" ON public.tasks FOR ALL USING (true);

CREATE POLICY "Public manage submissions" ON public.task_submissions FOR ALL USING (true);
CREATE POLICY "Public manage gmail submissions" ON public.gmail_submissions FOR ALL USING (true);

CREATE POLICY "Public read banners" ON public.banners FOR SELECT USING (true);
CREATE POLICY "Public read notices" ON public.notices FOR SELECT USING (true);
CREATE POLICY "Public read social links" ON public.social_links FOR SELECT USING (true);
CREATE POLICY "Public read projects" ON public.projects FOR SELECT USING (true);
CREATE POLICY "Public read settings" ON public.site_settings FOR SELECT USING (true);
CREATE POLICY "Public manage settings" ON public.site_settings FOR ALL USING (true);
CREATE POLICY "Public manage bonus claims" ON public.bonus_claims FOR ALL USING (true);
CREATE POLICY "Public manage gift codes" ON public.gift_codes FOR ALL USING (true);
CREATE POLICY "Public manage audit logs" ON public.audit_logs FOR ALL USING (true);

-- ==============================================================================
-- INITIAL SEED DATA
-- ==============================================================================

-- 1. Default Admin & Demo User Profiles
INSERT INTO public.profiles (id, email, full_name, mobile, role, referral_code, is_verified) VALUES
('admin-songworld', 'songworld061@gmail.com', 'DEVELOPER AHAD (Admin)', '01700000000', 'admin', 'AHADADMIN', 'verified'),
('admin-demo-1', 'admin@easyearningbd.com', 'এডমিন আহাদ', '01812345678', 'admin', 'AHADADMIN2', 'verified'),
('user-demo-1', 'user@easyearningbd.com', 'মোহাম্মদ রাশেদ', '01711223344', 'user', 'EASYBD', 'verified')
ON CONFLICT (id) DO UPDATE SET role = EXCLUDED.role, is_verified = EXCLUDED.is_verified;

-- 2. Initial Wallets
INSERT INTO public.wallets (id, user_id, total_balance, available_balance, pending_balance, total_earnings, total_withdrawals) VALUES
('w-admin-songworld', 'admin-songworld', 50000.00, 50000.00, 0.00, 50000.00, 0.00),
('w-admin', 'admin-demo-1', 50000.00, 50000.00, 0.00, 50000.00, 0.00),
('w-user-1', 'user-demo-1', 485.50, 485.50, 0.00, 1250.00, 764.50)
ON CONFLICT (user_id) DO NOTHING;

-- 3. Site Settings
INSERT INTO public.site_settings (
    id, site_name, tagline, developer_credit, min_withdrawal, max_withdrawal,
    withdrawal_fee_pct, referral_bonus, daily_bonus_base, welcome_bonus_amount,
    support_whatsapp, support_telegram, support_email, support_phone,
    notice_headline, payment_bkash, payment_nagad, payment_rocket,
    gmail_sell_price, gmail_daily_limit, gmail_today_password, gmail_tutorial_url, gmail_report_time
) VALUES (
    1, 'EASY EARNING BD', 'বাংলাদেশের ১ নম্বর বিশ্বস্ত অনলাইন আয় প্ল্যাটফর্ম',
    'DEVELOPER AHAD', 50.00, 25000.00, 2.00, 10.00, 5.00, 25.00,
    '+8801712345678', 'https://t.me/easyearningbd', 'support@easyearningbd.com', '+8801812345678',
    '🎉 শুভ স্বাগতম EASY EARNING BD তে! একাউন্ট ভেরিফাই করলেই পেয়ে যাবেন স্পেশাল ওয়েলকাম বোনাস।',
    '01712345678', '01812345678', '01912345678',
    14.00, 1000, '@easybd2026', 'https://youtu.be/SVnx1ErWc0s?si=_TNFeyqdNl_J_TQV', '২-৩ দিন'
) ON CONFLICT (id) DO UPDATE SET
    site_name = EXCLUDED.site_name,
    gmail_sell_price = EXCLUDED.gmail_sell_price,
    gmail_today_password = EXCLUDED.gmail_today_password;

-- 4. Banners
INSERT INTO public.banners (id, title, image_url, badge, status, order_index) VALUES
('b1', 'দৈনিক কাজ করে ২০০-৫০০ টাকা আয় করুন', 'https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?auto=format&fit=crop&w=1200&q=80', 'নতুন অফার', 'active', 1),
('b2', 'বন্ধুদের রেফার করে আয় করুন আকর্ষণীয় কমিশন', 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?auto=format&fit=crop&w=1200&q=80', 'রেফারেল অফার', 'active', 2),
('b3', 'বিকাশ ও নগদে সরাসরি ইনস্ট্যান্ট উইথড্রয়াল', 'https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=1200&q=80', 'ইনস্ট্যান্ট ক্যাশআউট', 'active', 3)
ON CONFLICT (id) DO NOTHING;

-- 5. Social Links
INSERT INTO public.social_links (id, platform, name, name_bn, url, icon, color, is_active, order_index) VALUES
('s1', 'facebook_page', 'Facebook Page', 'ফেসবুক পেজ', 'https://facebook.com', 'fa-brands fa-facebook', '#1877F2', true, 1),
('s2', 'facebook_group', 'Facebook Group', 'ফেসবুক গ্রুপ', 'https://facebook.com/groups', 'fa-solid fa-users', '#0866FF', true, 2),
('s3', 'telegram', 'Telegram Channel', 'টেলিগ্রাম চ্যানেল', 'https://t.me', 'fa-brands fa-telegram', '#229ED9', true, 3),
('s4', 'whatsapp', 'WhatsApp Group', 'হোয়াটসঅ্যাপ হেল্পলাইন', 'https://whatsapp.com', 'fa-brands fa-whatsapp', '#25D366', true, 4),
('s5', 'youtube', 'YouTube Channel', 'ইউটিউব চ্যানেল', 'https://youtube.com', 'fa-brands fa-youtube', '#FF0000', true, 5),
('s6', 'instagram', 'Instagram', 'ইনস্টাগ্রাম', 'https://instagram.com', 'fa-brands fa-instagram', '#E4405F', true, 6),
('s7', 'support', 'Live Support', '২৪/৭ লাইভ সাপোর্ট', 'https://tawk.to', 'fa-solid fa-headset', '#008744', true, 7)
ON CONFLICT (id) DO NOTHING;

-- 6. Initial Notice
INSERT INTO public.notices (id, title, message, telegram_url, whatsapp_url, tutorial_url, is_active, display_frequency) VALUES
('n1', 'গুরুত্বপূর্ণ নোটিশ ও দিকনির্দেশনা', 'সকল ইউজারদের অবগতির জন্য জানানো যাচ্ছে যে, সঠিক নিয়মে কাজ জমা দিলে মাত্র ১০-৩০ মিনিটের মধ্যে টাকা ওয়ালেটে যোগ হবে। কোনো প্রকার ফেক স্ক্রিনশট বা মিথ্যা তথ্য দিলে একাউন্ট ব্যান করা হবে। উইথড্রয়াল সর্বনিম্ন ৫০ টাকা থেকে শুরু।', 'https://t.me/easyearningbd', 'https://wa.me/8801712345678', 'https://youtube.com', true, 'once_per_session')
ON CONFLICT (id) DO NOTHING;

-- 7. Gift Codes
INSERT INTO public.gift_codes (id, code, reward_amount, max_uses, current_uses, is_active) VALUES
('gc1', 'EASY2026', 20.00, 500, 12, true),
('gc2', 'WELCOME10', 10.00, 1000, 45, true),
('gc3', 'AHADSPECIAL', 50.00, 200, 8, true)
ON CONFLICT (id) DO NOTHING;
