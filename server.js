const express = require('express');
const cors = require('cors');
const PocketBase = require('pocketbase/cjs');

const app = express();
const PORT = process.env.PORT || 3000;
const POCKETBASE_URL = process.env.POCKETBASE_URL || 'http://127.0.0.1:8090';

app.use(cors());
app.use(express.json());
app.use(express.static('public'));

function getPocketBase() {
  return new PocketBase(POCKETBASE_URL);
}

function mapDevice(record) {
  return {
    id: record.id,
    name: record.name,
    description: record.description,
    status: record.status
  };
}

app.get('/api/health', async (req, res) => {
  try {
    const pb = getPocketBase();
    await pb.health.check();

    res.json({
      success: true,
      message: 'Server is running',
      pocketbaseUrl: POCKETBASE_URL
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'PocketBase is not available',
      error: error.message
    });
  }
});

app.post('/api/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email and password are required' });
    }

    const pb = getPocketBase();
    const authData = await pb.collection('users').authWithPassword(email, password);

    res.json({
      success: true,
      user: {
        id: authData.record.id,
        email: authData.record.email,
        role: authData.record.role || 'worker'
      },
      token: authData.token
    });
  } catch (error) {
    res.status(401).json({
      success: false,
      message: 'Invalid email or password',
      error: error?.response?.message || error.message
    });
  }
});

app.get('/api/devices', async (req, res) => {
  try {
    const pb = getPocketBase();
    const records = await pb.collection('devices').getFullList({
      sort: '-created'
    });

    res.json(records.map(mapDevice));
  } catch (error) {
    res.status(500).json({
      message: 'Failed to load devices from PocketBase',
      error: error?.response?.message || error.message
    });
  }
});

app.post('/api/devices', async (req, res) => {
  try {
    const { name, description } = req.body;

    if (!name || !description) {
      return res.status(400).json({ message: 'Name and description are required' });
    }

    const pb = getPocketBase();
    const record = await pb.collection('devices').create({
      name,
      description,
      status: 'available'
    });

    res.status(201).json(mapDevice(record));
  } catch (error) {
    res.status(500).json({
      message: 'Failed to create device in PocketBase',
      error: error?.response?.message || error.message
    });
  }
});

app.put('/api/devices/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!['available', 'in_use'].includes(status)) {
      return res.status(400).json({ message: 'Status must be available or in_use' });
    }

    const pb = getPocketBase();
    const record = await pb.collection('devices').update(id, { status });

    res.json(mapDevice(record));
  } catch (error) {
    const status = error?.status === 404 ? 404 : 500;
    res.status(status).json({
      message: status === 404 ? 'Device not found' : 'Failed to update device in PocketBase',
      error: error?.response?.message || error.message
    });
  }
});

app.delete('/api/devices/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const pb = getPocketBase();

    await pb.collection('devices').delete(id);
    res.json({ message: 'Device deleted successfully' });
  } catch (error) {
    const status = error?.status === 404 ? 404 : 500;
    res.status(status).json({
      message: status === 404 ? 'Device not found' : 'Failed to delete device from PocketBase',
      error: error?.response?.message || error.message
    });
  }
});

app.listen(PORT, () => {
  console.log(`Server started on http://localhost:${PORT}`);
  console.log(`PocketBase URL: ${POCKETBASE_URL}`);
});
