import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';
import { getArtworks, getSections, updateArtwork, deleteArtwork, type Artwork, type Section } from '../services/api';

type TabType = 'opere' | 'sezioni';

const Content: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<TabType>('opere');
  const [artworks, setArtworks] = useState<Artwork[]>([]);
  const [sections, setSections] = useState<Section[]>([]);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState<Partial<Artwork> | null>(null);
  const [loading, setLoading] = useState(true);

  // Carica i dati all'avvio
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [artworksData, sectionsData] = await Promise.all([
        getArtworks(),
        getSections()
      ]);
      setArtworks(artworksData);
      setSections(sectionsData);
    } catch (error) {
      console.error('Error loading data:', error);
      alert('Errore nel caricamento dei dati');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (artwork: Artwork) => {
    setEditingId(artwork.id);
    setFormData({ ...artwork });
  };

  const handleSave = async () => {
    if (formData && editingId) {
      try {
        await updateArtwork(editingId, {
          title: formData.title,
          description: formData.description,
          image_url: formData.image_url,
          section_id: formData.section_id,
          order_index: formData.order_index
        });
        await loadData();
        setEditingId(null);
        setFormData(null);
        alert('Opera aggiornata con successo!');
      } catch (error) {
        console.error('Error updating artwork:', error);
        alert('Errore durante l\'aggiornamento dell\'opera');
      }
    }
  };

  const handleCancel = () => {
    setEditingId(null);
    setFormData(null);
  };

  const handleDelete = async (id: number) => {
    if (confirm('Sei sicuro di voler eliminare questa opera?')) {
      try {
        await deleteArtwork(id);
        await loadData();
        alert('Opera eliminata con successo!');
      } catch (error) {
        console.error('Error deleting artwork:', error);
        alert('Errore durante l\'eliminazione dell\'opera');
      }
    }
  };

  const handleAdd = () => {
    navigate('/content/opera');
  };

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>Gestione Contenuti - Adele Lo Feudo</title>
      </Helmet>

      <div className="max-w-7xl mx-auto py-20 px-6">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-white uppercase" style={{ fontFamily: 'Palanquin, Helvetica Neue, sans-serif' }}>
            Gestione <span style={{ color: 'rgb(240, 45, 110)' }}>{activeTab === 'opere' ? 'Opere' : 'Sezioni'}</span>
          </h1>
          <button
            onClick={handleAdd}
            className="px-6 py-3 font-bold uppercase text-white transition-colors"
            style={{ backgroundColor: 'rgb(240, 45, 110)', fontFamily: 'Palanquin, Helvetica Neue, sans-serif' }}
          >
            + {activeTab === 'opere' ? 'Aggiungi Opera' : 'Aggiungi Sezione'}
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="mb-12 border-b-2" style={{ borderColor: 'rgba(240, 45, 110, 0.3)' }}>
          <div className="flex gap-8">
            <button
              onClick={() => setActiveTab('opere')}
              className={`pb-4 px-4 font-bold uppercase text-lg transition-colors ${activeTab === 'opere' ? 'border-b-4' : ''}`}
              style={{
                fontFamily: 'Palanquin, Helvetica Neue, sans-serif',
                color: activeTab === 'opere' ? 'rgb(240, 45, 110)' : 'white',
                borderColor: activeTab === 'opere' ? 'rgb(240, 45, 110)' : 'transparent'
              }}
            >
              Opere
            </button>
            <button
              onClick={() => setActiveTab('sezioni')}
              className={`pb-4 px-4 font-bold uppercase text-lg transition-colors ${activeTab === 'sezioni' ? 'border-b-4' : ''}`}
              style={{
                fontFamily: 'Palanquin, Helvetica Neue, sans-serif',
                color: activeTab === 'sezioni' ? 'rgb(240, 45, 110)' : 'white',
                borderColor: activeTab === 'sezioni' ? 'rgb(240, 45, 110)' : 'transparent'
              }}
            >
              Sezioni
            </button>
          </div>
        </div>

        {activeTab === 'opere' ? (
          loading ? (
            <div className="text-center py-20">
              <p className="text-white text-xl" style={{ fontFamily: 'Palanquin, Helvetica Neue, sans-serif' }}>Caricamento...</p>
            </div>
          ) : (
          <div className="grid gap-6">
            {artworks.map((artwork) => (
            <div key={artwork.id} className="bg-secondary p-6 border-2" style={{ borderColor: 'rgba(240, 45, 110, 0.3)' }}>
              {editingId === artwork.id && formData ? (
                <div className="space-y-4">
                  <div>
                    <label className="block text-white mb-2 font-bold" style={{ fontFamily: 'Palanquin, Helvetica Neue, sans-serif' }}>Titolo</label>
                    <input
                      type="text"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      className="w-full px-4 py-2 bg-background text-white border-2"
                      style={{ borderColor: 'rgba(240, 45, 110, 0.3)', fontFamily: 'Palanquin, Helvetica Neue, sans-serif' }}
                    />
                  </div>
                  <div>
                    <label className="block text-white mb-2 font-bold" style={{ fontFamily: 'Palanquin, Helvetica Neue, sans-serif' }}>Descrizione</label>
                    <textarea
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      rows={3}
                      className="w-full px-4 py-2 bg-background text-white border-2 rounded"
                      style={{ borderColor: 'rgba(240, 45, 110, 0.3)', fontFamily: 'Palanquin, Helvetica Neue, sans-serif' }}
                    />
                  </div>
                  <div>
                    <label className="block text-white mb-2 font-bold" style={{ fontFamily: 'Palanquin, Helvetica Neue, sans-serif' }}>Serie</label>
                    <select
                      value={formData.section_id || ''}
                      onChange={(e) => setFormData({ ...formData, section_id: Number(e.target.value) })}
                      className="w-full px-4 py-2 bg-background text-white border-2 rounded"
                      style={{ borderColor: 'rgba(240, 45, 110, 0.3)', fontFamily: 'Palanquin, Helvetica Neue, sans-serif' }}
                    >
                      {sections.map((section) => (
                        <option key={section.id} value={section.id}>{section.name}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-white mb-2 font-bold" style={{ fontFamily: 'Palanquin, Helvetica Neue, sans-serif' }}>Immagine (URL)</label>
                    <input
                      type="text"
                      value={formData.image_url || ''}
                      onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                      className="w-full px-4 py-2 bg-background text-white border-2 rounded"
                      style={{ borderColor: 'rgba(240, 45, 110, 0.3)', fontFamily: 'Palanquin, Helvetica Neue, sans-serif' }}
                    />
                  </div>
                  <div className="flex gap-4">
                    <button
                      onClick={handleSave}
                      className="px-6 py-2 font-bold uppercase text-white"
                      style={{ backgroundColor: 'rgb(240, 45, 110)', fontFamily: 'Palanquin, Helvetica Neue, sans-serif' }}
                    >
                      Salva
                    </button>
                    <button
                      onClick={handleCancel}
                      className="px-6 py-2 font-bold uppercase text-white border-2"
                      style={{ borderColor: 'rgba(240, 45, 110, 0.3)', fontFamily: 'Palanquin, Helvetica Neue, sans-serif' }}
                    >
                      Annulla
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex items-start gap-6">
                  <img src={artwork.image_url || '/opera.png'} alt={artwork.title} className="w-32 h-32 object-contain" />
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold mb-2" style={{ color: 'rgb(240, 45, 110)', fontFamily: 'Palanquin, Helvetica Neue, sans-serif' }}>
                      {artwork.title}
                    </h3>
                    <p className="text-white mb-2" style={{ fontFamily: 'Palanquin, Helvetica Neue, sans-serif' }}>{artwork.description}</p>
                    <p className="text-gray text-sm" style={{ fontFamily: 'Palanquin, Helvetica Neue, sans-serif' }}>
                      Serie: {sections.find(s => s.id === artwork.section_id)?.name || 'N/A'}
                    </p>
                  </div>
                  <div className="flex gap-4">
                    <button
                      onClick={() => handleEdit(artwork)}
                      className="px-4 py-2 font-bold uppercase text-white"
                      style={{ backgroundColor: 'rgb(240, 45, 110)', fontFamily: 'Palanquin, Helvetica Neue, sans-serif' }}
                    >
                      Modifica
                    </button>
                    <button
                      onClick={() => handleDelete(artwork.id)}
                      className="px-4 py-2 font-bold uppercase text-white border-2"
                      style={{ borderColor: 'rgba(240, 45, 110, 0.3)', fontFamily: 'Palanquin, Helvetica Neue, sans-serif' }}
                    >
                      Elimina
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
          </div>
          )
        ) : (
          <div className="grid gap-6">
            <div className="bg-secondary p-8 border-2 text-center" style={{ borderColor: 'rgba(240, 45, 110, 0.3)' }}>
              <p className="text-white text-lg" style={{ fontFamily: 'Palanquin, Helvetica Neue, sans-serif' }}>
                Gestione sezioni in arrivo...
              </p>
              <p className="text-gray mt-4" style={{ fontFamily: 'Palanquin, Helvetica Neue, sans-serif' }}>
                Qui potrai creare e modificare le sezioni (Name series, etc.)
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Content;
