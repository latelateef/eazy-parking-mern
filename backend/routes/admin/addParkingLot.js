import express from 'express'
import prisma from '../../prisma/client.js';
import dotenv from 'dotenv';
import auth from '../../middlewares/auth.js';

const router = express.Router();
dotenv.config();

// Add Parking Lot Route
router.post('/', auth, async (req, res) => {
    try {
        
        const { location, imgUrl, totalSlot, price } = req.body;
        const parkingLot = await prisma.parkingLot.create({
            data: {
                adminId: req.userId,
                location: location,
                imgUrl: imgUrl,
                totalSlot: totalSlot,
                bookedSlot: 0,
                price: price,
            },
        });
        res.status(201).json(parkingLot);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

export default router;