require('dotenv').config();
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');

const db = require('./models');
const errorHandler = require('./handlers/error');
const authRoutes = require('./routes/auth');
const messagesRoutes = require('./routes/messages');
const { loginRequired, ensureCorrectUser } = require('./middleware/auth');

const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json()); 

app.use('/api/auth', authRoutes);
app.use(
  '/api/users/:id/messages', 
  loginRequired, 
  ensureCorrectUser, 
  messagesRoutes
);

app.get('/api/messages', loginRequired, async (req, res, next) => {
  try {
    let messages = await db.Message.find()
      .sort({ createdAt: "asc"})
      .populate('user', {
        username: true,
        profileImageUrl: true
      });
    return res.status(200).json(messages);
  } catch(err) {
    return next(err);
  }
});

app.use((req, res, next) => {
  let err = new Error('Not Found');
  err.status = 404;
  next(err);
});

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});