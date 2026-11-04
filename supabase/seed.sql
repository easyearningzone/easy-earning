-- ==============================================================================
-- EASY EARNING BD — SEED DATA
-- ==============================================================================

-- 1. Site Settings
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
) ON CONFLICT (id) DO NOTHING;

-- 2. Initial Banners
INSERT INTO public.banners (title, image_url, badge, status, order_index) VALUES
('দৈনিক কাজ করে ২০০-৫০০ টাকা আয় করুন', 'https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?auto=format&fit=crop&w=1200&q=80', 'নতুন অফার', 'active', 1),
('বন্ধুদের রেফার করে আয় করুন আকর্ষণীয় কমিশন', 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?auto=format&fit=crop&w=1200&q=80', 'রেফারেল অফার', 'active', 2),
('বিকাশ ও নগদে সরাসরি ইনস্ট্যান্ট উইথড্রয়াল', 'https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=1200&q=80', 'ইনস্ট্যান্ট ক্যাশআউট', 'active', 3);

-- 3. Social Links
INSERT INTO public.social_links (platform, name, name_bn, url, icon, color, is_active, order_index) VALUES
('facebook_page', 'Facebook Page', 'ফেসবুক পেজ', 'https://facebook.com', 'fa-brands fa-facebook', '#1877F2', true, 1),
('facebook_group', 'Facebook Group', 'ফেসবুক গ্রুপ', 'https://facebook.com/groups', 'fa-solid fa-users', '#0866FF', true, 2),
('telegram', 'Telegram Channel', 'টেলিগ্রাম চ্যানেল', 'https://t.me', 'fa-brands fa-telegram', '#229ED9', true, 3),
('whatsapp', 'WhatsApp Group', 'হোয়াটসঅ্যাপ হেল্পলাইন', 'https://whatsapp.com', 'fa-brands fa-whatsapp', '#25D366', true, 4),
('youtube', 'YouTube Channel', 'ইউটিউব চ্যানেল', 'https://youtube.com', 'fa-brands fa-youtube', '#FF0000', true, 5),
('instagram', 'Instagram', 'ইনস্টাগ্রাম', 'https://instagram.com', 'fa-brands fa-instagram', '#E4405F', true, 6),
('support', 'Live Support', '২৪/৭ লাইভ সাপোর্ট', 'https://tawk.to', 'fa-solid fa-headset', '#008744', true, 7);

-- 4. Initial Notice
INSERT INTO public.notices (title, message, telegram_url, whatsapp_url, tutorial_url, is_active, display_frequency) VALUES
('গুরুত্বপূর্ণ নোটিশ ও দিকনির্দেশনা', 'সকল ইউজারদের অবগতির জন্য জানানো যাচ্ছে যে, সঠিক নিয়মে কাজ জমা দিলে মাত্র ১০-৩০ মিনিটের মধ্যে টাকা ওয়ালেটে যোগ হবে। কোনো প্রকার ফেক স্ক্রিনশট বা মিথ্যা তথ্য দিলে একাউন্ট ব্যান করা হবে। উইথড্রয়াল সর্বনিম্ন ৫০ টাকা থেকে শুরু।', 'https://t.me/easyearningbd', 'https://wa.me/8801712345678', 'https://youtube.com', true, 'once_per_session');

-- 5. Gift Codes
INSERT INTO public.gift_codes (code, reward_amount, max_uses, current_uses, is_active) VALUES
('EASY2026', 20.00, 500, 12, true),
('WELCOME10', 10.00, 1000, 45, true),
('AHADSPECIAL', 50.00, 200, 8, true);
