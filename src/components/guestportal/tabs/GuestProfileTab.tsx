import React, { useState } from 'react';
import {
  User, Mail, Phone, MapPin, Globe, Shield, ShieldCheck,
  Eye, EyeOff, Lock, Award, CheckCircle2, AlertCircle, Save,
  RefreshCw, FileText, Bell, Sparkles, Send
} from 'lucide-react';
import type { GuestProfileData } from '../types';
import { Modal } from '../../ui/Modal';

interface GuestProfileTabProps {
  profile: GuestProfileData;
  onUpdateProfile: (updates: Partial<GuestProfileData>) => void;
  onAddToast: (toast: { type: 'success' | 'warning' | 'info' | 'error'; title: string; message: string }) => void;
}

export const GuestProfileTab: React.FC<GuestProfileTabProps> = ({
  profile,
  onUpdateProfile,
  onAddToast,
}) => {
  // Editable contact fields
  const [phone, setPhone] = useState(profile.phone);
  const [email, setEmail] = useState(profile.email);
  const [address, setAddress] = useState(profile.address);
  const [nationality, setNationality] = useState(profile.nationality);

  // Emergency contact fields
  const [emergencyName, setEmergencyName] = useState(profile.emergencyContact.name);
  const [emergencyRelationship, setEmergencyRelationship] = useState(profile.emergencyContact.relationship);
  const [emergencyPhone, setEmergencyPhone] = useState(profile.emergencyContact.phone);

  // Password modal
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // ID Mask toggle
  const [showFullId, setShowFullId] = useState(false);

  // Request ID Correction Modal (Requires Staff Approval)
  const [isCorrectionModalOpen, setIsCorrectionModalOpen] = useState(false);
  const [correctionReason, setCorrectionReason] = useState('Renewed passport prior to arrival');
  const [newIdNumber, setNewIdNumber] = useState('');
  const [newExpiryDate, setNewExpiryDate] = useState('2034-01-01');

  // Preferences
  const [language, setLanguage] = useState(profile.language);
  const [emailNotif, setEmailNotif] = useState(profile.commPreferences.email);
  const [smsNotif, setSmsNotif] = useState(profile.commPreferences.sms);
  const [whatsappNotif, setWhatsappNotif] = useState(profile.commPreferences.whatsapp);

  const handleSaveContact = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateProfile({
      phone,
      email,
      address,
      nationality,
      emergencyContact: {
        name: emergencyName,
        relationship: emergencyRelationship,
        phone: emergencyPhone,
      },
      language,
      commPreferences: {
        email: emailNotif,
        sms: smsNotif,
        whatsapp: whatsappNotif,
      },
    });
    onAddToast({
      type: 'success',
      title: 'Profile Updated',
      message: 'Your personal contact details and communication preferences were saved.',
    });
  };

  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPassword || newPassword !== confirmPassword) {
      onAddToast({ type: 'warning', title: 'Password Mismatch', message: 'New passwords do not match.' });
      return;
    }
    setIsPasswordModalOpen(false);
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    onAddToast({
      type: 'success',
      title: 'Password Changed',
      message: 'Your guest portal login password has been updated securely.',
    });
  };

  const handleRequestCorrection = (e: React.FormEvent) => {
    e.preventDefault();
    setIsCorrectionModalOpen(false);
    onAddToast({
      type: 'info',
      title: 'Identity Correction Request Submitted',
      message: 'Your document correction request was routed to Front Desk Management for verification and approval.',
    });
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header Profile Ribbon */}
      <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-5">
        <div className="flex items-center gap-4 sm:gap-5">
          <div className="relative">
            <img
              src={profile.avatar}
              alt={profile.fullName}
              className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover border-2 border-indigo-500 shadow-sm"
            />
            <span className="absolute -bottom-1 -right-1 px-1.5 py-0.5 bg-indigo-600 text-[10px] text-white font-bold rounded-md">
              {profile.tier}
            </span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white font-serif">
                {profile.fullName}
              </h2>
              <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300">
                ID: {profile.guestId}
              </span>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 flex items-center gap-2">
              <span>{profile.nationality} Citizen</span>
              <span>·</span>
              <span>DOB: {profile.dateOfBirth}</span>
            </p>
          </div>
        </div>

        {/* Loyalty Points Capsule */}
        <div className="flex items-center gap-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 p-4 rounded-2xl">
          <div className="w-10 h-10 rounded-xl bg-[#1e3a5f] text-white flex items-center justify-center font-bold">
            <Award className="w-5 h-5 text-blue-300" />
          </div>
          <div>
            <p className="text-[11px] uppercase font-bold text-[#1e3a5f] dark:text-blue-200">
              LuxeRewards Balance
            </p>
            <p className="text-lg font-bold text-blue-900 dark:text-blue-100">
              {profile.loyaltyPoints.toLocaleString()} Points
            </p>
            <p className="text-[10px] text-blue-700 dark:text-blue-300">
              Equivalent to ${(profile.loyaltyPoints / 100).toFixed(2)} in hotel credit
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column (8 cols): Contact & Emergency Information */}
        <div className="lg:col-span-8 space-y-6">
          <form onSubmit={handleSaveContact} className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 shadow-xs space-y-5">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="text-sm font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <User className="w-4 h-4 text-indigo-600" />
                Personal Contact Information
              </h3>
              <span className="text-[11px] text-gray-400">Permitted fields editable</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold mb-1 text-gray-700 dark:text-gray-300">Phone Number</label>
                <div className="relative">
                  <Phone className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-3" />
                  <input
                    type="tel"
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl text-xs"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold mb-1 text-gray-700 dark:text-gray-300">Email Address</label>
                <div className="relative">
                  <Mail className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-3" />
                  <input
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl text-xs"
                    required
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold mb-1 text-gray-700 dark:text-gray-300">Permanent Address</label>
                <div className="relative">
                  <MapPin className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    value={address}
                    onChange={e => setAddress(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl text-xs"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold mb-1 text-gray-700 dark:text-gray-300">Nationality</label>
                <div className="relative">
                  <Globe className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    value={nationality}
                    onChange={e => setNationality(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl text-xs"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Emergency Contact Sub-Section */}
            <div className="pt-4 border-t border-gray-100 dark:border-gray-700 space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-gray-500">Emergency Contact Person</h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold mb-1">Contact Name</label>
                  <input
                    type="text"
                    value={emergencyName}
                    onChange={e => setEmergencyName(e.target.value)}
                    className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl text-xs"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold mb-1">Relationship</label>
                  <input
                    type="text"
                    value={emergencyRelationship}
                    onChange={e => setEmergencyRelationship(e.target.value)}
                    className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl text-xs"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold mb-1">Emergency Phone</label>
                  <input
                    type="tel"
                    value={emergencyPhone}
                    onChange={e => setEmergencyPhone(e.target.value)}
                    className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl text-xs"
                  />
                </div>
              </div>
            </div>

            {/* Language & Communication Channels */}
            <div className="pt-4 border-t border-gray-100 dark:border-gray-700 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold mb-1">Preferred Language</label>
                <select
                  value={language}
                  onChange={e => setLanguage(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl text-xs"
                >
                  <option value="English (UK)">English (UK)</option>
                  <option value="English (US)">English (US)</option>
                  <option value="Français">Français</option>
                  <option value="Deutsch">Deutsch</option>
                  <option value="Español">Español</option>
                  <option value="العربية">العربية</option>
                  <option value="日本語">日本語</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold mb-1.5">Notification Channels</label>
                <div className="flex flex-wrap gap-3 text-xs">
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input type="checkbox" checked={emailNotif} onChange={e => setEmailNotif(e.target.checked)} className="rounded text-indigo-600" />
                    <span>Email</span>
                  </label>
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input type="checkbox" checked={smsNotif} onChange={e => setSmsNotif(e.target.checked)} className="rounded text-indigo-600" />
                    <span>SMS</span>
                  </label>
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input type="checkbox" checked={whatsappNotif} onChange={e => setWhatsappNotif(e.target.checked)} className="rounded text-indigo-600" />
                    <span>WhatsApp</span>
                  </label>
                </div>
              </div>
            </div>

            <div className="flex justify-between items-center pt-3 border-t">
              <button
                type="button"
                onClick={() => setIsPasswordModalOpen(true)}
                className="text-xs text-indigo-600 dark:text-indigo-400 font-bold hover:underline flex items-center gap-1"
              >
                <Lock className="w-3.5 h-3.5" /> Change Account Password
              </button>

              <button
                type="submit"
                className="flex items-center gap-1.5 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-xs transition-colors"
              >
                <Save className="w-3.5 h-3.5" /> Save Changes
              </button>
            </div>
          </form>
        </div>

        {/* Right Column (4 cols): Verified Identification & Security */}
        <div className="lg:col-span-4 space-y-5">
          {/* Identity Document Card (Sensitive Data Masking) */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                Verified Legal Identification
              </h3>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300">
                Verified
              </span>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <p className="text-[11px] text-gray-400">Document Type</p>
                <p className="font-bold text-gray-900 dark:text-white">{profile.identification.type}</p>
              </div>

              <div>
                <div className="flex items-center justify-between">
                  <p className="text-[11px] text-gray-400">Document Number (Masked)</p>
                  <button
                    type="button"
                    onClick={() => setShowFullId(!showFullId)}
                    className="text-[10px] text-indigo-600 hover:underline flex items-center gap-1"
                  >
                    {showFullId ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                    <span>{showFullId ? 'Hide' : 'Reveal'}</span>
                  </button>
                </div>
                <p className="font-mono font-bold text-sm text-gray-900 dark:text-white tracking-widest mt-0.5">
                  {showFullId ? profile.identification.fullNumber : profile.identification.maskedNumber}
                </p>
              </div>

              <div>
                <p className="text-[11px] text-gray-400">Document Expiry Date</p>
                <p className="font-semibold text-gray-800 dark:text-gray-200">{profile.identification.expiryDate}</p>
              </div>

              <div className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-xl border border-gray-200 dark:border-gray-600 text-[11px] text-gray-500 dark:text-gray-400 space-y-1">
                <p><strong>Certified on:</strong> {profile.identification.verificationDate}</p>
                <p><strong>Audited by:</strong> {profile.identification.verifyingAgent}</p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setIsCorrectionModalOpen(true)}
              className="w-full py-2.5 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-1.5"
            >
              <FileText className="w-3.5 h-3.5" />
              Request ID Correction (Staff Approval)
            </button>
            <p className="text-[10px] text-gray-400 text-center">
              Changes to legal documents require duty manager authorization.
            </p>
          </div>
        </div>
      </div>

      {/* Password Change Modal */}
      <Modal isOpen={isPasswordModalOpen} onClose={() => setIsPasswordModalOpen(false)} title="Change Portal Password">
        <form onSubmit={handleChangePassword} className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-semibold mb-1">Current Password</label>
            <input
              type="password"
              value={currentPassword}
              onChange={e => setCurrentPassword(e.target.value)}
              className="w-full px-3 py-2 border rounded-xl text-xs dark:bg-gray-700"
              required
            />
          </div>
          <div>
            <label className="block text-xs font-semibold mb-1">New Password</label>
            <input
              type="password"
              value={newPassword}
              onChange={e => setNewPassword(e.target.value)}
              className="w-full px-3 py-2 border rounded-xl text-xs dark:bg-gray-700"
              required
            />
          </div>
          <div>
            <label className="block text-xs font-semibold mb-1">Confirm New Password</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={e => setConfirmPassword(e.target.value)}
              className="w-full px-3 py-2 border rounded-xl text-xs dark:bg-gray-700"
              required
            />
          </div>
          <div className="flex justify-end gap-2 pt-2 border-t">
            <button type="button" onClick={() => setIsPasswordModalOpen(false)} className="px-4 py-2 border rounded-xl text-xs">
              Cancel
            </button>
            <button type="submit" className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold">
              Update Password
            </button>
          </div>
        </form>
      </Modal>

      {/* ID Correction Request Modal */}
      <Modal isOpen={isCorrectionModalOpen} onClose={() => setIsCorrectionModalOpen(false)} title="Request Official Identity Document Correction">
        <form onSubmit={handleRequestCorrection} className="p-6 space-y-4">
          <div className="p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl text-xs text-blue-900 dark:text-blue-200">
            <strong>Security Notice:</strong> Front Office regulations require staff approval before modifying verified legal travel documents. Please submit the updated details along with justification.
          </div>
          <div>
            <label className="block text-xs font-semibold mb-1">Correction Reason</label>
            <select
              value={correctionReason}
              onChange={e => setCorrectionReason(e.target.value)}
              className="w-full px-3 py-2 border rounded-xl text-xs dark:bg-gray-700"
            >
              <option value="Renewed passport prior to arrival">Renewed passport prior to arrival</option>
              <option value="Spelling error in legal name">Spelling error in legal name</option>
              <option value="Updated national identity card">Updated national identity card</option>
              <option value="Dual citizenship document switch">Dual citizenship document switch</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold mb-1">New Document Number</label>
            <input
              type="text"
              value={newIdNumber}
              onChange={e => setNewIdNumber(e.target.value)}
              placeholder="e.g. GBR-9902184"
              className="w-full px-3 py-2 border rounded-xl text-xs dark:bg-gray-700 font-mono"
              required
            />
          </div>
          <div>
            <label className="block text-xs font-semibold mb-1">New Expiration Date</label>
            <input
              type="date"
              value={newExpiryDate}
              onChange={e => setNewExpiryDate(e.target.value)}
              className="w-full px-3 py-2 border rounded-xl text-xs dark:bg-gray-700"
              required
            />
          </div>
          <div className="flex justify-end gap-2 pt-2 border-t">
            <button type="button" onClick={() => setIsCorrectionModalOpen(false)} className="px-4 py-2 border rounded-xl text-xs">
              Cancel
            </button>
            <button type="submit" className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5">
              <Send className="w-3.5 h-3.5" /> Submit to Duty Manager
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
