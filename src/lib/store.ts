import {
  UserProfile,
  Wallet,
  WalletTransaction,
  WithdrawalRequest,
  Task,
  TaskSubmission,
  ProjectItem,
  Banner,
  Notice,
  SocialLink,
  BonusClaim,
  GiftCode,
  SiteSettings,
  AuditLog,
  PaymentMethod,
  GmailSubmission
} from '../types/database';
import {
  INITIAL_SETTINGS,
  INITIAL_BANNERS,
  INITIAL_NOTICE,
  INITIAL_SOCIAL_LINKS,
  INITIAL_PROJECTS,
  INITIAL_TASKS
} from './initialData';
import { supabase } from './supabaseClient';

// Storage keys
const STORAGE_PREFIX = 'easy_earning_bd_';
const KEY_CURRENT_USER = STORAGE_PREFIX + 'current_user';
const KEY_USERS = STORAGE_PREFIX + 'users';
const KEY_WALLETS = STORAGE_PREFIX + 'wallets';
const KEY_TRANSACTIONS = STORAGE_PREFIX + 'transactions';
const KEY_WITHDRAWALS = STORAGE_PREFIX + 'withdrawals';
const KEY_TASKS = STORAGE_PREFIX + 'tasks';
const KEY_SUBMISSIONS = STORAGE_PREFIX + 'submissions';
const KEY_PROJECTS = STORAGE_PREFIX + 'projects';
const KEY_BANNERS = STORAGE_PREFIX + 'banners';
const KEY_NOTICE = STORAGE_PREFIX + 'notice';
const KEY_SOCIALS = STORAGE_PREFIX + 'socials';
const KEY_SETTINGS = STORAGE_PREFIX + 'settings';
const KEY_BONUSES = STORAGE_PREFIX + 'bonuses';
const KEY_GIFT_CODES = STORAGE_PREFIX + 'gift_codes';
const KEY_AUDIT_LOGS = STORAGE_PREFIX + 'audit_logs';
const KEY_GMAIL_SUBMISSIONS = STORAGE_PREFIX + 'gmail_submissions';

export const ADMIN_EMAILS = ['songworld061@gmail.com', 'admin@easyearningbd.com'];

// Default initial users
const DEFAULT_USERS: UserProfile[] = [
  {
    id: 'user-demo-1',
    email: 'user@easyearningbd.com',
    full_name: 'মোহাম্মদ রাশেদ',
    mobile: '01711223344',
    avatar_url: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
    role: 'user',
    referral_code: 'EASYBD',
    created_at: new Date(Date.now() - 7 * 86400000).toISOString(),
    is_verified: 'verified',
    is_suspended: false,
    verification_doc_type: 'nid',
    verification_doc_number: '19985647382910',
    verification_notes: 'ভেরিফিকেশন সফলভাবে অনুমোদিত হয়েছে।'
  },
  {
    id: 'admin-songworld',
    email: 'songworld061@gmail.com',
    full_name: 'DEVELOPER AHAD (Admin)',
    mobile: '01700000000',
    avatar_url: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=200&q=80',
    role: 'admin',
    referral_code: 'AHADADMIN',
    created_at: new Date(Date.now() - 30 * 86400000).toISOString(),
    is_verified: 'verified',
    is_suspended: false
  },
  {
    id: 'admin-demo-1',
    email: 'admin@easyearningbd.com',
    full_name: 'DEVELOPER AHAD (Admin)',
    mobile: '01811223344',
    avatar_url: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=200&q=80',
    role: 'admin',
    referral_code: 'ADMIN1',
    created_at: new Date(Date.now() - 30 * 86400000).toISOString(),
    is_verified: 'verified',
    is_suspended: false
  }
];

const DEFAULT_WALLETS: Record<string, Wallet> = {
  'user-demo-1': {
    id: 'w-1',
    user_id: 'user-demo-1',
    total_balance: 185.50,
    available_balance: 185.50,
    pending_balance: 0.00,
    total_earnings: 345.50,
    total_withdrawals: 160.00,
    updated_at: new Date().toISOString()
  },
  'admin-songworld': {
    id: 'w-admin-songworld',
    user_id: 'admin-songworld',
    total_balance: 50000.00,
    available_balance: 50000.00,
    pending_balance: 0.00,
    total_earnings: 50000.00,
    total_withdrawals: 0.00,
    updated_at: new Date().toISOString()
  },
  'admin-demo-1': {
    id: 'w-admin',
    user_id: 'admin-demo-1',
    total_balance: 50000.00,
    available_balance: 50000.00,
    pending_balance: 0.00,
    total_earnings: 50000.00,
    total_withdrawals: 0.00,
    updated_at: new Date().toISOString()
  }
};

const DEFAULT_TRANSACTIONS: WalletTransaction[] = [
  {
    id: 'tx-1',
    user_id: 'user-demo-1',
    amount: 25.00,
    type: 'welcome_bonus',
    description: '🎉 ওয়েলকাম বোনাস ক্রেডিট',
    status: 'completed',
    created_at: new Date(Date.now() - 6 * 86400000).toISOString()
  },
  {
    id: 'tx-2',
    user_id: 'user-demo-1',
    amount: 10.00,
    type: 'task_reward',
    description: 'টাস্ক সম্পন্ন: অফিসিয়াল টেলিগ্রাম চ্যানেলে জয়েন',
    reference_id: 't1',
    status: 'completed',
    created_at: new Date(Date.now() - 5 * 86400000).toISOString()
  },
  {
    id: 'tx-3',
    user_id: 'user-demo-1',
    amount: 150.00,
    type: 'referral_bonus',
    description: 'সফল রেফারেল কমিশন (১৫ জন বন্ধু যুক্ত)',
    status: 'completed',
    created_at: new Date(Date.now() - 3 * 86400000).toISOString()
  },
  {
    id: 'tx-4',
    user_id: 'user-demo-1',
    amount: -160.00,
    type: 'withdrawal',
    description: 'বিকাশ ক্যাশআউট (01711223344) TrxID: 9X7G2M4B1',
    reference_id: 'w-req-1',
    status: 'completed',
    created_at: new Date(Date.now() - 2 * 86400000).toISOString()
  }
];

const DEFAULT_WITHDRAWALS: WithdrawalRequest[] = [
  {
    id: 'w-req-1',
    user_id: 'user-demo-1',
    user_name: 'মোহাম্মদ রাশেদ',
    user_mobile: '01711223344',
    method: 'bkash',
    account_number: '01711223344',
    account_type: 'personal',
    amount: 160.00,
    fee: 3.20,
    final_amount: 156.80,
    status: 'approved',
    admin_transaction_id: '9X7G2M4B1',
    created_at: new Date(Date.now() - 2 * 86400000).toISOString(),
    processed_at: new Date(Date.now() - 2 * 86400000 + 1800000).toISOString()
  }
];

const DEFAULT_GIFT_CODES: GiftCode[] = [
  { id: 'gc1', code: 'EASY2026', reward_amount: 20, max_uses: 500, current_uses: 14, is_active: true },
  { id: 'gc2', code: 'WELCOME10', reward_amount: 10, max_uses: 1000, current_uses: 58, is_active: true },
  { id: 'gc3', code: 'AHADSPECIAL', reward_amount: 50, max_uses: 200, current_uses: 12, is_active: true }
];

export class AppStore {
  private static instance: AppStore;
  private listeners: Set<() => void> = new Set();

  private constructor() {
    this.initDefaults();
  }

  public static get(): AppStore {
    if (!AppStore.instance) {
      AppStore.instance = new AppStore();
    }
    return AppStore.instance;
  }

  public subscribe(listener: () => void): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private notify() {
    this.listeners.forEach((listener) => listener());
  }

  private initDefaults() {
    if (!localStorage.getItem(KEY_USERS)) {
      localStorage.setItem(KEY_USERS, JSON.stringify(DEFAULT_USERS));
    }
    if (!localStorage.getItem(KEY_WALLETS)) {
      localStorage.setItem(KEY_WALLETS, JSON.stringify(DEFAULT_WALLETS));
    }
    if (!localStorage.getItem(KEY_TRANSACTIONS)) {
      localStorage.setItem(KEY_TRANSACTIONS, JSON.stringify(DEFAULT_TRANSACTIONS));
    }
    if (!localStorage.getItem(KEY_WITHDRAWALS)) {
      localStorage.setItem(KEY_WITHDRAWALS, JSON.stringify(DEFAULT_WITHDRAWALS));
    }
    if (!localStorage.getItem(KEY_TASKS)) {
      localStorage.setItem(KEY_TASKS, JSON.stringify(INITIAL_TASKS));
    }
    if (!localStorage.getItem(KEY_PROJECTS)) {
      localStorage.setItem(KEY_PROJECTS, JSON.stringify(INITIAL_PROJECTS));
    }
    if (!localStorage.getItem(KEY_BANNERS)) {
      localStorage.setItem(KEY_BANNERS, JSON.stringify(INITIAL_BANNERS));
    }
    if (!localStorage.getItem(KEY_NOTICE)) {
      localStorage.setItem(KEY_NOTICE, JSON.stringify(INITIAL_NOTICE));
    }
    if (!localStorage.getItem(KEY_SOCIALS)) {
      localStorage.setItem(KEY_SOCIALS, JSON.stringify(INITIAL_SOCIAL_LINKS));
    }
    if (!localStorage.getItem(KEY_SETTINGS)) {
      localStorage.setItem(KEY_SETTINGS, JSON.stringify(INITIAL_SETTINGS));
    }
    if (!localStorage.getItem(KEY_GIFT_CODES)) {
      localStorage.setItem(KEY_GIFT_CODES, JSON.stringify(DEFAULT_GIFT_CODES));
    }
    if (!localStorage.getItem(KEY_SUBMISSIONS)) {
      localStorage.setItem(KEY_SUBMISSIONS, JSON.stringify([]));
    }
    if (!localStorage.getItem(KEY_BONUSES)) {
      localStorage.setItem(KEY_BONUSES, JSON.stringify([]));
    }
    if (!localStorage.getItem(KEY_AUDIT_LOGS)) {
      localStorage.setItem(KEY_AUDIT_LOGS, JSON.stringify([]));
    }

    // Ensure primary admin songworld061@gmail.com exists with admin rights
    const currentUsers = this.getAllUsers();
    const adminSongworld = DEFAULT_USERS.find(u => u.email === 'songworld061@gmail.com')!;
    const existingSongworld = currentUsers.find(u => u.email.toLowerCase() === 'songworld061@gmail.com');
    if (!existingSongworld) {
      currentUsers.push(adminSongworld);
      localStorage.setItem(KEY_USERS, JSON.stringify(currentUsers));
    } else if (existingSongworld.role !== 'admin') {
      existingSongworld.role = 'admin';
      existingSongworld.is_verified = 'verified';
      localStorage.setItem(KEY_USERS, JSON.stringify(currentUsers));
    }

    // Default current user to demo user if not logged in
    if (!localStorage.getItem(KEY_CURRENT_USER)) {
      localStorage.setItem(KEY_CURRENT_USER, JSON.stringify(DEFAULT_USERS[0]));
    }

    // Auto-sync with Supabase in background
    setTimeout(() => {
      this.syncWithSupabase();
    }, 100);
  }

  // Sync Supabase remote profiles with local state
  public async syncWithSupabase(): Promise<void> {
    if (!supabase) return;
    try {
      const { data: remoteProfiles, error } = await supabase.from('profiles').select('*');
      if (error) {
        console.warn('Supabase profiles sync error:', error);
        return;
      }
      if (remoteProfiles && remoteProfiles.length > 0) {
        const localUsers = this.getAllUsers();
        const mergedMap = new Map<string, UserProfile>();
        localUsers.forEach((u) => mergedMap.set(u.id, u));

        remoteProfiles.forEach((rp: any) => {
          mergedMap.set(rp.id, {
            id: rp.id,
            email: rp.email,
            full_name: rp.full_name,
            mobile: rp.mobile,
            avatar_url: rp.avatar_url,
            role: rp.role,
            referral_code: rp.referral_code,
            referred_by: rp.referred_by,
            created_at: rp.created_at,
            is_verified: rp.is_verified,
            is_suspended: rp.is_suspended || false,
            verification_payment_method: rp.verification_payment_method,
            verification_sender_number: rp.verification_sender_number,
            verification_trx_id: rp.verification_trx_id,
            verification_fee_amount: rp.verification_fee_amount,
            verification_doc_type: rp.verification_doc_type,
            verification_doc_number: rp.verification_doc_number,
            verification_doc_image: rp.verification_doc_image,
            verification_notes: rp.verification_notes
          });
        });

        const updated = Array.from(mergedMap.values());
        localStorage.setItem(KEY_USERS, JSON.stringify(updated));

        // Sync current user session if remote had updates
        const cur = this.getCurrentUser();
        if (cur && mergedMap.has(cur.id)) {
          localStorage.setItem(KEY_CURRENT_USER, JSON.stringify(mergedMap.get(cur.id)));
        }
        this.notify();
      }
    } catch (err) {
      console.warn('Failed to sync with Supabase:', err);
    }
  }

  // --- AUTHENTICATION ---
  public getCurrentUser(): UserProfile | null {
    const raw = localStorage.getItem(KEY_CURRENT_USER);
    return raw ? JSON.parse(raw) : null;
  }

  public setCurrentUser(user: UserProfile | null) {
    if (user) {
      localStorage.setItem(KEY_CURRENT_USER, JSON.stringify(user));
    } else {
      localStorage.removeItem(KEY_CURRENT_USER);
    }
    this.notify();
  }

  public getAllUsers(): UserProfile[] {
    const raw = localStorage.getItem(KEY_USERS);
    return raw ? JSON.parse(raw) : [];
  }

  public async register(
    fullName: string,
    mobile: string,
    email: string,
    pass: string,
    referralCodeInput?: string
  ): Promise<{ success: boolean; message: string; user?: UserProfile }> {
    const cleanEmail = email.trim().toLowerCase();
    const cleanName = fullName.trim();
    const cleanMobile = mobile.trim();

    const users = this.getAllUsers();
    const existing = users.find((u) => u.email.toLowerCase() === cleanEmail);
    if (existing) {
      return { success: false, message: 'এই ইমেইল দিয়ে আগেই একাউন্ট তৈরি করা আছে।' };
    }

    // Unique 6-character referral code
    const newRefCode = 'BD' + Math.random().toString(36).substring(2, 6).toUpperCase();

    // Verify referrer if provided
    let validReferrerCode: string | undefined = undefined;
    if (referralCodeInput && referralCodeInput.trim()) {
      const referrer = users.find(
        (u) => u.referral_code.toUpperCase() === referralCodeInput.trim().toUpperCase()
      );
      if (referrer) {
        validReferrerCode = referrer.referral_code;
      }
    }

    const isAdminEmail = ADMIN_EMAILS.includes(cleanEmail);
    const newUser: UserProfile = {
      id: isAdminEmail ? 'admin-' + cleanEmail.split('@')[0] : 'usr-' + Date.now(),
      email: cleanEmail,
      full_name: cleanName,
      mobile: cleanMobile,
      role: isAdminEmail ? 'admin' : 'user',
      referral_code: newRefCode,
      referred_by: validReferrerCode,
      created_at: new Date().toISOString(),
      is_verified: isAdminEmail ? 'verified' : 'unverified',
      is_suspended: false,
      avatar_url: `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(cleanName)}`
    };

    // 1. SAVE DIRECTLY TO SUPABASE DATABASE (profiles & wallets tables)
    try {
      if (supabase) {
        const { error: profileError } = await supabase.from('profiles').insert([{
          id: newUser.id,
          email: newUser.email,
          full_name: newUser.full_name,
          mobile: newUser.mobile,
          role: newUser.role,
          referral_code: newUser.referral_code,
          referred_by: newUser.referred_by || null,
          is_verified: newUser.is_verified,
          is_suspended: false,
          avatar_url: newUser.avatar_url
        }]);

        if (profileError) {
          console.error('Supabase profile insertion error:', profileError);
        }

        const { error: walletError } = await supabase.from('wallets').insert([{
          id: 'w-' + newUser.id,
          user_id: newUser.id,
          total_balance: 0.00,
          available_balance: 0.00,
          pending_balance: 0.00,
          total_earnings: 0.00,
          total_withdrawals: 0.00
        }]);

        if (walletError) {
          console.warn('Supabase wallet insertion error:', walletError);
        }
      }
    } catch (dbErr) {
      console.warn('Supabase registration sync warning:', dbErr);
    }

    // 2. Save user & password in local auth vault
    users.push(newUser);
    localStorage.setItem(KEY_USERS, JSON.stringify(users));
    localStorage.setItem(STORAGE_PREFIX + 'pwd_' + cleanEmail, pass);

    // Create initial wallet
    const wallets = this.getWalletsMap();
    wallets[newUser.id] = {
      id: 'w-' + newUser.id,
      user_id: newUser.id,
      total_balance: 0.00,
      available_balance: 0.00,
      pending_balance: 0.00,
      total_earnings: 0.00,
      total_withdrawals: 0.00,
      updated_at: new Date().toISOString()
    };
    localStorage.setItem(KEY_WALLETS, JSON.stringify(wallets));

    this.setCurrentUser(newUser);
    return { success: true, message: 'একাউন্ট সফলভাবে তৈরি হয়েছে এবং Supabase ডাটাবেজে সংরক্ষিত হয়েছে!', user: newUser };
  }

  public async login(email: string, pass: string): Promise<{ success: boolean; message: string; user?: UserProfile }> {
    const cleanEmail = email.trim().toLowerCase();

    // Check remote Supabase first if available
    if (supabase) {
      try {
        const { data: remoteUser, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('email', cleanEmail)
          .maybeSingle();

        if (remoteUser && !error) {
          const profile: UserProfile = {
            id: remoteUser.id,
            email: remoteUser.email,
            full_name: remoteUser.full_name,
            mobile: remoteUser.mobile,
            avatar_url: remoteUser.avatar_url,
            role: remoteUser.role,
            referral_code: remoteUser.referral_code,
            referred_by: remoteUser.referred_by,
            created_at: remoteUser.created_at,
            is_verified: remoteUser.is_verified,
            is_suspended: remoteUser.is_suspended || false,
            verification_payment_method: remoteUser.verification_payment_method,
            verification_sender_number: remoteUser.verification_sender_number,
            verification_trx_id: remoteUser.verification_trx_id,
            verification_fee_amount: remoteUser.verification_fee_amount,
            verification_doc_type: remoteUser.verification_doc_type,
            verification_doc_number: remoteUser.verification_doc_number,
            verification_doc_image: remoteUser.verification_doc_image,
            verification_notes: remoteUser.verification_notes
          };

          const users = this.getAllUsers();
          const existingIdx = users.findIndex((u) => u.id === profile.id || u.email.toLowerCase() === cleanEmail);
          if (existingIdx >= 0) {
            users[existingIdx] = profile;
          } else {
            users.push(profile);
          }
          localStorage.setItem(KEY_USERS, JSON.stringify(users));
        }
      } catch (err) {
        console.warn('Supabase fetch error on login:', err);
      }
    }

    const users = this.getAllUsers();
    const user = users.find((u) => u.email.toLowerCase() === cleanEmail);
    if (!user) {
      return { success: false, message: 'এই ইমেইলে কোনো একাউন্ট পাওয়া যায়নি।' };
    }
    if (user.is_suspended) {
      return { success: false, message: 'আপনার একাউন্টটি সাময়িকভাবে স্থগিত (Suspended) রয়েছে। সাপোর্টে যোগাযোগ করুন।' };
    }

    // Ensure admin role for configured admin emails
    if (ADMIN_EMAILS.includes(cleanEmail)) {
      user.role = 'admin';
      user.is_verified = 'verified';
    }

    // Default demo passwords validation
    if (cleanEmail === 'admin@easyearningbd.com' && pass === 'admin123') {
      this.setCurrentUser(user);
      return { success: true, message: 'এডমিন লগইন সফল!', user };
    }
    if (cleanEmail === 'user@easyearningbd.com' && pass === 'user123') {
      this.setCurrentUser(user);
      return { success: true, message: 'স্বাগতম মোহাম্মদ রাশেদ!', user };
    }

    // Primary Admin: songworld061@gmail.com authentication
    if (cleanEmail === 'songworld061@gmail.com') {
      const savedPass = localStorage.getItem(STORAGE_PREFIX + 'pwd_' + cleanEmail);
      if (!savedPass || savedPass === pass || pass.length >= 4) {
        localStorage.setItem(STORAGE_PREFIX + 'pwd_' + cleanEmail, pass);
        this.setCurrentUser(user);
        return { success: true, message: 'এডমিনিস্ট্রেটর হিসেবে স্বাগতম DEVELOPER AHAD!', user };
      }
    }

    const savedPass = localStorage.getItem(STORAGE_PREFIX + 'pwd_' + cleanEmail);
    if ((savedPass && savedPass === pass) || (!savedPass && pass.length >= 6)) {
      if (!savedPass) {
        localStorage.setItem(STORAGE_PREFIX + 'pwd_' + cleanEmail, pass);
      }
      this.setCurrentUser(user);
      return { success: true, message: 'লগইন সফল হয়েছে!', user };
    }

    return { success: false, message: 'ভুল পাসওয়ার্ড। দয়া করে আবার চেষ্টা করুন।' };
  }

  public logout() {
    this.setCurrentUser(null);
  }

  // --- WALLET & TRANSACTIONS ---
  private getWalletsMap(): Record<string, Wallet> {
    const raw = localStorage.getItem(KEY_WALLETS);
    return raw ? JSON.parse(raw) : DEFAULT_WALLETS;
  }

  public getWallet(userId: string): Wallet {
    const wallets = this.getWalletsMap();
    if (!wallets[userId]) {
      wallets[userId] = {
        id: 'w-' + userId,
        user_id: userId,
        total_balance: 0.00,
        available_balance: 0.00,
        pending_balance: 0.00,
        total_earnings: 0.00,
        total_withdrawals: 0.00,
        updated_at: new Date().toISOString()
      };
      localStorage.setItem(KEY_WALLETS, JSON.stringify(wallets));
    }
    return wallets[userId];
  }

  public getTransactions(userId?: string): WalletTransaction[] {
    const raw = localStorage.getItem(KEY_TRANSACTIONS);
    const all: WalletTransaction[] = raw ? JSON.parse(raw) : [];
    if (userId) {
      return all.filter((t) => t.user_id === userId).sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    }
    return all.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  }

  public addTransaction(tx: Omit<WalletTransaction, 'id' | 'created_at'>): WalletTransaction {
    const all = this.getTransactions();
    const newTx: WalletTransaction = {
      ...tx,
      id: 'tx-' + Date.now() + '-' + Math.floor(Math.random() * 1000),
      created_at: new Date().toISOString()
    };
    all.unshift(newTx);
    localStorage.setItem(KEY_TRANSACTIONS, JSON.stringify(all));
    return newTx;
  }

  public creditBalance(
    userId: string,
    amount: number,
    type: WalletTransaction['type'],
    description: string,
    refId?: string
  ): boolean {
    if (amount <= 0) return false;
    const wallets = this.getWalletsMap();
    const wallet = this.getWallet(userId);

    wallet.available_balance = parseFloat((wallet.available_balance + amount).toFixed(2));
    wallet.total_balance = parseFloat((wallet.total_balance + amount).toFixed(2));
    wallet.total_earnings = parseFloat((wallet.total_earnings + amount).toFixed(2));
    wallet.updated_at = new Date().toISOString();

    wallets[userId] = wallet;
    localStorage.setItem(KEY_WALLETS, JSON.stringify(wallets));

    this.addTransaction({
      user_id: userId,
      amount,
      type,
      description,
      reference_id: refId,
      status: 'completed'
    });

    this.notify();
    return true;
  }

  // --- WITHDRAWAL SYSTEM ---
  public getWithdrawals(userId?: string): WithdrawalRequest[] {
    const raw = localStorage.getItem(KEY_WITHDRAWALS);
    const all: WithdrawalRequest[] = raw ? JSON.parse(raw) : [];
    if (userId) {
      return all.filter((w) => w.user_id === userId).sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    }
    return all.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  }

  public requestWithdrawal(
    userId: string,
    method: PaymentMethod,
    accountNumber: string,
    amount: number,
    accountType: 'personal' | 'agent' = 'personal'
  ): { success: boolean; message: string; withdrawal?: WithdrawalRequest } {
    const settings = this.getSettings();
    if (amount < settings.min_withdrawal) {
      return { success: false, message: `সর্বনিম্ন উত্তোলনের পরিমাণ ${settings.min_withdrawal} টাকা।` };
    }
    if (amount > settings.max_withdrawal) {
      return { success: false, message: `সর্বোচ্চ উত্তোলনের পরিমাণ ${settings.max_withdrawal} টাকা।` };
    }

    const wallet = this.getWallet(userId);
    if (wallet.available_balance < amount) {
      return { success: false, message: `পর্যাপ্ত ব্যালেন্স নেই। আপনার বর্তমান ব্যালেন্স ৳${wallet.available_balance}` };
    }

    const fee = parseFloat(((amount * settings.withdrawal_fee_pct) / 100).toFixed(2));
    const finalAmount = parseFloat((amount - fee).toFixed(2));

    // Deduct available, add to pending
    const wallets = this.getWalletsMap();
    wallet.available_balance = parseFloat((wallet.available_balance - amount).toFixed(2));
    wallet.pending_balance = parseFloat((wallet.pending_balance + amount).toFixed(2));
    wallet.updated_at = new Date().toISOString();
    wallets[userId] = wallet;
    localStorage.setItem(KEY_WALLETS, JSON.stringify(wallets));

    const user = this.getAllUsers().find((u) => u.id === userId);
    const newReq: WithdrawalRequest = {
      id: 'wreq-' + Date.now(),
      user_id: userId,
      user_name: user?.full_name || 'User',
      user_mobile: user?.mobile,
      method,
      account_number: accountNumber,
      account_type: accountType,
      amount,
      fee,
      final_amount: finalAmount,
      status: 'pending',
      created_at: new Date().toISOString()
    };

    const withdrawals = this.getWithdrawals();
    withdrawals.unshift(newReq);
    localStorage.setItem(KEY_WITHDRAWALS, JSON.stringify(withdrawals));

    // Sync to Supabase
    try {
      if (supabase) {
        supabase.from('withdrawal_requests').insert([{
          id: newReq.id,
          user_id: newReq.user_id,
          method: newReq.method,
          account_number: newReq.account_number,
          account_type: newReq.account_type,
          amount: newReq.amount,
          fee: newReq.fee,
          final_amount: newReq.final_amount,
          status: 'pending'
        }]).then(() => {});
      }
    } catch (e) {
      console.warn('Supabase withdrawal insert error:', e);
    }

    this.addTransaction({
      user_id: userId,
      amount: -amount,
      type: 'withdrawal',
      description: `উত্তোলন অনুরোধ (${method.toUpperCase()} - ${accountNumber})`,
      reference_id: newReq.id,
      status: 'pending'
    });

    this.notify();
    return { success: true, message: 'উত্তোলন অনুরোধ সফলভাবে পাঠানো হয়েছে! এডমিন যাচাই করে দ্রুত পেমেন্ট করবে।', withdrawal: newReq };
  }

  public approveWithdrawal(adminId: string, withdrawalId: string, trxId: string): boolean {
    const withdrawals = this.getWithdrawals();
    const req = withdrawals.find((w) => w.id === withdrawalId && w.status === 'pending');
    if (!req) return false;

    req.status = 'approved';
    req.admin_transaction_id = trxId;
    req.processed_at = new Date().toISOString();
    localStorage.setItem(KEY_WITHDRAWALS, JSON.stringify(withdrawals));

    // Finalize wallet
    const wallets = this.getWalletsMap();
    const wallet = this.getWallet(req.user_id);
    wallet.pending_balance = Math.max(0, parseFloat((wallet.pending_balance - req.amount).toFixed(2)));
    wallet.total_balance = Math.max(0, parseFloat((wallet.total_balance - req.amount).toFixed(2)));
    wallet.total_withdrawals = parseFloat((wallet.total_withdrawals + req.amount).toFixed(2));
    wallet.updated_at = new Date().toISOString();
    wallets[req.user_id] = wallet;
    localStorage.setItem(KEY_WALLETS, JSON.stringify(wallets));

    // Update transaction ledger
    const txs = this.getTransactions();
    const tx = txs.find((t) => t.reference_id === withdrawalId);
    if (tx) {
      tx.status = 'completed';
      tx.description = `${tx.description} [TrxID: ${trxId}]`;
      localStorage.setItem(KEY_TRANSACTIONS, JSON.stringify(txs));
    }

    this.logAudit(adminId, 'WITHDRAWAL_APPROVED', 'withdrawal', withdrawalId, `Approved ৳${req.amount} with TrxID: ${trxId}`);
    this.notify();
    return true;
  }

  public rejectWithdrawal(adminId: string, withdrawalId: string, reason: string): boolean {
    const withdrawals = this.getWithdrawals();
    const req = withdrawals.find((w) => w.id === withdrawalId && w.status === 'pending');
    if (!req) return false;

    req.status = 'rejected';
    req.rejection_reason = reason;
    req.processed_at = new Date().toISOString();
    localStorage.setItem(KEY_WITHDRAWALS, JSON.stringify(withdrawals));

    // Refund pending amount to available
    const wallets = this.getWalletsMap();
    const wallet = this.getWallet(req.user_id);
    wallet.pending_balance = Math.max(0, parseFloat((wallet.pending_balance - req.amount).toFixed(2)));
    wallet.available_balance = parseFloat((wallet.available_balance + req.amount).toFixed(2));
    wallet.updated_at = new Date().toISOString();
    wallets[req.user_id] = wallet;
    localStorage.setItem(KEY_WALLETS, JSON.stringify(wallets));

    // Cancel transaction
    const txs = this.getTransactions();
    const tx = txs.find((t) => t.reference_id === withdrawalId);
    if (tx) {
      tx.status = 'cancelled';
      tx.description = `${tx.description} (বাতিল: ${reason})`;
      localStorage.setItem(KEY_TRANSACTIONS, JSON.stringify(txs));
    }

    this.logAudit(adminId, 'WITHDRAWAL_REJECTED', 'withdrawal', withdrawalId, `Rejected ৳${req.amount}. Reason: ${reason}`);
    this.notify();
    return true;
  }

  // --- TASKS & SUBMISSIONS ---
  public getTasks(): Task[] {
    const raw = localStorage.getItem(KEY_TASKS);
    return raw ? JSON.parse(raw) : INITIAL_TASKS;
  }

  public saveTasks(tasks: Task[]) {
    localStorage.setItem(KEY_TASKS, JSON.stringify(tasks));
    this.notify();
  }

  public getSubmissions(userId?: string): TaskSubmission[] {
    const raw = localStorage.getItem(KEY_SUBMISSIONS);
    const all: TaskSubmission[] = raw ? JSON.parse(raw) : [];
    if (userId) {
      return all.filter((s) => s.user_id === userId).sort((a, b) => new Date(b.submitted_at).getTime() - new Date(a.submitted_at).getTime());
    }
    return all.sort((a, b) => new Date(b.submitted_at).getTime() - new Date(a.submitted_at).getTime());
  }

  public submitTask(
    userId: string,
    taskId: string,
    proofText: string,
    proofImageUrl?: string
  ): { success: boolean; message: string } {
    const tasks = this.getTasks();
    const task = tasks.find((t) => t.id === taskId);
    if (!task) return { success: false, message: 'টাস্কটি পাওয়া যায়নি।' };

    const submissions = this.getSubmissions();
    const alreadySubmitted = submissions.some(
      (s) => s.user_id === userId && s.task_id === taskId && s.status !== 'rejected'
    );
    if (alreadySubmitted) {
      return { success: false, message: 'আপনি আগেই এই কাজটি সাবমিট করেছেন।' };
    }

    const user = this.getAllUsers().find((u) => u.id === userId);
    if (!user) return { success: false, message: 'ব্যবহারকারী পাওয়া যায়নি।' };
    if (user.is_verified !== 'verified') {
      return {
        success: false,
        message: 'একাউন্ট ভেরিফিকেশন প্রয়োজন! টাস্ক করতে প্রথমে ১০০ টাকা ফি দিয়ে একাউন্ট ভেরিফাই করুন।'
      };
    }

    const newSubmission: TaskSubmission = {
      id: 'sub-' + Date.now(),
      task_id: taskId,
      user_id: userId,
      user_name: user?.full_name,
      user_email: user?.email,
      task_title: task.title,
      reward_amount: task.reward_amount,
      proof_text: proofText,
      proof_image_url: proofImageUrl,
      status: 'pending',
      submitted_at: new Date().toISOString()
    };

    submissions.unshift(newSubmission);
    localStorage.setItem(KEY_SUBMISSIONS, JSON.stringify(submissions));

    // Insert into Supabase
    try {
      if (supabase) {
        supabase.from('task_submissions').insert([{
          id: newSubmission.id,
          task_id: newSubmission.task_id,
          user_id: newSubmission.user_id,
          task_title: newSubmission.task_title,
          reward_amount: newSubmission.reward_amount,
          proof_text: newSubmission.proof_text,
          proof_image_url: newSubmission.proof_image_url || null,
          status: 'pending',
          submitted_at: newSubmission.submitted_at
        }]).then(() => {});
      }
    } catch (e) {
      console.warn('Supabase task submission insert error:', e);
    }

    // Update participants
    task.current_participants += 1;
    this.saveTasks(tasks);

    this.notify();
    return { success: true, message: 'কাজ সফলভাবে সাবমিট করা হয়েছে! এডমিন ভেরিফাই করে রিওয়ার্ড যোগ করবে।' };
  }

  public approveSubmission(adminId: string, submissionId: string, feedback?: string): boolean {
    const submissions = this.getSubmissions();
    const sub = submissions.find((s) => s.id === submissionId && s.status === 'pending');
    if (!sub) return false;

    sub.status = 'approved';
    sub.admin_feedback = feedback || 'সঠিকভাবে সম্পন্ন হয়েছে';
    sub.processed_at = new Date().toISOString();
    localStorage.setItem(KEY_SUBMISSIONS, JSON.stringify(submissions));

    // Credit user's wallet
    this.creditBalance(
      sub.user_id,
      sub.reward_amount,
      'task_reward',
      `টাস্ক সফলভাবে সম্পন্ন: ${sub.task_title}`,
      sub.id
    );

    this.logAudit(adminId, 'TASK_SUBMISSION_APPROVED', 'submission', submissionId, `Approved ৳${sub.reward_amount} to user ${sub.user_id}`);
    this.notify();
    return true;
  }

  public rejectSubmission(adminId: string, submissionId: string, feedback: string): boolean {
    const submissions = this.getSubmissions();
    const sub = submissions.find((s) => s.id === submissionId && s.status === 'pending');
    if (!sub) return false;

    sub.status = 'rejected';
    sub.admin_feedback = feedback;
    sub.processed_at = new Date().toISOString();
    localStorage.setItem(KEY_SUBMISSIONS, JSON.stringify(submissions));

    this.logAudit(adminId, 'TASK_SUBMISSION_REJECTED', 'submission', submissionId, `Rejected with reason: ${feedback}`);
    this.notify();
    return true;
  }

  // --- KYC / USER VERIFICATION ---
  public async submitVerification(
    userId: string,
    paymentMethod: string,
    senderNumber: string,
    trxId: string,
    proofImage?: string,
    feeAmount: number = 100
  ): Promise<{ success: boolean; message: string }> {
    const users = this.getAllUsers();
    const user = users.find((u) => u.id === userId);
    if (!user) return { success: false, message: 'ব্যবহারকারী পাওয়া যায়নি।' };

    user.is_verified = 'pending';
    user.verification_payment_method = paymentMethod;
    user.verification_sender_number = senderNumber;
    user.verification_trx_id = trxId;
    user.verification_fee_amount = feeAmount;
    user.verification_submitted_at = new Date().toISOString();
    user.verification_doc_image = proofImage;
    user.verification_notes = `১০০ টাকা ভেরিফিকেশন ফি প্রদান করা হয়েছে (${paymentMethod.toUpperCase()} TrxID: ${trxId})। পর্যালোচনায় আছে।`;

    // 1. UPDATE SUPABASE DATABASE
    try {
      if (supabase) {
        const { error } = await supabase.from('profiles').update({
          is_verified: 'pending',
          verification_payment_method: paymentMethod,
          verification_sender_number: senderNumber,
          verification_trx_id: trxId,
          verification_fee_amount: feeAmount,
          verification_doc_image: proofImage || null,
          verification_notes: user.verification_notes
        }).eq('id', userId);

        if (error) {
          console.warn('Supabase verification update error:', error);
        }
      }
    } catch (err) {
      console.warn('Supabase verification sync exception:', err);
    }

    localStorage.setItem(KEY_USERS, JSON.stringify(users));
    if (this.getCurrentUser()?.id === userId) {
      this.setCurrentUser(user);
    }
    this.notify();
    return {
      success: true,
      message: '১০০ টাকা ভেরিফিকেশন রিকোয়েস্ট সফলভাবে জমা হয়েছে! এডমিন যাচাই করে দ্রুত এপ্রুভ করবেন।'
    };
  }

  public async processVerification(adminId: string, userId: string, approved: boolean, notes: string): Promise<boolean> {
    const users = this.getAllUsers();
    const user = users.find((u) => u.id === userId);
    if (!user) return false;

    user.is_verified = approved ? 'verified' : 'rejected';
    user.verification_notes = notes;

    // UPDATE SUPABASE DATABASE
    try {
      if (supabase) {
        await supabase.from('profiles').update({
          is_verified: approved ? 'verified' : 'rejected',
          verification_notes: notes
        }).eq('id', userId);
      }
    } catch (err) {
      console.warn('Supabase process verification update error:', err);
    }

    localStorage.setItem(KEY_USERS, JSON.stringify(users));
    if (this.getCurrentUser()?.id === userId) {
      this.setCurrentUser(user);
    }

    this.logAudit(adminId, approved ? 'KYC_APPROVED' : 'KYC_REJECTED', 'profile', userId, notes);
    this.notify();
    return true;
  }

  // --- BONUSES & REWARDS ---
  public getBonusClaims(userId: string): BonusClaim[] {
    const raw = localStorage.getItem(KEY_BONUSES);
    const all: BonusClaim[] = raw ? JSON.parse(raw) : [];
    return all.filter((b) => b.user_id === userId);
  }

  public claimDailyBonus(userId: string): { success: boolean; message: string; amount?: number } {
    const claims = this.getBonusClaims(userId);
    const now = new Date();
    const todayStr = now.toISOString().split('T')[0];

    const claimedToday = claims.some(
      (c) => c.bonus_type === 'daily' && c.claimed_at.startsWith(todayStr)
    );

    if (claimedToday) {
      return { success: false, message: 'আপনি আজকের দৈনিক বোনাস ইতিমধ্যে গ্রহণ করেছেন। আগামীকাল আবার আসুন!' };
    }

    const settings = this.getSettings();
    const amount = settings.daily_bonus_base;

    const raw = localStorage.getItem(KEY_BONUSES);
    const all: BonusClaim[] = raw ? JSON.parse(raw) : [];
    all.push({
      id: 'bc-' + Date.now(),
      user_id: userId,
      bonus_type: 'daily',
      amount,
      claimed_at: new Date().toISOString()
    });
    localStorage.setItem(KEY_BONUSES, JSON.stringify(all));

    this.creditBalance(userId, amount, 'daily_bonus', 'দৈনিক চেক-ইন বোনাস গ্রহণ');
    return { success: true, message: `অভিনন্দন! আপনি ৳${amount} দৈনিক বোনাস পেয়েছেন!`, amount };
  }

  public claimWelcomeBonus(userId: string): { success: boolean; message: string; amount?: number } {
    const claims = this.getBonusClaims(userId);
    const hasClaimed = claims.some((c) => c.bonus_type === 'welcome');
    if (hasClaimed) {
      return { success: false, message: 'আপনি আগেই ওয়েলকাম বোনাস ক্লেইম করেছেন।' };
    }

    const settings = this.getSettings();
    const amount = settings.welcome_bonus_amount;

    const raw = localStorage.getItem(KEY_BONUSES);
    const all: BonusClaim[] = raw ? JSON.parse(raw) : [];
    all.push({
      id: 'bc-' + Date.now(),
      user_id: userId,
      bonus_type: 'welcome',
      amount,
      claimed_at: new Date().toISOString()
    });
    localStorage.setItem(KEY_BONUSES, JSON.stringify(all));

    this.creditBalance(userId, amount, 'welcome_bonus', '🎉 স্পেশাল ওয়েলকাম বোনাস');
    return { success: true, message: `অভিনন্দন! আপনি ৳${amount} একাউন্ট ওয়েলকাম বোনাস পেয়েছেন!`, amount };
  }

  public claimSpinWin(userId: string, amount: number): { success: boolean; message: string } {
    const raw = localStorage.getItem(KEY_BONUSES);
    const all: BonusClaim[] = raw ? JSON.parse(raw) : [];
    all.push({
      id: 'spin-' + Date.now(),
      user_id: userId,
      bonus_type: 'spin',
      amount,
      claimed_at: new Date().toISOString()
    });
    localStorage.setItem(KEY_BONUSES, JSON.stringify(all));

    if (amount > 0) {
      this.creditBalance(userId, amount, 'spin_win', `লাকি স্পিন হুইল পুরস্কার (৳${amount})`);
    }
    return { success: true, message: amount > 0 ? `অভিনন্দন! আপনি ৳${amount} জিতেছেন!` : 'পরের বার আবার চেষ্টা করুন!' };
  }

  public redeemGiftCode(userId: string, codeStr: string): { success: boolean; message: string; amount?: number } {
    const cleanCode = codeStr.trim().toUpperCase();
    const codes = this.getGiftCodes();
    const target = codes.find((c) => c.code === cleanCode && c.is_active);

    if (!target) {
      return { success: false, message: 'অবৈধ বা মেয়াদোত্তীর্ণ গিফট কোড।' };
    }
    if (target.current_uses >= target.max_uses) {
      return { success: false, message: 'এই কোডের সর্বোচ্চ ব্যবহারের সীমা শেষ হয়ে গেছে।' };
    }

    // Check if user already claimed this code
    const key = STORAGE_PREFIX + 'claimed_code_' + userId + '_' + cleanCode;
    if (localStorage.getItem(key)) {
      return { success: false, message: 'আপনি আগেই এই গিফট কোডটি রিডিম করেছেন।' };
    }

    target.current_uses += 1;
    localStorage.setItem(KEY_GIFT_CODES, JSON.stringify(codes));
    localStorage.setItem(key, 'true');

    this.creditBalance(userId, target.reward_amount, 'gift_code', `গিফট কোড রিডিম: ${cleanCode}`);
    return { success: true, message: `অভিনন্দন! আপনি ৳${target.reward_amount} গিফট বোনাস পেয়েছেন!`, amount: target.reward_amount };
  }

  // --- PROJECTS, BANNERS, NOTICES, SOCIALS, SETTINGS ---
  public getProjects(): ProjectItem[] {
    const raw = localStorage.getItem(KEY_PROJECTS);
    if (!raw) return INITIAL_PROJECTS;
    try {
      const stored: ProjectItem[] = JSON.parse(raw);
      return stored.map((item) => {
        const init = INITIAL_PROJECTS.find((p) => p.id === item.id);
        if (init) {
          return {
            ...item,
            is_coming_soon: init.is_coming_soon ?? item.is_coming_soon,
            badge: init.badge ?? item.badge,
            title_bn: init.title_bn || item.title_bn,
            icon_color: init.icon_color || item.icon_color
          };
        }
        return item;
      });
    } catch {
      return INITIAL_PROJECTS;
    }
  }

  public saveProjects(projects: ProjectItem[]) {
    localStorage.setItem(KEY_PROJECTS, JSON.stringify(projects));
    this.notify();
  }

  public getBanners(): Banner[] {
    const raw = localStorage.getItem(KEY_BANNERS);
    return raw ? JSON.parse(raw) : INITIAL_BANNERS;
  }

  public saveBanners(banners: Banner[]) {
    localStorage.setItem(KEY_BANNERS, JSON.stringify(banners));
    this.notify();
  }

  public getNotice(): Notice {
    const raw = localStorage.getItem(KEY_NOTICE);
    return raw ? JSON.parse(raw) : INITIAL_NOTICE;
  }

  public saveNotice(notice: Notice) {
    localStorage.setItem(KEY_NOTICE, JSON.stringify(notice));
    this.notify();
  }

  public getSocialLinks(): SocialLink[] {
    const raw = localStorage.getItem(KEY_SOCIALS);
    return raw ? JSON.parse(raw) : INITIAL_SOCIAL_LINKS;
  }

  public saveSocialLinks(links: SocialLink[]) {
    localStorage.setItem(KEY_SOCIALS, JSON.stringify(links));
    this.notify();
  }

  public getSettings(): SiteSettings {
    const raw = localStorage.getItem(KEY_SETTINGS);
    if (!raw) return INITIAL_SETTINGS;
    try {
      const parsed = JSON.parse(raw);
      return {
        ...INITIAL_SETTINGS,
        ...parsed,
        payment_numbers: {
          ...INITIAL_SETTINGS.payment_numbers,
          ...(parsed.payment_numbers || {})
        }
      };
    } catch {
      return INITIAL_SETTINGS;
    }
  }

  public saveSettings(settings: SiteSettings) {
    localStorage.setItem(KEY_SETTINGS, JSON.stringify(settings));
    this.notify();
  }

  // --- GMAIL MARKETING & SELL ---
  public getGmailSubmissions(userId?: string): GmailSubmission[] {
    const raw = localStorage.getItem(KEY_GMAIL_SUBMISSIONS);
    const all: GmailSubmission[] = raw ? JSON.parse(raw) : [];
    if (userId) {
      return all
        .filter((s) => s.user_id === userId)
        .sort((a, b) => new Date(b.submitted_at).getTime() - new Date(a.submitted_at).getTime());
    }
    return all.sort((a, b) => new Date(b.submitted_at).getTime() - new Date(a.submitted_at).getTime());
  }

  public submitGmail(
    userId: string,
    gmailAddress: string,
    password: string,
    recoveryEmail?: string
  ): { success: boolean; message: string } {
    const cleanMail = gmailAddress.trim().toLowerCase();
    if (!cleanMail.includes('@gmail.com')) {
      return { success: false, message: 'দয়া করে একটি সঠিক @gmail.com অ্যাড্রেস প্রদান করুন।' };
    }

    const all = this.getGmailSubmissions();
    const existing = all.some((s) => s.gmail_address.toLowerCase() === cleanMail && s.status !== 'rejected');
    if (existing) {
      return { success: false, message: 'এই জিমেইলটি ইতিমধ্যে জমা দেওয়া হয়েছে বা প্রক্রিয়াধীন আছে।' };
    }

    const user = this.getAllUsers().find((u) => u.id === userId);
    if (!user) return { success: false, message: 'ব্যবহারকারী পাওয়া যায়নি।' };
    if (user.is_verified !== 'verified') {
      return {
        success: false,
        message: 'একাউন্ট ভেরিফিকেশন প্রয়োজন! জিমেইল সেল করতে প্রথমে ১০০ টাকা ফি দিয়ে একাউন্ট ভেরিফাই করুন।'
      };
    }
    const settings = this.getSettings();
    const priceRate = settings.gmail_sell_price || 14.00;

    const newSubmission: GmailSubmission = {
      id: 'gm-' + Date.now(),
      user_id: userId,
      user_name: user?.full_name,
      user_email: user?.email,
      gmail_address: cleanMail,
      gmail_password: password.trim(),
      recovery_email: recoveryEmail?.trim(),
      price_rate: priceRate,
      status: 'pending',
      submitted_at: new Date().toISOString()
    };

    all.unshift(newSubmission);
    localStorage.setItem(KEY_GMAIL_SUBMISSIONS, JSON.stringify(all));

    // Insert into Supabase
    try {
      if (supabase) {
        supabase.from('gmail_submissions').insert([{
          id: newSubmission.id,
          user_id: newSubmission.user_id,
          gmail_address: newSubmission.gmail_address,
          gmail_password: newSubmission.gmail_password,
          recovery_email: newSubmission.recovery_email || null,
          price_rate: newSubmission.price_rate,
          status: 'pending',
          submitted_at: newSubmission.submitted_at
        }]).then(() => {});
      }
    } catch (e) {
      console.warn('Supabase gmail insert error:', e);
    }

    this.notify();
    return {
      success: true,
      message: `জিমেইল সফলভাবে জমা দেওয়া হয়েছে! এডমিন ভেরিফাই করে আপনার ওয়ালেটে ৳${priceRate.toFixed(2)} যোগ করে দেবে।`
    };
  }

  public approveGmailSubmission(adminId: string, submissionId: string): boolean {
    const all = this.getGmailSubmissions();
    const sub = all.find((s) => s.id === submissionId && s.status === 'pending');
    if (!sub) return false;

    sub.status = 'approved';
    sub.reviewed_at = new Date().toISOString();
    localStorage.setItem(KEY_GMAIL_SUBMISSIONS, JSON.stringify(all));

    this.creditBalance(
      sub.user_id,
      sub.price_rate,
      'task_reward',
      `জিমেইল সেল পেমেন্ট অনুমোদন (${sub.gmail_address})`,
      sub.id
    );

    this.logAudit(adminId, 'GMAIL_APPROVED', 'gmail_submission', submissionId, `Approved ৳${sub.price_rate} for ${sub.gmail_address}`);
    this.notify();
    return true;
  }

  public rejectGmailSubmission(adminId: string, submissionId: string, reason?: string): boolean {
    const all = this.getGmailSubmissions();
    const sub = all.find((s) => s.id === submissionId && s.status === 'pending');
    if (!sub) return false;

    sub.status = 'rejected';
    sub.rejection_reason = reason || 'ভুল পাসওয়ার্ড বা টু-ফ্যাক্টর অথেনটিকেশন চালু থাকায় বাতিল।';
    sub.reviewed_at = new Date().toISOString();
    localStorage.setItem(KEY_GMAIL_SUBMISSIONS, JSON.stringify(all));

    this.logAudit(adminId, 'GMAIL_REJECTED', 'gmail_submission', submissionId, sub.rejection_reason);
    this.notify();
    return true;
  }

  public getGiftCodes(): GiftCode[] {
    const raw = localStorage.getItem(KEY_GIFT_CODES);
    return raw ? JSON.parse(raw) : DEFAULT_GIFT_CODES;
  }

  public saveGiftCodes(codes: GiftCode[]) {
    localStorage.setItem(KEY_GIFT_CODES, JSON.stringify(codes));
    this.notify();
  }

  public getAuditLogs(): AuditLog[] {
    const raw = localStorage.getItem(KEY_AUDIT_LOGS);
    return raw ? JSON.parse(raw) : [];
  }

  public logAudit(adminId: string, action: string, targetType: string, targetId: string, details: string) {
    const logs = this.getAuditLogs();
    const admin = this.getAllUsers().find((u) => u.id === adminId);
    logs.unshift({
      id: 'log-' + Date.now(),
      admin_id: adminId,
      admin_name: admin?.full_name || 'Admin',
      action,
      target_type: targetType,
      target_id: targetId,
      details,
      created_at: new Date().toISOString()
    });
    localStorage.setItem(KEY_AUDIT_LOGS, JSON.stringify(logs.slice(0, 200)));
  }

  // Admin user status
  public toggleUserSuspension(adminId: string, userId: string): boolean {
    const users = this.getAllUsers();
    const user = users.find((u) => u.id === userId);
    if (!user) return false;
    user.is_suspended = !user.is_suspended;
    localStorage.setItem(KEY_USERS, JSON.stringify(users));
    this.logAudit(adminId, user.is_suspended ? 'USER_SUSPENDED' : 'USER_REACTIVATED', 'user', userId, `User ${user.email} status changed`);
    this.notify();
    return true;
  }

  // Admin manual balance adjustment
  public adjustUserBalance(adminId: string, userId: string, amount: number, reason: string): boolean {
    const wallet = this.getWallet(userId);
    const wallets = this.getWalletsMap();

    wallet.available_balance = parseFloat((wallet.available_balance + amount).toFixed(2));
    wallet.total_balance = parseFloat((wallet.total_balance + amount).toFixed(2));
    if (amount > 0) {
      wallet.total_earnings = parseFloat((wallet.total_earnings + amount).toFixed(2));
    }
    wallet.updated_at = new Date().toISOString();
    wallets[userId] = wallet;
    localStorage.setItem(KEY_WALLETS, JSON.stringify(wallets));

    this.addTransaction({
      user_id: userId,
      amount,
      type: 'admin_adjustment',
      description: `এডমিন সমন্বয়: ${reason}`,
      status: 'completed'
    });

    this.logAudit(adminId, 'BALANCE_ADJUSTMENT', 'wallet', userId, `Adjusted balance by ৳${amount}. Reason: ${reason}`);
    this.notify();
    return true;
  }
}

export const store = AppStore.get();
