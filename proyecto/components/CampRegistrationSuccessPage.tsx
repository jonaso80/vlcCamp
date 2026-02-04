import React, { useEffect, useState } from 'react';
import { useTranslations } from '../context/LanguageContext';
import { CampFormData } from './CampRegistrationModal';

interface CampRegistrationSuccessPageProps {
  registration: CampFormData | null;
  onBackHome: () => void;
}

const CampRegistrationSuccessPage: React.FC<CampRegistrationSuccessPageProps> = ({
  registration,
  onBackHome,
}) => {
  const { t } = useTranslations();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulamos una pequeña carga para mostrar el engranaje
    const timeout = setTimeout(() => setIsLoading(false), 1500);
    return () => clearTimeout(timeout);
  }, []);

  if (!registration) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-4">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-16 w-16 text-[#2E4053] animate-spin"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M11.983 2.25c-.379 0-.724.214-.894.553L9.674 5.618a1.125 1.125 0 01-1.003.617H5.25a.75.75 0 00-.75.75v2.421c0 .379.214.724.553.894l2.815 1.415a1.125 1.125 0 01.553.982v.003c0 .409-.222.784-.58.983l-2.79 1.55a.75.75 0 00-.381.657v2.421c0 .414.336.75.75.75h3.421c.379 0 .724-.214.894-.553l1.415-2.815a1.125 1.125 0 011.003-.617h.003c.409 0 .784.222.983.58l1.55 2.79a.75.75 0 00.657.381h2.421a.75.75 0 00.75-.75v-3.421c0-.379-.214-.724-.553-.894l-2.815-1.415a1.125 1.125 0 01-.553-.982v-.003c0-.409.222-.784.58-.983l2.79-1.55a.75.75 0 00.381-.657V7.0a.75.75 0 00-.75-.75h-3.421a1.125 1.125 0 01-1.003-.617l-1.415-2.815a.975.975 0 00-.894-.553h-.034z"
            />
          </svg>
          <p className="text-slate-600 text-sm">Cargando...</p>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-4">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-16 w-16 text-[#2E4053] animate-spin"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M11.983 2.25c-.379 0-.724.214-.894.553L9.674 5.618a1.125 1.125 0 01-1.003.617H5.25a.75.75 0 00-.75.75v2.421c0 .379.214.724.553.894l2.815 1.415a1.125 1.125 0 01.553.982v.003c0 .409-.222.784-.58.983l-2.79 1.55a.75.75 0 00-.381.657v2.421c0 .414.336.75.75.75h3.421c.379 0 .724-.214.894-.553l1.415-2.815a1.125 1.125 0 011.003-.617h.003c.409 0 .784.222.983.58l1.55 2.79a.75.75 0 00.657.381h2.421a.75.75 0 00.75-.75v-3.421c0-.379-.214-.724-.553-.894l-2.815-1.415a1.125 1.125 0 01-.553-.982v-.003c0-.409.222-.784.58-.983l2.79-1.55a.75.75 0 00.381-.657V7.0a.75.75 0 00-.75-.75h-3.421a1.125 1.125 0 01-1.003-.617l-1.415-2.815a.975.975 0 00-.894-.553h-.034z"
            />
          </svg>
          <p className="text-slate-600 text-sm">
            {t('campRegistration.loadingMessage') ?? 'Preparando tu espacio en vlcCamp...'}
          </p>
        </div>
      </div>
    );
  }

  const planLabelMap: Record<CampFormData['plan'], string> = {
    monthly: t('campRegistration.plans.monthly'),
    semester: t('campRegistration.plans.semester'),
    annual: t('campRegistration.plans.annual'),
  };

  console.log('📝 Rendering CampRegistrationSuccessPage with registration:', registration);

  return (
    <div className="max-w-3xl mx-auto animate-fade-in">
      <div className="bg-white/70 backdrop-blur-sm rounded-3xl shadow-2xl p-8 md:p-10 border border-white/60">
        <h1 className="text-3xl md:text-4xl font-serif font-bold text-[#2E4053] mb-4 text-center">
          {t('campRegistration.successTitle')}
        </h1>
        <p className="text-slate-600 text-center mb-8">
          {t('campRegistration.successText')}
        </p>

        <div className="space-y-6">
          <div>
            <h2 className="text-lg font-semibold text-[#2E4053] mb-2">
              {t('campRegistration.summaryTitle') ?? 'Resumen de tu solicitud'}
            </h2>
            <div className="bg-[#def1f0]/60 rounded-2xl p-4 grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-slate-700">
              <div>
                <p className="font-semibold">{t('campRegistration.campName')}</p>
                <p>{registration.campName}</p>
              </div>
              <div>
                <p className="font-semibold">{t('campRegistration.location')}</p>
                <p>{registration.location}</p>
              </div>
              <div>
                <p className="font-semibold">{t('campRegistration.phone')}</p>
                <p>{registration.phone}</p>
              </div>
              <div>
                <p className="font-semibold">{t('campRegistration.email')}</p>
                <p>{registration.email}</p>
              </div>
              <div className="md:col-span-2">
                <p className="font-semibold">{t('campRegistration.description')}</p>
                <p className="whitespace-pre-line">{registration.description}</p>
              </div>
            </div>
          </div>

          <div>
            <h2 className="text-lg font-semibold text-[#2E4053] mb-2">
              {t('campRegistration.selectedPlanTitle') ?? 'Plan seleccionado'}
            </h2>
            <div className="bg-white/80 rounded-2xl p-4 flex items-center justify-between border border-[#b6e0de]/60">
              <div>
                <p className="font-semibold text-[#2E4053]">{planLabelMap[registration.plan]}</p>
                <p className="text-slate-500 text-sm">
                  {registration.plan === 'monthly'
                    ? '99 € / mes'
                    : registration.plan === 'semester'
                    ? '535 € / 6 meses'
                    : '950 € / año'}
                </p>
              </div>
              <span className="inline-flex items-center gap-1 text-xs font-semibold text-green-700 bg-green-100 px-3 py-1 rounded-full">
                <span>✓</span>
                {t('campRegistration.paymentPendingLabel') ??
                  'Pago pendiente de confirmar una vez activemos tu cuenta'}
              </span>
            </div>
          </div>
        </div>

        <div className="mt-8 text-center text-sm text-slate-600">
          <p>{t('campRegistration.emailNotice') ?? 'Te avisaremos por correo cuando tu campamento esté revisado y publicado.'}</p>
        </div>

        <div className="mt-8 flex justify-center">
          <button
            onClick={onBackHome}
            className="px-8 py-3 rounded-full border border-slate-300 text-slate-700 text-sm font-semibold hover:bg-slate-50 transition-colors"
          >
            {t('campRegistration.backToHome') ?? 'Volver al inicio'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CampRegistrationSuccessPage;

