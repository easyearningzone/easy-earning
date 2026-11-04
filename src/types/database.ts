export type UserRole = 'user' | 'admin';
export type VerificationStatus = 'unverified' | 'pending' | 'verified' | 'rejected';
export type PaymentMethod = 'bkash' | 'nagad' | 'rocket';
export type TransactionType =
  | 'deposit'
  | 'task_reward'
  | 'referral_bonus'
  | 'daily_bonus'
  | 'spin_win'
  | 'welcome_bonus'
  | 'gift_code'
  | 'withdrawal'
  | 'admin_adjustment';

export type TransactionStatus = 'completed' | 'pending' | 'failed' | 'cancelled';
export type WithdrawalStatus = 'pending' | 'approved' | 'rejected';
export type SubmissionStatus = 'pending' | 'approved' | 'rejected';

export interface UserProfile {
  id: string;
  email: string;
  full_name: string;
  mobile: string;
  avatar_url?: string;
  role: UserRole;
  referral_code: string;
  referred_by?: string;
  created_at: string;
  is_verified: VerificationStatus;
  is_suspended: boolean;
  verification_doc_type?: string;
  verification_doc_number?: string;
  verification_doc_image?: string;
  verification_notes?: string;
}

export interface Wallet {
  id: string;
  user_id: string;
  total_balance: number;
  available_balance: number;
  pending_balance: number;
  total_earnings: number;
  total_withdrawals: number;
  updated_at: string;
}

export interface WalletTransaction {
  id: string;
  user_id: string;
  amount: number;
  type: TransactionType;
  description: string;
  reference_id?: string;
  status: TransactionStatus;
  created_at: string;
}

export interface WithdrawalRequest {
  id: string;
  user_id: string;
  user_name?: string;
  user_mobile?: string;
  method: PaymentMethod;
  account_number: string;
  account_type?: 'personal' | 'agent';
  amount: number;
  fee: number;
  final_amount: number;
  status: WithdrawalStatus;
  admin_transaction_id?: string;
  rejection_reason?: string;
  created_at: string;
  processed_at?: string;
}

export interface Task {
  id: string;
  title: string;
  category: string;
  description: string;
  instructions: string[];
  reward_amount: number;
  task_link?: string;
  required_proof: string;
  max_participants: number;
  current_participants: number;
  deadline?: string;
  status: 'active' | 'inactive';
  icon?: string;
  created_at: string;
}

export interface TaskSubmission {
  id: string;
  task_id: string;
  user_id: string;
  user_name?: string;
  user_email?: string;
  task_title: string;
  reward_amount: number;
  proof_text: string;
  proof_image_url?: string;
  status: SubmissionStatus;
  admin_feedback?: string;
  submitted_at: string;
  processed_at?: string;
}

export interface ProjectItem {
  id: string;
  title: string;
  title_bn: string;
  category: string;
  icon: string;
  icon_color: string;
  status: 'active' | 'inactive';
  requires_verification: boolean;
  action_type: 'modal' | 'route' | 'external';
  modal_id?: string;
  badge?: string;
  description: string;
  is_coming_soon?: boolean;
}

export interface Banner {
  id: string;
  title: string;
  image_url: string;
  link?: string;
  badge?: string;
  status: 'active' | 'inactive';
  order_index: number;
}

export interface Notice {
  id: string;
  title: string;
  message: string;
  telegram_url: string;
  whatsapp_url: string;
  tutorial_url: string;
  is_active: boolean;
  display_frequency: 'always' | 'once_per_session' | 'disabled';
  created_at: string;
}

export interface SocialLink {
  id: string;
  platform: string;
  name: string;
  name_bn: string;
  url: string;
  icon: string;
  color: string;
  is_active: boolean;
  order_index: number;
}

export interface BonusClaim {
  id: string;
  user_id: string;
  bonus_type: 'daily' | 'welcome' | 'target' | 'spin' | 'weekly' | 'monthly';
  amount: number;
  claimed_at: string;
}

export interface GiftCode {
  id: string;
  code: string;
  reward_amount: number;
  max_uses: number;
  current_uses: number;
  expires_at?: string;
  is_active: boolean;
}

export interface GmailSubmission {
  id: string;
  user_id: string;
  user_name?: string;
  user_email?: string;
  gmail_address: string;
  gmail_password: string;
  recovery_email?: string;
  price_rate: number;
  status: 'pending' | 'approved' | 'rejected';
  rejection_reason?: string;
  submitted_at: string;
  reviewed_at?: string;
}

export interface SiteSettings {
  site_name: string;
  tagline: string;
  developer_credit: string;
  currency_symbol: string;
  min_withdrawal: number;
  max_withdrawal: number;
  withdrawal_fee_pct: number;
  referral_bonus: number;
  referral_commission_pct: number;
  daily_bonus_base: number;
  welcome_bonus_amount: number;
  support_whatsapp: string;
  support_telegram: string;
  support_email: string;
  support_phone: string;
  notice_headline: string;
  notice_enabled: boolean;
  is_maintenance: boolean;
  gmail_sell_price: number;
  gmail_daily_limit: number;
  gmail_today_password: string;
  gmail_tutorial_url: string;
  gmail_report_time: string;
  payment_numbers: {
    bkash: string;
    nagad: string;
    rocket: string;
  };
}

export interface AuditLog {
  id: string;
  admin_id: string;
  admin_name: string;
  action: string;
  target_type: string;
  target_id: string;
  details: string;
  created_at: string;
}
