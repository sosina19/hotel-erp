import React, { useState, useEffect } from 'react';
import {
  UserPlus, Scan, Sparkles, ShieldCheck, User, MapPin,
  CheckCircle2, Clock, Check, AlertCircle, ArrowLeft
} from 'lucide-react';
import type { Guest } from '../../../data/mockData';

interface NewGuestRegistrationProps {
  onRegisterGuest: (newGuest: Guest) => void;
  onNavigateToScanner: () => void;
  onNavigateToCrm: () => void;
  onAddToast: (toast: { type: 'success' | 'warning' | 'info' | 'error'; title: string; message: string }) => void;
  nextGuestId: string;
  initialValues?: Partial<Guest>;
  onBack?: () => void;
}

export const NewGuestRegistration: React.FC<NewGuestRegistrationProps> = ({
  onRegisterGuest,
  onNavigateToScanner,
  onNavigateToCrm,
  onAddToast,
  nextGuestId,
  initialValues,
  onBack,
}) => {
  const [regGuestId] = useState(nextGuestId || 'G009');
  const [regFirstName, setRegFirstName] = useState(initialValues?.firstName || '');
  const [regMiddleName, setRegMiddleName] = useState(initialValues?.middleName || '');
  const [regLastName, setRegLastName] = useState(initialValues?.lastName || '');
  const [regEmail, setRegEmail] = useState(initialValues?.email || '');
  const [regPhone, setRegPhone] = useState(initialValues?.phone || '');
  const [regDob, setRegDob] = useState(initialValues?.dateOfBirth || '1990-01-01');
  const [regNationality, setRegNationality] = useState(initialValues?.nationality || 'United States');
  const [regGender, setRegGender] = useState<'Male' | 'Female' | 'Other' | 'Prefer not to say'>('Male');
  const [regAddress, setRegAddress] = useState(initialValues?.address || '');
  const [regIdType, setRegIdType] = useState<'Passport' | 'National ID' | 'Driver License'>('Passport');
  const [regIdNumber, setRegIdNumber] = useState(initialValues?.idNumber || initialValues?.passportNumber || '');
  const [regIdExpiry, setRegIdExpiry] = useState(initialValues?.idExpiryDate || '2030-01-01');
  const [regEmergencyName, setRegEmergencyName] = useState(initialValues?.emergencyContactName || '');
  const [regEmergencyPhone, setRegEmergencyPhone] = useState(initialValues?.emergencyContactPhone || '');

  useEffect(() => {
    if (initialValues) {
      if (initialValues.firstName !== undefined) setRegFirstName(initialValues.firstName);
      if (initialValues.middleName !== undefined) setRegMiddleName(initialValues.middleName || '');
      if (initialValues.lastName !== undefined) setRegLastName(initialValues.lastName);
      if (initialValues.email !== undefined) setRegEmail(initialValues.email);
      if (initialValues.phone !== undefined) setRegPhone(initialValues.phone);
      if (initialValues.dateOfBirth !== undefined) setRegDob(initialValues.dateOfBirth);
      if (initialValues.nationality !== undefined) setRegNationality(initialValues.nationality);
      if (initialValues.gender !== undefined) setRegGender(initialValues.gender as any);
      if (initialValues.address !== undefined) setRegAddress(initialValues.address);
      if (initialValues.idNumber || initialValues.passportNumber) setRegIdNumber(initialValues.idNumber || initialValues.passportNumber || '');
      if (initialValues.idExpiryDate) setRegIdExpiry(initialValues.idExpiryDate);
      if (initialValues.emergencyContactName) setRegEmergencyName(initialValues.emergencyContactName);
      if (initialValues.emergencyContactPhone) setRegEmergencyPhone(initialValues.emergencyContactPhone);
    }
  }, [initialValues]);

  const handleFillDemo = () => {
    setRegFirstName('Julian');
    setRegMiddleName('Alexander');
    setRegLastName('Sterling');
    setRegEmail('julian.sterling@consortium.org');
    setRegPhone('+1 (555) 349-8802');
    setRegDob('1984-06-18');
    setRegNationality('United Kingdom');
    setRegGender('Male');
    setRegAddress('14 Berkeley Square, Mayfair, London W1J 6BQ');
    setRegIdType('Passport');
    setRegIdNumber('GBR-88392014');
    setRegIdExpiry('2032-11-20');
    setRegEmergencyName('Lady Eleanor Sterling (Spouse)');
    setRegEmergencyPhone('+44 20 7946 0912');
    onAddToast({ type: 'info', title: 'Sample Guest Filled', message: 'All 14 fields populated with demo data.' });
  };

  const handleClear = () => {
    setRegFirstName('');
    setRegMiddleName('');
    setRegLastName('');
    setRegEmail('');
    setRegPhone('');
    setRegAddress('');
    setRegIdNumber('');
    setRegEmergencyName('');
    setRegEmergencyPhone('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!regFirstName || !regLastName || !regEmail || !regPhone || !regIdNumber) {
      onAddToast({ type: 'warning', title: 'Required Fields', message: 'Please complete all required demographic and identity fields.' });
      return;
    }

    const newGuest: Guest = {
      id: regGuestId,
      firstName: regFirstName,
      middleName: regMiddleName || undefined,
      lastName: regLastName,
      email: regEmail,
      phone: regPhone,
      dateOfBirth: regDob,
      nationality: regNationality,
      gender: regGender,
      address: regAddress,
      idType: regIdType,
      idNumber: regIdNumber,
      idExpiryDate: regIdExpiry,
      emergencyContactName: regEmergencyName,
      emergencyContactPhone: regEmergencyPhone,
      passportNumber: regIdType === 'Passport' ? regIdNumber : `PASS-${Math.floor(100000 + Math.random() * 900000)}`,
      vipStatus: false,
      tier: 'Bronze',
      totalStays: 0,
      totalSpend: 0,
      preferences: ['Standard Room'],
      allergies: [],
      notes: 'New guest registered at Front Office reception.',
      lastStay: 'Never',
      joinDate: new Date().toISOString().split('T')[0],
      createdAt: new Date().toISOString(),
      avatar: `https://images.unsplash.com/photo-1534528741775?w=150&q=80`,
    };

    onRegisterGuest(newGuest);
    onAddToast({
      type: 'success',
      title: 'Guest Registered',
      message: `${newGuest.firstName} ${newGuest.lastName} (${newGuest.id}) added to CRM database.`,
    });
    onNavigateToCrm();
  };

  return (
    <div className="space-y-5 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          {onBack && (
            <button
              type="button"
              onClick={onBack}
              title="Return to previous screen"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700 shadow-xs transition-all"
            >
              <ArrowLeft className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
              <span>Back</span>
            </button>
          )}
          <div>
            <h2 className="text-lg font-bold text-gray-900 dark:text-white font-serif flex items-center gap-2">
              <UserPlus className="w-5 h-5 text-emerald-600" />
              New Guest Registration (14 Standard PMS Fields)
            </h2>
            <p className="text-xs text-gray-500">
              Systematic guest check-in intake. Collect demographics, legal identification documents, and emergency contacts.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onNavigateToScanner}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 hover:bg-indigo-100 rounded-xl text-xs font-bold border border-indigo-200 dark:border-indigo-800 transition-colors"
          >
            <Scan className="w-3.5 h-3.5" /> Scan ID via OCR Beam
          </button>
          <button
            type="button"
            onClick={handleFillDemo}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-xl text-xs font-semibold"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-500" /> Demo Sample Fill
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Form Fields: 8 cols */}
        <div className="lg:col-span-8 space-y-4">
          {/* Section 1: System & Identity Documents */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-gray-100 dark:border-gray-700 pb-3">
              <h3 className="text-sm font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-indigo-600" />
                1. System Identifier & Legal Identification
              </h3>
              <span className="text-[11px] font-mono font-bold px-2 py-0.5 rounded bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400">
                PMS Ref: {regGuestId}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              <div>
                <label className="text-[11px] font-bold uppercase text-gray-500 block mb-1">
                  Guest ID (Auto-Generated)
                </label>
                <input
                  type="text"
                  value={regGuestId}
                  readOnly
                  className="w-full px-3 py-2 bg-gray-100 dark:bg-gray-700/60 border border-gray-200 dark:border-gray-600 rounded-xl text-xs font-mono font-bold text-gray-700 dark:text-gray-300 cursor-not-allowed"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold uppercase text-gray-500 block mb-1">
                  Identification Type *
                </label>
                <select
                  value={regIdType}
                  onChange={e => setRegIdType(e.target.value as any)}
                  className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl text-xs font-semibold"
                >
                  <option value="Passport">Passport</option>
                  <option value="National ID">National ID Card</option>
                  <option value="Driver License">Driver's License</option>
                </select>
              </div>

              <div>
                <label className="text-[11px] font-bold uppercase text-gray-500 block mb-1">
                  Identification Number *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. USA-992817441"
                  value={regIdNumber}
                  onChange={e => setRegIdNumber(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl text-xs font-mono"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold uppercase text-gray-500 block mb-1">
                  Document Expiry Date *
                </label>
                <input
                  type="date"
                  required
                  value={regIdExpiry}
                  onChange={e => setRegIdExpiry(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl text-xs"
                />
                {new Date(regIdExpiry) < new Date() && (
                  <span className="text-[10px] text-red-500 font-bold flex items-center gap-1 mt-1">
                    <AlertCircle className="w-3 h-3" /> Document is Expired!
                  </span>
                )}
              </div>

              <div className="sm:col-span-2">
                <label className="text-[11px] font-bold uppercase text-gray-500 block mb-1">
                  Nationality (Citizenship) *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Country of citizenship"
                  value={regNationality}
                  onChange={e => setRegNationality(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl text-xs"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Personal & Contact Information */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-5 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-gray-900 dark:text-white border-b border-gray-100 dark:border-gray-700 pb-3 flex items-center gap-2">
              <User className="w-4 h-4 text-emerald-600" />
              2. Personal & Contact Profile
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="text-[11px] font-bold uppercase text-gray-500 block mb-1">
                  First Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Given name"
                  value={regFirstName}
                  onChange={e => setRegFirstName(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl text-xs"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold uppercase text-gray-500 block mb-1">
                  Middle Name (Optional)
                </label>
                <input
                  type="text"
                  placeholder="Middle name"
                  value={regMiddleName}
                  onChange={e => setRegMiddleName(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl text-xs"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold uppercase text-gray-500 block mb-1">
                  Last Name (Surname) *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Surname"
                  value={regLastName}
                  onChange={e => setRegLastName(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl text-xs"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold uppercase text-gray-500 block mb-1">
                  Contact Email *
                </label>
                <input
                  type="email"
                  required
                  placeholder="guest@domain.com"
                  value={regEmail}
                  onChange={e => setRegEmail(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl text-xs"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold uppercase text-gray-500 block mb-1">
                  Primary Phone Number *
                </label>
                <input
                  type="tel"
                  required
                  placeholder="+1 555-0100"
                  value={regPhone}
                  onChange={e => setRegPhone(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl text-xs"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold uppercase text-gray-500 block mb-1">
                  Date of Birth *
                </label>
                <input
                  type="date"
                  required
                  value={regDob}
                  onChange={e => setRegDob(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl text-xs"
                />
              </div>

              <div className="sm:col-span-3">
                <label className="text-[11px] font-bold uppercase text-gray-500 block mb-1">
                  Gender (Policy Compliance)
                </label>
                <div className="flex gap-2">
                  {(['Male', 'Female', 'Other', 'Prefer not to say'] as const).map(g => (
                    <button
                      type="button"
                      key={g}
                      onClick={() => setRegGender(g)}
                      className={`flex-1 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
                        regGender === g
                          ? 'bg-emerald-50 dark:bg-emerald-900/40 border-emerald-500 text-emerald-700 dark:text-emerald-300 shadow-xs'
                          : 'border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400'
                      }`}
                    >
                      {g}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Section 3: Address & Emergency Contacts */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-5 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-gray-900 dark:text-white border-b border-gray-100 dark:border-gray-700 pb-3 flex items-center gap-2">
              <MapPin className="w-4 h-4 text-amber-600" />
              3. Physical Address & Emergency Contacts
            </h3>

            <div className="space-y-3">
              <div>
                <label className="text-[11px] font-bold uppercase text-gray-500 block mb-1">
                  Full Residential Address *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Street, City, State/Province, Postal Code, Country"
                  value={regAddress}
                  onChange={e => setRegAddress(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl text-xs"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                <div>
                  <label className="text-[11px] font-bold uppercase text-gray-500 block mb-1">
                    Emergency Contact Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Person name and relationship (e.g. Jane Doe - Sister)"
                    value={regEmergencyName}
                    onChange={e => setRegEmergencyName(e.target.value)}
                    className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl text-xs"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold uppercase text-gray-500 block mb-1">
                    Emergency Contact Phone *
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="+1 555-0998"
                    value={regEmergencyPhone}
                    onChange={e => setRegEmergencyPhone(e.target.value)}
                    className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl text-xs"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Submission Actions */}
          <div className="flex items-center justify-between pt-2">
            <button
              type="button"
              onClick={handleClear}
              className="px-4 py-2 text-xs font-semibold text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
            >
              Clear Fields
            </button>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={onNavigateToCrm}
                className="px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-xl text-xs font-semibold text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                Cancel / Back to CRM
              </button>

              <button
                type="submit"
                className="flex items-center gap-2 px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-md transition-all hover:shadow-lg"
              >
                <CheckCircle2 className="w-4 h-4" /> Save & Register Guest Profile
              </button>
            </div>
          </div>
        </div>

        {/* Live Preview Card & Requirements Summary: 4 cols */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-5 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase text-gray-500">Live PMS Card Preview</span>
              <span className="text-[10px] bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300 font-bold px-2 py-0.5 rounded">
                New Guest
              </span>
            </div>

            <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-indigo-950 text-white rounded-xl p-4 shadow-inner space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-emerald-500/20 border-2 border-emerald-400 flex items-center justify-center font-bold text-lg text-emerald-300">
                  {regFirstName ? regFirstName[0] : 'G'}{regLastName ? regLastName[0] : ''}
                </div>
                <div>
                  <h4 className="font-bold text-sm leading-tight">
                    {regFirstName || 'First'} {regMiddleName ? `${regMiddleName} ` : ''}{regLastName || 'Last'}
                  </h4>
                  <span className="text-[11px] text-emerald-400 font-mono font-semibold">{regGuestId}</span>
                </div>
              </div>

              <div className="text-[11px] space-y-1 text-gray-300 pt-2 border-t border-white/10 font-mono">
                <p className="flex justify-between">
                  <span className="text-gray-400">Doc:</span>
                  <span>{regIdType} ({regIdNumber || 'Pending'})</span>
                </p>
                <p className="flex justify-between">
                  <span className="text-gray-400">Citizenship:</span>
                  <span>{regNationality}</span>
                </p>
                <p className="flex justify-between">
                  <span className="text-gray-400">Expiry:</span>
                  <span>{regIdExpiry}</span>
                </p>
                <p className="flex justify-between">
                  <span className="text-gray-400">Phone:</span>
                  <span>{regPhone || '—'}</span>
                </p>
                <p className="flex justify-between truncate">
                  <span className="text-gray-400">Email:</span>
                  <span className="truncate max-w-[140px]">{regEmail || '—'}</span>
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-5 shadow-sm space-y-2.5 text-xs">
            <span className="text-[11px] font-bold uppercase text-gray-500 block">
              Part A: 14 Required PMS Fields Checklist
            </span>
            <ul className="space-y-1.5 text-gray-600 dark:text-gray-400">
              <li className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                <span>1. <strong>Guest ID:</strong> {regGuestId} (Unique)</span>
              </li>
              <li className="flex items-center gap-2">
                {regFirstName ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Clock className="w-3.5 h-3.5 text-gray-400" />}
                <span>2. <strong>First Name:</strong> {regFirstName || 'Required'}</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                <span>3. <strong>Middle Name:</strong> {regMiddleName || 'Optional'}</span>
              </li>
              <li className="flex items-center gap-2">
                {regLastName ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Clock className="w-3.5 h-3.5 text-gray-400" />}
                <span>4. <strong>Last Name:</strong> {regLastName || 'Required'}</span>
              </li>
              <li className="flex items-center gap-2">
                {regEmail ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Clock className="w-3.5 h-3.5 text-gray-400" />}
                <span>5. <strong>Email:</strong> {regEmail || 'Required'}</span>
              </li>
              <li className="flex items-center gap-2">
                {regPhone ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Clock className="w-3.5 h-3.5 text-gray-400" />}
                <span>6. <strong>Phone:</strong> {regPhone || 'Required'}</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                <span>7. <strong>Date of Birth:</strong> {regDob}</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                <span>8. <strong>Nationality:</strong> {regNationality}</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                <span>9. <strong>Gender:</strong> {regGender}</span>
              </li>
              <li className="flex items-center gap-2">
                {regAddress ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Clock className="w-3.5 h-3.5 text-gray-400" />}
                <span>10. <strong>Address:</strong> {regAddress ? 'Filled' : 'Required'}</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                <span>11. <strong>ID Type:</strong> {regIdType}</span>
              </li>
              <li className="flex items-center gap-2">
                {regIdNumber ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Clock className="w-3.5 h-3.5 text-gray-400" />}
                <span>12. <strong>ID Number:</strong> {regIdNumber || 'Required'}</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                <span>13. <strong>Doc Expiry:</strong> {regIdExpiry}</span>
              </li>
              <li className="flex items-center gap-2">
                {regEmergencyName && regEmergencyPhone ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Clock className="w-3.5 h-3.5 text-gray-400" />}
                <span>14. <strong>Emergency Contact:</strong> {regEmergencyName ? `${regEmergencyName}` : 'Required'}</span>
              </li>
            </ul>
          </div>
        </div>
      </form>
    </div>
  );
};
