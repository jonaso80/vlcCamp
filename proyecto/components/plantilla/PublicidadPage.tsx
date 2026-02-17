import React from 'react';
import CampBuilder from './builder/CampBuilder';

interface PublicidadPageProps {
  campId: number;
  campName: string;
  onBack: () => void;
  onPublished?: () => void;
}

const PublicidadPage: React.FC<PublicidadPageProps> = ({ campId, campName, onBack, onPublished }) => {
  return (
    <CampBuilder onBack={onBack} campId={campId} onPublished={onPublished} />
  );
};

export default PublicidadPage;
