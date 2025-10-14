const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const dotenv = require('dotenv');
const { createClient } = require('@supabase/supabase-js');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Initialize Supabase with service role key
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
);

// Middleware
app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Auth Middleware
const verifyAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ 
        error: 'No token provided',
        message: 'Authorization header missing or invalid' 
      });
    }

    const token = authHeader.split(' ')[1];
    const { data: { user }, error } = await supabase.auth.getUser(token);

    if (error || !user) {
      return res.status(401).json({ 
        error: 'Invalid token',
        message: 'Authentication failed' 
      });
    }

    if (!user.email_confirmed_at) {
      return res.status(403).json({ 
        error: 'Email not verified',
        message: 'Please verify your email before accessing this resource' 
      });
    }

    req.user = user;
    req.token = token;
    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    return res.status(401).json({ 
      error: 'Authentication failed',
      message: error.message 
    });
  }
};

// Health Check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK',
    message: 'Lost & Found API is running',
    timestamp: new Date().toISOString()
  });
});

// API Info
app.get('/api', (req, res) => {
  res.json({
    name: 'Lost & Found API - NIT Raipur',
    version: '1.0.0',
    author: 'Tanmay Srivastava'
  });
});

// GET all items
app.get('/api/items', verifyAuth, async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('items')
      .select(`
        *,
        users:user_id (
          id,
          email,
          full_name
        )
      `)
      .order('created_at', { ascending: false });

    if (error) throw error;
    res.json(data || []);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Failed to fetch items' });
  }
});

// GET user's items
app.get('/api/items/my-items', verifyAuth, async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('items')
      .select('*')
      .eq('user_id', req.user.id)
      .order('created_at', { ascending: false });

    if (error) throw error;
    res.json(data || []);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Failed to fetch items' });
  }
});

// Search items
app.get('/api/items/search', verifyAuth, async (req, res) => {
  try {
    const { query, location } = req.query;

    let supabaseQuery = supabase
      .from('items')
      .select(`
        *,
        users:user_id (
          id,
          email,
          full_name
        )
      `);

    if (query) {
      supabaseQuery = supabaseQuery.or(
        `item_name.ilike.%${query}%,description.ilike.%${query}%`
      );
    }

    if (location && location !== 'All') {
      supabaseQuery = supabaseQuery.eq('location', location);
    }

    const { data, error } = await supabaseQuery.order('created_at', { ascending: false });

    if (error) throw error;
    res.json(data || []);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Failed to search items' });
  }
});

// GET single item
app.get('/api/items/:id', verifyAuth, async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('items')
      .select(`
        *,
        users:user_id (
          id,
          email,
          full_name
        )
      `)
      .eq('id', req.params.id)
      .single();

    if (error) {
      return res.status(404).json({ error: 'Item not found' });
    }
    res.json(data);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Failed to fetch item' });
  }
});

// POST create item
app.post('/api/items', verifyAuth, async (req, res) => {
  try {
    const { item_name, description, location, date_found, contact_details, additional_info, image_url } = req.body;

    if (!item_name || !description || !location || !date_found || !contact_details) {
      return res.status(400).json({ 
        error: 'Missing required fields',
        required: ['item_name', 'description', 'location', 'date_found', 'contact_details']
      });
    }

    const { data, error } = await supabase
      .from('items')
      .insert([{
        user_id: req.user.id,
        item_name,
        description,
        location,
        date_found,
        contact_details,
        additional_info,
        image_url,
        status: 'available'
      }])
      .select()
      .single();

    if (error) throw error;
    res.status(201).json({ message: 'Item posted successfully', data });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Failed to create item' });
  }
});

// PATCH update item status
app.patch('/api/items/:id/status', verifyAuth, async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const validStatuses = ['available', 'claimed', 'returned'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: 'Invalid status', validStatuses });
    }

    const { data: item } = await supabase
      .from('items')
      .select('user_id')
      .eq('id', id)
      .single();

    if (!item || item.user_id !== req.user.id) {
      return res.status(403).json({ error: 'Not authorized' });
    }

    const { data, error } = await supabase
      .from('items')
      .update({ status })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    res.json({ message: 'Status updated', data });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Failed to update status' });
  }
});

// DELETE item
app.delete('/api/items/:id', verifyAuth, async (req, res) => {
  try {
    const { data: item } = await supabase
      .from('items')
      .select('user_id, image_url')
      .eq('id', req.params.id)
      .single();

    if (!item || item.user_id !== req.user.id) {
      return res.status(403).json({ error: 'Not authorized' });
    }

    const { error } = await supabase
      .from('items')
      .delete()
      .eq('id', req.params.id);

    if (error) throw error;

    if (item.image_url) {
      const fileName = item.image_url.split('/').pop();
      await supabase.storage.from('item-images').remove([fileName]);
    }

    res.json({ message: 'Item deleted' });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Failed to delete item' });
  }
});

// GET received claims
app.get('/api/claims/received', verifyAuth, async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('claims')
      .select(`
        *,
        items!inner (
          id,
          item_name,
          image_url,
          user_id
        ),
        users:claimer_id (
          id,
          email,
          full_name
        )
      `)
      .eq('items.user_id', req.user.id)
      .order('created_at', { ascending: false });

    if (error) throw error;
    res.json(data || []);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Failed to fetch claims' });
  }
});

// GET sent claims
app.get('/api/claims/sent', verifyAuth, async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('claims')
      .select(`
        *,
        items (
          id,
          item_name,
          image_url,
          location
        )
      `)
      .eq('claimer_id', req.user.id)
      .order('created_at', { ascending: false });

    if (error) throw error;
    res.json(data || []);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Failed to fetch claims' });
  }
});

// POST create claim
app.post('/api/claims', verifyAuth, async (req, res) => {
  try {
    const { item_id, message } = req.body;

    if (!item_id || !message) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const { data: item } = await supabase
      .from('items')
      .select('user_id')
      .eq('id', item_id)
      .single();

    if (!item) {
      return res.status(404).json({ error: 'Item not found' });
    }

    if (item.user_id === req.user.id) {
      return res.status(400).json({ error: 'Cannot claim your own item' });
    }

    const { data, error } = await supabase
      .from('claims')
      .insert([{
        item_id,
        claimer_id: req.user.id,
        message,
        status: 'pending'
      }])
      .select()
      .single();

    if (error) throw error;
    res.status(201).json({ message: 'Claim submitted', data });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Failed to create claim' });
  }
});

// PATCH update claim
app.patch('/api/claims/:id', verifyAuth, async (req, res) => {
  try {
    const { status } = req.body;
    const validStatuses = ['pending', 'approved', 'rejected'];
    
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }

    const { data: claim } = await supabase
      .from('claims')
      .select(`
        *,
        items!inner (user_id)
      `)
      .eq('id', req.params.id)
      .single();

    if (!claim || claim.items.user_id !== req.user.id) {
      return res.status(403).json({ error: 'Not authorized' });
    }

    const { data, error } = await supabase
      .from('claims')
      .update({ status })
      .eq('id', req.params.id)
      .select()
      .single();

    if (error) throw error;

    if (status === 'approved') {
      await supabase
        .from('items')
        .update({ status: 'claimed' })
        .eq('id', claim.item_id);
    }

    res.json({ message: 'Claim updated', data });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Failed to update claim' });
  }
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Endpoint not found' });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

// Start server
app.listen(PORT, () => {
  console.log(`
╔════════════════════════════════════════╗
║   Lost & Found API - NIT Raipur       ║
║   Author: Tanmay Srivastava           ║
╚════════════════════════════════════════╝

🚀 Server running on port ${PORT}
🌍 Environment: ${process.env.NODE_ENV || 'development'}
  `);
});
