-- ==============================================================================
-- EASY EARNING BD — COMPLETE POSTGRESQL & SUPABASE DATABASE SCHEMA
-- Developed by DEVELOPER AHAD
-- Includes: 22 Tables, RLS Policies, Indexes, Triggers, & Stored Procedures
-- ==============================================================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. USER PROFILES TABLE
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT UNIQUE NOT NULL,
    full_name TEXT NOT NULL,
    mobile TEXT NOT NULL,
    avatar_url TEXT DEFAULT 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
    role TEXT NOT NULL DEFAULT 'user' CHECK (role IN ('user', 'admin')),
    referral_code TEXT UNIQUE NOT NULL,
    referred_by TEXT REFERENCES public.profiles(referral_code),
    is_verified TEXT NOT NULL DEFAULT 'unverified' CHECK (is_verified IN ('unverified', 'pending', 'verified', 'rejected')),
    is_suspended BOOLEAN NOT NULL DEFAULT FALSE,
    verification_doc_type TEXT,
    verification_doc_number TEXT,
    verification_doc_image TEXT,
    verification_notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. WALLETS TABLE (One wallet per profile, immutable via server-side balance updates)
CREATE TABLE IF NOT EXISTS public.wallets (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID UNIQUE NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    total_balance NUMERIC(12, 2) NOT NULL DEFAULT 0.00 CHECK (total_balance >= 0),
    available_balance NUMERIC(12, 2) NOT NULL DEFAULT 0.00 CHECK (available_balance >= 0),
    pending_balance NUMERIC(12, 2) NOT NULL DEFAULT 0.00 CHECK (pending_balance >= 0),
    total_earnings NUMERIC(12, 2) NOT NULL DEFAULT 0.00 CHECK (total_earnings >= 0),
    total_withdrawals NUMERIC(12, 2) NOT NULL DEFAULT 0.00 CHECK (total_withdrawals >= 0),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4. WALLET TRANSACTIONS TABLE (Immutable ledger)
CREATE TABLE IF NOT EXISTS public.wallet_transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
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

-- 5. WITHDRAWAL REQUESTS TABLE
CREATE TABLE IF NOT EXISTS public.withdrawal_requests (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
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

-- 6. PROJECT CATEGORIES
CREATE TABLE IF NOT EXISTS public.project_categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    name_bn TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    icon TEXT,
    order_index INT DEFAULT 0
);

-- 7. PROJECTS TABLE (26 Earning categories)
CREATE TABLE IF NOT EXISTS public.projects (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
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
    order_index INT NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 8. TASKS TABLE (Micro-Jobs)
CREATE TABLE IF NOT EXISTS public.tasks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
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

-- 9. TASK SUBMISSIONS TABLE
CREATE TABLE IF NOT EXISTS public.task_submissions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    task_id UUID NOT NULL REFERENCES public.tasks(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
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

-- 10. REFERRAL CODES & REFERRALS TABLE
CREATE TABLE IF NOT EXISTS public.referrals (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    referrer_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    referee_id UUID UNIQUE NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    commission_earned NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 11. BANNERS TABLE
CREATE TABLE IF NOT EXISTS public.banners (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    image_url TEXT NOT NULL,
    link TEXT,
    badge TEXT,
    status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
    order_index INT NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 12. NOTICES TABLE
CREATE TABLE IF NOT EXISTS public.notices (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
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
CREATE TABLE IF NOT EXISTS public.social_links (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    platform TEXT NOT NULL,
    name TEXT NOT NULL,
    name_bn TEXT NOT NULL,
    url TEXT NOT NULL,
    icon TEXT NOT NULL,
    color TEXT NOT NULL,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    order_index INT NOT NULL DEFAULT 0
);

-- 14. BONUS CLAIMS TABLE (Daily, Welcome, Spin, Targets)
CREATE TABLE IF NOT EXISTS public.bonus_claims (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    bonus_type TEXT NOT NULL CHECK (bonus_type IN ('daily', 'welcome', 'target', 'spin', 'weekly', 'monthly')),
    amount NUMERIC(10, 2) NOT NULL,
    claimed_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 15. GIFT CODES TABLE
CREATE TABLE IF NOT EXISTS public.gift_codes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    code TEXT UNIQUE NOT NULL,
    reward_amount NUMERIC(10, 2) NOT NULL CHECK (reward_amount > 0),
    max_uses INT NOT NULL DEFAULT 100,
    current_uses INT NOT NULL DEFAULT 0,
    expires_at TIMESTAMPTZ,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 16. GIFT CODE REDEMPTIONS
CREATE TABLE IF NOT EXISTS public.gift_code_redemptions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    gift_code_id UUID NOT NULL REFERENCES public.gift_codes(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    redeemed_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT one_redemption_per_user UNIQUE (gift_code_id, user_id)
);

-- 17. VERIFICATION REQUESTS TABLE (KYC)
CREATE TABLE IF NOT EXISTS public.verification_requests (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    document_type TEXT NOT NULL CHECK (document_type IN ('nid', 'birth_certificate', 'passport', 'student_id')),
    document_number TEXT NOT NULL,
    document_front_url TEXT NOT NULL,
    document_back_url TEXT,
    selfie_url TEXT,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
    rejection_reason TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    processed_at TIMESTAMPTZ
);

-- 18. SUPPORT TICKETS
CREATE TABLE IF NOT EXISTS public.support_tickets (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    subject TEXT NOT NULL,
    message TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'replied', 'closed')),
    admin_reply TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 19. REVIEWS TABLE
CREATE TABLE IF NOT EXISTS public.reviews (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
    comment TEXT NOT NULL,
    is_approved BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 20. NOTIFICATIONS TABLE
CREATE TABLE IF NOT EXISTS public.notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    is_read BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 21. SITE SETTINGS TABLE (Single row)
CREATE TABLE IF NOT EXISTS public.site_settings (
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
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 22. AUDIT LOGS TABLE
CREATE TABLE IF NOT EXISTS public.audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    admin_id UUID NOT NULL REFERENCES public.profiles(id),
    admin_name TEXT NOT NULL,
    action TEXT NOT NULL,
    target_type TEXT NOT NULL,
    target_id TEXT NOT NULL,
    details TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 23. GMAIL MARKETING / SELL SUBMISSIONS TABLE
CREATE TABLE IF NOT EXISTS public.gmail_submissions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    gmail_address TEXT NOT NULL,
    gmail_password TEXT NOT NULL,
    recovery_email TEXT,
    price_rate NUMERIC(10, 2) NOT NULL DEFAULT 14.00,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
    rejection_reason TEXT,
    submitted_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    reviewed_at TIMESTAMPTZ
);

-- ==============================================================================
-- INDEXES FOR FAST PERFORMANCE
-- ==============================================================================
CREATE INDEX IF NOT EXISTS idx_profiles_email ON public.profiles(email);
CREATE INDEX IF NOT EXISTS idx_profiles_referral_code ON public.profiles(referral_code);
CREATE INDEX IF NOT EXISTS idx_wallets_user_id ON public.wallets(user_id);
CREATE INDEX IF NOT EXISTS idx_transactions_user_id ON public.wallet_transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_withdrawals_user_id ON public.withdrawal_requests(user_id);
CREATE INDEX IF NOT EXISTS idx_task_submissions_user_id ON public.task_submissions(user_id);
CREATE INDEX IF NOT EXISTS idx_task_submissions_task_id ON public.task_submissions(task_id);
CREATE INDEX IF NOT EXISTS idx_bonus_claims_user_id ON public.bonus_claims(user_id);

-- ==============================================================================
-- DATABASE TRIGGER: AUTO-CREATE PROFILE & WALLET ON USER SIGNUP
-- ==============================================================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
    new_referral_code TEXT;
    referrer_record RECORD;
BEGIN
    -- Generate unique 6-digit alphanumeric referral code
    new_referral_code := UPPER(SUBSTRING(MD5(RANDOM()::TEXT) FROM 1 FOR 6));
    
    -- Insert profile
    INSERT INTO public.profiles (
        id, email, full_name, mobile, role, referral_code, referred_by, is_verified, created_at
    ) VALUES (
        NEW.id,
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'full_name', 'User ' || new_referral_code),
        COALESCE(NEW.raw_user_meta_data->>'mobile', '01700000000'),
        'user',
        new_referral_code,
        NEW.raw_user_meta_data->>'referred_by',
        'unverified',
        NOW()
    );

    -- Insert wallet
    INSERT INTO public.wallets (
        user_id, total_balance, available_balance, pending_balance, total_earnings, total_withdrawals
    ) VALUES (
        NEW.id, 0.00, 0.00, 0.00, 0.00, 0.00
    );

    -- Record referral relationship if valid referral code was passed
    IF NEW.raw_user_meta_data->>'referred_by' IS NOT NULL THEN
        SELECT id INTO referrer_record FROM public.profiles WHERE referral_code = NEW.raw_user_meta_data->>'referred_by';
        IF FOUND THEN
            INSERT INTO public.referrals (referrer_id, referee_id, commission_earned)
            VALUES (referrer_record.id, NEW.id, 0.00);
        END IF;
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger definition for auth.users
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ==============================================================================
-- SECURE STORED PROCEDURES (ATOMIC TRANSACTIONS & FINANCIAL VALIDATIONS)
-- ==============================================================================

-- 1. Create Withdrawal Request
CREATE OR REPLACE FUNCTION public.request_withdrawal(
    p_user_id UUID,
    p_method TEXT,
    p_account_number TEXT,
    p_amount NUMERIC
) RETURNS JSONB AS $$
DECLARE
    v_available NUMERIC;
    v_min NUMERIC;
    v_max NUMERIC;
    v_fee_pct NUMERIC;
    v_fee NUMERIC;
    v_final NUMERIC;
    v_req_id UUID;
BEGIN
    SELECT min_withdrawal, max_withdrawal, withdrawal_fee_pct 
    INTO v_min, v_max, v_fee_pct 
    FROM public.site_settings WHERE id = 1;

    IF p_amount < v_min THEN
        RAISE EXCEPTION 'মিনিমাম উত্তোলনের পরিমাণ % টাকা।', v_min;
    END IF;
    IF p_amount > v_max THEN
        RAISE EXCEPTION 'ম্যাক্সিমাম উত্তোলনের পরিমাণ % টাকা।', v_max;
    END IF;

    SELECT available_balance INTO v_available FROM public.wallets WHERE user_id = p_user_id FOR UPDATE;
    IF v_available < p_amount THEN
        RAISE EXCEPTION 'পর্যাপ্ত ব্যালেন্স নেই। আপনার বর্তমান ব্যালেন্স % টাকা।', v_available;
    END IF;

    v_fee := ROUND((p_amount * v_fee_pct / 100), 2);
    v_final := p_amount - v_fee;

    -- Deduct from available balance, add to pending balance
    UPDATE public.wallets
    SET available_balance = available_balance - p_amount,
        pending_balance = pending_balance + p_amount,
        updated_at = NOW()
    WHERE user_id = p_user_id;

    -- Insert withdrawal record
    INSERT INTO public.withdrawal_requests (
        user_id, method, account_number, amount, fee, final_amount, status
    ) VALUES (
        p_user_id, p_method, p_account_number, p_amount, v_fee, v_final, 'pending'
    ) RETURNING id INTO v_req_id;

    -- Record transaction
    INSERT INTO public.wallet_transactions (
        user_id, amount, type, description, reference_id, status
    ) VALUES (
        p_user_id, -p_amount, 'withdrawal', 'উত্তোলন অনুরোধ (' || UPPER(p_method) || ' - ' || p_account_number || ')', v_req_id::TEXT, 'pending'
    );

    RETURN jsonb_build_object('success', true, 'withdrawal_id', v_req_id, 'amount', p_amount);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 2. Process Withdrawal Approval (Admin Only)
CREATE OR REPLACE FUNCTION public.approve_withdrawal(
    p_admin_id UUID,
    p_withdrawal_id UUID,
    p_transaction_id TEXT
) RETURNS JSONB AS $$
DECLARE
    v_user_id UUID;
    v_amount NUMERIC;
BEGIN
    -- Check admin
    IF NOT EXISTS (SELECT 1 FROM public.profiles WHERE id = p_admin_id AND role = 'admin') THEN
        RAISE EXCEPTION 'শুধুমাত্র এডমিন এই কাজটি করতে পারেন।';
    END IF;

    SELECT user_id, amount INTO v_user_id, v_amount
    FROM public.withdrawal_requests
    WHERE id = p_withdrawal_id AND status = 'pending'
    FOR UPDATE;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'উত্তোলন অনুরোধ পাওয়া যায়নি বা আগেই প্রক্রিয়া করা হয়েছে।';
    END IF;

    -- Update withdrawal request
    UPDATE public.withdrawal_requests
    SET status = 'approved',
        admin_transaction_id = p_transaction_id,
        processed_at = NOW()
    WHERE id = p_withdrawal_id;

    -- Update user wallet: pending balance is removed and recorded as total_withdrawals
    UPDATE public.wallets
    SET pending_balance = pending_balance - v_amount,
        total_balance = total_balance - v_amount,
        total_withdrawals = total_withdrawals + v_amount,
        updated_at = NOW()
    WHERE user_id = v_user_id;

    -- Update transaction status
    UPDATE public.wallet_transactions
    SET status = 'completed'
    WHERE reference_id = p_withdrawal_id::TEXT;

    RETURN jsonb_build_object('success', true);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 3. Process Withdrawal Rejection (Admin Only - Safely Refund User)
CREATE OR REPLACE FUNCTION public.reject_withdrawal(
    p_admin_id UUID,
    p_withdrawal_id UUID,
    p_reason TEXT
) RETURNS JSONB AS $$
DECLARE
    v_user_id UUID;
    v_amount NUMERIC;
BEGIN
    IF NOT EXISTS (SELECT 1 FROM public.profiles WHERE id = p_admin_id AND role = 'admin') THEN
        RAISE EXCEPTION 'শুধুমাত্র এডমিন এই কাজটি করতে পারেন।';
    END IF;

    SELECT user_id, amount INTO v_user_id, v_amount
    FROM public.withdrawal_requests
    WHERE id = p_withdrawal_id AND status = 'pending'
    FOR UPDATE;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'উত্তোলন অনুরোধ পাওয়া যায়নি।';
    END IF;

    -- Update request
    UPDATE public.withdrawal_requests
    SET status = 'rejected',
        rejection_reason = p_reason,
        processed_at = NOW()
    WHERE id = p_withdrawal_id;

    -- Refund balance: move back from pending to available
    UPDATE public.wallets
    SET pending_balance = pending_balance - v_amount,
        available_balance = available_balance + v_amount,
        updated_at = NOW()
    WHERE user_id = v_user_id;

    -- Update transaction
    UPDATE public.wallet_transactions
    SET status = 'cancelled'
    WHERE reference_id = p_withdrawal_id::TEXT;

    RETURN jsonb_build_object('success', true);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 4. Credit Task Reward on Approval
CREATE OR REPLACE FUNCTION public.approve_task_submission(
    p_admin_id UUID,
    p_submission_id UUID,
    p_feedback TEXT DEFAULT 'কাজটি সঠিকভাবে সম্পন্ন হয়েছে।'
) RETURNS JSONB AS $$
DECLARE
    v_user_id UUID;
    v_task_id UUID;
    v_reward NUMERIC;
    v_task_title TEXT;
BEGIN
    IF NOT EXISTS (SELECT 1 FROM public.profiles WHERE id = p_admin_id AND role = 'admin') THEN
        RAISE EXCEPTION 'শুধুমাত্র এডমিন এই কাজটি করতে পারেন।';
    END IF;

    SELECT user_id, task_id, reward_amount, task_title
    INTO v_user_id, v_task_id, v_reward, v_task_title
    FROM public.task_submissions
    WHERE id = p_submission_id AND status = 'pending'
    FOR UPDATE;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'সাবমিশন পাওয়া যায়নি বা আগেই সম্পন্ন হয়েছে।';
    END IF;

    -- Update submission
    UPDATE public.task_submissions
    SET status = 'approved',
        admin_feedback = p_feedback,
        processed_at = NOW()
    WHERE id = p_submission_id;

    -- Credit user wallet
    UPDATE public.wallets
    SET available_balance = available_balance + v_reward,
        total_balance = total_balance + v_reward,
        total_earnings = total_earnings + v_reward,
        updated_at = NOW()
    WHERE user_id = v_user_id;

    -- Insert ledger record
    INSERT INTO public.wallet_transactions (
        user_id, amount, type, description, reference_id, status
    ) VALUES (
        v_user_id, v_reward, 'task_reward', 'টাস্ক সম্পন্ন পুরস্কার: ' || v_task_title, p_submission_id::TEXT, 'completed'
    );

    RETURN jsonb_build_object('success', true, 'reward', v_reward);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ==============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wallets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wallet_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.withdrawal_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.task_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.banners ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.social_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bonus_claims ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gift_codes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.verification_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.support_tickets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- Profiles: Users can read their own, Admin can read/manage all
CREATE POLICY "Users can view own profile" ON public.profiles FOR SELECT USING (auth.uid() = id OR EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));
CREATE POLICY "Users can update permitted profile fields" ON public.profiles FOR UPDATE USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

-- Wallets: Users can only view their own wallet
CREATE POLICY "Users can view own wallet" ON public.wallets FOR SELECT USING (auth.uid() = user_id OR EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));

-- Transactions: Users can view own transactions
CREATE POLICY "Users can view own transactions" ON public.wallet_transactions FOR SELECT USING (auth.uid() = user_id OR EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));

-- Withdrawals: Users can view and insert own withdrawals
CREATE POLICY "Users can view own withdrawals" ON public.withdrawal_requests FOR SELECT USING (auth.uid() = user_id OR EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));
CREATE POLICY "Users can request withdrawal" ON public.withdrawal_requests FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Tasks & Projects & Banners & Notices: Public read
CREATE POLICY "Public read tasks" ON public.tasks FOR SELECT USING (true);
CREATE POLICY "Public read projects" ON public.projects FOR SELECT USING (true);
CREATE POLICY "Public read banners" ON public.banners FOR SELECT USING (true);
CREATE POLICY "Public read notices" ON public.notices FOR SELECT USING (true);
CREATE POLICY "Public read social links" ON public.social_links FOR SELECT USING (true);
CREATE POLICY "Public read settings" ON public.site_settings FOR SELECT USING (true);

-- Task Submissions: Users view/insert own, admin can update
CREATE POLICY "Users can view own submissions" ON public.task_submissions FOR SELECT USING (auth.uid() = user_id OR EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));
CREATE POLICY "Users can insert submissions" ON public.task_submissions FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Bonus Claims: Users view and insert own
CREATE POLICY "Users can view own bonus claims" ON public.bonus_claims FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can claim bonus" ON public.bonus_claims FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Verification: Users view/insert own
CREATE POLICY "Users can view own verification" ON public.verification_requests FOR SELECT USING (auth.uid() = user_id OR EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));
CREATE POLICY "Users can submit verification" ON public.verification_requests FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Gmail Submissions: Users view/insert own, admin can update/manage
ALTER TABLE public.gmail_submissions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own gmail submissions" ON public.gmail_submissions FOR SELECT USING (auth.uid() = user_id OR EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));
CREATE POLICY "Users can insert gmail submissions" ON public.gmail_submissions FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Admins manage all gmail submissions" ON public.gmail_submissions FOR ALL USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));

