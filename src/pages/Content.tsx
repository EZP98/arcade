import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';
import { getArtworks, getSections, updateArtwork, deleteArtwork, getNewsletterSubscribers, deleteNewsletterSubscriber, type Artwork, type Section, type NewsletterSubscriber } from '../services/api';

type TabType = 'opere' | 'sezioni' | 'newsletter';

const Content: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<TabType>('opere');
  const [artworks, setArtworks] = useState<Artwork[]>([]);
  const [sections, setSections] = useState<Section[]>([]);
  const [subscribers, setSubscribers] = useState<NewsletterSubscriber[]>([]);
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
      const [artworksData, sectionsData, subscribersData] = await Promise.all([
        getArtworks(),
        getSections(),
        getNewsletterSubscribers()
      ]);
      setArtworks(artworksData);
      setSections(sectionsData);
      setSubscribers(subscribersData);
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

  const handleDeleteSubscriber = async (id: number) => {
    if (confirm('Sei sicuro di voler eliminare questo iscritto?')) {
      try {
        await deleteNewsletterSubscriber(id);
        await loadData();
      } catch (error) {
        console.error('Error deleting subscriber:', error);
        alert('Errore durante l\'eliminazione dell\'iscritto');
      }
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>Gestione Contenuti - Adele Lo Feudo</title>
      </Helmet>

      <div className="max-w-7xl mx-auto py-20 px-6">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-white uppercase" style={{ fontFamily: 'Palanquin, Helvetica Neue, sans-serif' }}>
            Gestione <span style={{ color: 'rgb(240, 45, 110)' }}>
              {activeTab === 'opere' ? 'Opere' : activeTab === 'sezioni' ? 'Sezioni' : 'Newsletter'}
            </span>
          </h1>
          {activeTab !== 'newsletter' && (
            <button
              onClick={handleAdd}
              className="px-6 py-3 font-bold uppercase text-white transition-colors"
              style={{ backgroundColor: 'rgb(240, 45, 110)', fontFamily: 'Palanquin, Helvetica Neue, sans-serif' }}
            >
              + {activeTab === 'opere' ? 'Aggiungi Opera' : 'Aggiungi Sezione'}
            </button>
          )}
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
            <button
              onClick={() => setActiveTab('newsletter')}
              className={`pb-4 px-4 font-bold uppercase text-lg transition-colors ${activeTab === 'newsletter' ? 'border-b-4' : ''}`}
              style={{
                fontFamily: 'Palanquin, Helvetica Neue, sans-serif',
                color: activeTab === 'newsletter' ? 'rgb(240, 45, 110)' : 'white',
                borderColor: activeTab === 'newsletter' ? 'rgb(240, 45, 110)' : 'transparent'
              }}
            >
              Newsletter
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
        ) : activeTab === 'sezioni' ? (
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
        ) : (
          /* Newsletter Tab */
          loading ? (
            <div className="text-center py-20">
              <p className="text-white text-xl" style={{ fontFamily: 'Palanquin, Helvetica Neue, sans-serif' }}>Caricamento...</p>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Header con conteggio */}
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-white" style={{ fontFamily: 'Palanquin, Helvetica Neue, sans-serif' }}>
                  Totale iscritti: <span style={{ color: 'rgb(240, 45, 110)' }}>{subscribers.length}</span>
                </h2>
              </div>

              {/* Tabella iscritti */}
              {subscribers.length === 0 ? (
                <div className="p-8 border text-center" style={{ borderColor: 'rgba(255, 255, 255, 0.2)' }}>
                  <p className="text-white text-lg" style={{ fontFamily: 'Palanquin, Helvetica Neue, sans-serif' }}>
                    Nessun iscritto alla newsletter
                  </p>
                </div>
              ) : (
                <div className="border" style={{ borderColor: 'rgba(255, 255, 255, 0.2)' }}>
                  <table className="w-full">
                    <thead>
                      <tr style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.2)' }}>
                        <th className="text-left p-4 text-white font-bold uppercase text-sm" style={{ fontFamily: 'Palanquin, Helvetica Neue, sans-serif' }}>
                          Email
                        </th>
                        <th className="text-left p-4 text-white font-bold uppercase text-sm" style={{ fontFamily: 'Palanquin, Helvetica Neue, sans-serif' }}>
                          Data Iscrizione
                        </th>
                        <th className="text-right p-4 text-white font-bold uppercase text-sm" style={{ fontFamily: 'Palanquin, Helvetica Neue, sans-serif' }}>
                          Azioni
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {subscribers.map((subscriber, index) => (
                        <tr
                          key={subscriber.id}
                          style={{
                            borderBottom: index < subscribers.length - 1 ? '1px solid rgba(255, 255, 255, 0.1)' : 'none'
                          }}
                        >
                          <td className="p-4 text-white" style={{ fontFamily: 'Palanquin, Helvetica Neue, sans-serif' }}>
                            {subscriber.email}
                          </td>
                          <td className="p-4 text-white/60" style={{ fontFamily: 'Palanquin, Helvetica Neue, sans-serif' }}>
                            {new Date(subscriber.subscribed_at).toLocaleDateString('it-IT', {
                              day: '2-digit',
                              month: '2-digit',
                              year: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </td>
                          <td className="p-4 text-right">
                            <button
                              onClick={() => handleDeleteSubscriber(subscriber.id)}
                              className="px-4 py-2 font-bold uppercase text-white/60 hover:text-white transition-colors"
                              style={{ fontFamily: 'Palanquin, Helvetica Neue, sans-serif' }}
                            >
                              Elimina
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default Content;
