import React, { useState, useEffect } from 'react';
import { Camp, FormData, DateRange, View, User, UserReview, MyCamp } from './types';
// Los campamentos se cargarán desde Supabase cuando estén contratados
import Header from './components/Header';
import Footer from './components/Footer';
import HomePage from './components/HomePage';
import AuthPage from './components/auth/AuthPage';
import CampDetailPage from './components/CampDetailPage';
import RegistrationForm from './components/RegistrationForm';
import SummaryPage from './components/SummaryPage';
import InfoModal from './components/InfoModal';
import AccountPage from './components/account/AccountPage';
import CommunityPage from './components/CommunityPage';
import ContactPage from './components/ContactPage';
import Chatbot from './components/chatbot/Chatbot';
import ChatbotFab from './components/chatbot/ChatbotFab';
import CampRegistrationModal, { CampFormData } from './components/CampRegistrationModal';
import CampRegistrationSuccessPage from './components/CampRegistrationSuccessPage';
import MyCampProfilePage from './components/MyCampProfilePage';
import { useTranslations } from './context/LanguageContext';
import { logEvent } from './utils/logging';
import { supabase } from './supabaseClient';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000';
import Logo from './components/Logo';

// Array vacío para campamentos clientes
// Los campamentos solo aparecerán cuando sean contratados y añadidos desde Supabase
const CLIENT_CAMPS: Camp[] = [];

// --- ComingSoonPage Component ---
const ComingSoonPage: React.FC = () => {
    const { t } = useTranslations();
    return (
        <div className="flex items-center justify-center min-h-full text-center animate-fade-in py-16">
            <div className="bg-white/50 backdrop-blur-md p-8 sm:p-12 rounded-2xl shadow-lg max-w-2xl mx-auto">
                <Logo width={80} height={80} className="mx-auto mb-4" />
                <h1 className="text-3xl sm:text-4xl font-bold text-slate-800 mb-4">{t('community.comingSoonTitle')}</h1>
                <p className="text-slate-600">{t('community.comingSoonText')}</p>
            </div>
        </div>
    );
};


const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<View>('home');
  const [selectedCamp, setSelectedCamp] = useState<Camp | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [selectedDateRange, setSelectedDateRange] = useState<DateRange | null>(null);
  const [formData, setFormData] = useState<FormData | null>(null);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [userReviews, setUserReviews] = useState<UserReview[]>([]);
  const [isCampRegistrationModalOpen, setIsCampRegistrationModalOpen] = useState(false);
  const [pendingCampRegistration, setPendingCampRegistration] = useState(false);
  const [lastCampRegistration, setLastCampRegistration] = useState<CampFormData | null>(null);
  const [userCamp, setUserCamp] = useState<MyCamp | null>(null);
  const [showConfirmadoMessage, setShowConfirmadoMessage] = useState(false);
  const { t } = useTranslations();
  const [authInitialView, setAuthInitialView] = useState<'login' | 'signup'>('signup');

  // Mostrar mensaje "Gracias por confirmar" cuando llegan desde el enlace del correo (#confirmado)
  useEffect(() => {
    const hash = window.location.hash;
    if (hash.startsWith('#confirmado')) {
      setShowConfirmadoMessage(true);
    }
  }, []);

  // Si el usuario ya está logueado al confirmar, refrescar su campamento para que aparezca "Mi campamento"
  useEffect(() => {
    if (!showConfirmadoMessage || !currentUser?.email) return;
    const refetch = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/camps/my-camp?email=${encodeURIComponent(currentUser.email)}`);
        if (res.ok) {
          const data = await res.json();
          setUserCamp(data);
        }
      } catch {
        // ignore
      }
    };
    refetch();
  }, [showConfirmadoMessage, currentUser?.email]);

  // Cargar el campamento del usuario cuando está autenticado
  useEffect(() => {
    if (!currentUser?.email) {
      setUserCamp(null);
      return;
    }
    const loadMyCamp = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/camps/my-camp?email=${encodeURIComponent(currentUser.email)}`);
        if (res.ok) {
          const data = await res.json();
          setUserCamp(data);
        } else {
          setUserCamp(null);
        }
      } catch {
        setUserCamp(null);
      }
    };
    loadMyCamp();
  }, [currentUser?.email]);

  useEffect(() => {
    const loadInitialData = async () => {
      try {
        console.log('Cargando datos iniciales desde Supabase...');
        
        // Cargar usuarios desde Supabase
        const { data: profiles, error: profilesError } = await supabase
          .from('profiles')
          .select('name, email, avatar');

        if (profilesError) {
          console.error('Error al cargar perfiles desde Supabase:', profilesError);
          console.error('Código de error:', profilesError.code);
          console.error('Mensaje:', profilesError.message);
          console.error('Detalles:', profilesError.details);
        } else if (profiles) {
          console.log('Perfiles cargados:', profiles.length, 'usuarios');
          setUsers(profiles as User[]);
        }

        // Cargar reseñas de usuarios desde Supabase
        const { data: reviews, error: reviewsError } = await supabase
          .from('reviews')
          .select('camp_id, author_name, author_avatar, author_email, rating, comment');

        if (reviewsError) {
          console.error('Error al cargar reseñas desde Supabase:', reviewsError);
        } else if (reviews) {
          const mappedReviews: UserReview[] = reviews.map((r: any) => ({
            campId: r.camp_id,
            authorName: r.author_name,
            authorAvatar: r.author_avatar,
            authorEmail: r.author_email,
            rating: r.rating,
            text: r.comment,
          }));
          setUserReviews(mappedReviews);
          console.log('Reseñas cargadas:', mappedReviews.length);
        }
      } catch (error) {
        console.error('Error al cargar datos iniciales desde Supabase:', error);
      }
    };

    loadInitialData();
  }, []);


  const handleSelectCamp = (camp: Camp) => {
    setSelectedCamp(camp);
    if (isAuthenticated) {
      setCurrentView('info');
    } else {
      setAuthInitialView('signup');
      setCurrentView('auth');
    }
  };
  
  const handleShowAuth = () => {
    if (!isAuthenticated) {
      setAuthInitialView('login');
      setCurrentView('auth');
    }
  };
  
  const handleShowAccount = () => {
    setCurrentView('account');
  }

  const handleCommunityClick = () => {
    // Abrir la aplicación social en una nueva pestaña
    const socialUrl = import.meta.env.VITE_SOCIAL_URL || 'http://localhost:3001';
    window.open(socialUrl, '_blank');
  };

  const handleContactClick = () => {
    setCurrentView('contact');
  }

  const handleCampRegistrationClick = () => {
    if (isAuthenticated) {
      setIsCampRegistrationModalOpen(true);
    } else {
      setPendingCampRegistration(true);
      setAuthInitialView('signup');
      setCurrentView('auth');
    }
  }

  const handleCampRegistrationSubmit = async (data: CampFormData) => {
    try {
      // Guardar la solicitud en Supabase
      const { error } = await supabase
        .from('camps')
        .insert([{
          name: data.campName,
          location: data.location,
          description: data.description,
          contact_phone: data.phone,
          contact_email: data.email,
          plan: data.plan,
          user_email: currentUser?.email,
          status: 'pending'
        }]);

      if (error) {
        console.error('Error al registrar campamento:', error);
        alert('Error al enviar la solicitud. Por favor, inténtalo de nuevo.');
        return;
      }

      logEvent('camp_registration', {
        status: 'OK',
        campName: data.campName,
        plan: data.plan,
        userEmail: currentUser?.email
      });

      // Enviar email de confirmación al email del formulario del campamento
      // IMPORTANTE: Este código SIEMPRE debe ejecutarse después de un registro exitoso
      console.log('📧 [CAMP REGISTRATION] ===== INICIANDO ENVÍO DE EMAIL =====');
      console.log('📧 [CAMP REGISTRATION] Email destino:', data.email);
      console.log('📧 [CAMP REGISTRATION] Nombre del campamento:', data.campName);
      
      try {
        console.log('📧 [CAMP REGISTRATION] Enviando correo de confirmación a:', data.email);
        console.log('📧 [CAMP REGISTRATION] API URL:', `${API_BASE_URL}/api/camps/send-registration-confirmation`);
        console.log('📧 [CAMP REGISTRATION] Payload:', {
          email: data.email,
          campName: data.campName,
          contactName: currentUser?.name || '',
        });

        const response = await fetch(`${API_BASE_URL}/api/camps/send-registration-confirmation`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: data.email, // Email del formulario del campamento
            campName: data.campName,
            contactName: currentUser?.name || '',
          }),
        });

        console.log('📧 [CAMP REGISTRATION] Response status:', response.status);
        console.log('📧 [CAMP REGISTRATION] Response ok:', response.ok);

        if (!response.ok) {
          const errorText = await response.text();
          console.error('❌ [CAMP REGISTRATION] Error HTTP:', response.status, errorText);
          throw new Error(`HTTP ${response.status}: ${response.statusText} - ${errorText}`);
        }

        const emailResult = await response.json();
        console.log('📧 [CAMP REGISTRATION] Response JSON:', emailResult);

        if (emailResult.success) {
          console.log('✅ [CAMP REGISTRATION] Email de confirmación enviado correctamente a:', data.email);
          console.log('📧 [CAMP REGISTRATION] Message ID:', emailResult.messageId);
        } else {
          // Mostrar error más visible
          console.error('❌ [CAMP REGISTRATION] ===== ERROR AL ENVIAR EMAIL =====');
          console.error('❌ [CAMP REGISTRATION] Email destino:', data.email);
          console.error('❌ [CAMP REGISTRATION] Error:', emailResult.error || emailResult.warning);
          console.error('❌ [CAMP REGISTRATION] Detalles completos:', JSON.stringify(emailResult, null, 2));
          console.error('❌ [CAMP REGISTRATION] ====================================');
          
          // Mostrar alerta al usuario (opcional, comentado para no interrumpir el flujo)
          // alert(`No se pudo enviar el email de confirmación: ${emailResult.error || emailResult.warning}`);
        }
      } catch (emailError: any) {
        // No crítico, pero loguear con más detalle
        console.error('❌ [CAMP REGISTRATION] Error al enviar email de confirmación:', emailError);
        console.error('❌ [CAMP REGISTRATION] Error message:', emailError?.message);
        console.error('❌ [CAMP REGISTRATION] Error stack:', emailError?.stack);
      }

      // Cerrar el modal primero
      setIsCampRegistrationModalOpen(false);
      
      // Guardar los datos y cambiar la vista después de un pequeño delay
      // para asegurar que el modal se cierre completamente
      setLastCampRegistration(data);
      console.log('✅ Camp registration completed, switching to success view', data);
      setTimeout(() => {
        console.log('➡️ Setting currentView to camp-registration-success');
        setCurrentView('camp-registration-success');
      }, 100);
    } catch (error: any) {
      console.error('Error inesperado:', error);
      logEvent('camp_registration', {
        status: 'ERROR',
        error: error?.message ?? 'unknown'
      });
    }
  }

  const handleRegister = async (newUser: User) => {
    // Verificar primero en Supabase si el usuario ya existe
    try {
      const { data: existingUser, error: checkError } = await supabase
        .from('profiles')
        .select('email')
        .eq('email', newUser.email.toLowerCase())
        .maybeSingle();

      if (checkError) {
        console.error('Error al verificar usuario existente:', checkError);
      }

      if (existingUser) {
        alert('Este email ya está registrado. Por favor, inicia sesión.');
        logEvent('signup', { status: 'ERROR', error: 'User already exists', email: newUser.email });
        return;
      }

      const { data, error } = await supabase
        .from('profiles')
        .insert([{ 
          name: newUser.name, 
          email: newUser.email.toLowerCase(), 
          avatar: newUser.avatar || 'https://i.pravatar.cc/150' 
        }])
        .select('name, email, avatar')
        .single();

      if (error) {
        console.error('Error al registrar usuario en Supabase:', error);
        alert('Error al registrar: ' + error.message);
        logEvent('signup', { status: 'ERROR', error: error.message, email: newUser.email });
        return;
      }

      const createdUser: User = {
        name: data.name,
        email: data.email,
        avatar: data.avatar,
      };

      setUsers(prev => [...prev, createdUser]);
      logEvent('signup', { status: 'OK', name: createdUser.name, email: createdUser.email });
      alert('¡Registro exitoso! Por favor, inicia sesión.');
    } catch (error: any) {
      console.error('Error inesperado al registrar usuario:', error);
      alert('Error inesperado al registrar. Por favor, inténtalo de nuevo.');
      logEvent('signup', { status: 'ERROR', error: error?.message ?? 'unknown', email: newUser.email });
    }
  };

  const handleLogin = (nameOrEmail: string): boolean => {
    // Buscar por nombre O por email (case insensitive)
    const user = users.find(u => 
      u.name.toLowerCase() === nameOrEmail.toLowerCase() || 
      u.email.toLowerCase() === nameOrEmail.toLowerCase()
    );
    
    if (user) {
        setIsAuthenticated(true);
        setCurrentUser(user);
        
        logEvent('login', { status: 'OK', user: user.name, email: user.email });

        if (pendingCampRegistration) {
            setPendingCampRegistration(false);
            setCurrentView('home');
            setTimeout(() => setIsCampRegistrationModalOpen(true), 100);
        } else if (selectedCamp) {
            setCurrentView('info');
        } else {
            setCurrentView('home');
        }
        return true;
    }
    
    console.log('Login fallido. Usuario no encontrado:', nameOrEmail);
    console.log('Usuarios disponibles:', users.map(u => ({ name: u.name, email: u.email })));
    logEvent('login', { status: 'ERROR', error: 'Invalid credentials', nameOrEmail });
    return false;
  };
  
  const handleGoogleLogin = async (googleUserData: { name: string; email: string; avatar: string }) => {
    let user = users.find(u => u.email.toLowerCase() === googleUserData.email.toLowerCase());
    
    if (!user) {
        try {
          const { data, error } = await supabase
            .from('profiles')
            .insert([{
              name: googleUserData.name,
              email: googleUserData.email,
              avatar: googleUserData.avatar
            }])
            .select('name, email, avatar')
            .single();

          if (error) {
            console.error('Error al registrar usuario Google en Supabase', error);
            logEvent('signup', { status: 'ERROR', error: error.message, email: googleUserData.email, method: 'Google' });
            return;
          }

          user = {
            name: data.name,
            email: data.email,
            avatar: data.avatar
          };

          setUsers(prev => [...prev, user as User]);
          logEvent('signup', { status: 'OK', name: user.name, email: user.email, method: 'Google' });
        } catch (error: any) {
          console.error('Error inesperado al registrar usuario Google', error);
          logEvent('signup', { status: 'ERROR', error: error?.message ?? 'unknown', email: googleUserData.email, method: 'Google' });
          return;
        }
    }

    setIsAuthenticated(true);
    setCurrentUser(user);
    logEvent('login', { status: 'OK', user: user.name, email: user.email, method: 'Google' });

    if (pendingCampRegistration) {
        setPendingCampRegistration(false);
        setCurrentView('home');
        setTimeout(() => setIsCampRegistrationModalOpen(true), 100);
    } else if (selectedCamp) {
        setCurrentView('info');
    } else {
        setCurrentView('home');
    }
  };

  const handleCloseAuth = () => {
    setCurrentView('home');
    setSelectedCamp(null);
    setPendingCampRegistration(false);
  };
  
  const handleLogout = () => {
    logEvent('logout', { user: currentUser?.name, email: currentUser?.email });
    setIsAuthenticated(false);
    setCurrentUser(null);
    setUserCamp(null);
    setCurrentView('home');
    setSelectedCamp(null);
  };

  const handleSwitchAccount = () => {
    setIsAuthenticated(false);
    setCurrentUser(null);
    setAuthInitialView('login');
    setCurrentView('auth');
    setSelectedCamp(null);
  };

  const handleUpdateUser = async (updatedUser: User) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .update({
          name: updatedUser.name,
          avatar: updatedUser.avatar
        })
        .eq('email', updatedUser.email)
        .select('name, email, avatar')
        .single();

      if (error) {
        console.error('Error al actualizar usuario en Supabase', error);
        logEvent('updates', {
          action: 'Personal Data Update',
          status: 'ERROR',
          user: updatedUser.name,
          email: updatedUser.email,
          error: error.message
        });
        return;
      }

      const savedUser: User = {
        name: data.name,
        email: data.email,
        avatar: data.avatar,
      };

      setCurrentUser(savedUser);
      setUsers(prevUsers => prevUsers.map(u => u.email === savedUser.email ? savedUser : u));

      logEvent('updates', { 
          action: 'Personal Data Update', 
          status: 'OK',
          user: savedUser.name, 
          email: savedUser.email, 
          newData: savedUser
      });
    } catch (error: any) {
      console.error('Error inesperado al actualizar usuario', error);
      logEvent('updates', { 
          action: 'Personal Data Update', 
          status: 'ERROR',
          user: updatedUser.name, 
          email: updatedUser.email, 
          error: error?.message ?? 'unknown'
      });
    }
  };

  const handleSelectDateRange = (range: DateRange) => {
    setSelectedDateRange(range);
    setCurrentView('form');
  };

  const handleFormSubmit = (data: FormData) => {
    setFormData(data);
    setCurrentView('summary');
  };
  
  const handleAddReview = async (newReview: UserReview) => {
    try {
      const { error } = await supabase
        .from('reviews')
        .insert([{
          camp_id: newReview.campId,
          author_name: newReview.authorName,
          author_avatar: newReview.authorAvatar,
          author_email: newReview.authorEmail,
          rating: newReview.rating,
          comment: newReview.text
        }]);

      if (error) {
        console.error('Error al guardar reseña en Supabase', error);
        return;
      }

      setUserReviews(prev => [...prev, newReview]);
    } catch (error) {
      console.error('Error inesperado al guardar reseña en Supabase', error);
    }
  };

  const handleConfirmRegistration = () => {
    const registerEnrollment = async () => {
      if (selectedCamp && selectedDateRange && formData && currentUser) {
        const payload = {
          user_id: currentUser.email,
          camp_id: selectedCamp.id,
          start_date: selectedDateRange.start.toISOString(),
          end_date: selectedDateRange.end.toISOString(),
          form_data: formData,
        };

        logEvent('enrollments', { 
            action: 'New Enrollment',
            status: 'PENDING',
            camp: selectedCamp.name, 
            user: currentUser.name, 
            email: currentUser.email, 
            photoPermission: formData.photoPermission 
        });

        try {
          const response = await fetch(`${API_BASE_URL}/api/enrollments`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
          });

          if (!response.ok) {
            const errorBody = await response.json().catch(() => ({}));
            throw new Error(errorBody.error || 'Error al crear la inscripción');
          }

          logEvent('enrollments', { 
              action: 'New Enrollment',
              status: 'OK',
              camp: selectedCamp.name, 
              user: currentUser.name, 
              email: currentUser.email, 
              photoPermission: formData.photoPermission 
          });
        } catch (error: any) {
          console.error('Error al crear inscripción en backend', error);
          logEvent('enrollments', { 
              action: 'New Enrollment',
              status: 'ERROR',
              error: error?.message ?? 'unknown',
              camp: selectedCamp.name, 
              user: currentUser.name, 
              email: currentUser.email,
          });
        }
      }

      alert('¡Inscripción confirmada! Recibirás un correo con los detalles.');
      setCurrentView('home');
      setSelectedCamp(null);
      setSelectedDateRange(null);
      setFormData(null);
    };

    registerEnrollment();
  };

  const renderContent = () => {
    switch (currentView) {
      case 'info':
        return selectedCamp && <InfoModal camp={selectedCamp} onClose={() => { setCurrentView('home'); setSelectedCamp(null); }} onMoreInfo={() => setCurrentView('detail')} />;
      case 'detail':
        return selectedCamp && <CampDetailPage camp={selectedCamp} onSelectDateRange={handleSelectDateRange} userReviews={userReviews} />;
      case 'form':
        return selectedCamp && selectedDateRange && <RegistrationForm camp={selectedCamp} selectedDateRange={selectedDateRange} onSubmit={handleFormSubmit} onBack={() => setCurrentView('detail')} />;
      case 'summary':
        return selectedCamp && selectedDateRange && formData && <SummaryPage camp={selectedCamp} dateRange={selectedDateRange} formData={formData} onConfirm={handleConfirmRegistration} />;
      case 'account':
        return currentUser && <AccountPage user={currentUser} onUpdateUser={handleUpdateUser} onAddReview={handleAddReview} userReviews={userReviews} />;
      case 'community':
        return currentUser && <CommunityPage currentUser={currentUser} onSwitchAccount={handleSwitchAccount} onAccountClick={handleShowAccount} />;
      case 'camp-registration-success':
        return (
          <CampRegistrationSuccessPage
            registration={lastCampRegistration}
            onBackHome={() => {
              setLastCampRegistration(null);
              setCurrentView('home');
            }}
          />
        );
      case 'my-camp-profile':
        return userCamp ? (
          <MyCampProfilePage
            camp={userCamp}
            onBackToAccount={() => setCurrentView('account')}
          />
        ) : null;
      case 'coming-soon':
        return <ComingSoonPage />;
      case 'contact':
        return <ContactPage />;
      case 'home':
      default:
        return <HomePage clientCamps={CLIENT_CAMPS} onSelectCamp={handleSelectCamp} onCampRegistrationClick={handleCampRegistrationClick} />;
    }
  };

  return (
    <div className="bg-gradient-to-br from-[#E0F2F1] to-[#B2DFDB] min-h-screen text-slate-800 font-sans flex flex-col">
      <Header 
        onHomeClick={() => setCurrentView('home')} 
        onAuthClick={handleShowAuth}
        isAuthenticated={isAuthenticated}
        currentUser={currentUser}
        onLogout={handleLogout}
        onAccountClick={handleShowAccount}
        onSwitchAccount={handleSwitchAccount}
        onCommunityClick={handleCommunityClick}
        onContactClick={handleContactClick}
        userCamp={userCamp}
        onMyCampClick={() => setCurrentView('my-camp-profile')}
      />
      <main className="container mx-auto px-4 py-8 flex-grow">
        {renderContent()}
      </main>
      <Footer onHomeClick={() => setCurrentView('home')} onAuthClick={handleShowAuth} onContactClick={handleContactClick} />
      {showConfirmadoMessage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-8 text-center">
            <h2 className="text-xl font-bold text-[#2E4053] mb-3">Gracias por confirmar</h2>
            <p className="text-slate-600 mb-6">
              Puedes volver a la web de vlcCamp y acceder al perfil de tu campamento desde el apartado <strong>Cuenta</strong>, arriba en el menú del header.
            </p>
            <button
              type="button"
              onClick={() => {
                setShowConfirmadoMessage(false);
                if (window.location.hash) {
                  window.history.replaceState(null, '', window.location.pathname + window.location.search);
                }
              }}
              className="px-6 py-3 bg-[#2E4053] text-white rounded-full font-medium hover:bg-[#3d5a6e] transition-colors"
            >
              Entendido
            </button>
          </div>
        </div>
      )}
      {currentView === 'auth' && <AuthPage onClose={handleCloseAuth} onRegister={handleRegister} onLogin={handleLogin} onGoogleLogin={handleGoogleLogin} initialView={authInitialView} />}
      <CampRegistrationModal 
        isOpen={isCampRegistrationModalOpen} 
        onClose={() => setIsCampRegistrationModalOpen(false)} 
        onSubmit={handleCampRegistrationSubmit}
      />
      <ChatbotFab onToggle={() => setIsChatOpen(prev => !prev)} />
      <Chatbot isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />
    </div>
  );
};

export default App;