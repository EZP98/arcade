/**
 * ALF Portfolio API Worker
 * Gestisce CRUD per opere, sezioni e contenuti
 */

interface Env {
  DB: D1Database;
  ARTWORKS?: R2Bucket;
}

// Funzioni helper per CORS
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

function jsonResponse(data: any, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'Content-Type': 'application/json',
      ...corsHeaders,
    },
  });
}

// Router principale
export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);
    const path = url.pathname;
    const method = request.method;

    // Handle CORS preflight
    if (method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders });
    }

    try {
      // API Routes

      // ========== ARTWORKS ==========

      // GET /api/artworks - Lista tutte le opere
      if (path === '/api/artworks' && method === 'GET') {
        const sectionId = url.searchParams.get('section_id');
        let query = 'SELECT * FROM artworks';
        const params: any[] = [];

        if (sectionId) {
          query += ' WHERE section_id = ?';
          params.push(sectionId);
        }

        query += ' ORDER BY order_index ASC';

        const { results } = await env.DB.prepare(query)
          .bind(...params)
          .all();

        return jsonResponse({ artworks: results });
      }

      // GET /api/artworks/:id - Singola opera
      if (path.match(/^\/api\/artworks\/\d+$/) && method === 'GET') {
        const id = path.split('/').pop();
        const { results } = await env.DB.prepare(
          'SELECT * FROM artworks WHERE id = ?'
        ).bind(id).all();

        if (results.length === 0) {
          return jsonResponse({ error: 'Artwork not found' }, 404);
        }

        return jsonResponse({ artwork: results[0] });
      }

      // POST /api/artworks - Crea nuova opera
      if (path === '/api/artworks' && method === 'POST') {
        const body = await request.json() as {
          title: string;
          description?: string;
          image_url?: string;
          section_id: number;
          order_index?: number;
        };

        const { title, description, image_url, section_id, order_index } = body;

        if (!title || !section_id) {
          return jsonResponse({ error: 'Title and section_id are required' }, 400);
        }

        const result = await env.DB.prepare(
          `INSERT INTO artworks (title, description, image_url, section_id, order_index)
           VALUES (?, ?, ?, ?, ?)
           RETURNING *`
        ).bind(
          title,
          description || null,
          image_url || null,
          section_id,
          order_index || 0
        ).first();

        return jsonResponse({ artwork: result }, 201);
      }

      // PUT /api/artworks/:id - Aggiorna opera
      if (path.match(/^\/api\/artworks\/\d+$/) && method === 'PUT') {
        const id = path.split('/').pop();
        const body = await request.json() as {
          title?: string;
          description?: string;
          image_url?: string;
          section_id?: number;
          order_index?: number;
        };

        const { title, description, image_url, section_id, order_index } = body;

        const result = await env.DB.prepare(
          `UPDATE artworks
           SET title = COALESCE(?, title),
               description = COALESCE(?, description),
               image_url = COALESCE(?, image_url),
               section_id = COALESCE(?, section_id),
               order_index = COALESCE(?, order_index),
               updated_at = CURRENT_TIMESTAMP
           WHERE id = ?
           RETURNING *`
        ).bind(
          title || null,
          description || null,
          image_url || null,
          section_id || null,
          order_index || null,
          id
        ).first();

        if (!result) {
          return jsonResponse({ error: 'Artwork not found' }, 404);
        }

        return jsonResponse({ artwork: result });
      }

      // DELETE /api/artworks/:id - Elimina opera
      if (path.match(/^\/api\/artworks\/\d+$/) && method === 'DELETE') {
        const id = path.split('/').pop();

        const result = await env.DB.prepare(
          'DELETE FROM artworks WHERE id = ? RETURNING *'
        ).bind(id).first();

        if (!result) {
          return jsonResponse({ error: 'Artwork not found' }, 404);
        }

        return jsonResponse({ message: 'Artwork deleted', artwork: result });
      }

      // ========== SECTIONS ==========

      // GET /api/sections - Lista tutte le sezioni
      if (path === '/api/sections' && method === 'GET') {
        const { results } = await env.DB.prepare(
          'SELECT * FROM sections ORDER BY order_index ASC'
        ).all();

        return jsonResponse({ sections: results });
      }

      // GET /api/sections/:id - Singola sezione
      if (path.match(/^\/api\/sections\/\d+$/) && method === 'GET') {
        const id = path.split('/').pop();
        const { results } = await env.DB.prepare(
          'SELECT * FROM sections WHERE id = ?'
        ).bind(id).all();

        if (results.length === 0) {
          return jsonResponse({ error: 'Section not found' }, 404);
        }

        return jsonResponse({ section: results[0] });
      }

      // GET /api/sections/:id/artworks - Opere di una sezione
      if (path.match(/^\/api\/sections\/\d+\/artworks$/) && method === 'GET') {
        const id = path.split('/')[3];
        const { results } = await env.DB.prepare(
          'SELECT * FROM artworks WHERE section_id = ? ORDER BY order_index ASC'
        ).bind(id).all();

        return jsonResponse({ artworks: results });
      }

      // POST /api/sections - Crea nuova sezione
      if (path === '/api/sections' && method === 'POST') {
        const body = await request.json() as {
          name: string;
          slug: string;
          description?: string;
          order_index?: number;
        };

        const { name, slug, description, order_index } = body;

        if (!name || !slug) {
          return jsonResponse({ error: 'Name and slug are required' }, 400);
        }

        const result = await env.DB.prepare(
          `INSERT INTO sections (name, slug, description, order_index)
           VALUES (?, ?, ?, ?)
           RETURNING *`
        ).bind(
          name,
          slug,
          description || null,
          order_index || 0
        ).first();

        return jsonResponse({ section: result }, 201);
      }

      // PUT /api/sections/:id - Aggiorna sezione
      if (path.match(/^\/api\/sections\/\d+$/) && method === 'PUT') {
        const id = path.split('/').pop();
        const body = await request.json() as {
          name?: string;
          slug?: string;
          description?: string;
          order_index?: number;
        };

        const { name, slug, description, order_index } = body;

        const result = await env.DB.prepare(
          `UPDATE sections
           SET name = COALESCE(?, name),
               slug = COALESCE(?, slug),
               description = COALESCE(?, description),
               order_index = COALESCE(?, order_index),
               updated_at = CURRENT_TIMESTAMP
           WHERE id = ?
           RETURNING *`
        ).bind(
          name || null,
          slug || null,
          description || null,
          order_index || null,
          id
        ).first();

        if (!result) {
          return jsonResponse({ error: 'Section not found' }, 404);
        }

        return jsonResponse({ section: result });
      }

      // DELETE /api/sections/:id - Elimina sezione
      if (path.match(/^\/api\/sections\/\d+$/) && method === 'DELETE') {
        const id = path.split('/').pop();

        const result = await env.DB.prepare(
          'DELETE FROM sections WHERE id = ? RETURNING *'
        ).bind(id).first();

        if (!result) {
          return jsonResponse({ error: 'Section not found' }, 404);
        }

        return jsonResponse({ message: 'Section deleted', section: result });
      }

      // ========== CONTENT BLOCKS ==========

      // GET /api/content - Lista tutti i content blocks
      if (path === '/api/content' && method === 'GET') {
        const { results } = await env.DB.prepare(
          'SELECT * FROM content_blocks'
        ).all();

        return jsonResponse({ content: results });
      }

      // GET /api/content/:key - Singolo content block per chiave
      if (path.match(/^\/api\/content\/[\w-]+$/) && method === 'GET') {
        const key = path.split('/').pop();
        const { results } = await env.DB.prepare(
          'SELECT * FROM content_blocks WHERE key = ?'
        ).bind(key).all();

        if (results.length === 0) {
          return jsonResponse({ error: 'Content block not found' }, 404);
        }

        return jsonResponse({ content: results[0] });
      }

      // PUT /api/content/:key - Aggiorna content block
      if (path.match(/^\/api\/content\/[\w-]+$/) && method === 'PUT') {
        const key = path.split('/').pop();
        const body = await request.json() as {
          title?: string;
          content?: string;
          image_url?: string;
        };

        const { title, content, image_url } = body;

        const result = await env.DB.prepare(
          `UPDATE content_blocks
           SET title = COALESCE(?, title),
               content = COALESCE(?, content),
               image_url = COALESCE(?, image_url),
               updated_at = CURRENT_TIMESTAMP
           WHERE key = ?
           RETURNING *`
        ).bind(
          title || null,
          content || null,
          image_url || null,
          key
        ).first();

        if (!result) {
          return jsonResponse({ error: 'Content block not found' }, 404);
        }

        return jsonResponse({ content: result });
      }

      // ========== IMAGE UPLOAD (R2) ==========

      // POST /api/upload - Upload immagine su R2
      if (path === '/api/upload' && method === 'POST') {
        if (!env.ARTWORKS) {
          return jsonResponse({ error: 'R2 storage not configured' }, 503);
        }

        const formData = await request.formData();
        const file = formData.get('file') as File;

        if (!file) {
          return jsonResponse({ error: 'No file provided' }, 400);
        }

        // Genera nome file unico
        const timestamp = Date.now();
        const filename = `${timestamp}-${file.name}`;

        // Upload su R2
        await env.ARTWORKS.put(filename, file.stream(), {
          httpMetadata: {
            contentType: file.type,
          },
        });

        const imageUrl = `/images/${filename}`;

        return jsonResponse({
          message: 'File uploaded successfully',
          url: imageUrl,
          filename
        }, 201);
      }

      // GET /images/:filename - Serve immagine da R2
      if (path.match(/^\/images\/.+$/) && method === 'GET') {
        if (!env.ARTWORKS) {
          return jsonResponse({ error: 'R2 storage not configured' }, 503);
        }

        const filename = path.replace('/images/', '');
        const object = await env.ARTWORKS.get(filename);

        if (!object) {
          return jsonResponse({ error: 'Image not found' }, 404);
        }

        return new Response(object.body, {
          headers: {
            'Content-Type': object.httpMetadata?.contentType || 'application/octet-stream',
            'Cache-Control': 'public, max-age=31536000',
            ...corsHeaders,
          },
        });
      }

      // Route non trovata
      return jsonResponse({ error: 'Not found' }, 404);

    } catch (error: any) {
      console.error('Worker error:', error);
      return jsonResponse({
        error: 'Internal server error',
        message: error.message
      }, 500);
    }
  },
};
