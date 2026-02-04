import React, { useState } from 'react';
import { useTranslations } from '../context/LanguageContext';
import { CloseIcon } from './icons/Icons';

interface CampRegistrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CampFormData) => void;
}

export interface CampFormData {
  campName: string;
  location: string;
  description: string;
  phone: string;
  email: string;
  plan: 'monthly' | 'semester' | 'annual';
}

type Step = 'form' | 'plans';

const CampRegistrationModal: React.FC<CampRegistrationModalProps> = ({ isOpen, onClose, onSubmit }) => {
  const { t } = useTranslations();
  const [step, setStep] = useState<Step>('form');
  const [formData, setFormData] = useState<CampFormData>({
    campName: '',
    location: '',
    description: '',
    phone: '',
    email: '',
    plan: 'monthly'
  });
  const [errors, setErrors] = useState<Partial<Record<keyof CampFormData, string>>>({});

  if (!isOpen) return null;

  const validateForm = () => {
    const newErrors: Partial<Record<keyof CampFormData, string>> = {};
    
    if (!formData.campName.trim()) {
      newErrors.campName = t('campRegistration.errors.required');
    }
    if (!formData.location.trim()) {
      newErrors.location = t('campRegistration.errors.required');
    }
    if (!formData.description.trim()) {
      newErrors.description = t('campRegistration.errors.required');
    }
    if (!formData.phone.trim()) {
      newErrors.phone = t('campRegistration.errors.required');
    }
    if (!formData.email.trim()) {
      newErrors.email = t('campRegistration.errors.required');
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = t('campRegistration.errors.invalidEmail');
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNextStep = () => {
    if (validateForm()) {
      setStep('plans');
    }
  };

  const handleSubmit = () => {
    onSubmit(formData);
    // Reset form
    setFormData({
      campName: '',
      location: '',
      description: '',
      phone: '',
      email: '',
      plan: 'monthly'
    });
    setStep('form');
    onClose();
  };

  const handleClose = () => {
    setStep('form');
    setErrors({});
    onClose();
  };

  const plans = [
    {
      id: 'monthly' as const,
      name: t('campRegistration.plans.monthly'),
      price: 99,
      period: t('campRegistration.plans.perMonth'),
      features: [
        t('campRegistration.plans.feature1'),
        t('campRegistration.plans.feature2'),
        t('campRegistration.plans.feature3'),
      ]
    },
    {
      id: 'semester' as const,
      name: t('campRegistration.plans.semester'),
      price: 535,
      period: t('campRegistration.plans.per6Months'),
      savings: t('campRegistration.plans.save10'),
      popular: true,
      features: [
        t('campRegistration.plans.feature1'),
        t('campRegistration.plans.feature2'),
        t('campRegistration.plans.feature3'),
        t('campRegistration.plans.feature4'),
      ]
    },
    {
      id: 'annual' as const,
      name: t('campRegistration.plans.annual'),
      price: 950,
      period: t('campRegistration.plans.perYear'),
      savings: t('campRegistration.plans.save20'),
      features: [
        t('campRegistration.plans.feature1'),
        t('campRegistration.plans.feature2'),
        t('campRegistration.plans.feature3'),
        t('campRegistration.plans.feature4'),
        t('campRegistration.plans.feature5'),
      ]
    }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={handleClose}
      />
      
      {/* Modal */}
      <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto animate-fade-in">
        {/* Header */}
        <div className="sticky top-0 bg-white/90 backdrop-blur-md border-b border-slate-100 px-8 py-5 flex justify-between items-center rounded-t-3xl z-10">
          <div>
            <h2 className="text-2xl font-serif font-bold text-[#2E4053]">
              {step === 'form' ? t('campRegistration.title') : t('campRegistration.selectPlan')}
            </h2>
            <p className="text-slate-500 text-sm mt-1">
              {step === 'form' ? t('campRegistration.subtitle') : t('campRegistration.planSubtitle')}
            </p>
          </div>
          <button 
            onClick={handleClose}
            className="p-2 hover:bg-slate-100 rounded-full transition-colors"
          >
            <CloseIcon />
          </button>
        </div>

        {/* Content */}
        <div className="p-8">
          {step === 'form' ? (
            <div className="space-y-6">
              {/* Camp Name */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  {t('campRegistration.campName')} *
                </label>
                <input
                  type="text"
                  value={formData.campName}
                  onChange={(e) => setFormData({ ...formData, campName: e.target.value })}
                  className={`w-full px-4 py-3 rounded-xl border ${errors.campName ? 'border-red-400 bg-red-50' : 'border-slate-200'} focus:border-[#b6e0de] focus:ring-2 focus:ring-[#b6e0de]/20 outline-none transition-all`}
                  placeholder={t('campRegistration.campNamePlaceholder')}
                />
                {errors.campName && <p className="mt-1 text-sm text-red-500">{errors.campName}</p>}
              </div>

              {/* Location */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  {t('campRegistration.location')} *
                </label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  className={`w-full px-4 py-3 rounded-xl border ${errors.location ? 'border-red-400 bg-red-50' : 'border-slate-200'} focus:border-[#b6e0de] focus:ring-2 focus:ring-[#b6e0de]/20 outline-none transition-all`}
                  placeholder={t('campRegistration.locationPlaceholder')}
                />
                {errors.location && <p className="mt-1 text-sm text-red-500">{errors.location}</p>}
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  {t('campRegistration.description')} *
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={4}
                  className={`w-full px-4 py-3 rounded-xl border ${errors.description ? 'border-red-400 bg-red-50' : 'border-slate-200'} focus:border-[#b6e0de] focus:ring-2 focus:ring-[#b6e0de]/20 outline-none transition-all resize-none`}
                  placeholder={t('campRegistration.descriptionPlaceholder')}
                />
                {errors.description && <p className="mt-1 text-sm text-red-500">{errors.description}</p>}
              </div>

              {/* Contact Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    {t('campRegistration.phone')} *
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className={`w-full px-4 py-3 rounded-xl border ${errors.phone ? 'border-red-400 bg-red-50' : 'border-slate-200'} focus:border-[#b6e0de] focus:ring-2 focus:ring-[#b6e0de]/20 outline-none transition-all`}
                    placeholder="+34 600 000 000"
                  />
                  {errors.phone && <p className="mt-1 text-sm text-red-500">{errors.phone}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    {t('campRegistration.email')} *
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className={`w-full px-4 py-3 rounded-xl border ${errors.email ? 'border-red-400 bg-red-50' : 'border-slate-200'} focus:border-[#b6e0de] focus:ring-2 focus:ring-[#b6e0de]/20 outline-none transition-all`}
                    placeholder="contacto@campamento.com"
                  />
                  {errors.email && <p className="mt-1 text-sm text-red-500">{errors.email}</p>}
                </div>
              </div>

              {/* Next Button */}
              <div className="pt-4">
                <button
                  onClick={handleNextStep}
                  className="w-full py-4 bg-gradient-to-r from-[#b6e0de] to-[#8EB8BA] text-[#2E4053] font-semibold rounded-xl hover:shadow-lg transition-all duration-300 hover:scale-[1.02]"
                >
                  {t('campRegistration.seePlans')}
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-8">
              {/* Plans Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {plans.map((plan) => (
                  <div
                    key={plan.id}
                    onClick={() => setFormData({ ...formData, plan: plan.id })}
                    className={`relative rounded-2xl p-6 cursor-pointer transition-all duration-300 ${
                      formData.plan === plan.id
                        ? 'bg-gradient-to-br from-[#b6e0de] to-[#def1f0] border-2 border-[#8EB8BA] shadow-lg scale-[1.02]'
                        : 'bg-white border-2 border-slate-200 hover:border-[#b6e0de] hover:shadow-md'
                    }`}
                  >
                    {plan.popular && (
                      <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#2E4053] text-white text-xs font-semibold px-4 py-1 rounded-full">
                        {t('campRegistration.plans.popular')}
                      </div>
                    )}
                    
                    <div className="text-center">
                      <h3 className="text-lg font-semibold text-[#2E4053] mb-2">{plan.name}</h3>
                      <div className="mb-4">
                        <span className="text-4xl font-bold text-[#2E4053]">{plan.price}€</span>
                        <span className="text-slate-500 text-sm ml-1">{plan.period}</span>
                      </div>
                      {plan.savings && (
                        <span className="inline-block bg-green-100 text-green-700 text-xs font-semibold px-3 py-1 rounded-full mb-4">
                          {plan.savings}
                        </span>
                      )}
                    </div>
                    
                    <ul className="space-y-2 mt-4">
                      {plan.features.map((feature, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-sm text-slate-600">
                          <svg className="w-5 h-5 text-[#8EB8BA] flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          {feature}
                        </li>
                      ))}
                    </ul>

                    {/* Selection indicator */}
                    <div className={`mt-6 w-6 h-6 mx-auto rounded-full border-2 flex items-center justify-center transition-all ${
                      formData.plan === plan.id
                        ? 'border-[#2E4053] bg-[#2E4053]'
                        : 'border-slate-300'
                    }`}>
                      {formData.plan === plan.id && (
                        <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <button
                  onClick={() => setStep('form')}
                  className="flex-1 py-4 border-2 border-slate-200 text-slate-600 font-semibold rounded-xl hover:bg-slate-50 transition-all"
                >
                  {t('campRegistration.back')}
                </button>
                <button
                  onClick={handleSubmit}
                  className="flex-1 py-4 bg-[#2E4053] text-white font-semibold rounded-xl hover:bg-[#3d5a6e] hover:shadow-lg transition-all duration-300"
                >
                  {t('campRegistration.confirmSubscription')}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CampRegistrationModal;
