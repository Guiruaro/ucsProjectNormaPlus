const { Socket } = require('socket.io');
const Booking = require('../models/Booking');

module.exports = {
    async store(req , res) {
        const { user_id } = req.headers;
        const { spot_id } = req.params;
        const { date } = req.body;

        const booking = await Booking.create({
            user: user_id,
            spot: spot_id,
            date,
        });

        await booking.populate({path: 'user'});
        await booking.populate({path: 'spot'});

        const ownerSocket = req.connectedUsers[booking.spot.user];

        if (ownerSocket) {
            req.io.to(ownerSocket).emit('booking_request', booking);
            console.log(ownerSocket);
        }

        return res.json(booking);

    }
};