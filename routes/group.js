const express = require('express');
const Group = require('../models/Group');
const User = require('../models/User');
const router = express.Router();
const Message = require('../models/Message');
const jwt = require('jsonwebtoken');


const authenticateUser  = async (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1]; 
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id);
    next();
};

// Create group
router.post('/create', authenticateUser , async (req, res) => {
    const { name } = req.body;
    const userId = req.user.id; 
    const newGroup = new Group({ name, members: [userId] });
    await newGroup.save();
    await User.findByIdAndUpdate(userId, { $push: { groups: newGroup._id } });
    res.status(201).json({ groupId: newGroup._id });
});

// Join group
router.post('/join', authenticateUser , async (req, res) => {
    const { groupId, userId } = req.body;
    await Group.findByIdAndUpdate(groupId, { $addToSet: { members: userId } });
    await User.findByIdAndUpdate(userId, { $addToSet: { groups: groupId } });
    res.status(200).json({ message: 'User  joined the group' });
});

// message
router.post('/message', authenticateUser , async (req, res) => {
    const { groupId, text } = req.body;
    const userId = req.user.id;

    try {
        const message = new Message({ groupId, sender: userId, text });
        await message.save(); 

        res.status(200).json({ message: 'Message sent', message });
    } catch (error) {
        console.error('Error sending message:', error);
        res.status(500).json({ message: 'Error sending message', error });
    }
});

//message for a group.
router.get('/:groupId/messages', authenticateUser , async (req, res) => {
    const { groupId } = req.params; 


    try {
        const messages = await Message.find({ groupId })
            .populate('sender', 'username')
            .sort({ createdAt: 1 });

        if (!messages || messages.length === 0) {
            return res.status(404).json({ message: 'No messages found for this group.' });
        }

        res.status(200).json(messages);
    } catch (error) {
        console.error('Error fetching messages:', error);//show error when no messages are there
        res.status(500).json({ message: 'Error fetching messages', error });
    }
});

router.get('/user/:userId', authenticateUser , async (req, res) => {
    const { userId } = req.params;
    try {
        const user = await User.findById(userId).populate('groups');
        res.status(200).json(user.groups);
    } catch (error) {
        console.error('Error fetching user groups:', error);
        res.status(500).json({ message: 'Error fetching user groups', error });
    }
});

module.exports = router;