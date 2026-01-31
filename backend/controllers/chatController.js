import Chat from '../models/Chat.js';

// @desc    Get chat history
// @route   GET /api/chat/:interestId
export const getChat = async (req, res) => {
  try {
    let chat = await Chat.findOne({ interest_id: req.params.interestId });
    if (!chat) {
      // If no chat exists yet, return empty history
      return res.json({ messages: [] });
    }
    res.json(chat);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Send a message (Text OR Deal Proposal)
// @route   POST /api/chat/:interestId/send
export const sendMessage = async (req, res) => {
  const { text, type, price } = req.body;
  const { interestId } = req.params;

  try {
    let chat = await Chat.findOne({ interest_id: interestId });

    // Create chat if it doesn't exist
    if (!chat) {
      chat = await Chat.create({ interest_id: interestId, messages: [] });
    }

    const newMessage = {
      sender_id: req.user.id,
      type: type || 'text',
      text: text || '',
      price: price || 0,
      deal_status: 'pending'
    };

    chat.messages.push(newMessage);
    await chat.save();

    res.status(201).json(chat.messages[chat.messages.length - 1]);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Accept/Decline a Deal
// @route   PUT /api/chat/:interestId/message/:msgId
export const updateMessageStatus = async (req, res) => {
  const { status } = req.body; // 'accepted' or 'declined'
  const { interestId, msgId } = req.params;

  try {
    const chat = await Chat.findOne({ interest_id: interestId });
    const message = chat.messages.id(msgId);

    if (!message) return res.status(404).json({ message: 'Message not found' });
    if (message.type !== 'deal') return res.status(400).json({ message: 'Not a deal proposal' });

    message.deal_status = status;
    await chat.save();

    res.json(message);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};